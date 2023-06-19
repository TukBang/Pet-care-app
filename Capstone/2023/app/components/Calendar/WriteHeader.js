import React, { useState } from "react";
import { View, StyleSheet, TextInput, TouchableOpacity, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

import TransparentCircleButton from "./TransparentCircleButton";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import format from "date-fns/format";
import ko from "date-fns/locale";

function WriteHeader({ 
  onSave, onAskRemove, isEditing, 
  date, onChangeDate }) {
   
  const navigation = useNavigation();
  const onGoBack = () => {
    navigation.pop();
  };

  const [isDatePickerVisible, setDatePickerVisibility] = useState({picker: false});

  const showDatePicker = (picker) => {
    setDatePickerVisibility({...isDatePickerVisible, [picker]: true });
  };

  const hideDatePicker = (picker) => {
    setDatePickerVisibility({...isDatePickerVisible, [picker]: false });
  };

  const handleConfirm = (date, picker) => {
    console.log("A date has been picked: ", date);
    onChangeDate(date);
    hideDatePicker(picker);
  };

  return (
    <View style={styles.header}>
      {/* 뒤로가기 버튼 */}
      <View style={styles.iconButtonWrapper}>
        <TransparentCircleButton onPress={onGoBack} name="arrow-back" color="#3A8DF8" />
      </View>

      <View style={styles.buttonContainer}>
        {/* 날짜 */}
        <TouchableOpacity onPress={() => showDatePicker('picker')} style={styles.button}>
          <Text style={styles.Text}>
            {format(new Date(date), "yyyy년 MM월 dd일", { locale: ko })}
          </Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDatePickerVisible.picker}
          mode="date"
          date={date}
          onConfirm={(date) => handleConfirm(date, 'picker')}
          onCancel={() => hideDatePicker('picker')}
        />

        {/* 날짜, 시간 분리 여백 */}
        <View style={{ width: 8 }} />

      </View>

      <View style={styles.buttons}>
        {isEditing && (
          <TransparentCircleButton
            name="delete-forever"
            color="#ef5350"
            hasMarginRight
            onPress={onAskRemove}
          />
        )}
        <TransparentCircleButton name="check" color="#3A8DF8" onPress={onSave} />
      </View>
    </View>
    
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    paddingHorizontal: 10,
    height: 50,

    // 밑줄
    borderBottomWidth: 1.3,
    borderBottomColor: "#E2E6EB",
  },

  // 뒤로가기 버튼
  buttons: {
    flexDirection: "row",
    alignItems: "center",
  },

  // 날짜, 시간 버튼 컨테이너
  buttonContainer: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    zIndex: -1,

    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  // 날짜 버튼
  button: {
    // 정렬
    justifyContent: "center",
    alignItems: "center",

    height: "100%",
    width: "40%",
    borderRadius: 5,
    backgroundColor: "#F6FAFF",
  },

  Text: {
    fontSize: 18,
    color: "#282828",
  },
});

export default WriteHeader;
