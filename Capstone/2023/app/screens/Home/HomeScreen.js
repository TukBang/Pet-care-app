import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TextInput, Button, Modal, ScrollView, TouchableOpacity } from "react-native";
import { useUserContext } from "../../contexts/UserContext";
import { Calendar } from "react-native-calendars";
import Ggupdeagi from "../Ggupdeagi";
import { Pressable } from "react-native";

function HomeScreen() {
  
  const [petname, setPetname] = useState("");
  const [gender, setGender] = useState("");
  const [weight, setWeight] = useState("");
  const [birth, setBirth] = useState("");
  const [kind, setKind] = useState("");

  //삭제를 위한 코드 (지울 예정)
  const [unique_id , setUnique_id ] = useState("");
  
  const [saving, setSaving] = useState(false);
  const [petInfo, setPetInfo] = useState(null);
  const { user } = useUserContext();
  const uid = user["id"];
  const [showModal, setShowModal] = useState(false);
  
  useEffect(() => {
    return () => {
      // cleanup function
      setSaving(false); // cancel saving if component unmounts
    };
  }, []);

  useEffect(() => {
    // GET request to retrieve pet information for the user
    const fetchPetInfo = async () => {
      try {
        console.log(uid)
        const response = await fetch(`http://127.0.0.1:4000/pet?uid=${uid}`);
        const data = await response.json();
        setPetInfo(data); // Assuming there is only one pet per user
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPetInfo();
  }, [uid]);
  // 펫 정보 서버에 저장
  const savePet = async () => {
    setSaving(true);
    try {
      const response = await fetch("http://127.0.0.1:4000/pet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          petname,
          id: uid,
          gender,
          weight,
          birth,
          kind,
          unique_id,
        }),
      });
      const data = await response.json();
      console.log(data);
      setPetInfo(data);
    } catch (error) {
      console.error(error);
    } finally {
      // check if component is still mounted before updating state
      if (!saving) return;
      setSaving(false);
    }
  };
  //펫 정보 삭제
  const handleDeletePet = async (unique_id) => {
    try {
      await fetch(`http://127.0.0.1:4000/pet/${unique_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      // create a new petInfo array that excludes the deleted pet
      const updatedPetInfo = petInfo.filter((pet) => pet.unique_id !== unique_id);
      setPetInfo(updatedPetInfo);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Ggupdeagi />
      {user.photoURL && (
        <Image
          source={{uri: user.photoURL}}
          style={{width: 128, height: 128, marginBottom: 16}}
          resizeMode="cover"
        />
      )}      
      {/* <ScrollView horizontal={true} contentContainerStyle={styles.scrollViewContent} style={styles.scrollView}>
        {petInfo && petInfo.map((pet, index) => (
          <View key={index} style={styles.petInfoContainer}>
          <Text style={styles.subtitle}></Text>
          <Text style={styles.petInfoText}>Name: {pet.petname}</Text>
          <Text style={styles.petInfoText}>Gender: {pet.gender}</Text>
          <Text style={styles.petInfoText}>Weight: {pet.weight}</Text>
          <Text style={styles.petInfoText}>Birth date: {pet.birth}</Text>
          <Text style={styles.petInfoText}>Kind: {pet.kind}</Text>
        </View>
      ))}
    </ScrollView> */}


    <ScrollView horizontal={true} contentContainerStyle={styles.scrollViewContent} style={styles.scrollView}>
      {petInfo && petInfo.map((pet) => (
        <View key={pet.unique_id} style={styles.petInfoContainer}>
          <Text style={styles.subtitle}></Text>
          <Text style={styles.petInfoText}>Name: {pet.petname}</Text>
          <Text style={styles.petInfoText}>Gender: {pet.gender}</Text>
          <Text style={styles.petInfoText}>Weight: {pet.weight}</Text>
          <Text style={styles.petInfoText}>Birth date: {pet.birth}</Text>
          <Text style={styles.petInfoText}>Kind: {pet.kind}</Text>
          <Text style={styles.petInfoText}>unique_id: {pet.unique_id}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => handleDeletePet(pet.unique_id)} style={styles.deleteButton}>
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
    <Modal
      visible={showModal}
      transparent={true}
      animationType="fade"
    >
      <Pressable style={styles.background}>
        <View style={styles.whiteBox}>
          
            <Text style={styles.modalTitle}>새로운 반려동물을 등록해주세요</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="이름"
              onChangeText={(text) => setPetname(text)}
              value={petname}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="성별"
              onChangeText={(text) => setGender(text)}
              value={gender}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="무게"
              onChangeText={(text) => setWeight(text)}
              value={weight}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="생년월일 ( 예) 000000 )"
              onChangeText={(text) => setBirth(text)}
              value={birth}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="품종"
              onChangeText={(text) => setKind(text)}
              value={kind}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="User ID"
              onChangeText={() => {}}
              value={uid}
              editable={false}
            />
            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                onPress={() => setShowModal(false)}
                color="gray"
              />
              <Button title="Save" onPress={savePet} />
            </View>
          </View>

      </Pressable>
    </Modal>
      <TouchableOpacity style={styles.addButton} onPress={() => setShowModal(true)}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  scrollViewContent: {
    flexDirection: "row",
  },
  input: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: "80%",
  },
  subtitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  errorText: {
    color: "red",
    marginTop: 5,
  },
  saving: {
    marginTop: 10,
  },
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#2196F3",
    position: "absolute",
    bottom: 20,
    right: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 24,
  },
  // 스크롤 뷰 스타일
  scrollView: {
    backgroundColor: '#FFFFFF',
  },
  scrollViewContent: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  petInfoContainer: {
    width: 200,
    height: 200,
    borderRadius: 10,
    backgroundColor: '#E5E5E5',
    marginRight: 20,
    padding: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  petInfoText: {
    fontSize: 14,
    marginBottom: 5,
  },
  buttonContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    flexDirection: 'row-reverse',
    margin: 8,
  },
  deleteButton: {
    backgroundColor: 'red',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginLeft: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  //--------------------------------------------------------------------
  // 모달 창 스타일

  background: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  whiteBox: {
    flexDirection: "column",
    alignItems: 'center',
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 4,
    elevation: 2
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 20,
    width: "80%",
  },
  modalTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: "100%",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
  },
  modalButton: {
    marginLeft: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  modalButtons: {
    width: "100%"    
  }
  //--------------------------------------------------------------------
});

export default HomeScreen;
