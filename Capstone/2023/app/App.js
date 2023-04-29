import React from "react";
import { NavigationContainer } from "@react-navigation/native";

import RootStack from "./screens/RootStack";
import { LogContextProvider } from "./contexts/LogContext";
import { UserContextProvider } from "./contexts/UserContext";

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
