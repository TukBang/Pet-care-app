## TUK-CE Capstone project: 반려동물 케어 어플리케이션(Pet Care Application)
- [S2-9](https://drive.google.com/file/d/1giU1pYGtdT9mLH-DMJ_dQV0NAyd9nFFq/view?usp=sharing)
  - 방진식 pas342423@gmail.com
  - 노한영 gksehf97@tukorea.ac.kr
  - 이승훈 oscm9@tukorea.ac.kr

- 데이터 정보
  - [정형 데이터(csv)](https://drive.google.com/file/d/1BIObNyMgc2k1ApZL7BcpR7KQC-L2Vn70/view?usp=sharing) (2022-12)
  - [dataset(48.12GB)](https://www.aihub.or.kr/aihubdata/data/view.do?dataSetSn=561) (2022-12)
  - [pretrained model](https://drive.google.com/file/d/1F-lV7uH7nnuANQlnY2oMVhxYmI31oNUf/view?usp=sharing)
    - Acc: 69%
    - 5 Class
      - A1: 구진, 플라크
      - A2: 태선화, 과다색소침착
      - A3: 농포, 여드름
      - A4: 미란, 궤양
      - A5: 결절, 종괴
</br>

## Application
- React Native
- Firebase
</br>

## Server
- 어플리케이션과 소통되는 Database는 Firebase를 사용합니다.
- Python 파일에 사용자의 환경에 따라 다르게 작동되는 경로가 포함되어 있어 코드를 수정하여 사용해야 합니다.
- ChatGPT API를 사용하기 위한 Key는 [이 곳](https://platform.openai.com/docs/introduction)을 참고해주세요.

### Development environment
- Python Flask
- ChatGPT 3.5 turbo API

### Files
- Pet-care-app\Capstone\2023\server\python\
  - ai_server.py
    - Flask 기반 AI 서버 (CNN, Chatbot)
    - 173 Line의 수를 조절하여 ChatGPT가 기억할 token을 설정합니다.
    - 245 Line의 jsonify에 레이블의 개수를 조절하여 모델의 레이블을 다르게 설정할 수 있습니다.

### Dependency
- pprint
- numpy
- pandas
- torch>=1.10.1
- torchvision>=0.11.2
- torchinfo
- openai
- flask
</br>
  
## AI
### Development environment
- Windows 10
- NVIDIA RTX 3090 24GB

### Files
- 각 주피터 노트북 파일은 사용자의 환경에 따라 다르게 작동되므로 코드를 수정하여 사용해야 합니다.
- Pet-care-app\Capstone\2023\skin_disease\
  - data\
    - 정형 데이터(A1.csv, A2.csv, ..., A6.csv)
  - module\
    - data_processing.py
      - 데이터셋 json 파일 처리 모듈
    - image_preprocessing.py
      - 이미지 전처리 함수 모듈
    - skin_disease_model.py
      - 모델 모듈
  - create_preprocessed_dataset.ipynb
    - 전처리 데이터셋 만드는 파일
  - Extract_data.ipynb
    - 전처리 데이터 추출 파일
  - train_model.ipynb
    - 모델 훈련 파일
 
### Dependency
- pprint
- tqdm
- natsort
- numpy
- numba
- pandas
- matplotlib
- PIL
- python-opencv
- sklearn
- torch>=1.10.1
- torchvision>=0.11.2
