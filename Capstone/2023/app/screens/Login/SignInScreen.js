import React, { useState, useEffect } from "react";
import { Keyboard, KeyboardAvoidingView, 
  Platform, StyleSheet, 
  View, ScrollView, Image, Text, 
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import SignButtons from "../../components/Login/SignButtons";
import SignInForm from "../../components/Login/SignForm";
import { useUserContext } from "../../contexts/UserContext";
import { signIn, signUp } from "../../lib/auth";
import { getUser } from "../../lib/users";

// 로그인 화면
function SignInScreen({ navigation, route }) {
  const { isSignUp } = route.params || {};
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const { setUser } = useUserContext();
  const pcaImage = require('../../assets/dog.png');
  const catImage = require('../../assets/catt.png');

  useEffect(() => {
    return () => {
      setLoading(false);
    };
  }, []);

  const createChangeTextHandler = (name) => (value) => {
    setForm({ ...form, [name]: value });
  };

  // 로그인 시도함수
  const onSubmit = async () => {
    Keyboard.dismiss();
    const { email, password, confirmPassword } = form;
    if (email === "" || email === null) {
      Alert.alert("실패", "이메일을 입력해주세요.");
      return;
    }
    if (password === "" || password === null) {
      Alert.alert("실패", "비밀번호를 입력해주세요.");
      return;
    }
    if (isSignUp && password !== confirmPassword) {
      Alert.alert("실패", "비밀번호가 일치하지 않습니다.");
      console.log({ password, confirmPassword });
      return;
    }

    setLoading(true);
    const info = { email, password };

    // 로그인 예외 설정
    try {
      const { user } = isSignUp ? await signUp(info) : await signIn(info);
      const profile = await getUser(user.uid);
      if (!profile) {
        navigation.navigate("Welcome", { uid: user.uid });
      } else {
        setUser(profile);
      }
    } catch (e) {
      const messages = {
        "auth/email-already-in-use": "이미 가입된 이메일입니다.",
        "auth/wrong-password": "잘못된 비밀번호입니다.",
        "auth/user-not-found": "존재하지 않는 계정입니다.",
        "auth/invalid-email": "유효하지 않은 이메일 주소입니다.",
      };
      console.log(e.code);
      const msg = messages[e.code] || `${isSignUp ? "가입" : "로그인"} 실패`;
      Alert.alert("실패", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior="padding"
      keyboardVerticalOffset={-110}
    >
      <SafeAreaView style={styles.fullscreen}>
        <View style={styles.container}>
          <Image source={pcaImage} style={styles.image}  resizeMode="contain"/>
          <Text style={styles.text}>PCA</Text>
          <Image source={catImage} style={styles.image2}  resizeMode="contain"/>
        </View>
        <View style={styles.form}>
          <SignInForm
            isSignUp={isSignUp}
            onSubmit={onSubmit}
            form={form}
            createChangeTextHandler={createChangeTextHandler}
          />
          <SignButtons isSignUp={isSignUp} onSubmit={onSubmit} loading={loading} />
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: "#F6FAFF",
  },

  fullscreen: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  text: {
    fontSize: 50,
    fontWeight: "bold",
    color: "#3a8df0",
  },

  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: "40%",
    marginBottom: "60%",
  },

  form: {
    width: "90%",
  },

  image: {
    width: 60,
    height: 60,
    marginRight: 10,
  },

  image2: {
    width: 60,
    height: 60,
    marginLeft: 10,
  },
});

export default SignInScreen;
