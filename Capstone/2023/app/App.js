import React from "react";
import { NavigationContainer, useFocusEffect } from "@react-navigation/native";

import RootStack from "./screens/RootStack";
import { LogContextProvider } from "./contexts/LogContext";
import { UserContextProvider } from "./contexts/UserContext";
import { useCallback } from "react";

// 총 화면 구성



function App() {
  
  return (
    <UserContextProvider>
      <NavigationContainer>
        <LogContextProvider>
          <RootStack />
        </LogContextProvider>
      </NavigationContainer>
    </UserContextProvider>
  );
}

export default App;
