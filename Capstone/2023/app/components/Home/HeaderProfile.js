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
      <View style={styles.block}>
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
    </View>
    <View style={styles.border} />
    </>
  );
}

const styles = StyleSheet.create({
  block: {
    width: 44,
    height: 44,
    top: -4,
    right: 5,
    marginRight: 20,
    borderWidth: 4,
    borderColor: 'gray',
  },
  
  container: {
    position: 'absolute',
    width: 500,
    height: 60,
    top: 0,
    left: -100,
    backgroundColor: "#F6FAFF",
  },

  press: {
    top: 12,
    right: 69,
  },

  avatar: {
    width: 34,
    height: 34,
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
    backgroundColor: "#C0CDDF",
  },
});

export default HeaderProfile;