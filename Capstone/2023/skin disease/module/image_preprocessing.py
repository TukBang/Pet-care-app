import natsort
import os
import numpy as np
from PIL import Image
import pandas as pd
import cv2
import torch
import torchvision

def get_RoI_range_csv(size: int, csv_file: pd.DataFrame) -> pd.DataFrame:
    result_csv = csv_file.loc[csv_file.loc[csv_file["width"] <= size].index].copy()
    result_csv = result_csv.loc[result_csv.loc[result_csv["width"] >= 10].index]
    result_csv = result_csv.loc[result_csv.loc[result_csv["height"] <= size].index]
    result_csv = result_csv.loc[result_csv.loc[result_csv["height"] >= 10].index]
    return result_csv

# csv_files: pd.DataFrame list
# project_path, original_data_path: project and data folder path
def get_RoI_box_image(size: int, csv_files: list, project_path: str, original_data_path: str, data_type: str = "train") -> None:
    try:    os.mkdir(f"{project_path}box_data/{size}x{size}/{data_type}/")
    except: pass
    
    for i, csv_file in enumerate(csv_files):
        # size: 256, 384, 512
        try:    os.mkdir(f"{project_path}box_data/{size}x{size}/{data_type}/A{i + 1}/")
        except: pass

        size_csv = get_RoI_range_csv(size, csv_file)
        count = 0
        last_image_name = ""
        for index in size_csv.index:
            x1, y1 = size_csv.loc[index][["x", "y"]]
            width, height = size_csv.loc[index][["width", "height"]]
            x2, y2 = x1 + width, y1 + height
            center_x = round((x1 + x2 -1) / 2)
            center_y = round((y1 + y2 -1) / 2)

            sX, eX = center_x - (size // 2), center_x + (size // 2)
            sY, eY = center_y - (size // 2), center_y + (size // 2)
            resX, resY = tuple(size_csv.loc[index]["resolution"].split("X"))
            resX, resY = int(resX), int(resY)
            if (sX < 0):      sX, eX = 0, size
            elif (eX > resX): sX, eX = resX - size, resX
            if (sY < 0):      sY, eY = 0, size
            elif (eY > resY): sY, eY = resY - size, resY

            image_name = size_csv.loc[index]["Raw data ID"].split("_")[-1]
            img = cv2.imread(f"{original_data_path}A{i + 1}/IMG_D_A{i + 1}_{image_name}")
            # 이미지 파일이 없을 경우 except
            try:    crop_img = img[sY:eY, sX:eX]
            except: continue

            # 중복된 이미지 파일 이름 행 존재 (다른 관심 영역)
            if (last_image_name == image_name):
                count += 1
                save_path = f"{project_path}box_data/{size}x{size}/{data_type}/A{i + 1}/{count}_{image_name}"
            else:
                count = 0
                save_path = f"{project_path}box_data/{size}x{size}/{data_type}/A{i + 1}/{count}_{image_name}"

            cv2.imwrite(save_path, crop_img)
            last_image_name = image_name
    return

def resize_and_crop(image_path, modified_path, size, crop_type='middle'):
    files = os.listdir(image_path)
    try:    os.mkdir(modified_path)
    except: pass

    for file in files:
        name = str(file)
        os.chdir(image_path)
        img = Image.open(file)
        img_ratio = img.size[0] / float(img.size[1])
        ratio = size[0] / float(size[1])
        
        if ratio > img_ratio:
            img = img.resize((size[0], int(round(size[0] * img.size[1] / img.size[0]))),
                Image.ANTIALIAS)     
            if crop_type == 'top':
                box = (0, 0, img.size[0], size[1])
            elif crop_type == 'middle':
                box = (0, int(round((img.size[1] - size[1]) / 2)), img.size[0],
                    int(round((img.size[1] + size[1]) / 2)))
            elif crop_type == 'bottom':
                box = (0, img.size[1] - size[1], img.size[0], img.size[1])
            else :
                raise ValueError('ERROR: invalid value for crop_type')
            img = img.crop(box)
            
        elif ratio < img_ratio:
            img = img.resize((int(round(size[1] * img.size[0] / img.size[1])), size[1]),
                Image.ANTIALIAS)
            if crop_type == 'top':
                box = (0, 0, size[0], img.size[1])
            elif crop_type == 'middle':
                box = (int(round((img.size[0] - size[0]) / 2)), 0,
                    int(round((img.size[0] + size[0]) / 2)), img.size[1])
            elif crop_type == 'bottom':
                box = (img.size[0] - size[0], 0, img.size[0], img.size[1])
            else :
                raise ValueError('ERROR: invalid value for crop_type')
            img = img.crop(box)
            
        else :
            img = img.resize((size[0], size[1]), Image.ANTIALIAS)
            
        os.chdir(modified_path)
        img.save(name, "JPEG")

def ratio_resize_and_zeroPadding(size, RoI_data_path, RZ_data_path):
    for label in natsort.natsorted(os.listdir(RoI_data_path)):
        folder_path = os.path.join(RoI_data_path, f"{label}/")
        img_filenames = natsort.natsorted(os.listdir(folder_path))

        for img_filename in img_filenames:
            result = np.zeros((size, size, 3), np.uint8)
            image = cv2.imread(folder_path + img_filename, cv2.IMREAD_COLOR)
            
            h, w = image.shape[:2]
            ash = size / h
            asw = size / w
            if asw < ash: sizeas = (int(w*asw), int(h*asw))
            else:         sizeas = (int(w*ash), int(h*ash))
            image = cv2.resize(image, dsize=sizeas)

            sx, ex = int(size/2 - sizeas[1]/2), int(size/2 + sizeas[1]/2)
            sy, ey = int(size/2 - sizeas[0]/2), int(size/2 + sizeas[0]/2)
            result[sx:ex, sy:ey, :] = image

            try:    os.mkdir(RZ_data_path + label)
            except: pass
            save_path = os.path.join(RZ_data_path, f"{label}/")
            cv2.imwrite(save_path + img_filename, result)
    return

def convert_PIL_to_numpy(images):
    return np.array([cv2.merge(list(cv2.split(np.uint8(image))[::-1])) for image in images])

def convert_PIL_to_tensor(images):
    to_tensor = torchvision.transforms.ToTensor()      
    return torch.stack([to_tensor(PIL_image) for PIL_image in images], dim=0)

def convert_numpy_to_PIL(images):
    return [Image.fromarray(cv2.merge(list(cv2.split(image)[::-1]))) for image in images]

def convert_numpy_to_tensor(images):
    return convert_PIL_to_tensor(convert_numpy_to_PIL(images))

def convert_tensor_to_PIL(tensors):
    to_PIL = torchvision.transforms.ToPILImage()    
    return [to_PIL(tensor) for tensor in tensors]

def convert_tensor_to_numpy(tensors):
    return convert_PIL_to_numpy(convert_tensor_to_PIL(tensors))