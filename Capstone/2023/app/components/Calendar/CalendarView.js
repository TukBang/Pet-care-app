import React from "react";
import { Calendar, LocaleConfig } from "react-native-calendars";
import {
  View,
  StyleSheet
} from "react-native";

LocaleConfig.locales['ko'] = {
  monthNames: [
    '1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'
  ],
  monthNamesShort: [
    '1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'
  ],

  dayNames: ['일', '월', '화', '수', '목', '금', '토'],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  
  today: "오늘"
};

LocaleConfig.defaultLocale = 'ko';

function CalendarView({markedDates, selectedDate, onSelectDate}) {
  const markedSelectedDate = {
    ...markedDates,
    [selectedDate]: {
      selected: true,
      marked: markedDates[selectedDate]?.marked,
      selectedColor: '#FFA000',
      dotColor: '#189AF2',
    },
  };

  return (
    <>
      <View
        style={styles.calendarView}
      >
        <Calendar
          style={StyleSheet.calendar}
          markedDates={markedSelectedDate}
          monthFormat={'MMM'}
          onDayPress={(day) => {
            onSelectDate(day.dateString);
          }}
          theme={{
            todayTextColor: "#189AF2",
            arrowColor: '#FFA000',
            textDayFontFamily: 'NotoSansKR-Regular',
            textMonthFontFamily: 'NotoSansKR-Regular',
            textDayHeaderFontFamily: 'NotoSansKR-Regular',
            textDayFontSize: 16,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 16,
          }}
        />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  calendarView: {
    // 여백
    marginTop: 5,
    marginLeft: 5,
    marginRight: 5,

    // 밑줄
    borderBottomWidth: 3,
    borderBottomColor: '#E0E0E0',
  },
  
});

export default CalendarView;