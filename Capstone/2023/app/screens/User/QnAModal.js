import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";



// 로그인 이후 - 프로필 설정 화면

function QnAModal({visible, unvisible}) {
  return (
    <Modal visible={visible} onRequestClose={unvisible} transparent={true} animationType="fade">
      <Pressable style={styles.background} onPress={unvisible}>
        <View style={styles.whiteBox}>
          <Text>이메일로 문의 하시려면 아래 이메일을 통해 보내주세요</Text>
          <Text>pca_QnA@gmail.com</Text>
          <Text>화면을 클릭하면 꺼집니다.</Text>
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
    flexDirection: "column",
    alignItems: "center",
    width: "80%",
    backgroundColor: "white",
    borderRadius: 4,
    elevation: 2,
  },
});

export default QnAModal;