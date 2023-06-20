import React from "react";
import { Modal, Pressable, StyleSheet, Text, View, Linking, TouchableOpacity } from "react-native";



// 로그인 이후 - 프로필 설정 화면

function AuthExpertModal({visible, unvisible}) {
  return (
    <Modal visible={visible} onRequestClose={unvisible} transparent={true} animationType="fade">
      <Pressable style={styles.background} onPress={unvisible}>
        <View style={styles.whiteBox}>
          <Text style={[styles.mainText, {marginBottom: 5}]}>전문가 인증</Text>
          <Text style={styles.subText}>전문가 인증은 아래 이메일에 가입된 계정으로</Text>
          <Text style={[styles.subText, {marginBottom: 2}]}>수의사 면허증을 첨부하여 보내주세요.</Text>
          <Text style={[styles.subText, {color: "#3A8DF8", marginBottom: 5}]}>pca_authExpert@gmail.com</Text>
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
    height: "21%",
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

export default AuthExpertModal;
