import React, { useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUserContext } from "../../contexts/UserContext";

// 그라데이션
import LinearGradient from 'react-native-linear-gradient';

// 사용자 모듈
import SimpleTodo from "../../components/Home/SimpleTodo";
import PetList from "../../components/Home/PetList";
import HeaderProfile from "../../components/Home/HeaderProfile";
import Banner from "../../components/Home/Banner";
import Disease from "../../components/Home/Disease";

function HomeScreen() {
  const { user } = useUserContext();
  const navigation = useNavigation();

  const onPress = () => {
    // 사용자 프로필 화면 열기
    navigation.push("ProfileSetting");
  };

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerRight: () => <HeaderProfile user={user} onPress={onPress} />,
    });
  }, [navigation]);

  return (
    <LinearGradient
      colors={['#F6FAFF', '#F6FAFF']}
      style={{flex : 1}}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <PetList />
        <Banner />
        <SimpleTodo />
        <Disease />
        <Text 
          style={styles.text}
        />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "flex-start",
    paddingLeft: 20,
    paddingRight: 20,
  },

  profile: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 10,
  },

  text: {
    marginTop: 10,
  }
});

export default HomeScreen;