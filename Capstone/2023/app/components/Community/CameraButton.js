import React, {
  useState,
  useRef,
  useEffect
} from 'react';

import {
  View, 
  Pressable, 
  StyleSheet, 
  Platform,
  ActionSheetIOS,
  Animated
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import UploadModeModal from './UploadModeModal';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';

import ActionSheetModal from '../ActionSheetModal';

const TABBAR_HEIGHT = 49;
const imagePickerOption = {
    mediaType: 'photo',
    maxWidth: 768,
    maxHeight: 768,
    includeBase64: Platform.OS === 'android',
  };

function CameraButton() {
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  
  const animation = useRef(new Animated.Value(0)).current;
  // Animation for Pressable Button
  useEffect(()=> {
    Animated.spring(animation, {
      toValue: 0,
      useNativeDriver: true,
      tension: 45,
      friction: 5,
    }).start();
  }, [animation]);

  const bottom = Platform.select({
    android: TABBAR_HEIGHT / 2,
    ios: TABBAR_HEIGHT / 2 + insets.bottom - 4,
  });

  const onPress = () => {
    if (Platform.OS === 'android') {
      setModalVisible(true);
      return;
    }
    ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['카메라로 촬영하기', '사진 선택하기', '취소'],
          cancelButtonIndex: 2,
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            onLaunchCamera();
          } else if (buttonIndex === 1) {
            onLaunchImageLibrary();
          }
        },
      );
    };

    const onPickImage = (res) => {
      if (res.didCancel || !res) {
          return;
      }
      // console.log("PickImage", res);
      navigation.push('Upload', {res, isSolution: false});
    };

  const onLaunchCamera = () => {
    launchCamera(imagePickerOption, onPickImage);
  };

  const onLaunchImageLibrary = () => {
    launchImageLibrary(imagePickerOption, onPickImage);
  };

  return (
    <>
      <Animated.View 
        style={[styles.wrapper, {
          transform: [{
            translateY: animation.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 88],
            }),
          }],
          
          opacity: animation.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0],
          }),
        }]}
      >
        <Pressable
          style={({pressed}) => [
            styles.addButton,
            Platform.OS === 'ios' && {
              opacity: pressed ? 0.6 : 1,
            },
          ]}
          android_ripple={{color:'white'}}
          onPress={() => {
            setModalVisible(true);
          }}>
          <Icon name='add' size={24} style={{color: 'white'}} />
        </Pressable>
      </Animated.View>

      <ActionSheetModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        actions={[{
          icon: 'camera-alt',
          text: '카메라로 촬영하기',
          onPress: onLaunchCamera,
        }, {
          icon: 'photo',
          text: '사진 선택하기',
          onPress: onLaunchImageLibrary,
        }]}
      />
    </>
  );
}

const styles = StyleSheet.create({
  wrapper : {
    position: 'absolute',
    bottom: 15,
    right: 15,
    width: 58,
    height: 58,
    borderRadius: 28,
    
    zIndex: 5,
    
    shadowColor: '#4D4D4D',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,

    overflow: Platform.select({android: 'hidden'}),
    
  },

  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFA000',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default CameraButton;