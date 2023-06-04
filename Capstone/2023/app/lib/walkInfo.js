import firestore from "@react-native-firebase/firestore";

export const walkInfoCollection = firestore().collection("walkInfo");

export function createWalkInfo({ time, distance, kcal , userID, walkingImage }) {
  const docRef = walkInfoCollection.doc();
  const walkID = docRef.id;

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

