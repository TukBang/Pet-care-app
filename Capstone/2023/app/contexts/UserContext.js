import React, { useContext, createContext, useState } from "react";

// 현재 세션의 user을 불러오는 함수
// import 하고 cosnt user = useUserContext() 로 선언하면
// user 에 유저 정보가 저장 됨
// id, photoURL, displayName

const UserContext = createContext(null);

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [updateVariable, setUpdateVariable] = useState(null);
  const [lagi, setLagi] = useState(null)
  const [logi, setLogi] = useState(null)
  return (
    <UserContext.Provider
      children={children}
      value={{
        user,
        setUser,
        updateVariable,
        setUpdateVariable,
        lagi, setLagi,
        logi, setLogi,
      }}
    />
  );
}

export function useUserContext() {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("UserContext.Provider is not found");
  }
  return userContext;
}
