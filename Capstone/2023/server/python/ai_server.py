# default
import pickle as pkl
import sys, os
from pprint import *
import numpy as np
import cv2
import torch
from torchvision.models import efficientnet_v2_s
from torchinfo import summary

# Web server based on Flask ()
from flask import Flask, jsonify, request, send_from_directory
from flask_restful import Resource, Api
from PIL import Image
import base64
import io

# users module
sys.path.append("d:\\GitHub\\Pet-care-app\\Capstone\\2023\\")
import skin_disease.module.skin_disease_model as sdm

# AI 불러오기
# server AI model 가중치 저장 경로
# Image 저장 경로
model_path = "E:/Tukorea/Capstone/model/server/"
image_path = "E:/Tukorea/Capstone/images/"
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = sdm.Skin_Distinction_Model(model=efficientnet_v2_s(weights="DEFAULT"),
                                       out_features=6,
                                       device=device,
                                       save_path=model_path).to(device)

def save_history_fig(history):
    import math
    import numpy as np
    import matplotlib.pyplot as plt

    train_loss = history["train_loss"]
    train_acc = history["train_acc"]
    valid_loss = history["valid_loss"]
    valid_acc = history["valid_acc"]
    epoch = len(history["train_loss"])

    fig, ax = plt.subplots(1, 2, figsize=(10, 4))
    ax[0].plot(train_loss, 'b', label="training")
    ax[0].plot(valid_loss, '--r', label="validation")
    ax[0].set_xlim((0, epoch))
    max_y = math.ceil(max(valid_loss)) if max(train_loss) < max(valid_loss) else math.ceil(max(train_loss))
    ax[0].set_ylim((0, max_y))
    ax[0].legend()
    ax[0].grid()

    ax[1].plot(train_acc, 'b', label="training")
    ax[1].plot(valid_acc, '--r', label="validation")
    ax[1].set_xlim((0, epoch))
    ax[1].set_ylim((0, 100))
    ax[1].legend()
    ax[1].grid()
    plt.savefig('model_history.png')
    return 

def get_evaluate_images(src_path, dst_path):
    import shutil

    return_flag = True
    try:
        shutil.copy(src_path + "AUC-ROC.png", dst_path + "AUC-ROC.png")
        shutil.copy(src_path + "classification_report.txt", dst_path + "classification_report.txt")
    except: return_flag = False
    return return_flag

class ImageResource(Resource):
    # 이 부분은 인공지능 평가에 대한 데이터가 보내져야 함
    def get(self, image_name):
        if os.path.isfile(os.path.join(image_path, image_name)):
            return send_from_directory(image_path, image_name)
        else:
            return {'error': 'Image not found'}, 404

    # 이미지를 받으면, 저장하고, 인공지능 모델에 넣어야 함
    def post(self):
        data = request.get_json()
        image_data = data.get('image', None)
        if image_data:
            try:
                image_data = base64.b64decode(image_data)
                image = Image.open(io.BytesIO(image_data))
                image_name = data.get('name', 'unnamed.jpg')
                image_path = os.path.join("", image_name)
                image.save(image_path)

                image = Image.fromarray(cv2.merge(list(cv2.split(np.array(image))[::-1])))
                pred = model.forward(image)
                prob = torch.softmax(pred, dim=1)

                ret_data = jsonify({'name': image_name, 
                                    'L1': prob[0], 'L2': prob[1],
                                    'L3': prob[2], 'L4': prob[3],
                                    'L5': prob[4], 'L6': prob[5]})
                return ret_data
            
            except Exception as e:
                return {'error': str(e)}, 400
        else:
            return {'error': 'No image data found'}, 400

if __name__ == "__main__":
    if not os.path.exists(image_path):
        os.makedirs(image_path)

    pprint(summary(model, input_size=(1, 3, 224, 224), verbose=0))
    
    # 예외 처리 필요
    # 2023-03-30 6-CLASS Valid 63% Model
    with open(f"{model_path}last_history.pkl", "rb") as pkl_file:
        save_history_fig(history=pkl.load(pkl_file))
    get_evaluate_images(src_path=model_path, dst_path=image_path)
    # PCA, T-SNE 결과도 가져오기 추가

    # 예외 처리 필요
    model.load_state_dict(torch.load(f"{model_path}high_acc.pth"))
    
    # 위 내용이 불러와지면, 서버를 엽니다.
    app = Flask(__name__)
    api = Api(app)
    api.add_resource(ImageResource, '/images', '/images/<string:image_name>')

    # 웹 서버 열기
    app.run(host='0.0.0.0', debug=True)