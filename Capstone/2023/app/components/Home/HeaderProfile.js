import React from "react";
import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

// Header Profile
function HeaderProfile({ user, onPress }) {
  return (
    <>
    <View style={styles.container}>
      <Text style={styles.textStyle}>{user.isExpert ? 'Expert+' : '일반회원'}</Text>
      <Icon style={styles.iconImage} name='help-outline' size={40} />
      <Pressable onPress={onPress} style={styles.press}>
        <Image
          source={
            user.photoURL
            ? {
                uri: user.photoURL,
              }
            : require("../../assets/user.png")
          }
          resizeMode="cover"
          style={styles.avatar}
        />
      </Pressable>
    </View>
    <View style={styles.border} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 500,
    height: 60,
    top: 0,
    left: -100,
    backgroundColor: "#F6FAFF",
  },

  press: {
    width: 34,
    height: 34,
    top: 12,
    right: 69,
  },

  avatar: {
    width: "100%",
    height: "100%",
    left: 505,
    borderRadius: 22,
  },

  iconImage: {
    position: "absolute",
    marginRight: 40,
    top: 9,
    right: 30,
    color: '#3A8DF0',
  },

  textStyle: {
    position: 'absolute',
    top: 17,
    right: 350,
    color: "black",
    fontWeight: "bold",
    fontSize: 17,
    backgroundColor: "#F6FAFF"
  },

  border: {
    height: 2,
    top: 32,
    left: 100,
    width: 1000,
    backgroundColor: "#E2E6EB",
  },
});

export default HeaderProfile;