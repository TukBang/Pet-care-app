import firestore from "@react-native-firebase/firestore";

export const petInfoCollection = firestore().collection("petInfo");

// 펫 정보 생성

export function createPetInfo({ petName, petAge, petWeight, petGender, petKind, userID }) {
    const docRef = petInfoCollection.doc();
    const petID = docRef.id;
    return docRef.set({
      petID,
      petName,
      petAge,
      petWeight,
      petGender,
      petKind,
      userID,
    });
  }

export const getPetInfoByUserID = async (userID) => {
const snapshot = await firestore()
    .collection("petInfo")
    .where("userID", "==", userID)
    .get();

return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export async function getPetInfo(petID) {
  const doc = await petInfoCollection.doc(petID).get();
  return doc.data();
}

export async function deletePetInfo(petID) {
    const docRef = petInfoCollection.doc(petID);
    const doc = await docRef.get();
    if (!doc.exists) {
      throw new Error(`반려동물의 ${petID} 가 존재하지 않습니다.`);
    }
    await docRef.delete();
    return doc.id;
}