import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";


export const diagnosisResultCollection = firestore().collection("diagnosis");

export function createDiagnosisResult({ userID, petName, petSpecies, petGender, petWeight, petAge, petImage, image, petID,  prediction }) {
    const docRef = diagnosisResultCollection.doc();
    const diagID = docRef.id;
  
    return docRef.set({
      diagID,
      userID,
      petName,
      petSpecies,
      petGender,
      petWeight,
      petAge,
      petID,
      prediction,
      petImage,
      image,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
  }

export const PAGE_SIZE = 15;

export async function getDiags() {
    const currentUser = auth().currentUser;
  const snapshot = await diagnosisResultCollection
    .where("userID", "==", currentUser.uid)
    .orderBy("createdAt", "desc")
    .limit(PAGE_SIZE)
    .get();
  const diags = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return diags;
}

export async function getOlderDiags(id) {
    const currentUser = auth().currentUser;
  const cursorDoc = await diagnosisResultCollection.doc(id).get();
  const snapshot = await diagnosisResultCollection
  .where("userID", "==", currentUser.uid)
    .orderBy("createdAt", "desc")
    .startAfter(cursorDoc)
    .limit(PAGE_SIZE)
    .get();

  const diags = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return diags;
}
export async function getNewerDiags(id) {
    const currentUser = auth().currentUser;
  const cursorDoc = await diagnosisResultCollection.doc(id).get();
  const snapshot = await diagnosisResultCollection
  .where("userID", "==", currentUser.uid)
    .orderBy("createdAt", "desc")
    .endBefore(cursorDoc)
    .limit(PAGE_SIZE)
    .get();

  const diags = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return diags;
}