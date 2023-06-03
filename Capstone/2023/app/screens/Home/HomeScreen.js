// import React, { useEffect } from "react";
// import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { useUserContext } from "../../contexts/UserContext";
// import SimpleTodo from "../../components/Home/SimpleTodo";
// import PetList from "../../components/Home/PetList";
// import HeaderProfile from "../../components/Home/HeaderProfile";
// import Banner from "../../components/Home/Banner";

// function HomeScreen() {
//   const { user } = useUserContext();
//   const navigation = useNavigation();

//   const onPress = () => {
//     // TODO: 사용자 프로필 화면 열기
//     navigation.push("ProfileSetting");
//   };

//   useEffect(() => {
//     navigation.setOptions({
//       headerTitle: "",
//       headerRight: () => <HeaderProfile user={user} onPress={onPress} />,
//     });
//   }, [navigation]);

//   return (
//     <View style={styles.container}>
//       <PetList />
//       <SimpleTodo />
//       <Banner />
//       {/* 어플 요약 정보 표시 - 23.04.29 현재는 형태만 저장 */}
//       <SimpleTodo />
      
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "flex-start",
//     paddingLeft: 20,
//     paddingRight: 20,
//   },
//   profile: {
//     margin: 10,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },


// });
// //--------------------------------------------------------------------

// export default HomeScreen;

import React, { useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUserContext } from "../../contexts/UserContext";
import SimpleTodo from "../../components/Home/SimpleTodo";
import PetList from "../../components/Home/PetList";
import HeaderProfile from "../../components/Home/HeaderProfile";
import Banner from "../../components/Home/Banner";
import Disease from "../../components/Home/Disease";

function HomeScreen() {
  const { user } = useUserContext();
  const navigation = useNavigation();

  const onPress = () => {
    // TODO: 사용자 프로필 화면 열기
    navigation.push("ProfileSetting");
  };

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerRight: () => <HeaderProfile user={user} onPress={onPress} />,
    });
  }, [navigation]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <PetList />
      <Banner />
      <SimpleTodo />
      <Disease />
      <Banner />
      {/* 어플 요약 정보 표시 - 23.04.29 현재는 형태만 저장 */}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    alignItems: "flex-start",
    paddingLeft: 20,
    paddingRight: 20,
  },
  profile: {
    margin: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default HomeScreen;

