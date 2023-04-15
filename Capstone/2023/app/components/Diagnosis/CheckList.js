import React, { useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Button, 
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';

function CheckList({setModalVisible}) {
  let explainText1 = `피부 진단 AI 기술을 사용하여 6가지 증상을 진단합니다.
   1. 구진, 플라크
   2. 비듬, 각질, 상피성잔고리
   3. 태선화, 과다색소침착
   4. 농포, 여드름
   5. 미란, 궤양
   6. 결절, 종괴`;
  let explainText2 = `진단 결과는 전문가의 진단과 다를 수 있습니다. 결과에서 진단된 병의 설명을 자세히 읽어보시고 참고용으로 사용해주세요. 또한 진단된 병이 심각하다면, 수의사와 상담을 권장드립니다!`;
  let checkText = `유의사항 확인`;
  let ButtonText1 = !isAllChecked ? "진단 시작 전, 유의사항을 확인해주세요" : "진단 시작";
  let ButtonText2 = "챗봇에게 물어보기";

  const [data, setData] = useState([
    { id: 4, text: '유의사항', checked: false }
  ]);
  
  const [buttonColor, setButtonColor] = useState('#DFDFDF');
  const [buttonTextColor, setButtonTextColor] = useState('#A7A7A7');

  const handleCheck = (id) => {
    setData(data.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    ));

    if (buttonColor === '#DFDFDF') {
      setButtonColor('#2296F3');
      setButtonTextColor('#FFFFFF');
    } else {
      setButtonColor('#DFDFDF');
      setButtonTextColor('#A7A7A7');
    }
  }

  const onPress = () => {
    if (Platform.OS === 'android') {
      setModalVisible(true);
      return;
    }
  } 
  
  const isAllChecked = data.every((item) => item.checked);

  return (
    <View>
      <FlatList
        data = {data}
        renderItem = {({item}) => (
          <View style={{}}>
            <Text style={styles.header}>{item.text}</Text>
            <Text style={styles.sentence}>{explainText1}</Text>
            <Text style={styles.sentence}>{explainText2}</Text>
            <View style={styles.checkView}>
              <Text style={styles.checkText}>{checkText}</Text>
              <CheckBox style={styles.check}
                value={item.checked}
                onValueChange={() => handleCheck(item.id)}
              />
            </View>
          </View>
        )}
        keyExtractor = {(item) => item.id.toString()}
      />
      <View style={styles.button_container}>
        <TouchableOpacity style={[styles.button1, { backgroundColor: buttonColor, marginBottom: 10 }]}
          disabled={!isAllChecked}
          onPress={() => setModalVisible(true)}>
          <Text style={[styles.buttonText, { color: buttonTextColor }]}>{ButtonText1}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button1, { backgroundColor: '#2296F3' }]}>
          <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>{ButtonText2}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  // 유의사항 
  header: {
    // 여백
    marginTop: 40,
    marginLeft: 158,

    // 폰트
    fontSize: 30
  },

  // 설명
  sentence : {
    // 여백
    marginTop: 10,
    marginLeft: 40,
    marginRight: 40,

    // 평평하게 정렬
    textAlign: 'justify'
  },

  // 체크박스 뷰 (텍스트, 체크박스)
  checkView: {
    // 정렬
    flexDirection:'row',
    justifyContent:'flex-end',

    // 여백
    marginTop: 10
  },

  // 체크박스 옆 문구
  checkText: {
    // 여백
    marginTop: 10,
    marginLeft: 10
  },

  // 체크박스
  check: {
    // 여백
    marginTop: 4,
    marginRight: 34
  },

  button_container: {
    // 정렬
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: "hidden",

    // 여백
    marginTop: 20,
    marginLeft: 30,
    marginRight: 30,
  },

  // 버튼
  button1: {
    // 정렬
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 330,
    borderRadius: 5
  },

  // 버튼 텍스트
  buttonText: {
    fontSize: 15
  }
})

export default CheckList;