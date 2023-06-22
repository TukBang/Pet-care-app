import React, { useContext, useMemo, useState } from "react";

import { StyleSheet, View } from "react-native";

import format from "date-fns/format";
import CalendarView from "../../components/Calendar/CalendarView";
import FeedList from "../../components/Calendar/FeedList";
import LogContext from "../../contexts/LogContext";
import FloatingWriteButton from "../../components/Calendar/FloatingWriteButton";

// 달력 메인화면
import LinearGradient from 'react-native-linear-gradient';

function CalendarScreen() {
  // 기존에 저장되어 있던 일정 기록들
  const { logs } = useContext(LogContext);

  // 선택된 날짜
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [hidden, setHidden] = useState(false);

  const markedDates = useMemo(
    () =>
      logs.reduce((acc, current) => {
        const formattedDate = format(new Date(current.date), "yyyy-MM-dd");
        acc[formattedDate] = { marked: true };
        return acc;
      }, {}),
    [logs]
  );

  // 특정날짜에 속한 일정을 보기위한 logs
  const filteredLogs = logs.filter(
    (log) => format(new Date(log.date), "yyyy-MM-dd") === selectedDate
  );

  const onScrolledToBottom = (isBottom) => {
    if (hidden !== isBottom) setHidden(isBottom);
  };

  return (
    <LinearGradient
      colors={['#F6FAFF', '#F6FAFF']}
      style={{flex : 1}}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <View style={styles.block}>
        {/* 달력 뷰 */}
        <CalendarView
          markedDates={markedDates}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />
        {/* 일정 목록 */}
        <FeedList logs={filteredLogs} onScroll={onScrolledToBottom} />
        {/* 일정 추가 버튼 */}
        <FloatingWriteButton
          hidden={hidden}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  block: {
    flex: 1,
  },
});

export default CalendarScreen;
