import React, { useState } from "react";
import { Button, StyleSheet, View, Image, Text } from "react-native";
import PreDiagList from "../../components/Diagnosis/PreDiagList";
import DiagModal from "../../components/Diagnosis/DiagModal";

function DiagnosisScreen() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [diagmodalVisible, setDiagModalVisible] = useState(false);
  const [diagEnd, setDiagEnd] = useState(false);
  const [diagtempView, setDiagtmpView] = useState(false)

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
              <Image source={{ uri: selectedImage }} style={styles.image} resizeMode="contain" />
              <Button title="진단하기" onPress={() => {setDiagModalVisible(true); setDiagtmpView(true)}} />
            </>
          ) : (
            <>
              <DiagModal visible={diagmodalVisible} onClose={() => {
                setDiagModalVisible(false);
                // setDiagEnd(false);
            }} selectedImage={selectedImage} setDiagEnd={setDiagEnd} />
              {diagEnd ? (
                <>
                    <View style={{flexDirection:'row', height: 150, marginLeft:24,marginRight:24}}>
                        <View style={{width: '30%'}}>
                            <Text style={{fontSize: 24}}>진단 결과</Text>
                            <Text>OO이 의심됩니다.</Text>
                        </View>
                        <Image source={{ uri: selectedImage }} style={styles.image} resizeMode="contain" />
                    </View>
                </>
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
    width: "100%",
    // height: 20,
  },
});

export default DiagnosisScreen;
