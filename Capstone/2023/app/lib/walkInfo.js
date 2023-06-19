import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

export const walkInfoCollection = firestore().collection("walkInfo");

export function createWalkInfo({ time, distance, kcal , petID, userID, walkingImage }) {
  const docRef = walkInfoCollection.doc();
  const walkID = docRef.id;

  return docRef.set({
    walkID,
    time,
    distance,
    kcal,
    userID,
    petID,
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

export const PAGE_SIZE = 15;

export async function getWalk() {
  const currentUser = auth().currentUser;
  const snapshot = await walkInfoCollection
    .where("userID", "==", currentUser.uid)
    .orderBy("createdAt", "desc")
    .limit(PAGE_SIZE)
    .get();
  const Walk = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return Walk;
}

export async function getOlderWalk(id) {
  const currentUser = auth().currentUser;
  const cursorDoc = await walkInfoCollection.doc(id).get();
  const snapshot = await walkInfoCollection
  .where("userID", "==", currentUser.uid)
    .orderBy("createdAt", "desc")
    .startAfter(cursorDoc)
    .limit(PAGE_SIZE)
    .get();

  const Walk = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return Walk;
}

export async function getNewerWalk(id) {
  const currentUser = auth().currentUser;
  const cursorDoc = await walkInfoCollection.doc(id).get();
  const snapshot = await walkInfoCollection
  .where("userID", "==", currentUser.uid)
    .orderBy("createdAt", "desc")
    .endBefore(cursorDoc)
    .limit(PAGE_SIZE)
    .get();

  const Walk = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return Walk;
}