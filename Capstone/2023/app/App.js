import React, {useEffect} from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RootStack from "./screens/RootStack";
import { LogContextProvider } from "./contexts/LogContext";
import { UserContextProvider } from "./contexts/UserContext";

const Stack = createNativeStackNavigator();



function App() {
  return(
    <UserContextProvider>
      <NavigationContainer>
        <LogContextProvider>
          <RootStack />
        </LogContextProvider>
      </NavigationContainer>
    </UserContextProvider>
  )
}


export default App;