import React, { useRef, useEffect } from "react";
import { NavigationContainer, useFocusEffect } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainScreen from "./MainScreen";
import WriteScreen from "./Calendar/WriteScreen";
import SignInScreen from "./Login/SignInScreen";
import WelcomeScreen from "./User/WelcomeScreen";
import { useUserContext } from "../contexts/UserContext";
import UploadScreen from "./Community/UploadScreen";
import BoardScreen from "./Community/BoardScreen";
import ModifyScreen from "./Community/ModifyScreen";
import ModifyCommentScreen from "./Community/ModifyCommentScreen";
import ProfileSetting from "./User/ProfileSetting";
import PetProfile from "../components/Home/PetProfile";
import ChattingBot from "./ChatBot/ChatBot";
import { BackHandler, ToastAndroid } from "react-native";
const Stack = createNativeStackNavigator();
// 화면 스택이 구성되어 있는 모듈
function RootStack() {
  const { user } = useUserContext();

  // const exitApp = useRef(false); // 앱 종료 여부를 저장하는 useRef

  // useEffect(() => {
  //   const backHandler = BackHandler.addEventListener("hardwareBackPress", handleBackPress);

  //   return () => {
  //     backHandler.remove();
  //   };
  // }, []);

  // const handleBackPress = () => {
  //   if (exitApp.current) {
  //     BackHandler.exitApp(); // 앱 종료
  //     return true;
  //   }

  //   exitApp.current = true;
  //   ToastAndroid.show("한번 더 뒤로가기를 누르면 종료됩니다.", ToastAndroid.SHORT);

  //   setTimeout(() => {
  //     exitApp.current = false;
  //   }, 2000);

  //   return true;
  // };

  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator>
        {/* 로그인 여부에 따라 로그인 화면 - 메인 화면 분기 */}
        {user ? (
          <>
            <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Write" component={WriteScreen} options={{ headerShown: false }} />
            <Stack.Screen
              name="Upload"
              component={UploadScreen}
              options={{ title: "새 게시물", headerBackTitle: "뒤로가기" }}
            />
            <Stack.Screen
              name="Board"
              component={BoardScreen}
              options={{ title: "커뮤니티", headerBackTitle: "뒤로가기" }}
            />
            <Stack.Screen
              name="Modify"
              component={ModifyScreen}
              options={{ title: "게시글 수정", headerBackTitle: "뒤로가기" }}
            />
            <Stack.Screen
              name="ModifyComment"
              component={ModifyCommentScreen}
              options={{ title: "댓글 수정", headerBackTitle: "뒤로가기" }}
            />
            <Stack.Screen
              name="ProfileSetting"
              component={ProfileSetting}
              options={{
                title: "프로필 화면", 
                headerBackTitle: "뒤로가기", 
                headerStyle: {
                  backgroundColor: '#F6FAFF',
                },
                headerTitleStyle: {
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: "#282828",
                },
                headerTintColor: "#3A8DF8",
              }}
            />
            <Stack.Screen
              name="PetProfile"
              component={PetProfile}
              
              options={{
                title: "펫 정보 화면", 
                headerBackTitle: "뒤로가기", 
                headerStyle: {
                  backgroundColor: '#F6FAFF',
                },
                headerTitleStyle: {
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: "#282828",
                },
                headerTintColor: "#3A8DF8",
              }}
            />
            <Stack.Screen
              name="ChatBot"
              component={ChattingBot}
              options={{ title: "챗봇", headerBackTitle: "뒤로가기" }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }} />
            <Stack.Screen
              name="Welcome"
              component={WelcomeScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default RootStack;
