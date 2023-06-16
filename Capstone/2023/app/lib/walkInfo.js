import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

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

export const getNextClosestWalkingByUser = async () => {
  try {
    const currentUser = auth().currentUser;
    const snapshot = await firestore()
      .collection("walkInfo")
      .orderBy("createdAt", "desc")
      .where("userID", "==", currentUser.uid)
      .limit(1)
      .get();

    const calendar = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))[0];

    return calendar;
  } catch (error) {
    console.error("Error fetching WalkInfo:", error);
    throw error;
  }
};