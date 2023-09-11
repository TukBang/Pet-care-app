import React, { useState, useContext, useEffect } from "react";
import { StyleSheet, View, KeyboardAvoidingView, Platform, Alert, ScrollView } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import events from "../../lib/events";
import LogContext from "../../contexts/LogContext";
import WriteHeader from "../../components/Calendar/WriteHeader";
import WriteEditor from "../../components/Calendar/WriterEditor";

// firebase에 저장
import { createCalendar } from "../../lib/calendar";
// user uid 를 위해 사용
import { useUserContext } from "../../contexts/UserContext";
import { deleteCalendar } from "../../lib/calendar";
import { getAllCalendarsByUser } from "../../lib/calendar";
import { v4 as uuidv4 } from "uuid";

import { deleteCalendarRecordFromFirebase } from "../../lib/calendar";

// 일정 작성 화면
function WriteScreen({ route }) {
  const log = route.params?.log;
  // const selectedDate = route.params.selectedDate;
  // console.log(selectedDate);

  const [title, setTitle] = useState(log?.title ?? "");
  const [body, setBody] = useState(log?.body ?? "");
  const [pet, setPet] = useState(log?.pet ?? "");
  const navigation = useNavigation();
  const [date, setDate] = useState(log ? new Date(log.date) : new Date());
  const [endDate, setEndDate] = useState(log ? new Date(log.endDate) : new Date());

  const { onCreate, onModify, onRemove } = useContext(LogContext);
  
  const { user, setUpdateVariable } = useUserContext();
  const uid = user["id"];
  const [calendarList, setCalendarList] = useState([]);
  
  
  const createId = uuidv4();
  
  //저장함수
  const onSave = async () => {
    if (title === "" || title === null) {
      Alert.alert("실패", "제목을 입력해주세요.");
      return;
    }
    if (body === "" || body === null) {
      Alert.alert("실패", "내용을 입력해주세요.");
      return;
    }
    if (date >= endDate) {
      Alert.alert("실패", "시작 시간이 종료 시간보다 늦을 수 없어요.");
      console.log(date)
      console.log(endDate)
      return;
    }
    await createCalendar({
      calendarUid: createId,
      title: title,
      memo: body,
      s_time: date,
      e_time: endDate,
      userID: uid,
      petName: pet, // 펫 이름을 전달
    })
      .then(() => {
        console.log('Data saved successfully');
        console.log('setUp')
        setUpdateVariable(1);
        // navigation.pop();
      })
      .catch((error) => {
        console.error('Error saving data:', error);
        // Handle error accordingly
      });
// test
    if (log) {
       await onModify({
        id: log.id,
        date: date,
        endDate: endDate,
        title,
        body,
        pet,
      })
    } else {
      await onCreate({
        id: createId,
        title,
        body,
        pet,
        date: date,
        endDate: endDate,
        // date: selectedDate.toISOString(),
      })
    }
    setUpdateVariable(1);
    events.emit("Calrefresh");
    navigation.pop();
  };

  // 캘린더 불러오기 위한 함수
  useEffect(() => {
    if (user) {
      // uid를 통해서 캘린더 정보 가져옴
      getAllCalendarsByUser(uid)
        .then((calendars) => {
          // 모든 캘린더 정보를 calendarList에 저장
          setCalendarList(calendars);
        })
        .catch((error) => console.error("캘린더 정보 불러오기 실패", error));
    }
  }, [user, uid]);

  const calUid = log?.id;

  // calendarList에서 logId에 해당하는 기록을 찾습니다.
  const calendarRecordToDelete = calendarList.find((record) => record.calendarUid === calUid);
  const DeleteCalendarID = calendarRecordToDelete?.calendarID;
  // 해당하는 지워야할 CalendarID
  console.log(DeleteCalendarID);

  // 삭제 함수

  const onDelete = () => {
    deleteCalendarRecordFromFirebase(DeleteCalendarID)
      .then(() => {
        console.log('Calendar document deleted successfully');
        setUpdateVariable(1);
        // 삭제 후 추가 작업 수행
      })
      .catch((error) => {
        console.error('Error deleting calendar document:', error);
        // 삭제 실패 시 에러 처리 방식 결정
      });
    events.emit("Calrefresh");
  };

  // 삭제 여부를 물어보는 함수
  const onAskRemove = () => {
    Alert.alert(
      "삭제",
      "정말로 삭제하시겠어요?",
      [
        { text: "취소", style: "cancel" },
        {
          text: "삭제",
          onPress: () => {
            onDelete(log?.id);
            onRemove(log?.id);
            navigation.pop();
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.block}>
      <KeyboardAvoidingView
        style={styles.avoidingView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView>
        {/* 쓰기 화면의 헤더 부분 */}
        <WriteHeader
          onSave={onSave}
          onAskRemove={onAskRemove}
          isEditing={!!log}
          date={date}
          onChangeDate={setDate}
        />
        {/* 헤더 아래 글쓰는 부분 (에디터) */}
        <WriteEditor 
          title={title} 
          body={body} 
          pet={pet} 
          onChangeTitle={setTitle} 
          onChangeBody={setBody} 
          onChangePet={setPet}
          date={date}
          endDate={endDate}
          onChangeDate={setDate}
          onEndChangeDate={setEndDate}
        />
        </ScrollView>
        {console.log(date)}
        {console.log(endDate)}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  block: {
    flex: 1,
    backgroundColor: "#F6FAFF",
  },

  avoidingView: {
    flex: 1,
    height: "100%",
  },
});

export default WriteScreen;
