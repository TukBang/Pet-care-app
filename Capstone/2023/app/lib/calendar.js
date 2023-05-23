import firestore from "@react-native-firebase/firestore";

export const calendarCollection = firestore().collection("calendar");

export function createCalendar({ calendarID, title, memo, s_time , e_time, userID, petName }) {
  const docRef = calendarCollection.doc();
  //const calendarID = docRef.id;

  return docRef.set({
    calendarID,
    title,
    memo,
    s_time,
    e_time,
    userID,
    petName,
    createdAt: firestore.FieldValue.serverTimestamp(),
  });
}
