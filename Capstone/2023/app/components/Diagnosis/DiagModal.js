import Reac, {useEffect,useState} from 'react';
import {StyleSheet, Modal, View, Pressable, Text,ActivityIndicator, Button, Image} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';


function DiagModal({
    setDiagEnd,
    selectedImage,
    visible,
    onClose,
    timeout = 3000,
}) {
    
 
    useEffect(() => {
        const timeoutId = setTimeout(() => {
          onClose();
        }, timeout);
        setDiagEnd(true)
    
        return () => clearTimeout(timeoutId);
      }, [visible, timeout, onClose]);
    
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      >
      <Pressable style={styles.background} onPress={onClose}>
        <View style={styles.whiteBox}>
            {/* 로딩중 */}
            <Text style={styles.actionText}>진단중</Text>
            <ActivityIndicator size={32} color="#6200ee" />
            <Button title='임시버튼' />
            {/* 로딩끝 */}
            <Image source={{ uri: selectedImage }}  style={styles.image} resizeMode='contain'/>
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
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 4,
    elevation: 2,
  },
  actionButton: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  text: {
    fontSize: 16,
  },
  image: {
    width: '100%',
    height: 200
  },
});

export default DiagModal;