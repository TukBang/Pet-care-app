import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";



// 로그인 이후 - 프로필 설정 화면

function QnAModal({visible, unvisible}) {
  return (
    <Modal visible={visible} onRequestClose={unvisible} transparent={true} animationType="fade">
      <Pressable style={styles.background} onPress={unvisible}>
        <View style={styles.whiteBox}>
          <Text style={styles.mainText}>문의는 아래 이메일로 보내주세요</Text>
          <Text style={[styles.subText, {color: "#3A8DF8"}]}>pca_QnA@gmail.com</Text>
          <Text style={styles.mainText}>화면을 클릭하면 꺼집니다.</Text>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: "rgba(0,0,0,0.6)",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  whiteBox: {
    width: "80%",
    height: "13%",
    flexDirection: "column",
    alignItems: "center",

    backgroundColor: "white",
    borderRadius: 4,
    elevation: 2,
  },

  mainText: {
    marginTop: 5,

    fontSize: 18,
    color: "#282828",
  },

  subText: {
    fontSize: 16,
    color: "#686868",
  },
});

export default QnAModal;