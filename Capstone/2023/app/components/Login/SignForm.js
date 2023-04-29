import React, { useRef } from "react";
import { StyleSheet } from "react-native";
import BorderedInput from "./BorderedInput";

function SignForm({ isSignUp, onSubmit, form, createChangeTextHandler }) {
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  return (
    <>
      <BorderedInput
        hasMarginBottom
        styles={styles.text}
        placeholder="이메일"
        value={form.email}
        onChangeText={createChangeTextHandler("email")}
        autoCapitalize="none"
        autoCorrect={false}
        autoCompleteType="email"
        keyboardType="email-address"
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current.focus()}
      />
      <BorderedInput
        styles={styles.text}
        placeholder="비밀번호"
        secureTextEntry
        hasMarginBottom={isSignUp}
        value={form.password}
        onChangeText={createChangeTextHandler("password")}
        ref={passwordRef}
        returnKeyType={isSignUp ? "next" : "done"}
        onSubmitEditing={() => {
          if (isSignUp) {
            confirmPasswordRef.current.focus();
          } else {
            onSubmit();
          }
        }}
      />
      {isSignUp && (
        <BorderedInput
          styles={styles.text}
          placeholder="비밀번호 확인"
          secureTextEntry
          value={form.confirmPassword}
          onChangeText={createChangeTextHandler("confirmPassword")}
          ref={confirmPasswordRef}
          returnKeyType="done"
          onSubmitEditing={onSubmit}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "#808080",
  },
});

export default SignForm;
