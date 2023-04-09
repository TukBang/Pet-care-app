import React, {useEffect} from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainScreen from "./MainScreen";
import WriteScreen from "./Calendar/WriteScreen";
import SignInScreen from "./Login/SignInScreen";
import WelcomeScreen from "./User/WelcomeScreen";
import { useUserContext } from "../contexts/UserContext";
import UploadScreen from "./Community/UploadScreen";
// import MainScreen from "./screens/MainScreen";
// import DetailScreen from "./components/DetailScreen";

const Stack = createNativeStackNavigator();



function RootStack() {

  const {user} = useUserContext();

  return(
    <NavigationContainer independent={true}>
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen
              name="Main"
              component={MainScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen name="Write" component={WriteScreen} options={{headerShown: false}}/>
            <Stack.Screen
            name="Upload"
            component={UploadScreen}
            options={{title: '새 게시물', headerBackTitle: '뒤로가기'}}
          />
          </>
        ) : (
          <>
            <Stack.Screen
              name="SignIn"
              component={SignInScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Welcome"
              component={WelcomeScreen}
              options={{headerShown: false}}
            />
          </>
        )}
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}


export default RootStack;