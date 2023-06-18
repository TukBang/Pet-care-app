import React from "react";
import { StyleSheet, View, Pressable, Text, Platform } from "react-native";

function CustomButton({ onPress, title, hasMarginBottom, theme }) {
  const isPrimary = theme === "primary";

  return (
    <View style={[styles.block, hasMarginBottom && styles.margin]}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.wrapper,
          isPrimary && styles.primaryWrapper,
          Platform.OS === "ios" && pressed && { opacity: 0.5 },
        ]}
        android_ripple={{
          color: isPrimary ? "#ffffff" : "#3A8DF0",
        }}
      >
        <Text style={[styles.text, isPrimary ? styles.primaryText : styles.secondaryText]}>
          {title}
        </Text>
      </Pressable>
    </View>
  );
}

CustomButton.defaultProps = {
  theme: "primary",
};

const styles = StyleSheet.create({
  overflow: {
    borderRadius: 4,
    overflow: "hidden",
  },
  block: {
    alignItems: "center",
  },
  wrapper: {
    width: "100%",
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF", // 흰색 바탕
    borderWidth: 1,
    borderColor: "#C0C0C0", // 회색 테두리 색상
    borderRadius: 5,
    borderWidth: 2,
  },
  primaryWrapper: {
    backgroundColor: "#3A8DF0",
    elevation: 5,
  },
  text: {
    fontWeight: "bold",
    fontSize: 14,
    color: "white",
  },
  primaryText: {
    color: "white",
  },
  secondaryText: {
    color: "#3A8DF0",
  },
  margin: {
    marginBottom: 10,
  },
});

export default CustomButton;
