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
  const { title, date } = log;
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
        Platform.OS === "ios" && pressed && { backgroundColor: "#efefef" },
      ]}
      android_ripple={{ color: "#ededed" }}
      onPress={onPress}
    >
      <Text style={styles.title}>{showTitle}</Text>
      <Text style={styles.time}>{formatDate(date)}</Text>
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
    color: "#000000",
  },

  time: {
    marginLeft: 10,
    marginBottom: 8,
    fontSize: 13,
    color: "#9E9E9E",
  },
});

export default FeedListItem;
