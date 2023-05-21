# default
import pickle as pkl
import sys, os
from pprint import *
import numpy as np

# AI
import cv2
import torch
from torchvision import transforms
from torchvision.models import efficientnet_v2_s
from torchinfo import summary

# ChatBot
import openai
import threading
import time, datetime

# Web server based on Flask ()
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
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
model_path = "D:/Capstone/Capstone/model/server/"
image_path = "D:/Capstone/Capstone/images/"
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = sdm.Skin_Distinction_Model(model=efficientnet_v2_s(weights="DEFAULT"),
                                       out_features=6,
                                       device=device,
                                       save_path=model_path).to(device)

# initial
last_use_user = list()
chatbot = dict()

# history_fig 저장
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
    plt.savefig(image_path + 'evaluate/model_history.png')
    return 

def get_evaluate_images(src_path, dst_path):
    import shutil

    return_flag = True
    try:
        shutil.copy(src_path + "AUC-ROC.png", dst_path + "AUC-ROC.png")
        shutil.copy(src_path + "classification_report.png", dst_path + "classification_report.png")
    except: return_flag = False
    return return_flag

def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        encoded_string = base64.b64encode(image_file.read()).decode("utf-8")
    return encoded_string

def softmax(pred):
    sum_exp = float()
    for prob in pred:
        sum_exp += np.exp(prob)

    ret_pred = list()
    for prob in pred:
        ret_pred.append(np.exp(prob) / sum_exp)

    return ret_pred

# chatbot class
class PetCareChatBot:
    def __init__(self, model="gpt-3.5-turbo"):
        self.model = model
        self.last_use_time = datetime.datetime.now()
        self.chatlog = dict()
        self.chatlog["system"] = "You are a helpful assistant about pet care."
        self.chatlog["user"] = list()
        self.chatlog["question_token"] = [0]
        self.chatlog["assistant"] = list()
        self.chatlog["answer_token"] = [0]
        self.chatlog["total_token"] = 0
        self.SYSTEM_TOKEN_LEN = 22
        return
    
    def return_create_time(self):
        return (self.create_time.year, 
                self.create_time.month, 
                self.create_time.day, 
                self.create_time.hour, 
                self.create_time.minute, 
                self.create_time.second)

    def request_chat(self, sentence):
        # initialize meesages
        ## system message part
        chat_messages = [{"role": "system", "content": self.chatlog["system"]}]
        
        ## user, assistant message part
        for q, a in zip(self.chatlog["user"], self.chatlog["assistant"]):
            chat_messages.append({"role": "user", "content": q})
            chat_messages.append({"role": "assistant", "content": a})

        # append question message
        chat_messages.append({"role": "user", "content": sentence})
        self.chatlog["user"].append(sentence)

        # request message
        openai.organization = os.getenv("OPENAI_ORGANIZATION")
        openai.api_key = os.getenv("OPENAI_API_KEY")
        completion = openai.ChatCompletion.create(
            model=self.model,
            messages=chat_messages
        )

        # update token
        self.chatlog["answer_token"].append(completion["usage"]["completion_tokens"])
        if (len(self.chatlog["question_token"]) == 0):
            self.chatlog["question_token"].append(
                completion["usage"]["prompt_tokens"] - self.SYSTEM_TOKEN_LEN
            )
        else:
            self.chatlog["question_token"].append(
                completion["usage"]["prompt_tokens"] 
                - sum(self.chatlog["question_token"][:-1])
                - sum(self.chatlog["question_token"][:-1])
                - self.SYSTEM_TOKEN_LEN
            )
        self.chatlog["total_token"] = completion["usage"]["total_tokens"]

        # append answer message
        answer_message = completion["choices"][0]["message"]["content"]
        self.chatlog["assistant"].append(answer_message)

        # delete exceed log messages
        while self.chatlog["total_token"] > 1000:
            # delete exceed token
            question_token = self.chatlog["question_token"].pop(0)
            answer_token = self.chatlog["answer_token"].pop(0)

            ### part that can improve memory ability efficiency ###
            self.chatlog["user"].pop(0)
            self.chatlog["assistant"].pop(0)
            self.chatlog["total_token"] -= question_token - answer_token
            #######################################################
        
        self.last_use_time = datetime.datetime.now()
        return answer_message

