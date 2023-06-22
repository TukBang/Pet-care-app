import { Modal,Pressable, View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native"

function MapUploadModal({isModalVisible, hideModal, resultImage, isLoading}) {
    return (
    <Modal visible={isModalVisible} onRequestClose={hideModal} transparent={true} animationType="fade">
      <Pressable style={styles.background} onPress={hideModal}>
        <View style={styles.whiteBox}>
          <Text style={styles.mainText}>산책 내용 저장</Text>
          
          <View style={styles.imageView}>
            <Image 
              style={styles.image}
              source={{uri: resultImage}}
              resizeMode="contain"
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={hideModal}
          >
            <Text style={styles.buttonText}>닫기</Text>
          </TouchableOpacity>          

          {/* Activity Indicator 표시 */}
          {isLoading && (
            <Modal transparent={true} animationType="fade">
              <Pressable style={styles.background}>
                <View style={styles.loading}>
                  <ActivityIndicator size="large" color="#3A8DF8"/>
                </View>
              </Pressable>
            </Modal>
          )}
        </View>
      </Pressable>
    </Modal>
    )
}

const styles= StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },

  whiteBox: {
    width: "80%",
    height: "60%",
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  mainText: {
    alignSelf: "center",
    fontSize: 18,
    color: "#282828",
  },

  imageView: {
    height: "80%", 
    width: "100%",

    justifyContent: "flex-start",
    alignSelf: "center",
  },

  image: {
    height: "90%",
    width: "100%",
    marginTop: 15,
    
    alignSelf: 'center'
  },

  button: {
    // 정렬
    justifyContent: "center",
    alignItems: "center",

    height: "10%",
    width: "85%",

    // 여백
    marginTop: 10,
    marginLeft: 20,

    // 모양
    borderRadius: 5,

    // 배경색
    backgroundColor: "#3A8DF8",
  },

  buttonText: {
    fontSize: 15,
    color: "#FFFFFF",
  },
})

export default MapUploadModal;