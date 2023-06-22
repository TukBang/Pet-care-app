import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";

import PreDiagList from "../../components/Diagnosis/PreDiagList";
import DiagModal from "../../components/Diagnosis/DiagModal";
import DiagResult from "./DiagResult";
import DiagIngScreen from "./DiagIngScreen";

// user information (account id)
import { useUserContext } from "../../contexts/UserContext";

// get the pet infomation
import { getPetInfoByUserID } from "../../lib/petInfo";

function DiagnosisScreen() {
  // get the user information
  const { user } = useUserContext();
  const uid = user["id"];

  // get the pet information
  const [petList, setPetList] = useState([]);
  const [selectedPet, setSelectedPet] = useState(undefined);

  // variable for the screen transition
  const [selectedImage, setSelectedImage] = useState(null);
  const [diagmodalVisible, setDiagModalVisible] = useState(false);
  const [diagState, setDiagState] = useState(false);
  const [diagEnd, setDiagEnd] = useState(false);
  const [diagtempView, setDiagtempView] = useState(false);
  const [aiResult, setAiResult] = useState( {
    labels: [
      "구진, 플라크",
      "태선화, 과다색소침착",
      "농포, 여드름",
      "미란, 궤양",
      "결절, 종괴",
    ],
    predictions: [0, 0, 0, 0, 0],
  });
  const [ diagnosisResultText2, setDiagnosisResultText2] = useState('')
  
  // 펫 정보 불러오기
  useEffect(() => {
    if (user) {
      // uid를 통해서 펫 정보 가져옴
      getPetInfoByUserID(uid)
        .then((pets) => {
          // createdAt 값이 null인 경우를 대비하여 예외처리 추가 (에러방지)
          // 펫 정보 오름차순 정렬
          const sortedPets = pets.sort((a, b) => {
            const dateA = a.createdAt ? a.createdAt.toDate() : 0;
            const dateB = b.createdAt ? b.createdAt.toDate() : 0;
            return dateA - dateB;
          });

          setPetList(sortedPets);
        })
        .catch((error) => console.error("펫 정보 불러오기 실패", error));
    }
  }, [petList]);


  // 61.106.219.238:5000
  // 121.170.118.190:5000
  // SelectedImage AI SERVER 전송

  return (
    <View style={{ flex: 1,}}>
      {/* 이미지 선택 여부에 따라 화면 전환 */}
      {!selectedImage ? (
        <PreDiagList 
          setSelectedImage={setSelectedImage} 
          style={diagnosisSelectStyles.checklist} 
          setSelectedPet = {setSelectedPet}
          petList = {petList}
        />
      ) : (
        <>
          {
            // 진단 화면을 표기하기 위한 임시변수
            !diagtempView ? (
              <DiagIngScreen 
                petList={selectedPet}
                uid={uid}
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
                setDiagState={setDiagState}
                setDiagEnd={setDiagEnd}
                setDiagtempView={setDiagtempView}
                setDiagModalVisible={setDiagModalVisible}
                aiResult={aiResult}
                setAiResult={setAiResult}
              />
            ) : (
              <>
                {/* 진단 중 Modal */}
                <DiagModal
                  diagState={diagState}
                  selectedImage={selectedImage}
                  visible={diagmodalVisible}
                  onClose={() => {
                    setDiagModalVisible(false);
                  }}
                />
                {/* 진단 결과 화면 */}
                <DiagResult
                  uid={uid}
                  diagEnd={diagEnd}
                  setDiagEnd={setDiagEnd}
                  selectedImage={selectedImage}
                  setSelectedImage={setSelectedImage}
                  setDiagnosisResultText2={setDiagnosisResultText2}
                  diagnosisResultText2={diagnosisResultText2}
                  setDiagtempView={setDiagtempView}
                  aiResult={aiResult}
                  />
              </>
            )
          }
        </>
      )}
    </View>
  );
}

// 진단 선택 스타일
const diagnosisSelectStyles = StyleSheet.create({
  text1: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    
    fontSize: 20,
  },

  text2: {
    marginBottom: 40,
    marginLeft: 10,

    fontSize: 15,
    fontWeight: "bold",
  },

  imageView: {
    alignItems: "center",

    height: 300,
    width: "100%",

    // 여백
    marginBottom: 30,
  },

  image: {
    width: 300,
    height: 300,
  },

  button_container: {
    // 정렬
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    overflow: "hidden",

    // 여백
    marginTop: 20,
    marginLeft: 30,
    marginRight: 30,
  },

  button: {
    // 정렬
    justifyContent: "center",
    alignItems: "center",

    height: 40,
    width: 330,

    // 여백
    marginTop: 10,

    // 모양
    borderRadius: 5,

    // 배경색
    backgroundColor: "#3A8DF8",
  },

  // 버튼 텍스트
  buttonText: {
    fontSize: 15,
    color: "#FFFFFF",
  },
});

export default DiagnosisScreen;
