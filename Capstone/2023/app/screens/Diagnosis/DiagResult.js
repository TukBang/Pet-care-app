import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import DiagModal from "../../components/Diagnosis/DiagModal";
import { useNavigation, useRoute } from "@react-navigation/native";
import ProbChart from "../../components/Diagnosis/HorizontalBarChart";



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
    <>
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
          <View style={diagnosisResultStyles.chartView}>
            <ProbChart prediction={aiResult["predictions"]} />
          </View>

          <View style={diagnosisResultStyles.button_container}>
            <TouchableOpacity
              style={diagnosisResultStyles.button}
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
    </>
    )


}

// 진단 결과 스타일
const diagnosisResultStyles = StyleSheet.create({
  resultScreenView: {
    flexDirection: "column",
    height: 150,
    padding: 20,
  },

  resultView: {
    flexDirection: "row",
    justifyContent: "space-between",
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
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    overflow: "hidden",

    // 여백
    marginTop: 20,
  },

  button: {
    // 정렬
    justifyContent: "center",
    alignItems: "center",

    height: 40,
    width: 330,

    // 여백
    marginTop: 10,

    // 모양
    borderRadius: 5,

    // 배경색
    backgroundColor: "#2296F3",
  },

  // 버튼 텍스트
  buttonText: {
    fontSize: 15,
    color: "#FFFFFF",
  },
});

export default DiagResult