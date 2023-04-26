import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text,Image, TextInput, Button, Modal, ScrollView, TouchableOpacity } from "react-native";
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

  return (
    <View style={styles.container}>
      <View style={{margin:10,flexDirection:'row',justifyContent:'space-between', alignItems:'center'}}>
        {user.photoURL && (
          <Image
            source={{uri: user.photoURL}}
            style={{width: 60, height: 60}}
            resizeMode="cover"
          />
        )} 
        <Text style={{fontSize:30, marginLeft:10}}>안녕하세요 {user.displayName} 님!</Text>
      </View>
      <Ggupdeagi />
           
      <ScrollView horizontal={true} contentContainerStyle={styles.scrollViewContent} style={styles.scrollView}>
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
