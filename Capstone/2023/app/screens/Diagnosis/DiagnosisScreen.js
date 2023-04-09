import React, { useState } from "react";
import { Button, StyleSheet, View, Image, Text } from "react-native";
import PreDiagList from "../../components/Diagnosis/PreDiagList";
import DiagModal from "../../components/Diagnosis/DiagModal";

function DiagnosisScreen() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [diagmodalVisible, setDiagModalVisible] = useState(false);
  const [diagEnd, setDiagEnd] = useState(false);

  return (
    <View style={styles.block}>
      {!selectedImage ? (
        <PreDiagList setSelectedImage={setSelectedImage} style={styles.checklist} />
      ) : (
        <>
          {!diagmodalVisible ? (
            <>
              <Text>이 사진이 맞나요?</Text>
              <Button title="다시 선택하기" onPress={() => setSelectedImage(null)} />
              <Image source={{ uri: selectedImage }} style={styles.image} resizeMode="contain" />
              <Button title="진단하기" onPress={() => setDiagModalVisible(true)} />
            </>
          ) : (
            <>
              <DiagModal visible={diagmodalVisible} onClose={() => {
                setDiagModalVisible(false);
                setDiagEnd(false);
            }} selectedImage={selectedImage} setDiagEnd={setDiagEnd} />
              {diagEnd ? (
                <Image source={{ uri: selectedImage }} style={styles.image} resizeMode="contain" />
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
    height: 200,
  },
});

export default DiagnosisScreen;
