import React, { useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import UploadModeModal from './UploadModeModal';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';


const imagePickerOption = {
  mediaType: 'photo',
  maxWidth: 768,
  maxHeight: 768,
  includeBase64: Platform.OS === 'android',
};


function CheckList() {
  const [data, setData] = useState([
    // { id: 1, text: '1. 도', checked: false },
    // { id: 2, text: '2. 레', checked: false },
    // { id: 3, text: '3. 미', checked: false },
    { id: 4, text: '4스날', checked: false },
    // { id: 5, text: '항목 5', checked: false },
  ]);

  const handleCheck = (id) => {
    setData(
      data.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };


  const onPickImage = (res) => {
    if (res.didCancel || !res) {
      return;
    }
    console.log(res);
  };

  const onLaunchCamera = () => {
    launchCamera(imagePickerOption, onPickImage);
  };

  const onLaunchImageLibrary = () => {
    launchImageLibrary(imagePickerOption, onPickImage);
  };

  const onPress = () => {
    if (Platform.OS === 'android') {
      setModalVisible(true);
      return;
    }
  }

  const [modalVisible, setModalVisible] = useState(false);
  const isAllChecked = data.every((item) => item.checked);

  return (
    <View>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <View style={{ }}>
            <Text style={styles.header}>{item.text}</Text>
            <Text style={styles.sentence}>이 진단은 6가지 증상- 추후 설명 추가 에 대해 진단할 수 있어요. 다만 오진의 가능성이 있으니, 진단 후 수의사와 상담이 권장돼요. 따라서 이 진단은 참고용으로 사용하면 좋을 것 같아요!</Text>
            <View style={{flexDirection:'row',justifyContent:'flex-end', marginTop: 10}}>
                <Text style={{ marginLeft: 10 }}>숙지하셨으면 눌러주세요!</Text>
                <CheckBox
                value={item.checked}
                onValueChange={() => handleCheck(item.id)}
                />
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
      <>
        <View style={{flexDirection: 'column'}}>
          <Button style={styles.buttons} title={
            !isAllChecked 
                ? '진단을 하기 위해선 위 유의사항을 읽어주세요!' 
                : '진단을 시작하려면 눌러주세요!'} 
                disabled={!isAllChecked}
                onPress={()=> setModalVisible(true)}
                />
          <Button style={styles.buttons} title='챗봇한테 물어보기' />
        </View>
        <UploadModeModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onLaunchCamera={onLaunchCamera}
          onLaunchImageLibrary={onLaunchImageLibrary}
        />
      </>
    </View>
  );
}

const styles = StyleSheet.create({
    header: {
        marginLeft: 10,
        fontSize: 20,
    },
    sentence : {
        marginLeft: 7

    },
    buttons: {
        
    }
})


export default CheckList;