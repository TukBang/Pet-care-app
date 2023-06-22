import React from "react";
import { Platform, Pressable, StyleSheet, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { format, formatDistanceToNow } from "date-fns";
import ko from "date-fns/locale/ko";

function formatDate(date) {
  const d = new Date(date);
  const now = Date.now();
  const diff = (now - d.getTime()) / 1000;

  if (diff < 0) return formatDistanceToNow(d, { addSuffix: true, locale: ko });
  else if (diff < 60 * 1) return "1분 전";
  else if (diff < 60 * 5) return "5분 전";
  else if (diff < 60 * 10) return "10분 전";
  else if (diff < 60 * 30) return "30분 전";
  else if (diff < 60 * 60) return "1시간 전";
  else if (diff < 60 * 60 * 6) return "6시간 전";
  else if (diff < 60 * 60 * 12) return "12시간 전";
  else if (diff < 60 * 60 * 24) return format(d, "1일 전", { locale: ko });

  return format(d, "MM월 dd일 (EEE) hh시 mm분", { locale: ko });
}

function FeedListItem({ log }) {
  let { title, date, endDate } = log;

  if (typeof date === "string") {
    date = Date.parse(date);
  }
  if (typeof endDate === "string") {
    endDate = Date.parse(endDate);
  }

  const navigation = useNavigation();

  const onPress = () => {
    navigation.navigate("Write", {
      log,
    });
  };

  let showTitle = undefined;
  if (title === "") showTitle = "일정 - 제목 없음";
  else showTitle = title;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.block,
        Platform.OS === "ios" && pressed && { backgroundColor: "#F6FAFF" },
      ]}
      android_ripple={{ color: "#F6FAFF" }}
      onPress={onPress}
    >
      <Text style={styles.title}>{showTitle}</Text>
      <Text style={styles.time}>{format(date, "a h:mm", { locale: ko })} - {format(endDate, "a h:mm", { locale: ko })}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  block: {
    backgroundColor: "white",
    paddingHorizontal: 0,
    paddingVertical: 0,
  },

  title: {
    marginTop: 5,
    marginLeft: 10,
    marginBottom: 2,
    fontWeight: "bold",
    fontSize: 16,
    color: "#282828",
  },

  time: {
    marginLeft: 10,
    marginBottom: 8,
    fontSize: 13,
    color: "#8E8E8E",
  },
});

export default FeedListItem;
