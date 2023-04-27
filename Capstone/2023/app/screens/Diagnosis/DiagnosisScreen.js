import React, { useState } from "react";
import {
  View, 
  Text, 
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import RNFS from "react-native-fs"
import PreDiagList from "../../components/Diagnosis/PreDiagList";
import DiagModal from "../../components/Diagnosis/DiagModal";
import ProbChart from "../../components/Diagnosis/HorizontalBarChart";
import { useNavigation, useRoute } from '@react-navigation/native';

var aiResult = {
  labels: ["구진, 플라크", "비듬, 각질, 상피성잔고리", "태선화, 과다색소침착", "농포, 여드름", "미란, 궤양", "결절, 종괴"],
  predictions: [0, 0, 0, 0, 0, 0],
};

var diagnosisResultText2 = `(이)가 의심됩니다.`;

function DiagnosisScreen() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [diagmodalVisible, setDiagModalVisible] = useState(false);
  const [diagState, setDiagState] = useState(false);
  const [diagEnd, setDiagEnd] = useState(false);
  const [diagtempView, setDiagtempView] = useState(false);
  const navigation = useNavigation();

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 진단 선택 스크린
  let DiagnosisText1 = `진단하려는 사진을 확인해주세요.`
  let DiagnosisText2 = `  [Tip]\n  환부가 잘 보이고, 이미지가 클수록 정확도가 향상됩니다!`
  let buttonText1 = `다시 선택하기`;
  let buttonText2 = `진단하기`;
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 진단 결과 스크린
  let diagnosisResultText1 = `진단 결과`;
  let resultButtonText1 = `처음으로 돌아가기`;
  let resultButtonText2 = `전문가와 상담하기`;
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // 61.106.219.238:5000
  // 121.170.118.190:5000
  // SelectedImage AI SERVER 전송
  const handlePostRequest = async () => {
    try {
      const image = await RNFS.readFile(selectedImage.path, 'base64');
      const response = await fetch("http://121.170.118.190:5000/images", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          /* 더 많은 펫 정보들이 담겨서 가야 함 */
          /* 랜덤 이미지 이름은 추후에 사용자 정보와 펫 정보를 함께 담을 수 있도록
             식별하여 구성하도록 만들어야 함 (2023-04-15) */
          name : Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + ".jpg",
          image: image
        }),
      });

      let predictions = await response.json();
      aiResult.predictions = [
        predictions["L1"], predictions["L2"], predictions["L3"],
        predictions["L4"], predictions["L5"], predictions["L6"]
      ];

      console.log(aiResult.predictions);
      diagnosisResultText2 = `${aiResult.labels[aiResult.predictions.indexOf(Math.max(...aiResult.predictions))]}(이)가 의심됩니다.`;
      console.log(diagnosisResultText2)
      setDiagState(true);
      setDiagEnd(true);
    } catch (error) {
      // 서버 오류나서 진단 실패되면 진행
      // 초기화면으로 갈 수 있도록 설정
      console.error(error);
      setSelectedImage(null);
      setDiagtempView(false);
      setDiagState(false);
      setDiagEnd(false)
    }
  };

  // 상담 게시판 이동 버튼 - 
  const goWrite = (res) => {
    console.log("PickImage", res);
    navigation.push('Upload', {res, isSolution: true});
  }

  return (
    <View style={{flex: 1}}>
      {
        !selectedImage ? ( <PreDiagList setSelectedImage={setSelectedImage} style={diagnosisSelectStyles.checklist} /> ) : (
        <>
          {
            // 진단 선택 스크린
            !diagtempView ? (
            <>
              <Text style={diagnosisSelectStyles.text1}>{DiagnosisText1}</Text>
              <Text style={diagnosisSelectStyles.text2}>{DiagnosisText2}</Text>
              <View style={diagnosisSelectStyles.imageView}>
                <Image 
                  source={{ uri: selectedImage.path }}
                  style={diagnosisSelectStyles.image}
                  resizeMode="contain"
                />
              </View>
              
              <View style={diagnosisSelectStyles.button_container}>
                <TouchableOpacity 
                  style={diagnosisSelectStyles.button}
                  onPress={() => {
                    setDiagState(false);
                    // AI 서버에 이미지 전송
                    handlePostRequest();
                    
                    // 진단 모달 띄우기
                    setDiagtempView(true);
                    setDiagModalVisible(true);
                    }}>
                  <Text style={diagnosisSelectStyles.buttonText}>{buttonText2}</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={diagnosisSelectStyles.button}
                  onPress={() => setSelectedImage(null)}>
                  <Text style={diagnosisSelectStyles.buttonText}>{buttonText1}</Text>
                </TouchableOpacity>
              </View>
              
            </>
          ) : (
          <>
            {/* 진단 중 팝업 모달 */}
            <DiagModal 
              diagState={diagState}
              selectedImage={selectedImage}
              visible={diagmodalVisible}
              onClose={() => {
                setDiagModalVisible(false);
              }}
               />
            {
              diagEnd ? (
                // 진단 결과 스크린
                <View style={diagnosisResultStyles.resultScreenView}>
                  <View style={diagnosisResultStyles.resultView}>
                    <View style={{width: "50%"}}>
                        <Text style={diagnosisResultStyles.resultTextTitle}>{diagnosisResultText1}</Text>
                        <Text style={diagnosisResultStyles.resultTextContent}>{diagnosisResultText2}</Text>
                    </View>

                    <View style={diagnosisResultStyles.imageView}>
                      <Image 
                        source={{uri: selectedImage.path}} 
                        style={diagnosisResultStyles.image} 
                        resizeMode="contain"
                        transform={[{scale: 1}]}
                      />
                    </View>

                  </View>

                  <View style={diagnosisResultStyles.chartView}>
                      <ProbChart 
                        prediction={aiResult["predictions"]}
                      />
                  </View>

                  <View style={diagnosisResultStyles.button_container}>
                      <TouchableOpacity style={diagnosisResultStyles.button}
                        onPress={() => {
                          setSelectedImage(null);
                          setDiagtempView(false);
                          setDiagEnd(false)}}>
                        <Text style={diagnosisResultStyles.buttonText}>{resultButtonText1}</Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={diagnosisResultStyles.button}
                        onPress={() => { 
                          console.log(selectedImage)
                          goWrite(selectedImage) 
                        }}>
                        <Text style={diagnosisResultStyles.buttonText}>{resultButtonText2}</Text>
                      </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <Text></Text>
              )}</>)}</>)}</View>);
}

