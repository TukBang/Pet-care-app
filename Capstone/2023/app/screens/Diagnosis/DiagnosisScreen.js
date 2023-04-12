import React, { useState } from "react";
import { Button, StyleSheet, View, Image, Text, processColor } from "react-native";
import PreDiagList from "../../components/Diagnosis/PreDiagList";
import DiagModal from "../../components/Diagnosis/DiagModal";
import HorizontalBarChartScreen from "../../components/Diagnosis/HorizontalBarChart";

function DiagnosisScreen() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [diagmodalVisible, setDiagModalVisible] = useState(false);
  const [diagEnd, setDiagEnd] = useState(false);
  const [diagtempView, setDiagtmpView] = useState(false)

  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
      },
    ],
  };
  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 4, // optional, default 3
    barPercentage: 0.5,
  };

  return (
    <View style={styles.block}>
      {!selectedImage ? (
        <PreDiagList setSelectedImage={setSelectedImage} style={styles.checklist} />
      ) : (
        <>
          {!diagtempView ? (
            <>
              <Text>이 사진이 맞나요?</Text>
              <Button title="다시 선택하기" onPress={() => setSelectedImage(null)} />
              <View style={{height:150}}>
                <Image source={{ uri: selectedImage }} style={styles.image} resizeMode="contain" />
              </View>
              <Button title="진단하기" onPress={() => {setDiagModalVisible(true); setDiagtmpView(true)}} />
            </>
          ) : (
            <>
              <DiagModal visible={diagmodalVisible} onClose={() => {
                setDiagModalVisible(false);
                // setDiagEnd(false);
            }} selectedImage={selectedImage} setDiagEnd={setDiagEnd} />
              {diagEnd ? (
                <View style={{padding:10}}>
                    <View style={{flexDirection:'row', height: 150, alignItems:'flex-start'}}>
                        <View style={{width: '30%'}}>
                            <Text style={{fontSize: 24}}>진단 결과</Text>
                            <Text>OO이 의심됩니다.</Text>
                        </View>
                        <View style={{width: '70%'}}>
                            <Image source={{ uri: selectedImage }} style={styles.image} resizeMode="center" />
                        </View>
                    </View>
                    <View>
                        <HorizontalBarChartScreen />
                    </View>
                    <View>
                        <Button title='처음으로 돌아가기' onPress={()=>{setSelectedImage(null);setDiagtmpView(false);setDiagEnd(false) }} />
                    </View>
                </View>
              ) : (
                <>
                  <Text>ㅋㅋ?</Text>
                </>
              )}
            </>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default DiagnosisScreen;