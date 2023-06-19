import React from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import CustomButton from "./CustomButton";
import { useNavigation } from "@react-navigation/native";

function SignButtons({ isSignUp, onSubmit, loading }) {
  const navigation = useNavigation();

  const primaryTitle = isSignUp ? "회원가입" : "로그인";
  const secondaryTitle = isSignUp ? "로그인" : "회원가입";

  const onSecondaryButtonPress = () => {
    if (isSignUp) {
      navigation.goBack();
    } else {
      navigation.push("SignIn", { isSignUp: true });
    }
  };

  if (loading) {
    return (
      <View style={styles.spinnerWrapper}>
        <ActivityIndicator size={32} color="#3A8DF8" />
      </View>
    );
  }

  return (
    <View style={styles.buttons}>
      <CustomButton title={primaryTitle} hasMarginBottom onPress={onSubmit} />
      <CustomButton title={secondaryTitle} theme="secondary" onPress={onSecondaryButtonPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  spinnerWrapper: {
    justifyContent: "center",
    alignItems: "center",
    
    height: 104,
    marginTop: 64,
  },

  buttons: {
    flexDirection: 'row',
    marginTop: 15,
    marginBottom: 30,    
  },
});

export default SignButtons;