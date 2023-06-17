import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ImageBackground, Image } from "react-native";
// import { useUserContext } from "../../contexts/UserContext";
import { useNavigation } from "@react-navigation/native";
import useCal from "../../hooks/calendar/useCal";
import { useEffect } from "react";
import { getNextClosestWalkingByUser } from "../../lib/walkInfo";
import useWalk from "../../hooks/walking/useWalk";

// 홈 화면을 구성하는 요소 - 기능 요약의 형태

function SimpleTodo() {
  const { onecal } = useCal();
  const { walk } = useWalk()
  const navigation = useNavigation();

  const [todoRecent, setTodoRecent ] = useState(null)
  const [ afterDay, setAfterDay] = useState()
  const [ todo, setTodo ] = useState()

  const [ recentDiagnosis, setRecentDiagnosis ] = useState()
  const [ isWalked, setIsWalked ] = useState(false);
  const [ walkedRecent, setWalkedRecent ] = useState()
  const [ beforeDay, setBeforeDay] = useState()


  const todoText = todo ? todo : "일정이 없어요!";
  const walkText = "마지막 산책 : " + (walkedRecent && beforeDay === 0 ? '오늘' : beforeDay + '일 전');
  const diagnosisText = recentDiagnosis ? recentDiagnosis : '진단 기록 바로 가기';

  useEffect(() =>{
    if (onecal) {
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
      const recentDate = new Date(onecal.s_time.seconds * 1000)
      const today= new Date()
      const diffInMilliseconds = Math.abs(recentDate - today);
      const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
      setAfterDay(diffInDays)
      // date.get
      setTodoRecent(recentDate.toLocaleString('ko-KR', options))
      setTodo(onecal.memo)
    }
    else {
      setTodoRecent(null)
      setAfterDay(null)
    }
  },[onecal])

  useEffect(() => {
    if (walk) {
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
      const recentDate = new Date(walk.createdAt.seconds * 1000)
      const today= new Date()
      const diffInMilliseconds = Math.abs(recentDate - today);
      const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
      setWalkedRecent(recentDate.toLocaleString('ko-KR', options))
      setBeforeDay(diffInDays)
    } else {
      setWalkedRecent(null)
      setBeforeDay(null)
    }
},[walk])

  const onPressCalendar = () => {
    navigation.navigate("CalendarScreen")
  }
  const onPressWalking = () => {
    navigation.navigate("WalkingScreen")
  }
  const onPressDiagnosis = () => {
    navigation.navigate("DiagTabNavigator")
  }
  const onPressConsult = () => {
    navigation.navigate("CommunityScreen", {boardCategory : "상담"})
  }

  return (
    <View style={styles.container} >
      {/* 가장 가까운 일정 표기 */}
      <View style={[styles.block, { marginBottom: 5 }]}>
        <Text style={styles.titleSign}>■ </Text>
        <Text style={styles.header}> 함께하기</Text>
      </View>
      {/* 박스 형태로 확인할 수 있는 뷰 */}
      <View style={Boxstyles.boxContainer}>
        <TouchableOpacity onPress={() => onPressCalendar()} style={[Boxstyles.boxView1, {marginLeft : 7.5}]} activeOpacity={0.8}>
            <Text style={Boxstyles.boxTitle}>최근 일정</Text>
              {!todoRecent ? (
              <Text style={Boxstyles.boxSentence}>일정을 등록해보세요.</Text>
              ) : (
              <>
                <Text style={Boxstyles.boxSentence}>{afterDay ? afterDay + '일 뒤에' : '오늘' } 일정이 있어요!</Text>
                <Text style={Boxstyles.boxSentence}>"{todoText}"</Text>
              </>
              )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onPressWalking()} style={[Boxstyles.boxView2, {marginRight : 7.5}]} activeOpacity={0.8}>
          {beforeDay === 0 ? (
            <>
              <Text style={[Boxstyles.boxTitle, {fontSize: 20}]}>산책 하러 가기</Text>
              <Text style={Boxstyles.boxSentence}>내일도 같이가요!</Text>
            </>
          ): (
            <>
              <Text style={Boxstyles.boxTitle}>산책하러 가기</Text>
            </>
          )}
          <Text style={Boxstyles.boxSentence}>{walkText}</Text>
          
          <Image style={Boxstyles.image} source={require("../../assets/dog_walking.png")} />
        </TouchableOpacity>
      </View>

      {/* /////////////////////////////////////////////////////// */}
      {/* 이부분 화면 전환 바꿔줘야해 */}
      {/* /////////////////////////////////////////////////////// */}
      
      <View style={Boxstyles.boxContainer}>
        <TouchableOpacity onPress={() => onPressDiagnosis()} style={[Boxstyles.boxView3, {marginLeft : 7.5}]} activeOpacity={0.8}>
            <Text style={Boxstyles.boxTitle}>진단 기록</Text>
            <Text style={Boxstyles.boxSentence}>{diagnosisText}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onPressConsult()} style={[Boxstyles.boxView4, {marginRight : 7.5}]} activeOpacity={0.8}>
              <Text style={Boxstyles.boxTitle}>상담 하기</Text>
              <Text style={Boxstyles.boxSentence}>전문가에게 물어보세요!</Text>

        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    width: '100%',
    flexDirection: 'row',
  },

  container: {
    width: '100%',
    marginBottom: 25,
  },

  titleSign: {
    paddingTop: 15,
    marginBottom: 10,
    fontSize: 15,
    color: "#3A8DF0",
  },

  header: {
    paddingTop: 10,
    color: "black",
    fontWeight: "bold",
    paddingBottom: 2,
    fontSize: 20,
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
    top: -5,
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'center', // 추가
    // height: '30%',
    padding: 5,
  },

  boxView1: {
    width: '50%',
    height: 180,
    borderRadius: 15,
    backgroundColor: "#F0C660",
    padding: 12,
    marginRight: 5,
    marginLeft: 5,
    elevation:7,
  },

  boxView2: {
    width: '50%',
    height: 180,
    borderRadius: 15,
    backgroundColor: "#65B065",
    padding: 12,
    marginRight: 5,
    marginLeft: 5,
    elevation:7,
  },

  boxView3: {
    width: '50%',
    height: 180,
    borderRadius: 15,
    backgroundColor: "#409AFF",
    padding: 12,
    marginRight: 5,
    marginLeft: 5,
    elevation:7,
  },

  boxView4: {
    width: '50%',
    height: 180,
    borderRadius: 15,
    backgroundColor: "#E07070",
    padding: 12,
    marginRight: 5,
    marginLeft: 5,
    elevation:7,
  },

  boxTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },

  boxSentence: {
    color: "white",
    fontSize: 15, 
  },

  image: {
    position: 'absolute',
    resizeMode: 'contain',
    width: '80%',
    height: '80%',
    top: 60,
    left: 12,
  }
})
export default SimpleTodo;
