import React, { useState } from "react";
import { Button, StyleSheet, View, Image, Text, processColor } from "react-native";
import {useNavigation, useRoute} from '@react-navigation/native';
import RNFS from "react-native-fs"
import PreDiagList from "../../components/Diagnosis/PreDiagList";
import DiagModal from "../../components/Diagnosis/DiagModal";
import HorizontalBarChartScreen from "../../components/Diagnosis/HorizontalBarChart";
import UploadScreen from "../Community/UploadScreen";

function DiagnosisScreen() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [diagmodalVisible, setDiagModalVisible] = useState(false);
  const [diagEnd, setDiagEnd] = useState(false);
  const [diagtempView, setDiagtempView] = useState(false)
  const navigation = useNavigation();
  // const [isSolution, setIsSolution] = useState(false)

  // 상담 게시판 이동 버튼 - 
  const goWrite = (res) => {
    console.log("PickImage", res);
    navigation.push('Upload', {res, isSolution: true});
  }

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
      
      const image = await RNFS.readFile(selectedImage.path, 'base64');
      const response = await fetch("http://61.106.219.238:5000/images", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          name: "test.jpg",
          image: image
        }),
      });
      console.log("hello");
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
              <Text>이 사진이 맞나요? {selectedImage.path} or null</Text>
              <Button title="다시 선택하기" onPress={() => setSelectedImage(null)} />
              <View style={{height:150}}>
                <Image source={{ uri: selectedImage.path }} style={styles.image} resizeMode="contain" />
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
              selectedImage={selectedImage.path}
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
                        OO이 의심됩니다.
                      </Text>
                    </View>
                    <View style={{width: "70%"}}>
                      <Image source={{uri: selectedImage.path}} style={styles.image} resizeMode="center" />
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
                      {/* UploadScreen.js 를 재활용해서 상담에 쓰기 위한 isSolution 활용 */}
                      {/* isSolution 으로 조건 분기 : 자세한건 UploadScreen.js 참조 */}
                      <Button title='상담 게시판 올리기'  
                        onPress={() => {goWrite(selectedImage)}} />
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