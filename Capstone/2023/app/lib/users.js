import firestore from "@react-native-firebase/firestore";

export const usersCollection = firestore().collection("users");

// 유저 생성

export function createUser({ id, displayName, photoURL }) {
  return usersCollection.doc(id).set({
    id,
    displayName,
    photoURL,
    isExpert : false,
  });
}

export async function getUser(id) {
  const doc = await usersCollection.doc(id).get();
  return doc.data();
}
