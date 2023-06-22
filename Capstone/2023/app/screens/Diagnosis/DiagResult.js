import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import DiagModal from "../../components/Diagnosis/DiagModal";
import { useNavigation, useRoute } from "@react-navigation/native";
import ProbChart from "../../components/Diagnosis/HorizontalBarChart";
import LinearGradient from "react-native-linear-gradient";


function DiagResult({
    aiResult,
    diagEnd, setDiagEnd,
    selectedImage, setSelectedImage, 
    setDiagnosisResultText2,diagnosisResultText2,
    setDiagtempView
}) {
    
  // console.log('result', aiResult)
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 진단 결과 스크린
  let diagnosisResultText1 = `진단 결과`;
  let resultButtonText1 = `처음으로 돌아가기`;
  let resultButtonText2 = `전문가와 상담하기`;
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const navigation = useNavigation();

    // 상담 게시판 이동 버튼 -
    const goWrite = (res, predictions) => {
        console.log("PickImage", res);
        console.log("predictions", predictions) ;
        navigation.push("Upload", { res, predictions, isSolution: true });
      };

    setDiagnosisResultText2(`${
      aiResult.labels[aiResult.predictions.indexOf(Math.max(...aiResult.predictions))]
    }(이)가 의심됩니다.`);
    
    return (
      <LinearGradient
        colors={['#f6faff', '#f6faff']}
        style={{flex : 1}}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
      <View style={{ backgroundColor: 'F6FAFF' }}>
        {diagEnd ? (
          // 진단 결과 스크린
          <View style={diagnosisResultStyles.resultScreenView}>
            {/* 진단 결과 이미지 및 문구 */}
            <View style={diagnosisResultStyles.resultView}>
              <View style={{ width: "50%" }}>
                <Text style={diagnosisResultStyles.resultTextTitle}>
                  {diagnosisResultText1}
                </Text>
                <Text style={diagnosisResultStyles.resultTextContent}>
                  {diagnosisResultText2}
                </Text>
              </View>
    
              <View style={diagnosisResultStyles.imageView}>
                <Image
                  source={{ uri: selectedImage.path }}
                  style={diagnosisResultStyles.image}
                  resizeMode="contain"
                  transform={[{ scale: 1 }]}
                />
              </View>
            </View>
            {/* 차트 표시 */}
            <View style={{marginTop: 25, height: "200%"}}>
              <ProbChart 
                prediction={aiResult["predictions"]}
                chartTitle={diagnosisResultStyles.chartTitle}
                chartView={diagnosisResultStyles.chartView}
                chartStyle={diagnosisResultStyles.chartStyle}
              />
            </View>
            
    
            <View style={diagnosisResultStyles.button_container}>
              <TouchableOpacity
                style={[diagnosisResultStyles.button, {marginTop: 20,}]}
                onPress={() => {
                  setSelectedImage(null);
                  setDiagtempView(false);
                  setDiagEnd(false);
                }}
              >
                <Text style={diagnosisResultStyles.buttonText}>{resultButtonText1}</Text>
              </TouchableOpacity>

              {/* gowrite 함수에 selectedImage 인자 전달 - 상담 게시글 작성 이동*/}
              <TouchableOpacity
                style={diagnosisResultStyles.button}
                onPress={() => {
                  console.log(selectedImage);
                  goWrite(selectedImage, aiResult["predictions"]);
                }}
              >
                <Text style={diagnosisResultStyles.buttonText}>{resultButtonText2}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          // 예외 없음
          <Text></Text>
        )}
      </View>
      </LinearGradient>
    );
}

// 진단 결과 스타일
const diagnosisResultStyles = StyleSheet.create({

  resultScreenView: {
    flexDirection: "column",
    height: 150,
    padding: 20,
    //backgroundColor: "#f6faff",
  },

  resultView: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    
  },

  resultTextTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#282828",
  },

  resultTextContent: {
    fontSize: 15,
    color: "#282828",
  },

  imageView: {
    overflow: "hidden",
    width: "50%",
    height: "100%",
  },

  image: {
    overflow: "hidden",
    width: 200,
    height: 200,
  },

  chartTitle: {    
    marginBottom: 10,

    fontSize: 16,
    color: "#282828",
  },

  chartView: {
    flex: 1,
    
    height: "100%",
    width: "100%",

    borderWidth: 1,
    borderColor: "#C0CDDF",
  },

  chartStyle: {
    height: "100%",
    width: "100%",

    borderWidth: 1,
    borderColor: "#C0CDDF",
    backgroundColor: "#FFFFFF",
  },

  button_container: {
    // 정렬
    flexDirection: "column",
    alignItems: "center",
    height: "120%",
    
    // 여백
    marginTop: 20,
  },

  button: {
    // 정렬
    justifyContent: "center",
    alignItems: "center",

    height: "35%",
    width: "100%",

    // 여백
    marginTop: 10,
    marginBottom: 5,

    // 모양
    borderRadius: 5,

    // 배경색
    backgroundColor: "#3A8DF8",
  },

  // 버튼 텍스트
  buttonText: {
    fontSize: 15,
    color: "#FFFFFF",
  },
});

export default DiagResult