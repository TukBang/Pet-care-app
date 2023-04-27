import React, {
  useState,
  useRef,
  useEffect
} from "react";

import {
  StyleSheet,
  View,
  Modal,
  ScrollView,
  Text,
  TextInput,
  Image,
  Button,
  TouchableOpacity,
  Pressable,
  Animated
} from "react-native";

import {  } from "react-native";

import { useUserContext } from "../../contexts/UserContext";
import { Calendar } from "react-native-calendars";
import Ggupdeagi from "../Ggupdeagi";

import Icon from 'react-native-vector-icons/MaterialIcons'

// 난수 생성
import {v4 as uuidv4} from 'uuid';
const uuid = uuidv4();

function HomeScreen() {
  const [petname, setPetname] = useState("");
  const [gender, setGender] = useState("");
  const [weight, setWeight] = useState("");
  const [birth, setBirth] = useState("");
  const [kind, setKind] = useState("");

  // 삭제를 위한 코드 (지울 예정)
  const [unique_id , setUnique_id ] = useState("");
  
  const [saving, setSaving] = useState(false);
  const [petInfo, setPetInfo] = useState([]);
  const { user } = useUserContext();
  const uid = user["id"];
  const [showModal, setShowModal] = useState(false);
  
  const animation = useRef(new Animated.Value(0)).current;

  // Animation for Pressable Button
  useEffect(()=> {
    Animated.spring(animation, {
      toValue: 0,
      useNativeDriver: true,
      tension: 45,
      friction: 5,
    }).start();
  }, [animation]);
  
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
        //console.log(uid)
        const response = await fetch(`http://121.170.118.190:4000/pet?uid=${uid}`);
        const data = await response.json();

        setPetInfo(data);

        //console.log(data);
        
      } catch (error) {
        console.error(error);
      }
    };

    fetchPetInfo();
  }, [uid]);

  // 펫 정보 서버에 저장
  //http://121.170.118.190:4000/   //진식 주소
  const savePet = async () => {
    setSaving(true);
    
    try {

      console.log(JSON.stringify({
        petname,
        id: uid,
        gender,
        weight,
        birth,
        kind,
        unique_id: uuid,
      }));
      // const response = await fetch("http://121.170.118.190:4000/pet", {
      const response = await fetch("http://121.170.118.190:4000/pet", {
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
          unique_id: uuid,
        }),
      });

      const data = await response.json();
      console.log(data);
      getPetInfo();      
      setShowModal(false);
    } catch (error) {
      console.error(error);

    } finally {
      // check if component is still mounted before updating state
      if (!saving) return;
      setSaving(false);
    }
    
  };

  const getPetInfo = async () => {
    try {
      //console.log(uid)
      const response = await fetch(`http://121.170.118.190:4000/pet?uid=${uid}`);
      const data = await response.json();

      setPetInfo(data);

      //console.log(data);
      
    } catch (error) {
      console.error(error);
    }
  }

  //펫 정보 삭제
  const handleDeletePet = async (unique_id) => {
    try {
      await fetch(`http://121.170.118.190:4000/pet`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          unique_id: unique_id,
        }),
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
        {
          petInfo && (function() {
            const petElements = [];
            for (let i = 0; i < petInfo.length; i++) {
              const pet = petInfo[i];
              petElements.push(
                <View key={pet.unique_id} style={styles.petInfoContainer}>
                  <Text style={styles.subtitle}></Text>
                  <Text style={styles.petInfoText}>Name: {pet.petname}</Text>
                  <Text style={styles.petInfoText}>Gender: {pet.gender}</Text>
                  <Text style={styles.petInfoText}>Weight: {pet.weight}</Text>
                  <Text style={styles.petInfoText}>Birth date: {pet.birth}</Text>
                  <Text style={styles.petInfoText}>Kind: {pet.kind}</Text>
                  <Text style={styles.petInfoText}>unique_id: {pet.unique_id}</Text>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity 
                      onPress={() => {
                        handleDeletePet(pet.unique_id);
                        console.log(pet.unique_id)
                      }} 
                      style={styles.deleteButton}>
                      <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }
            return petElements;
          })()
        }
      </ScrollView>
      <Modal
        visible={showModal}
        transparent={true}
        animationType="fade"
      >
        <Pressable style={styles.background}>
          <View style={styles.whiteBox}>
            <Text style={styles.modalTitle}>반려동물을 등록해주세요</Text>
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
              placeholder="Unique_id"
              onChangeText={() => {}}
              value={uuid}
              editable={false}
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
                onPress={() => {
                  setShowModal(false);
                  setPetname('');
                  setGender('');
                  setWeight('');
                  setBirth('');
                  setKind('');
                }}
                color="gray"
              />
            </View>
            <View style={styles.modalButtons}>
              <Button 
                title="Save"
                onPress={() => {
                  savePet();
                }}
              />
            </View>
          </View>
        </Pressable>
      </Modal>
                
      <Animated.View 
        style={[styles.wrapper, {
          transform: [{
            translateY: animation.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 88],
            }),
          }],
          
          opacity: animation.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0],
          }),
        }]}
      >
        <Pressable
          style={({pressed}) => [
            styles.addButton,
            Platform.OS === 'ios' && {
              opacity: pressed ? 0.6 : 1,
            },
          ]}
          android_ripple={{color:'white'}}
          onPress={() => {
            console.log("this button");
            setShowModal(true);
            setPetname('');
            setGender('');
            setWeight('');
            setBirth('');
            setKind('');
          }}>
          <Icon name='add' size={24} style={{color: 'white'}} />
        </Pressable>        
      </Animated.View>
      

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

  wrapper : {
    position: 'absolute',
    bottom: 15,
    right: 15,
    width: 58,
    height: 58,
    borderRadius: 28,

    shadowColor: '#4D4D4D',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,

    overflow: Platform.select({android: 'hidden'})
  },

  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFA000',
    justifyContent: 'center',
    alignItems: 'center',
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)'
  },
  whiteBox: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'left',
  },
  modalInput: {
    width: '100%',
    borderWidth: 2,
    borderRadius: 5,
    borderColor: '#CDCDCD',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
    fontSize: 18,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    alignItems: 'center',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginLeft: 10,
    backgroundColor: '#2E8B57',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalButtons: {
    width: '100%',    
    paddingVertical: 2,
  },
});
  //--------------------------------------------------------------------


export default HomeScreen;
