import { useEffect } from "react";
import { StyleSheet, Modal, View, Pressable, Text, ActivityIndicator, Image } from "react-native";

// 진단 중 표기되는 Modal

function DiagModal({ diagState, selectedImage, visible, onClose, timeout = 1 }) {
  // 시간 초과 시 onClose() 함수 실행
  useEffect(() => {
    if (diagState === true) {
      const timeoutId = setTimeout(() => {
        onClose();
      }, timeout);
      return () => clearTimeout(timeoutId);
    }
  }, [visible, timeout, onClose]);

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <Pressable style={styles.background}>
        <View style={styles.whiteBox}>
          <Image source={{ uri: selectedImage.path }} style={styles.image} resizeMode="contain" />
          <ActivityIndicator size={50} color="#2296F3" />
          <Text style={styles.modalText}>진단 중입니다. 잠시만 기다려주세요!</Text>
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

  image: {
    marginTop: 10,
    marginBottom: 15,
    width: 200,
    height: 200,
  },

  modalText: {
    marginTop: 15,
    marginBottom: 10,
    fontSize: 15,
    color: "#282828",
  },
});

export default DiagModal;
