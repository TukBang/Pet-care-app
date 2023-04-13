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
    labels: ["A1", "A2", "A3", "A4", "A5", "A6"],
    predictions: [{ predict: [0, 0, 0, 0, 0, 0] }],
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
    try {
      console.log("NOW")
      console.log(selectedImage);
      
      const image = await RNFS.readFile(selectedImage, 'base64');
      const response = await fetch("http://61.106.219.238:5000/images", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          name: "test.jpg",
          image: image
        }),
      });

      aiResult.predictions = await response.json();
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