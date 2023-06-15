import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { Timestamp } from '@react-native-firebase/firestore';

export const calendarCollection = firestore().collection("calendar");

export function createCalendar({ calendarUid, title, memo, s_time , e_time, userID, petName }) {
  const docRef = calendarCollection.doc();
  const calendarID = docRef.id;

  return docRef.set({
    calendarID,
    calendarUid,
    title,
    memo,
    s_time,
    e_time,
    userID,
    petName,
    createdAt: firestore.FieldValue.serverTimestamp(),
  });
}

export const getAllCalendarsByUser = async () => {
  try {
    const currentUser = auth().currentUser;
    const snapshot = await firestore()
      .collection("calendar")
      .orderBy("createdAt", "desc")
      .where("userID", "==", currentUser.uid)
      .get();

    const calendars = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return calendars;
  } catch (error) {
    console.error("Error fetching calendars:", error);
    throw error;
  }
};

export const getNextClosestCalendarByUser = async () => {
  try {
    const currentUser = auth().currentUser;
    // const currentTime = Timestamp.

    const snapshot = await firestore()
      .collection("calendar")
      .orderBy("s_time", "asc")
      .where("userID", "==", currentUser.uid)
      .where("s_time", ">=", firestore.Timestamp.now()) // 현재 시간 이후의 캘린더만 가져옴
      .limit(1)
      .get();

    const calendar = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))[0]; // Get the first (and only) calendar in the array

    return calendar;
  } catch (error) {
    console.error("Error fetching calendar:", error);
    throw error;
  }
};

export async function getOneNewerCal(id) {
  const currentUser = auth().currentUser;
  const cursorDoc = await calendarCollection.doc(id).get();
  let query = postsCollection.orderBy("createdAt", "desc")
  .collection("calendar")
  .orderBy("s_time", "asc")
  .where("userID", "==", currentUser.uid)
  .where("s_time", ">=", currentTime) // 현재 시간 이후의 캘린더만 가져옴
  

  const snapshot = await query.startAfter(cursorDoc).limit(1).get();
  const cal = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return cal;
}

export const deleteCalendarRecordFromFirebase = async (logId) => {
  try {
    await firestore().collection("calendar").doc(logId).delete();
    console.log("Calendar deleted successfully");
  } catch (error) {
    console.error("Error deleting calendar:", error);
    throw error;
  }
};