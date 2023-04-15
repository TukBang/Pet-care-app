import React, { useState } from "react";
import { Button, StyleSheet, View, Image, Text, processColor } from "react-native";
import RNFS from "react-native-fs"
import PreDiagList from "../../components/Diagnosis/PreDiagList";
import DiagModal from "../../components/Diagnosis/DiagModal";
import HorizontalBarChartScreen from "../../components/Diagnosis/HorizontalBarChart";

function DiagnosisScreen() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [diagmodalVisible, setDiagModalVisible] = useState(false);
  const [diagEnd, setDiagEnd] = useState(false);
  const [diagtempView, setDiagtempView] = useState(false)

  let aiResult = {
    labels: ["구진, 플라크", "비듬, 각질, 상피성잔고리", "태선화, 과다색소침착", "농포, 여드름", "미란, 궤양", "결절, 종괴"],
    predictions: undefined,
  };

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 4, // optional, default 3
    barPercentage: 0.5,
  };

  // SelectedImage AI SERVER 전송
  const handlePostRequest = async () => {
    console.log(aiResult.predictions)
    try {
      const image = await RNFS.readFile(selectedImage, 'base64');
      const response = await fetch("http://61.106.219.238:5000/images", {
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

      let prediction = await response.json();
      aiResult.predictions = [
        prediction["L1"], prediction["L2"], prediction["L3"],
        prediction["L4"], prediction["L5"], prediction["L6"]
      ];
      console.log(aiResult.predictions);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.block}>
      {
        !selectedImage ? ( <PreDiagList setSelectedImage={setSelectedImage} style={styles.checklist} /> ) : (
        <>
          {
            !diagtempView ? (
            <>
              <Text>이 사진이 맞나요?</Text>
              <Button title="다시 선택하기" onPress={() => setSelectedImage(null)} />
              <View style={{height:150}}>
                <Image source={{ uri: selectedImage }} style={styles.image} resizeMode="contain" />
              </View>
              <Button title="진단하기" onPress={() => {
                handlePostRequest();
                setDiagModalVisible(true);
                setDiagtempView(true)}} />
            </>
          ) : (
          <>
            <DiagModal 
              setDiagEnd={setDiagEnd}
              selectedImage={selectedImage}
              visible={diagmodalVisible}
              onClose={() => {setDiagModalVisible(false);}}
               />
            {
              diagEnd ? (
                <View style={{padding: 10}}>
                  <View style={{flexDirection: "row", height: 150, alignItems: "flex-start"}}>
                    <View style={{width: "30%"}}>
                      <Text style={{fontSize: 24}}>
                        진단 결과
                      </Text>
                      <Text>
                        {}이 의심됩니다.
                      </Text>
                    </View>

                    <View style={{width: "70%"}}>
                      <Image source={{uri: selectedImage}} style={styles.image} resizeMode="center" />
                    </View>
                  </View>

                  <View>
                      <HorizontalBarChartScreen />
                  </View>

                  <View>
                      <Button title="처음으로 돌아가기" onPress={() => {
                        setSelectedImage(null);
                        setDiagtempView(false);
                        setDiagEnd(false)}} />
                      <Button title='상담 게시판 올리기' onPress={() => {}} />
                  </View>
                </View>
              ) : (
              <>
                <Text>
                  ㅋㅋ?
                </Text>
  </>)}</>)}</>)}</View>);
}

const styles = StyleSheet.create({
  block: {flex: 1},
  image: {
    width: "100%",
    height: "100%"
  }
});

export default DiagnosisScreen;