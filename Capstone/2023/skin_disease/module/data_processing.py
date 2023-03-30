import pprint
import os, json
import pandas as pd
import cv2

# fuctions
def mkadir(path):
    if not os.path.isdir(path):
        split_path = path.split("/")
        for i in range(len(split_path) -2, 0, -1):
            dir_path = "/".join(split_path[:-i]) + "/"
            try:    os.mkdir(dir_path)
            except: pass

    return

def to_excel(path, excel_information: dict):
    pd.DataFrame.from_dict(excel_information).to_csv(path)
    return

def extract_info_json(original_data_path, project_path, data_dict: dict, data_type: str = "train"):
    # json 정보 추출 단계
    # to_excel + inspRejectYn
    # to_RoI
    try:    os.mkdir(project_path + f"RoI_data/{data_type}/")
    except: pass

    excel_information = dict()
    excel_information["exist"] = list()

    labels = data_dict.keys()
    for label in labels:
        datas = data_dict[label]
        try:    os.mkdir(project_path + f"RoI_data/{data_type}/" + (label + "/"))
        except: pass

        jsons = datas[1]
        for json_file in jsons:
            file_path = (original_data_path + label + "/") + json_file
            data = json.load(open(file_path))
            
            if "x" not in excel_information: excel_information["x"] = list()
            if "y" not in excel_information: excel_information["y"] = list()
            if "width" not in excel_information: excel_information["width"] = list()
            if "height" not in excel_information: excel_information["height"] = list()

            # labelingInfo: 관심영역 (polygon, box)
            image_name = json_file.split(".")[0] + ".jpg"
            image_path = original_data_path + (label + "/") + image_name
            labeling_Info = data["labelingInfo"]
            info_length = len(labeling_Info)
            if info_length > 2:
                # length is always even
                for i, RoI_info in enumerate(labeling_Info):
                    if "box" not in RoI_info: break
                    RoI = RoI_info["box"]["location"][0]
                    sx, ex = RoI["x"], RoI["x"] + RoI["width"]
                    sy, ey = RoI["y"], RoI["y"] + RoI["height"]
                    
                    # metaData: 정형 데이터
                    # inspRejectYn: 반려 여부
                    mData = data["metaData"]
                    for key, value in mData.items():
                        if key not in excel_information:
                            excel_information[key] = list()
                        excel_information[key].append(value)

                    inspReject = data["inspRejectYn"]
                    if "inspRejectYn" not in excel_information: excel_information["inspRejectYn"] = list()
                    excel_information["inspRejectYn"].append(inspReject)

                    # 엑셀 저장용
                    # 이미지가 없어도 엑셀 데이터는 저장한다.
                    excel_information["x"].append(sx)
                    excel_information["y"].append(sy)
                    excel_information["width"].append(RoI["width"])
                    excel_information["height"].append(RoI["height"])

                    # RoI 박스 크기가 0이 아니라면
                    # 이미지가 존재 한다면
                    if ((sx != ex and sy != ey) and (os.path.exists(image_path))):
                        image = cv2.imread(image_path)
                        image_name = json_file.split(".")[0] + "T" + str(i) + ".jpg"
                        save_path = project_path + f"RoI_data/{data_type}/" + (label + "/") + image_name
                        cv2.imwrite(save_path, image[sy:ey, sx:ex])
                        excel_information["exist"].append("Y")
                    else:
                        excel_information["exist"].append("N")

            else:
                polygon = labeling_Info[0]
                RoI = labeling_Info[1]["box"]["location"][0]
                # swap
                if "box" in polygon:
                    temp = RoI
                    RoI = polygon
                    polygon = temp
                
                sx, ex = RoI["x"], RoI["x"] + RoI["width"]
                sy, ey = RoI["y"], RoI["y"] + RoI["height"]
                
                # metaData: 정형 데이터
                # inspRejectYn: 반려 여부
                mData = data["metaData"]
                for key, value in mData.items():
                    if key not in excel_information:
                        excel_information[key] = list()
                    excel_information[key].append(value)

                inspReject = data["inspRejectYn"]
                if "inspRejectYn" not in excel_information: excel_information["inspRejectYn"] = list()
                excel_information["inspRejectYn"].append(inspReject)

                # 엑셀 저장용
                excel_information["x"].append(sx)
                excel_information["y"].append(sy)
                excel_information["width"].append(RoI["width"])
                excel_information["height"].append(RoI["height"])
                
                # 관심 영역이 0이거나, 파일이 없다면
                if ((sx != ex and sy != ey) and (os.path.exists(image_path))):
                    image = cv2.imread(image_path)
                    cv2.imwrite(project_path + f"RoI_data/{data_type}/" + (label + "/") + image_name, image[sy:ey, sx:ex])
                    excel_information["exist"].append("Y")
                else:
                    excel_information["exist"].append("N")
        
        to_excel(project_path + label + ".csv", excel_information)
        excel_information = dict()
        excel_information["exist"] = list()
        break
    return

def get_RoI_range_csv(low, high, csv_file: pd.DataFrame) -> pd.DataFrame:
    result_csv = csv_file.loc[csv_file.loc[csv_file["width"] <= high].index].copy()
    result_csv = result_csv.loc[result_csv.loc[result_csv["width"] >= low].index]
    result_csv = result_csv.loc[result_csv.loc[result_csv["height"] <= high].index]
    result_csv = result_csv.loc[result_csv.loc[result_csv["height"] >= low].index]
    return result_csv

def create_asymptomatic_data(size, gap, csv_files, original_data_path, project_path, data_type):
    for i, csv_file in enumerate(csv_files):
        size_csv = get_RoI_range_csv(size, csv_file)
        
        for index in size_csv.index:
            row = size_csv.loc[index]
            resX, resY = row["resolution"].split("X")
            resX, resY = int(resX), int(resY)
            
            sx, ex = row["x"], row["x"] + row["width"]
            sy, ey = row["y"], row["y"] + row["height"]
            cx, cy = (sx+ex)/2, (sy+ey)/2

            newX, newY = -1, -1
            # 관심영역 중앙 x점이 해상도의 절반 기준으로 어느 위치에 있느냐에 따라 left, right를 정한다.
            if (cx < resX): newX = ex + gap                  # Right
            else:           newX = sx - (gap + row["width"]) # Left

            # 관심영역 중앙 y점이 해상도의 절반 기준으로 어느 위치에 있느냐에 따라 up, down을 정한다.
            if (cy < resY): newY = ey + gap                   # Down
            else:           newY = sy - (gap + row["height"]) # Up

            # 좌표가 해상도 안에 있다면 (newX, newY가 양수)
            if ((newX >= 0 and newY >= 0) and (newX <= resX and newY <= resY)):
                endX, endY = newX + row["width"], newY + row["height"]
                
                # endX, Y가 해상도 안에 있다면 이미지를 생성한다.
                if (endX <= resX and endY <= resY):
                    file_name = row["Raw data ID"].split("_")[-1]
                    image_name = f"IMG_D_A{i+1}_{file_name}"
                    image_path = os.path.join(original_data_path, f"A{i+1}/")
                    image = cv2.imread(image_path + image_name)

                    save_path = os.path.join(project_path, "data/", f"{data_type}/", "asymptomatic/", f"A{i+1}/")
                    try:    os.mkdir(save_path)
                    except: pass
                    cv2.imwrite(save_path + image_name, image[newY:endY, newX:endX])

                # endX, Y가 해상도 안에 없는 상태이며, 넘긴다.
                else:
                    continue
    return