import React from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SetupProfile from "../../components/User/SetupProfile";

// 로그인 이후 - 프로필 설정 화면

function WelcomeScreen() {
  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior={Platform.select({ ios: "padding" })}
    >
      <SafeAreaView style={styles.block}>
        <Text style={styles.title}>환영합니다!</Text>
        <Text style={styles.description}>프로필을 설정하세요.</Text>
        {/* 프로필 설정 모듈 */}
        <SetupProfile />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: "#FAF6FF",
  },
  block: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 48,
  },
  description: {
    marginTop: 16,
    fontSize: 21,
    color: "#757575",
  },
});

export default WelcomeScreen;
