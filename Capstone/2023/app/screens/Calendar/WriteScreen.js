import React, { useState, useContext, useEffect } from "react";
import { StyleSheet, View, KeyboardAvoidingView, Platform, Alert } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

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
  const selectedDate = route.params.selectedDate;
  // console.log(selectedDate);

  const [title, setTitle] = useState(log?.title ?? "");
  const [body, setBody] = useState(log?.body ?? "");
  const [pet, setPet] = useState(log?.pet ?? "");
  const navigation = useNavigation();
  const [date, setDate] = useState(log ? new Date(log.date) : new Date());

  const { onCreate, onModify, onRemove } = useContext(LogContext);
  
  const { user } = useUserContext();
  const uid = user["id"];
  const calendarUid = uuidv4();
  const [calendarList, setCalendarList] = useState([]);

  
  //저장함수
  const onSave = () => {
    createCalendar({
      calendarUid: calendarUid,
      title: title,
      memo: body,
      s_time: date.toISOString(),
      e_time: date.toISOString(),
      userID: uid,
      petName: pet, // 펫 이름을 전달
    })
      .then(() => {
        console.log('Data saved successfully');
        // navigation.pop();
      })
      .catch((error) => {
        console.error('Error saving data:', error);
        // Handle error accordingly
      });

    if (log) {
      onModify({
        id: calendarUid,
        date: date.toISOString(),
        title,
        body,
        pet,
      });
    } else {
      onCreate({
        id: calendarUid,
        title,
        body,
        pet,
        date: date.toISOString(),
        // date: selectedDate.toISOString(),
      });
    }
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

  console.log(calendarList);

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
        // 삭제 후 추가 작업 수행
      })
      .catch((error) => {
        console.error('Error deleting calendar document:', error);
        // 삭제 실패 시 에러 처리 방식 결정
      });
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
        {/* 쓰기 화면의 헤더 부분 */}
        <WriteHeader
          onSave={onSave}
          onAskRemove={onAskRemove}
          isEditing={!!log}
          date={date}
          onChangeDate={setDate}
        />
        {/* 헤더 아래 글쓰는 부분 (에디터) */}
        <WriteEditor title={title} body={body} onChangeTitle={setTitle} onChangeBody={setBody} onChangePet={setPet} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  block: {
    flex: 1,
    backgroundColor: "white",
  },

  avoidingView: {
    flex: 1,
  },
});

export default WriteScreen;