class ImageResource(Resource):
    # 이 부분은 인공지능 평가에 대한 데이터가 보내져야 함
    def get(self):
        auc_roc = encode_image(image_path=image_path + "evaluate/AUC-ROC.png")
        class_report = encode_image(image_path=image_path + "evaluate/classification_report.png")
        history = encode_image(image_path=image_path + "evaluate/model_history.png")

        ret_data = {"auc-roc": auc_roc,
                    "classification_report": class_report,
                    "model_history": history}

        return ret_data

    # 이미지를 받으면, 저장하고, 인공지능 모델에 넣어야 함
    def post(self):
        global image_path
        data = request.get_json()
        image_data = data.get('image', None)
        if image_data:
            try:
                image_data = base64.b64decode(image_data)
                image = Image.open(io.BytesIO(image_data))
                image_name = data.get('imageName', 'unnamed.jpg')
                save_path = os.path.join(image_path, image_name)
                image.save(save_path)

                test_transforms = transforms.Compose([
                    transforms.Resize(224),
                    transforms.ToTensor(),                    
                    transforms.Normalize([0.5, 0.5, 0.5], [0.5, 0.5, 0.5])
                ])

                image = Image.fromarray(cv2.merge(list(cv2.split(np.array(image))[::-1])))
                image = test_transforms(image).to(device).unsqueeze(0)
                with torch.no_grad():
                    model.eval()
                    pred = model.forward(image)
                probs = softmax(pred[0].to("cpu").detach().numpy())

                ret_data = jsonify({'name': image_name, 
                                    'L1': probs[0], 'L2': probs[1],
                                    'L3': probs[2], 'L4': probs[3],
                                    'L5': probs[4], 'L6': probs[5]})
                return ret_data

            except Exception as e:
                print(e)
                return {'error': str(e)}, 400
        else:
            return {'error': 'No image data found'}, 400

class ChatResource(Resource):
    def get(self):
        # ChatGPT Model 정보 전송
        return
    
    def post(self):
        global last_use_user, chatbot
        data = request.get_json()
        uid = data.get('uid', None)
        message = data.get('message', None)
        if not isinstance(message, type(None)) and not isinstance(uid, type(None)):
            try:
                # 챗봇 생성
                if uid not in chatbot:
                    chatbot[uid] = PetCareChatBot()
                    last_use_user.append(uid)
                
                ret_message = chatbot[uid].request_chat(message)
                last_use_user.remove(uid)
                last_use_user.append(uid)

                ret_data = jsonify({'message': ret_message})
                return ret_data
            except Exception as e:
                print(e)
                return {'error': str(e)}, 400
        else:
            return {"error": "Please check your sent message"}, 400

# last_use_user must be sorted by usage time
def free_chatbot(chatbot, last_use_user):
    while True:
        time.sleep(60)
        now = datetime.datetime.now()
        for uid in last_use_user:
            if (now - chatbot[uid].last_use_time).seconds > 3600:
                chatbot.pop(uid)
                last_use_user.remove(uid)

if __name__ == "__main__":
    if not os.path.exists(image_path):
        os.makedirs(image_path)

    # chatbot 대화 내용 제거용 thread 생성
    chatbot_thread = threading.Thread(target=free_chatbot, args=(chatbot, last_use_user))
    chatbot_thread.daemon = True
    chatbot_thread.start()

    pprint(summary(model, input_size=(1, 3, 224, 224), verbose=0))
    
    # 예외 처리 필요
    # 2023-03-30 6-CLASS Valid 63% Model
    with open(f"{model_path}last_history.pkl", "rb") as pkl_file:
        save_history_fig(history=pkl.load(pkl_file))
    get_evaluate_images(src_path=model_path, dst_path=image_path + "evaluate/")
    # PCA, T-SNE 결과도 가져오기 추가

    # 예외 처리 필요
    model.load_state_dict(torch.load(f"{model_path}high_acc.pth"))
    
    # 위 내용이 불러와지면, 서버를 엽니다.
    app = Flask(__name__)
    CORS(app)
    
    api = Api(app)
    api.add_resource(ImageResource, '/images')
    api.add_resource(ChatResource, '/chatbot')

    # 웹 서버 열기
    app.run(host='0.0.0.0', debug=True)