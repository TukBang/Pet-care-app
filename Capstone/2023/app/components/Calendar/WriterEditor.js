import React, { useRef, useState, useEffect } from "react";
import { View, StyleSheet, TextInput, TouchableOpacity, Text, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import format from "date-fns/format";
import ko from "date-fns/locale";

// user uid 를 위해 사용
import { useUserContext } from "../../contexts/UserContext";
// 저장된 펫 정보를 불러오기위해 사용
import { getPetInfoByUserID } from "../../lib/petInfo";

function WriteEditor(
  { title, body, pet, onChangeTitle, onChangeBody, onChangePet,
    date, endDate, onChangeDate, onEndChangeDate }) {
  // 펫 정보 불러오기위해 사용
  const { user } = useUserContext();
  const uid = user["id"];

  const bodyRef = useRef();
  const [petList, setPetList] = useState([]);

  const [selectedPet, setSelectedPet] = useState(undefined);

  const [isDatePickerVisible, setDatePickerVisibility] = useState({picker1: false, picker2: false});
  const showDatePicker = (picker) => {
    setDatePickerVisibility({...isDatePickerVisible, [picker]: true });
  };

  const hideDatePicker = (picker) => {
    setDatePickerVisibility({...isDatePickerVisible, [picker]: false });
  };

  const handleConfirm = (date, picker) => {
    console.log("A date has been picked: ", date);
    if (picker === 'picker2') {
      onEndChangeDate(date);
    } else {
      onChangeDate(date);
    }
    hideDatePicker(picker);
  };

  let titlePlaceHolder = "제목";
  let bodyPlaceHolder = "메모";
  let petPlaceHolder = "펫 선택"
  let placeholderTextColor = "#BCBCBC";

  // 펫 불러오기위한 함수
  useEffect(() => {
    if (user) {
      // uid를 통해서 펫 정보 가져옴
      getPetInfoByUserID(uid)
        .then((pets) => {
          // 모든 펫 정보를 petList에 저장
          setPetList(pets);
        })
        .catch((error) => console.error("펫 정보 불러오기 실패", error));
    }
  }, [user, uid]);

  return (
    <View style={styles.block}>
      {/* 제목 */}
      <TextInput
        style={styles.titleTextInput}
        placeholder={titlePlaceHolder}
        placeholderTextColor={placeholderTextColor}
        onChangeText={onChangeTitle}
        value={title}
        returnKeyType="next"
        onSubmitEditing={() => {
          bodyRef.current.focus();
        }}
      />
      <View style={{width: "100%", height: "1%"}}>
        <View style={[styles.border]} />
      </View>
      
      <View style={[styles.timeView, {width: "100%", height: "25%"}]}>
        {/* 시작 시간 */}
        <TouchableOpacity 
          onPress={() => showDatePicker('picker1')}
          style={[styles.button, {left: 30}]}
        >
          <Text style={styles.Text}>{format(new Date(date), "hh시 mm분", { locale: ko })}</Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDatePickerVisible.picker1}
          mode="time"
          date={date}
          onConfirm={(date) => handleConfirm(date, 'picker1')}
          onCancel={() => hideDatePicker('picker1')}
        />

        <Text style={[styles.Text, {top: 15}]}>→</Text>

        {/* 종료 시간 */}
        <TouchableOpacity 
          onPress={() => showDatePicker('picker2')} 
          style={[styles.button, {right: 30}]}
        >
          <Text style={styles.Text}>{format(new Date(endDate), "hh시 mm분", { locale: ko })}</Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDatePickerVisible.picker2}
          mode="time"
          date={endDate}
          onConfirm={(date) => handleConfirm(date, 'picker2')}
          onCancel={() => hideDatePicker('picker2')}
        />
      </View>
      
      <View style={{width: "100%", height: "1%", bottom: 3}}>
        <View style={[styles.border]} />
      </View>

      {/* 펫 선택 */}
      <View style={[{width: "100%", height: "25%"}]}>
        <Picker
          selectedValue={pet}
          onValueChange={(pet) => {
            setSelectedPet(pet);
            onChangePet(pet); // onChangePet 함수를 호출하여 선택된 펫 값을 업데이트
          }}
          style={styles.picker}
          itemStyle={styles.pickerItem}
        >
          <Picker.Item key="0" label={petPlaceHolder} value={undefined} />
          {petList.map((pet) => (
            <Picker.Item 
              key={pet.id} 
              label={pet.petName} 
              value={pet.petName} 
            />
          ))}
        </Picker>
      </View>

      <View style={{width: "100%", height: "1%", bottom: 3}}>
        <View style={[styles.border]} />
      </View>

      {/* 메모 */}
      <TextInput
        style={styles.bodyTextInput}
        placeholder={bodyPlaceHolder}
        placeholderTextColor={placeholderTextColor}
        onChangeText={onChangeBody}
        value={body}
        multiline={true}
        ref={bodyRef}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  block: { flexGrow: 1, padding: 12, marginBottom: 100 },

  border: {
    height: 1,
    backgroundColor: "#C0CDDF",
  },

  titleTextInput: {
    fontSize: 18,
  },

  timeView: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  // 시간 버튼
  button: {
    justifyContent: "center",
    alignItems: "center",

    height: "90%",
    width: "30%",
    borderRadius: 5,
    backgroundColor: "#F6FAFF",
  },

  Text: {
    fontSize: 18,
    color: "#282828",
  },

  bodyTextInput: {
    textAlignVertical: "top",
    height: "25%",
    fontSize: 18,
  },

  picker: {
    backgroundColor: "#F6FAFF",
  },
  
  pickerItem: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#000000",
  },
});

export default WriteEditor;
