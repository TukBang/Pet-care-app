import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { useUserContext } from "../../contexts/UserContext";
import Ggupdeagi from "../../components/Home/Ggupdeagi";
import PetList from "../../components/Home/PetList";
import HeaderProfile from "../../components/Home/HeaderProfile";

function HomeScreen() {
  const { user } = useUserContext();
  const navigation = useNavigation();

  const onPress = () => {
    // TODO: 사용자 프로필 화면 열기
    navigation.push("ProfileSetting");
  };

  {
    /* 홈화면 헤더 프로필 표시 */
  }
  useEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerRight: () => <HeaderProfile user={user} onPress={onPress} />,
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* 어플 요약 정보 표시 - 23.04.29 현재는 형태만 저장 */}
      <Ggupdeagi />
      <PetList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "flex-start",
    // justifyContent: "center",
  },
  profile: {
    margin: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
//--------------------------------------------------------------------

export default HomeScreen;
