import React from 'react';
import {StyleSheet, Modal, View, Pressable, Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

function EndModal({
  visible, 
  onClose,
}) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}>
      <Pressable style={styles.background} onPress={onClose}>
        <View style={styles.whiteBox}>
          <Text style={styles.modalheader}>상담 게시글이 업로드 되었어요!</Text>
          <Text style={styles.modalsentence}>게시글을 확인하려면 카테고리를 확인해주세요.</Text>
          <Text style={styles.modalsentence}>확인 버튼을 누르면 홈으로 돌아가요.</Text>
          <Pressable
            style={styles.actionButton}
            android_ripple={{color: '#eee'}}
            onPress={() => {
              onClose();
            }}>
            <Text style={styles.text}>확인</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  whiteBox: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 4,
    elevation: 2,
    padding: 15,
    // flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginTop: 8,
    // flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#009688',
  },
  modalheader: {
    fontSize: 20,
    marginBottom: 10,
  },
  modalsentence: {
    fontSize: 14,
    marginBottom: 2,
  },
  text: {
    fontSize: 16,
    color: 'white'
  },
});

export default EndModal;