import { Modal,Pressable, View, Text, Image, Button, StyleSheet, ActivityIndicator } from "react-native"

function MapUploadModal({isModalVisible, hideModal, resultImage, isLoading}) {

    return (
    <Modal visible={isModalVisible} onRequestClose={hideModal} transparent={true} animationType="fade">
        <Pressable style={styles.background} onPress={hideModal}>
          <View style={styles.whiteBox}>
            <Text>산책 내용 저장</Text>
            <Image source={{uri: resultImage}} style={styles.image} resizeMode="contain"/>
            <Button title="닫기" onPress={hideModal} />
            {/* Activity Indicator 표시 */}
            {isLoading && (
            <Modal transparent={true} animationType="fade">
              <Pressable style={styles.background}>
                <View style={styles.loading}>
                  <ActivityIndicator size="large" />
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
      image: {
        marginTop: 10,
        marginBottom: 15,
        width: 200,
        height: 200,
        alignSelf: 'center'
      },
})

export default MapUploadModal;