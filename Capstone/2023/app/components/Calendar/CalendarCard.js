import React, { useMemo } from "react";
import { View, StyleSheet, Text, Image, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { format, formatDistanceToNow } from "date-fns";
import ko from "date-fns/locale/ko";

function CalendarCard({ calendarID, calendarUid, title, memo, s_time, e_time, userID, petName, createdAt }) {
  const date = useMemo(
    () => (createdAt ? new Date(createdAt._seconds * 1000) : new Date()),
    [createdAt]
  );

  const navigation = useNavigation();

  const onPressCalendar = () => {
    navigation.navigate("CalendarScreen")
  }


  return (
    <>
        <TouchableOpacity onPress={() => onPressCalendar()} style={[Boxstyles.boxView1, {marginLeft : 7.5}]} activeOpacity={0.8}>
            <Text style={Boxstyles.boxTitle}>최근 일정</Text>
              {!todoRecent ? (
              <Text style={Boxstyles.boxSentence}>일정을 등록해보세요.</Text>
              ) : (
              <>
                <Text style={Boxstyles.boxSentence}>{afterDay ? afterDay + '일 뒤에' : '오늘' } 일정이 있어요!</Text>
                <Text style={Boxstyles.boxSentence}>"{todoText}"</Text>
              </>
              )}
        </TouchableOpacity>
    </>
  );
}
const Boxstyles = StyleSheet.create({
    boxContainer: {
      top: -5,
      flexDirection: "row",
      alignItems: 'center',
      justifyContent: 'center', // 추가
      // height: '30%',
      padding: 5,
    },
  
    boxView1: {
      width: '50%',
      height: 180,
      borderRadius: 15,
      backgroundColor: "#F0C660",
      padding: 12,
      marginRight: 5,
      marginLeft: 5,
      elevation:7,
    },
  
    boxView2: {
      width: '50%',
      height: 180,
      borderRadius: 15,
      backgroundColor: "#65B065",
      padding: 12,
      marginRight: 5,
      marginLeft: 5,
      elevation:7,
    },
  
    boxView3: {
      width: '50%',
      height: 180,
      borderRadius: 15,
      backgroundColor: "#409AFF",
      padding: 12,
      marginRight: 5,
      marginLeft: 5,
      elevation:7,
    },
  
    boxView4: {
      width: '50%',
      height: 180,
      borderRadius: 15,
      backgroundColor: "#E07070",
      padding: 12,
      marginRight: 5,
      marginLeft: 5,
      elevation:7,
    },
  
    boxTitle: {
      color: "white",
      fontSize: 20,
      fontWeight: "bold",
    },
  
    boxSentence: {
      color: "white",
      fontSize: 15, 
    },
  
    image: {
      position: 'absolute',
      resizeMode: 'contain',
      width: '80%',
      height: '80%',
      top: 60,
      left: 12,
    }
  })

export default React.memo(CalendarCard);
