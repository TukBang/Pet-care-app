import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import UploadModeModal from './UploadModeModal';
import ImagePicker from 'react-native-image-crop-picker'
import CheckList from './CheckList';

const imagePickerOption = {
  mediaType: 'photo',
  maxWidth: 768,
  maxHeight: 768,
  includeBase64: Platform.OS === 'android',
};

function PreDiagList(props) {
  const onCropImage = (res) => {
    if (res.didCancel || !res) { return; }
    props.setSelectedImage(res.path);
    console.log(res);
  };

  const onLaunchCamera = () => {
    ImagePicker.openCamera(imagePickerOption)
      .then((image) => {
        ImagePicker.openCropper({
          path: image.path,
          width: image.width,
          height: image.height,
        })
          .then(onCropImage)
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
  };

  const onLaunchImageLibrary = () => {
    ImagePicker.openPicker(imagePickerOption)
    .then((image) => {
      ImagePicker.openCropper({
        path: image.path,
        width: image.width,
        height: image.height,
      })
      .then(onCropImage)
      .catch((error) => console.log(error));
    })
    .catch((error) => console.log(error));
  };

  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View>
      <CheckList setModalVisible={setModalVisible}/>
      <UploadModeModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onLaunchCamera={onLaunchCamera}
        onLaunchImageLibrary={onLaunchImageLibrary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    header: {
      marginLeft: 10,
      fontSize: 20
    },
    sentence : {marginLeft: 7},
    buttons: {}
})

export default PreDiagList;