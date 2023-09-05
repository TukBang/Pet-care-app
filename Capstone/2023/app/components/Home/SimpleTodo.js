import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, RefreshControl, Image, FlatList } from "react-native";
// import { useUserContext } from "../../contexts/UserContext";
import { useNavigation } from "@react-navigation/native";
import useCal from "../../hooks/calendar/useCal";
import { useEffect } from "react";
import { getNextClosestWalkingByUser } from "../../lib/walkInfo";
import useWalk from "../../hooks/walking/useWalk";
import { useUserContext } from "../../contexts/UserContext";

// 홈 화면을 구성하는 요소 - 기능 요약의 형태

function SimpleTodo() {
  const { onecal, refreshing, onRefresh } = useCal();
  const [nonOneCal, setNonOneCal] = useState([]);
  const { oneWalk } = useWalk()
  const navigation = useNavigation();

  const [todoRecent, setTodoRecent ] = useState(null)
  const [ afterDay, setAfterDay] = useState()
  const [ todo, setTodo ] = useState()

  const [ recentDiagnosis, setRecentDiagnosis ] = useState()
  const [ walkedRecent, setWalkedRecent ] = useState()
  const [ beforeDay, setBeforeDay] = useState()

  const {updateVariable, setUpdateVariable} = useUserContext();
  const {user} = useUserContext();

  const todoText = todo ? todo : "일정이 없어요!";
  const walkText = walkedRecent ? ("마지막 산책 : " + (walkedRecent && beforeDay === 0 ? '오늘' : beforeDay + '일 전')) : ("산책을 해볼까요?");
  const diagnosisText = recentDiagnosis ? recentDiagnosis : '진단 기록 바로 가기';
  const expertText = user.isExpert ? ("상담 게시글 확인하기") : ("전문가에게 물어보세요!")
  
  useEffect(() =>{
    
    setUpdateVariable(0);
    console.log(updateVariable)
    if (onecal) {
      console.log('onecal',onecal)
      if(onecal.s_time && onecal.s_time.seconds){
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
      console.log('onecal.s_time.seconds',onecal.s_time.seconds)
      const recentDate = new Date(onecal.s_time.seconds * 1000)
      const today= new Date()
      const diffInMilliseconds = Math.abs(recentDate - today);
      const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
      setAfterDay(diffInDays)
      // date.get
      setTodoRecent(recentDate.toLocaleString('ko-KR', options))
      setTodo(onecal.memo)
    }} else {
      setTodoRecent(null)
      setAfterDay(null)
    }
    console.log(updateVariable)
  },[onecal, updateVariable])

  useEffect(() => {
    if (oneWalk && oneWalk.createdAt !== null) {
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
      const recentDate = new Date(oneWalk.createdAt.seconds * 1000)
      const today= new Date()
      const diffInMilliseconds = Math.abs(recentDate - today);
      const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
      setWalkedRecent(recentDate.toLocaleString('ko-KR', options))
      setBeforeDay(diffInDays)
    } else {
      setWalkedRecent(null)
      setBeforeDay(null)
    }
},[oneWalk,updateVariable])

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
            {/* <Text style={Boxstyles.boxSentence}>일정을 등록해보세요.</Text> */}
            {!todoRecent ? (
            <Text style={Boxstyles.boxSentence}>일정을 등록해보세요.</Text>
            ) : (
            <>
              <Text style={Boxstyles.boxSentence}>{afterDay ? afterDay + '일 뒤에' : '24시간 이내 ' } 일정이 있어요!</Text>
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
      <View style={Boxstyles.boxContainer}>
        <TouchableOpacity onPress={() => onPressDiagnosis()} style={[Boxstyles.boxView3, {marginLeft : 7.5}]} activeOpacity={0.8}>
            <Text style={Boxstyles.boxTitle}>진단 기록</Text>
            <Text style={Boxstyles.boxSentence}>{diagnosisText}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onPressConsult()} style={[Boxstyles.boxView4, {marginRight : 7.5}]} activeOpacity={0.8}>
              <Text style={Boxstyles.boxTitle}>상담 하기</Text>
              <Text style={Boxstyles.boxSentence}>{expertText}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const renderItem = ({ item }) => (
  <CalendarCard
  calendarID = {item.calendarID}
  calendarUid = {item.calendarUid}
  title = {item.title}
  memo = {item.memo}
  s_time = {item.s_time}
  e_time = {item.e_time}
  userID = {item.userID}
  petName = {item.petName}
  createdAt  = {item.createdAt}
  />
);

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
