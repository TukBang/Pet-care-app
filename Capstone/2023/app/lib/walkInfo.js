import firestore from "@react-native-firebase/firestore";

export const walkInfoCollection = firestore().collection("walkInfo");

// require("../assets/user.png");
// require("../assets/dog.png");
// 펫 정보 생성

export function createWalkInfo({ time, distance, kcal , userID, walkingImage }) {
  const docRef = walkInfoCollection.doc();
  const walkID = docRef.id;

  // // 기본 펫 이미지 설정
  // const petImage = imageUrl || require("../assets/dog.png"); // 기본 이미지 경로 할당

  return docRef.set({
    walkID,
    time,
    distance,
    kcal,
    userID,
    createdAt: firestore.FieldValue.serverTimestamp(),
    walkingImage,
  });
}

// export const getPetInfoByUserID = async (userID) => {
//   const snapshot = await firestore().collection("petInfo").where("userID", "==", userID).get();

//   return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// };

// export async function getPetInfo(petID) {
//   const doc = await petInfoCollection.doc(petID).get();
//   return doc.data();
// }

// export async function deletePetInfo(petID) {
//   const docRef = petInfoCollection.doc(petID);
//   const doc = await docRef.get();
//   if (!doc.exists) {
//     throw new Error(`반려동물의 ${petID} 가 존재하지 않습니다.`);
//   }
//   await docRef.delete();
//   return doc.id;
// }
