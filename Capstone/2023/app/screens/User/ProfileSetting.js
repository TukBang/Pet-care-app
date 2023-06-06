import React, { useCallback } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useUserContext } from "../../contexts/UserContext";
import auth from "@react-native-firebase/auth";

import { signOut } from "../../lib/auth";
import PetProfile from "../../components/Home/PetProfile";

function ProfileSetting() {
  const { user } = useUserContext();

  const navigation = useNavigation();

  const currentUser = auth().currentUser;
  console.log(currentUser)
  console.log(user)
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
            user.photoURL
              ? {
                  uri: user.photoURL,
                }
              : require("../../assets/user.png")
          }
          resizeMode="cover"
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.name}>{user.displayName} 님 반갑습니다!</Text>
          <Text>가입 일자 : {formattedDate}</Text>
          <Text>지금까지 {dayDiff}일 동안 함께 하셨습니다</Text>
        </View>
      </View>
      <View style={styles.border} />
      <TouchableOpacity style={styles.content} onPress={goMyBoard}>
        <Icon style={styles.icon} name="dashboard" size={30} />
        <Text style={{}}>내 게시물</Text>
      </TouchableOpacity>
      <View style={styles.border} />
      <TouchableOpacity style={styles.content} onPress={tryLogout}>
        <Icon style={[styles.icon, styles.logout]} name="logout" size={30} />
        <Text style={{}}>로그아웃</Text>
      </TouchableOpacity>
      <View style={styles.border} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
  profile: {
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
    fontSize: 20,
    // marginLeft:10,
  },
  userInfo: {
    marginLeft: 10,
  },
  border: {
    height: 1,
    backgroundColor: "gray",
    marginBottom: 10,
    // marginLeft: 10,
    // marginRight: 20,
    marginTop: 10,
  },
  content: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginLeft: 10,
    marginRight: 10,
    // color: 'red',
  },
  logout: {
    color: "red",
  },
});

export default ProfileSetting;
