import React, { useState, useCallback, useEffect } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useUserContext } from "../../contexts/UserContext";
import auth from "@react-native-firebase/auth";

import { signOut } from "../../lib/auth";
import PetProfile from "../../components/Home/PetProfile";
import AuthExpertModal from "./AuthExpertModal";
import QnAModal from "./QnAModal";

function ProfileSetting() {
  const { user, setUser } = useUserContext();

  const navigation = useNavigation();

  const currentUser = auth().currentUser;
  const creationTime = currentUser.metadata.creationTime;
  const dateObj = new Date(creationTime);
  console.log(dateObj)
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  const formattedDate = `${year}년 ${month}월 ${day}일`;
  const today = new Date();
  
  const timeDiff = today.getTime() - dateObj.getTime();
  const dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

  const [ authExpert, setAuthExpert ] = useState(false);
  const [ qna, setQnA ] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => 
      <>
        <TouchableOpacity style={styles.logout} onPress={tryLogout}>
          <Text style={styles.logoutText}>로그아웃</Text>
          <Icon style={styles.logoutIcon} name="logout" size={30} />
        </TouchableOpacity>
      </>,
    });
  }, [navigation]);

  const OpenAuthExpertModal = () => {
    setAuthExpert(true);
  }
  const CloseAuthExpertModal = () => {
    setAuthExpert(false);
  }
  const OpenQnAModal = () => {
    setQnA(true);
  }
  const CloseQnAModal = () => {
    setQnA(false);
  }

  const onCloseLogIn = useCallback(() => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "SignIn" }],
      })
    );
  }, [navigation]);

  const tryLogout = async () => {
    try {
      signOut; // Firebase에서 로그아웃 진행
               // 다른 변수나 상태값 초기화
               // ...  
      setUser(null);

      // 앱 초기화면으로 이동
      onCloseLogIn;
    } catch (error) {
      console.error(error);
    }
  };

  const goMyBoard = () => {
    navigation.navigate("CommunityScreen", { boardCategory: "내 게시물" });
  };

  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        <Image
          source={
            user.photoURL ? { uri: user.photoURL, } : require("../../assets/user.png")
          }
          resizeMode="cover"
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.name}>{user.displayName}님 반갑습니다!</Text>
          <Text style={styles.normalText}>가입 일자: {formattedDate}</Text>
          <Text style={styles.normalText}>지금까지 {dayDiff}일 동안 함께 하셨습니다!</Text>
        </View>
      </View>
      
      {/* my Information */}
      <Text style={[styles.normalText, {top: 10, left: 7,}]}>내 정보</Text>
      <View style={{width: "97%", height: "1%", left: 7}}>
        <View style={[styles.border, {top: 15,}]} />
      </View>

      <TouchableOpacity style={styles.content} onPress={goMyBoard}>
        <Icon style={styles.myPostIcon} name="dashboard" size={35} />
        <Text style={styles.normalText}>내 게시물</Text>
      </TouchableOpacity>
      
      <View style={{width: "97%", height: "1%", bottom: 8, left: 7}}>
        <View style={[styles.border]} />
      </View>
      
      {/* A/S */}
      <Text style={[styles.normalText, {top: 10, left: 7,}]}>문의</Text>
      <View style={{width: "97%", height: "1%", left: 7}}>
        <View style={[styles.border, {top: 15,}]} />
      </View>

      <TouchableOpacity style={styles.content} onPress={OpenQnAModal}>
        <Icon style={styles.inquireIcon} name="contact-support" size={35} />
        <Text style={styles.normalText}>문의하기</Text>
      </TouchableOpacity>
      <QnAModal visible={qna} unvisible={CloseQnAModal} />

      <View style={{width: "97%", height: "1%", bottom: 9, left: 7}}>
        <View style={[styles.border]} />
      </View>

      <TouchableOpacity style={[styles.content, {bottom: 21}]} onPress={OpenAuthExpertModal}>
        <Icon style={styles.expertCertificationIcon} name="work" size={35} />
        <Text style={styles.normalText}>전문가 계정 인증하기</Text>
      </TouchableOpacity>
      <AuthExpertModal visible={authExpert} unvisible={CloseAuthExpertModal} />
      

      <View style={{width: "97%", height: "1%", bottom: 28, left: 7}}>
        <View style={[styles.border]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f6faff",
  },

  profile: {
    margin: 20,
    flexDirection: "row",
    marginBottom: 20,
  },

  avatar: {
    width: 70,
    height: 70,
    borderRadius: 45,
    marginRight: 10,
  },
  
  name: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 5,
    color: "#282828", 
  },

  userInfo: {
    marginLeft: 10,
  },

  border: {
    height: 1,
    backgroundColor: "#C0CDDF",
  },

  logout: {
    flexDirection: "row",
    alignItems: "center",
    height: 60,
    left: 15,
  },

  logoutText: {
    fontSize: 16,
    fontWeight: "bold",
    left: 3,
    color: '#484848',
  },

  logoutIcon: {
    marginLeft: 10,
    marginRight: 10,
    color: '#DF3030',
  },

  normalText: {
    color: "#282828",
    fontSize: 15,
  },

  myInformation: {
    top: 10,
    left: 5,
  },

  content: {
    height: "12%",
    flexDirection: "row",
    alignItems: "center",
  },

  myPostIcon: {
    marginLeft: 10,
    marginRight: 10,
    color: "#E07070",
  },

  inquireIcon: {
    marginLeft: 10,
    marginRight: 10,
    color: "#E97020",
  },

  expertCertificationIcon: {
    marginLeft: 10,
    marginRight: 10,
    color: "#B97B50",
  },
});

export default ProfileSetting;
