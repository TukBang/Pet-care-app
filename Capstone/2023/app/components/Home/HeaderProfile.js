import React from "react";
import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

// Header Profile
function HeaderProfile({ user, onPress }) {
  return (
    <View style={styles.container}>
      <Text style={[styles.textStyle, user.isExpert ? {color: "#DBAC34"} : {}]}>{user.isExpert ? 'Expert+' : '일반회원'}</Text>
      <View style={styles.profile}>
        <Icon style={styles.iconImage} name='help-outline' size={45} />
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
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    width: "100%",
    height: 60,
    backgroundColor: "#F6FAFF",
    borderBottomWidth: 2,
    borderBottomColor: "#E2E6EB",
  },

  press: {
    width: 38.5,
    height: 38.5,
  },

  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 22,
  },

  iconImage: {
    color: '#3A8DF0',
    marginRight: 5,
  },

  textStyle: {
    color: "black",
    fontWeight: "bold",
    fontSize: 17,
    marginLeft: 15,
    backgroundColor: "#F6FAFF"
  },
  
  profile: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 10,
    alignItems: 'center',
  }
});

export default HeaderProfile;