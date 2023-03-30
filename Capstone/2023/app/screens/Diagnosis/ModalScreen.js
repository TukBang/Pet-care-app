import React from 'react';
import { Modal, Text, View, Button } from 'react-native';

const ModalScreen = ({ visible, onClose }) => {
  return (
    <Modal visible={visible} onRequestClose={onClose}>
      <View>
        <Text>This is my modal content!</Text>
        <Button title="Hide Modal" onPress={onClose} />
      </View>
    </Modal>
  );
};

export default ModalScreen;