// 진단 선택 스타일
const diagnosisSelectStyles = StyleSheet.create({
  text1: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,

    fontSize: 20
  },

  text2: {
    marginBottom: 40,
    marginLeft: 10,

    fontSize: 15,
    fontWeight: "bold"
  },

  imageView: {
    alignItems: 'center',

    height: 300,
    width: "100%",

    // 여백
    marginBottom: 30
  },

  image: {
    width: 300,
    height: 300
  },

  button_container: {
    // 정렬
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: "hidden",

    // 여백
    marginTop: 20,
    marginLeft: 30,
    marginRight: 30,
  },

  button: {
    // 정렬
    justifyContent: 'center',
    alignItems: 'center',

    height: 40,
    width: 330,

    // 여백
    marginTop: 10,

    // 모양
    borderRadius: 5,

    // 배경색
    backgroundColor: '#2296F3'
  },

  // 버튼 텍스트
  buttonText: {
    fontSize: 15,
    color: "#FFFFFF"
  },

});

// 진단 결과 스타일
const diagnosisResultStyles = StyleSheet.create({
  resultScreenView: {
    flexDirection: "column",
    height: 150,
    padding: 20,
  },

  resultView: {
    flexDirection: "row",
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  
  resultTextTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },

  resultTextContent: {
    fontSize: 15,    
  },

  imageView: {
    overflow: "hidden",
    width: "50%",
    height: "100%",
  },

  image: {
    overflow: "hidden",
    width: 250,
    height: 250,
  },

  chartView: {
    // 정렬
    flexDirection: "row",
    height: 100,
    padding: 0,

    marginBottom: 118,
  },

  button_container: {
    // 정렬
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: "hidden",

    // 여백
    marginTop: 20,
  },

  button: {
    // 정렬
    justifyContent: 'center',
    alignItems: 'center',

    height: 40,
    width: 330,

    // 여백
    marginTop: 10,

    // 모양
    borderRadius: 5,

    // 배경색
    backgroundColor: '#2296F3'
  },

  // 버튼 텍스트
  buttonText: {
    fontSize: 15,
    color: "#FFFFFF"
  },
});

export default DiagnosisScreen;