import React, { useRef } from "react";
import { View, StyleSheet, TextInput,  } from "react-native";
import { Picker } from "@react-native-picker/picker";

// user uid 를 위해 사용
import { useUserContext } from "../../contexts/UserContext";
// 저장된 펫 정보를 불러오기위해 사용
import { getPetInfoByUserID } from "../../lib/petInfo";

// 펫 이름 불러오기
import { useState, useEffect } from "react";

function WriteEditor({ title, body, pet, onChangeTitle, onChangeBody, onChangePet }) {
  // 펫 정보 불러오기위해 사용
  const { user } = useUserContext();
  const uid = user["id"];

  const bodyRef = useRef();
  const [petList, setPetList] = useState([]);

  const [selectedPet, setSelectedPet] = useState(undefined);

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

      {/* 펫 선택 */}
      <Picker
        selectedValue={pet}
        onValueChange={(pet) => {
          setSelectedPet(pet);
          onChangePet(pet); // onChangePet 함수를 호출하여 선택된 펫 값을 업데이트
        }}
        style={styles.picker}
      >
        <Picker.Item key="0" label={petPlaceHolder} value={undefined} />
        {petList.map((pet) => (
          <Picker.Item 
            key={pet.id} 
            label={pet.petName} 
            value={pet.petName} 
            style={styles.pickerItem}
          />
        ))}
      </Picker>

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
  block: { flex: 1, padding: 12 },

  titleTextInput: {
    borderWidth: 2,
    borderRadius: 5,
    borderColor: "#CDCDCD",
    paddingVertical: 5,
    paddingHorizontal: 12,

    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 15,
  },

  bodyTextInput: {
    textAlignVertical: "top",
    borderWidth: 2,
    borderRadius: 5,
    borderColor: "#CDCDCD",
    paddingVertical: 10,
    paddingHorizontal: 12,
    height: 400,

    fontWeight: "bold",
    fontSize: 18,
  },

  picker: {
    borderWidth: 2,
    borderRadius: 5,
    borderColor: "#CDCDCD",
    paddingVertical: 5,
    paddingHorizontal: 12,
    marginBottom: 15,
    backgroundColor: "#FFFFFF",
  },
  
  pickerItem: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
  },
});

export default WriteEditor;
