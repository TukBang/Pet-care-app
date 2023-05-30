import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ImageBackground, Image } from "react-native";
// import { useUserContext } from "../../contexts/UserContext";
import { useNavigation } from "@react-navigation/native";

// 홈 화면을 구성하는 요소 - 기능 요약의 형태

function SimpleTodo() {

  const navigation = useNavigation();
  const [ todoRecent, setTodoRecent ] = useState('건강 검진 가기')
  const [ isWalked, setIsWalked ] = useState(false);
  const [ whenWalked, setWhenWalked ] = useState('')


  return (
    <View style={styles.container} >
      {/* 가장 가까운 일정 표기 */}
      <View style={[styles.block, { marginBottom: 5 }]}>
        <Text style={styles.header}>간편 일정</Text>
      </View>
      {/* 박스 형태로 확인할 수 있는 뷰 */}
      <View style={Boxstyles.boxContainer}>
        <TouchableOpacity style={[Boxstyles.boxView, {marginRight : 7.5}]} activeOpacity={0.8}>
          {isWalked ? (
            <>
              <Text style={[Boxstyles.boxTitle,{fontSize: 20}]}>오늘도 즐거웠어요!</Text>
              <Text style={Boxstyles.boxSentence}>내일도 같이가요!</Text>
            </>
          ): (
            <>
              <Text style={Boxstyles.boxTitle}>산책 해주세요!</Text>
              <Text style={Boxstyles.boxSentence}>기다리고 있어요!</Text>
            </>
          )}
          <Text style={Boxstyles.boxSentence}>마지막 산책 : {whenWalked}</Text>
          <Image style={Boxstyles.image} source={require("../../assets/dog_walking.png")} />
        </TouchableOpacity>
        <TouchableOpacity style={[Boxstyles.boxView, {marginLeft : 7.5}]} activeOpacity={0.8}>
          <Text style={Boxstyles.boxTitle}>최근 일정</Text>
          <Text style={Boxstyles.boxSentence}>{todoRecent ? todoRecent : '일정이 없어요!'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    width: '100%',
  },
  container: {
    width: '100%',
    // height: '30%',
    marginBottom: 25,
  },
  header: {
    color: "black",
    fontWeight: "bold",
    paddingBottom: 10,
    fontSize: 25,
  },
  detail: {
    color: "#827397",
    paddingLeft: 10,
    fontSize: 15,
  },
  sentence: {
    color: "black",
    fontSize: 22,
  },
  endsentence: {
    color: "black",
    fontSize: 22,
    position: 'absolute', 
    alignSelf: 'flex-end',
    right: 0,
  },

});

const Boxstyles = StyleSheet.create({
  boxContainer: {
    flexDirection: "row",
    alignItems: 'center',
    height: '50%'
  },
  boxView: {
    flex: 1,
    width: '50%',
    height: '100%',
    borderRadius: 10,
    backgroundColor: "green",
    padding: 7,
  },
  boxTitle: {
    color: "white",
    fontSize: 22,
  },
  boxSentence: {
    color: "white",
    fontSize: 15,
  },
  image: {
    width: '60%',
    height: '60%',
    position: 'absolute',
    resizeMode: 'contain',
    bottom: 0,
    right: 10,
  }
})
export default SimpleTodo;
