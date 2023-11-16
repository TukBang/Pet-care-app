ROW = 0
COLUMN = 1

import pickle as pkl
from tqdm import notebook
import numpy as np
from numba import jit

import torch
from torch import nn
from torch.utils.data import Dataset, DataLoader
from torchvision import models
from torchvision import transforms as T

import pandas as pd
import cv2
from PIL import Image
from math import ceil, floor, sqrt
from random import randint

@jit(nopython=True)
def jit_calc1(background_ratio, asymmetry_padding_ratio, resX, resY, width, height, x1, y1, method):
    total_RoI_pixel_amount = width * height
    # crop_size가 비율에 맞을 경우
    background_pixel = float(width * height) / (1 - background_ratio) * background_ratio
    total_crop_image_pixel_amount = total_RoI_pixel_amount + background_pixel

    crop_size = int(ceil(sqrt(total_crop_image_pixel_amount)))

    x2, y2 = x1 + width, y1 + height

    crop_sizeX = crop_size
    crop_sizeY = crop_size

    asymmetryX = x2 - crop_size > x1
    asymmetryY = y2 - crop_size > y1

    # crop_size가 비율에 맞지 않을 경우
    # 즉, 기존 width나, height가 구한 정사각형 크기보다 큰 경우
    if (asymmetryX):
        crop_sizeX = ceil(width / (1 - asymmetry_padding_ratio))
        crop_sizeY = ceil(total_crop_image_pixel_amount / ceil(width / (1 - asymmetry_padding_ratio)))

    # height인 경우
    if (asymmetryY):
        crop_sizeY = ceil(height / (1 - asymmetry_padding_ratio))
        crop_sizeX = ceil(total_crop_image_pixel_amount / ceil(height / (1 - asymmetry_padding_ratio)))
    
    # print("crop_size:", crop_size)
    # print("x2, y2:", x2, y2)
    # print("asymmetryX, asymmetryY:", asymmetryX, asymmetryY)
    # print("crop_sizeX, crop_sizeY:", crop_sizeX, crop_sizeY)

    # 관심 영역이 중앙으로 갈 수 있도록 설정
    if (method == "centralize"):
        cX = round((x1 + x2 -1) / 2)
        cY = round((y1 + y2 -1) / 2)
        sX, eX = cX - ceil((crop_sizeX / 2)), cX + (crop_sizeX // 2)
        sY, eY = cY - ceil((crop_sizeY / 2)), cY + (crop_sizeY // 2)

        if (sX < 0):      sX, eX = 0, crop_size
        elif (eX > resX): sX, eX = resX - crop_size, resX
        if (sY < 0):      sY, eY = 0, crop_size
        elif (eY > resY): sY, eY = resY - crop_size, resY

    # 관심 영역이 랜덤으로 갈 수 있도록 설정
    elif (method == "randomize"):
        sX = randint(x2 - crop_sizeX, x1)
        eX = sX + crop_sizeX
        sY = randint(y2 - crop_sizeY, y1)
        eY = sY + crop_sizeY

        if (sX < 0):
            sX = randint(0, resX - crop_sizeX)
            eX = sX + crop_sizeX
        elif (eX > resX):
            eX = randint(resX - (resX - crop_sizeX), resX)
            sX = eX - crop_sizeX
        
        if (sY < 0):
            sY = randint(0, resY - crop_sizeY)
            eY = sY + crop_sizeY
        elif (eY > resY):
            eY = randint(resY - (resY - crop_sizeY), resY)
            sY = eY - crop_sizeY

    # print("sX, eX, sY, eY:", sX, eX, sY, eY)
    return sX, eX, sY, eY

@jit(nopython=True)
def jit_calc2(background_ratio, resX, resY, width, height, x1, y1, method):
    x2, y2 = x1 + width, y1 + height
    total_RoI_pixel_amount = width * height
    background_pixel = float(total_RoI_pixel_amount) * (background_ratio / (1 - background_ratio))

    b = 2 * (width + height)
    c = -background_pixel
    s1 = (-b + sqrt(b**2 - (4 * c))) / 2
    s2 = (-b - sqrt(b**2 - (4 * c))) / 2
    padding = floor(max(s1, s2))

    crop_sizeX = width + (2 * padding)
    crop_sizeY = height + (2 * padding)

    # 관심 영역이 중앙으로 갈 수 있도록 설정
    if (method == "centralize"):
        cX = round((x1 + x2 -1) / 2)
        cY = round((y1 + y2 -1) / 2)
        sX, eX = cX - ceil((crop_sizeX / 2)), cX + (crop_sizeX // 2)
        sY, eY = cY - ceil((crop_sizeY / 2)), cY + (crop_sizeY // 2)

        if (sX < 0):      sX, eX = 0, crop_sizeX
        elif (eX > resX): sX, eX = resX - crop_sizeX, resX
        if (sY < 0):      sY, eY = 0, crop_sizeY
        elif (eY > resY): sY, eY = resY - crop_sizeY, resY

    # 관심 영역이 랜덤으로 갈 수 있도록 설정
    elif (method == "randomize"):
        sXr = x2 - crop_sizeX
        eXr = x1 + crop_sizeX
        sYr = y2 - crop_sizeY
        eYr = y1 + crop_sizeY

        if (sXr < 0):
            sX = randint(0, x1)
            eX = sX + crop_sizeX
            if (eX > resX): eX = resX
        elif (eXr > resX):
            eX = randint(x2, resX)
            sX = eX - crop_sizeX
            if (sX < 0): sX = 0
        else:
            sX = randint(sXr, x1)
            eX = sX + crop_sizeX
            if (eX > resX): eX = resX

        if (sYr < 0):
            sY = randint(0, y1)
            eY = sY + crop_sizeY
            if (eY > resY): eY = resY
        elif (eYr > resY):
            eY = randint(y2, resY)
            sY = eY - crop_sizeY
            if (sY < 0): sY = 0
        else:
            sY = randint(sYr, y1)
            eY = sY + crop_sizeY
            if (eY > resY): eY = resY

    # print("sX, eX, sY, eY:", sX, eX, sY, eY)
    return sX, eX, sY, eY

class Skin_Disease_Dataset(Dataset):
  def __init__(self, x, y, transforms):
    self.x = x
    self.y = y
    if (isinstance(self.y, list)): self.index_flag = True
    else:                          self.index_flag = False
    if (isinstance(transforms, type(None))): self.transforms = T.Compose([T.ToTensor()])
    else:                                    self.transforms = transforms

  def __len__(self):
    if self.index_flag: return len(self.y) * len(self.y[0])
    else:               return len(self.y)
  
  def __getitem__(self, index: int):
    if self.index_flag: image = self.transforms(self.x[int(index / len(self.y[0]))][index % len(self.y[0])])
    else:               image = self.transforms(self.x[index])
    if self.index_flag: target = self.y[int(index / len(self.y[0]))][index % len(self.y[0])].astype(np.float32)
    else:               target = self.y[index].astype(np.float32)

    return image, target
  
class Skin_Disease_Dataset2(Dataset):
    def __init__(self, 
                 csv_data,
                 label, 
                 transforms,
                 original_data_path, 
                 background_ratio: list = [0.1, 0.2, 0.3, 0.4], 
                 asymmetry_padding_ratio: float = 0.1,
                 method = "randomize"):
        if (isinstance(transforms, type(None))): self.transforms = T.Compose([T.ToTensor()])
        else:                                    self.transforms = transforms
        self.csv_data = csv_data
        self.y = label
        self.original_data_path = original_data_path
        self.background_ratio = background_ratio
        self.asymmetry_padding_ratio = asymmetry_padding_ratio
        self.method = method
    
    def extract_image_in_csv_data(self, index):
        # csv_data에서 image를 추출
        # csv_data는 A1 ~ A6이 붙어 있어야 함
        row_data = self.csv_data.iloc[index]
        label = self.y[index]
        ratio_index = randint(0, len(self.background_ratio) - 1)
        
        # 이미지의 크기를 구함
        # 관심 영역의 크기를 구함
        # 관심 영역의 위치를 구함
        resolution, width, height, x1, y1 = row_data[["resolution", "width", "height", "x", "y"]]
        resX, resY = resolution.split("X")
        resX, resY = int(resX), int(resY)

        # 비율에 따른 추출을 할지 말지 결정
        extract_flag = True
        if (width / resX > (1 - self.background_ratio[ratio_index])):  extract_flag = False
        if (height / resY > (1 - self.background_ratio[ratio_index])): extract_flag = False

        if (extract_flag):
            sX, eX, sY, eY = jit_calc1(
                self.background_ratio[ratio_index],
                self.asymmetry_padding_ratio,
                resX, resY, width, height, x1, y1,
                self.method
            )

            # 이미지 추출
            image_name = row_data["Raw data ID"].split("_")[-1]
            image_path = f"{self.original_data_path}A{label + 1}/IMG_D_A{label + 1}_{image_name}"
            img = cv2.imread(image_path)
            crop_img = img[sY:eY, sX:eX]
        else:
            # crop_size가 너무 큰 경우 원본 이미지를 그대로 사용
            # 이미지 추출
            image_name = row_data["Raw data ID"].split("_")[-1]
            image_path = f"{self.original_data_path}A{label + 1}/IMG_D_A{label + 1}_{image_name}"
            img = cv2.imread(image_path)
            crop_img = img
            
        # print("index:", index)
        # print("background_ratio:", self.background_ratio[ratio_index])
        # print("asymmetry_padding_ratio:", self.asymmetry_padding_ratio)
        # print("resolution:", resX, resY)
        # print("w, h, x1, y1:", width, height, x1, y1)

        return Image.fromarray(cv2.merge(list(cv2.split(crop_img)[::-1])))
    
    def __len__(self):
        return len(self.y)

    def __getitem__(self, index: int):
        image = self.transforms(self.extract_image_in_csv_data(index))
        target = self.y[index].astype(np.float32)
    
        return image, target
    
class Skin_Disease_Dataset3(Dataset):
    def __init__(self, 
                 csv_data,
                 label, 
                 transforms,
                 original_data_path, 
                 background_ratio: list = [0.2, 0.3, 0.4, 0.5, 0.6],
                 method = "randomize"):
        if (isinstance(transforms, type(None))): self.transforms = T.Compose([T.ToTensor()])
        else:                                    self.transforms = transforms
        self.csv_data = csv_data
        self.y = label
        self.original_data_path = original_data_path
        self.background_ratio = background_ratio
        self.method = method
    
    def extract_image_in_csv_data(self, index):
        # csv_data에서 image를 추출
        # csv_data는 A1 ~ A5이 붙어 있어야 함
        row_data = self.csv_data.iloc[index]
        label = self.y[index]
        ratio_index = randint(0, len(self.background_ratio) - 1)
        
        # 이미지의 크기를 구함
        # 관심 영역의 크기를 구함
        # 관심 영역의 위치를 구함
        resolution, width, height, x1, y1 = row_data[["resolution", "width", "height", "x", "y"]]
        resX, resY = resolution.split("X")
        resX, resY = int(resX), int(resY)

        # 비율에 따른 추출을 할지 말지 결정
        extract_flag = True
        if (width / resX > (1 - self.background_ratio[ratio_index])):  extract_flag = False
        if (height / resY > (1 - self.background_ratio[ratio_index])): extract_flag = False

        if (extract_flag == False):
            ratio_index = 0            
            extract_flag = True
            if (width / resX > (1 - self.background_ratio[ratio_index])):  extract_flag = False
            if (height / resY > (1 - self.background_ratio[ratio_index])): extract_flag = False

        if (extract_flag):
            sX, eX, sY, eY = jit_calc2(
                self.background_ratio[ratio_index],
                resX, resY, width, height, x1, y1,
                self.method
            )

            # 이미지 추출
            image_name = row_data["Raw data ID"].split("_")[-1]
            label_add = 1 if label == 0 else 2
            image_path = f"{self.original_data_path}A{label + 1}/IMG_D_A{label + label_add}_{image_name}"
            
            img = cv2.imread(image_path)
            crop_img = img[sY:eY, sX:eX]
        else:
            image_name = row_data["Raw data ID"].split("_")[-1]
            label_add = 1 if label == 0 else 2
            image_path = f"{self.original_data_path}A{label + 1}/IMG_D_A{label + label_add}_{image_name}"
            img = cv2.imread(image_path)
            crop_img = img[y1:y1 + height, x1:x1 + width]
            
        # print("index:", index)
        # print("background_ratio:", self.background_ratio[ratio_index])
        # print("asymmetry_padding_ratio:", self.asymmetry_padding_ratio)
        # print("resolution:", resX, resY)
        # print("w, h, x1, y1:", width, height, x1, y1)

        return Image.fromarray(cv2.merge(list(cv2.split(crop_img)[::-1])))
    
    def __len__(self):
        return len(self.y)

    def __getitem__(self, index: int):
        image = self.transforms(self.extract_image_in_csv_data(index))
        target = self.y[index].astype(np.float32)
    
        return image, target
  
class Skin_Distinction_Model(nn.Module):
    def __init__(self, model, out_features, device, save_path):
        super().__init__()
        
        self.model = model
        self.output = nn.Linear(1000, out_features)
        
        self.device = device
        self.save_path = save_path
        self.history = {"train_loss": list(),
                        "valid_loss": list(),
                        "train_acc" : list(),
                        "valid_acc" : list()}
        self.best_loss = None
        self.best_acc  = None

    def forward(self, x):
        x = self.model(x)
        x = self.output(x)
        return x
    
    def fit(self, parameters):
        train_DataLoader = parameters["Train_DataLoader"]
        valid_DataLoader = parameters["Valid_DataLoader"]
        optimizer        = parameters["Optimizer"]
        criterion        = parameters["Loss_function"]
        epochs           = parameters['Epochs']

        for epoch in notebook.tqdm(range(epochs)):
            self.train(True)
            print("Epoch: %d/%d" % (epoch + 1, epochs))

            # train part
            batch_train_loss, batch_train_acc = list(), list()
            for i, (images, targets) in enumerate(train_DataLoader):
                optimizer.zero_grad()
                
                # cuda images, targets
                targets = targets.type(torch.LongTensor)
                images = images.to(self.device)
                targets = targets.to(self.device)

                # predict
                outputs = self(images)
                train_loss = criterion(outputs, targets)

                # backprop
                train_loss.backward()
                optimizer.step()

                value, labels = torch.max(outputs.data, dim=COLUMN)
                batch = targets.size(dim=ROW)
                train_acc = (labels == targets).sum().item() / batch * 100
                batch_train_loss.append(train_loss.item())
                batch_train_acc.append(train_acc)
            
            # train loss, acc
            tlv = sum(batch_train_loss) / len(batch_train_loss)
            tav = sum(batch_train_acc) / len(batch_train_acc)
            self.history["train_loss"].append(tlv)
            self.history["train_acc"].append(tav)
            print("Train - Loss: %.6f, Accuracy: %.2f" % (tlv, tav))
            
            # valid part
            if valid_DataLoader != None:
                self.train(False)

                batch_valid_loss, batch_valid_acc = list(), list()
                with torch.no_grad():
                    for i, (images, targets) in enumerate(valid_DataLoader):
                        # cuda images, targets
                        targets = targets.type(torch.LongTensor)
                        images = images.to(self.device)
                        targets = targets.to(self.device)

                        outputs = self(images).to(self.device)
                        valid_loss = criterion(outputs, targets)

                        value, labels = torch.max(outputs.data, dim=COLUMN)
                        batch = targets.size(dim=ROW)
                        valid_acc = (labels == targets).sum().item() / batch * 100
                        batch_valid_loss.append(valid_loss.item())
                        batch_valid_acc.append(valid_acc)

                vlv = sum(batch_valid_loss) / len(batch_valid_loss)
                vav = sum(batch_valid_acc) / len(batch_valid_acc)
                self.history["valid_loss"].append(vlv)
                self.history["valid_acc"].append(vav)
                print("Valid - Loss: %.6f, Accuracy: %.2f" % (vlv, vav))

                # validation loss가 가장 낮다면 저장
                if self.best_loss is None or self.best_loss > vlv:
                    self.best_loss = vlv
                    torch.save(self.state_dict(), self.save_path + "low_loss.pth")
                    print("Save model, validation loss:", vlv)
                
                # validation acc가 가장 높다면 저장
                if self.best_acc is None or self.best_acc < vav:
                    self.best_acc = vav
                    torch.save(self.state_dict(), self.save_path + "high_acc.pth")
                    print("Save model, validation acc:", vav)
                
            torch.save(self.state_dict(), self.save_path + "last_learning.pth")
            print("Save last model, validation acc:", vav)
            
            print(f"{epoch} epoch end lr: ", optimizer.param_groups[0]['lr'])
            with open(self.save_path + "last_history.pkl", "wb") as pkl_file:
                pkl.dump(self.history, pkl_file)

        self.train(False)
        return self.history
    
    def predict(self, x, tf, norm = [[0.5, 0.5, 0.5], [0.5, 0.5, 0.5]]):
        pred = torch.tensor([]).to(self.device)
        if isinstance(tf, type(None)):
            tf = T.Compose([
                T.ToTensor(),
                T.Normalize(norm[0], norm[1])
            ])
        
        test_dataset = Skin_Disease_Dataset(x, np.zeros((len(x),), dtype="int64"), tf)
        test_data_loader = DataLoader(test_dataset, batch_size=128)
        
        self.train(False)
        with torch.no_grad():
            for i, (images, targets) in enumerate(notebook.tqdm(test_data_loader)):
                images = images.to(self.device)
                outputs = self(images).to(self.device)
                pred = torch.cat((pred, outputs.data))

        value, labels = torch.max(pred.data, dim=COLUMN)
        return pred, labels