import React, {useEffect} from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RootStack from "./screens/RootStack";
import { LogContextProvider } from "./contexts/LogContext";

const Stack = createNativeStackNavigator();



function App() {
  return(
    <NavigationContainer>
      <LogContextProvider>
        <RootStack />
      </LogContextProvider>
    </NavigationContainer>
  )
}


export default App;