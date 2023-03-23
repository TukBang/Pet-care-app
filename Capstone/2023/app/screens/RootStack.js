import React, {useEffect} from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainScreen from "./MainScreen";
import WriteScreen from "./WriteScreen";
import SignInScreen from "./SignInScreen"
// import MainScreen from "./screens/MainScreen";
// import DetailScreen from "./components/DetailScreen";

const Stack = createNativeStackNavigator();



function RootStack() {
  return(
    <NavigationContainer independent={true}>
      <Stack.Navigator>
        {/* <Stack.Screen
          name="SignIn"
          component={SignInScreen}
          options={{headerShown:false}}
          /> */}
        <Stack.Screen
          name="Main"
          component={MainScreen}
          options={{headerShown:false}}
          />
        <Stack.Screen name="Write" component={WriteScreen} options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}


export default RootStack;