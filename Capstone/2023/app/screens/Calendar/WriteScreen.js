import React, { useState, useContext } from "react";

import { StyleSheet, View, KeyboardAvoidingView, Platform, Alert } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import LogContext from "../../contexts/LogContext";
import WriteHeader from "../../components/Calendar/WriteHeader";
import WriteEditor from "../../components/Calendar/WriterEditor";

// 일정 작성 화면

function WriteScreen({ route }) {
  const log = route.params?.log;
  const selectedDate = route.params.selectedDate;
  // console.log(selectedDate);

  const [title, setTitle] = useState(log?.title ?? "");
  const [body, setBody] = useState(log?.body ?? "");
  const navigation = useNavigation();
  const [date, setDate] = useState(log ? new Date(log.date) : new Date());

  const { onCreate, onModify, onRemove } = useContext(LogContext);

  //저장함수
  const onSave = () => {
    if (log) {
      onModify({
        id: log.id,
        date: date.toISOString(),
        title,
        body,
      });
    } else {
      onCreate({
        title,
        body,
        date: date.toISOString(),
        // date: selectedDate.toISOString(),
      });
    }
    navigation.pop();
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
        <WriteEditor title={title} body={body} onChangeTitle={setTitle} onChangeBody={setBody} />
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
