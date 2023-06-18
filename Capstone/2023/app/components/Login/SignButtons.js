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
        <ActivityIndicator size={32} color="#6200ee" />
      </View>
    );
  }

  return (
    <View style={styles.buttons}>
      <CustomButton style={styles.primary} title={primaryTitle} hasMarginBottom onPress={onSubmit} />
      <CustomButton style={styles.secondary} title={secondaryTitle} theme="secondary" onPress={onSecondaryButtonPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  spinnerWrapper: {
    marginTop: 64,
    height: 104,
    justifyContent: "center",
    alignItems: "center",
    
  },
  buttons: {
    marginTop: 15,
    flexDirection: 'row',
    // position: 'absolute',

  },
  // primary:{
  //   position: 'absolute',
  //   width: 500,
  //   height: 60,
  //   top: 0,
  //   left: -100,
  // },
  // secondary:{
  //   position: 'absolute',
  //   left: 100,
  // },
});

export default SignButtons;


