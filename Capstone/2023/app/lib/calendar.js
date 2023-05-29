import firestore from "@react-native-firebase/firestore";

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

export const getAllCalendarsByUser = async (userID) => {
  try {
    const snapshot = await firestore()
      .collection("calendar")
      .where("userID", "==", userID)
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

export const deleteCalendarRecordFromFirebase = async (logId) => {
  try {
    await firestore().collection("calendar").doc(logId).delete();
    console.log("Calendar deleted successfully");
  } catch (error) {
    console.error("Error deleting calendar:", error);
    throw error;
  }
};