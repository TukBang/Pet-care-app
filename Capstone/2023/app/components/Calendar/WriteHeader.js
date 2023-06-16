import React, { useState } from "react";
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import TransparentCircleButton from "./TransparentCircleButton";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import format from "date-fns/format";
import ko from "date-fns/locale";

function WriteHeader({ 
  onSave, onAskRemove, isEditing, 
  date, endDate, 
  onChangeDate, onEndChangeDate }) {
    
  const navigation = useNavigation();
  const onGoBack = () => {
    navigation.pop();
  };

  const [isDatePickerVisible, setDatePickerVisibility] = useState({picker1: false, picker2: false, picker3: false});

  const showDatePicker = (picker) => {
    setDatePickerVisibility({...isDatePickerVisible, [picker]: true });
  };

  const hideDatePicker = (picker) => {
    setDatePickerVisibility({...isDatePickerVisible, [picker]: false });
  };

  const handleConfirm = (date, picker) => {
    console.log("A date has been picked: ", date);
    if (picker === 'picker3') {
      onEndChangeDate(date);
    } else {
      onChangeDate(date);
    }
    hideDatePicker(picker);
  };

  return (
    <View style={styles.header}>
      {/* 뒤로가기 버튼 */}
      <View style={styles.iconButtonWrapper}>
        <TransparentCircleButton onPress={onGoBack} name="arrow-back" color="#FFA000" />
      </View>

      <View style={styles.buttonContainer}>
        {/* 날짜 */}
        <TouchableOpacity onPress={() => showDatePicker('picker1')} style={styles.button1}>
          <Text style={styles.Text}>
            {format(new Date(date), "yyyy년 MM월 dd일", { locale: ko })}
          </Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDatePickerVisible.picker1}
          mode="date"
          date={date}
          onConfirm={(date) => handleConfirm(date, 'picker1')}
          onCancel={() => hideDatePicker('picker1')}
        />

        {/* 날짜, 시간 분리 여백 */}
        <View style={{ width: 8 }} />

        {/* 시작 시간 */}
        <TouchableOpacity onPress={() => showDatePicker('picker2')} style={styles.button2}>
          <Text style={styles.Text}>{format(new Date(date), "hh시 mm분", { locale: ko })}</Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDatePickerVisible.picker2}
          mode="time"
          date={date}
          onConfirm={(date) => handleConfirm(date, 'picker2')}
          onCancel={() => hideDatePicker('picker2')}
        />
        {/* 종료 시간 */}
        <TouchableOpacity onPress={() => showDatePicker('picker3')} style={styles.button2}>
          <Text style={styles.Text}>{format(new Date(endDate), "hh시 mm분", { locale: ko })}</Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDatePickerVisible.picker3}
          mode="time"
          date={endDate}
          onConfirm={(date) => handleConfirm(date, 'picker3')}
          onCancel={() => hideDatePicker('picker3')}
        />
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
        <TransparentCircleButton name="check" color="#FFA000" onPress={onSave} />
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
    borderBottomWidth: 2,
    borderBottomColor: "#E0E0E0",
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
  button1: {
    // 정렬
    justifyContent: "center",
    alignItems: "center",

    height: 20,
    width: 120,
    borderRadius: 5,
    backgroundColor: "#FFA000",
  },

  // 시간 버튼
  button2: {
    justifyContent: "center",
    alignItems: "center",

    height: 20,
    width: 72,
    borderRadius: 5,
    backgroundColor: "#FFA000",
  },

  Text: {
    color: "#FFFFFF",
  },
});

export default WriteHeader;
