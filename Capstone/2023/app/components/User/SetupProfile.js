import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { Image, Platform, StyleSheet, View, Pressable, ActivityIndicator } from "react-native";
import { useUserContext } from "../../contexts/UserContext";
import { signOut } from "../../lib/auth";
import { createUser } from "../../lib/users";
import BorderedInput from "../Login/BorderedInput";
import CustomButton from "../Login/CustomButton";
import { launchImageLibrary } from "react-native-image-picker";
import storage from "@react-native-firebase/storage";

function SetupProfile() {
  const [displayName, setDisplayName] = useState("");
  const navigation = useNavigation();

  const { setUser } = useUserContext();

  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const { params } = useRoute();
  const { uid } = params || {};

  const onSubmit = async () => {
    setLoading(true);

    let photoURL = null;

    if (response) {
      const asset = response.assets[0];
      const extension = asset.fileName.split(".").pop(); // 확장자 추출
      const reference = storage().ref(`/profile/${uid}.${extension}`);

      if (Platform.OS === "android") {
        await reference.putString(asset.base64, "base64", {
          contentType: asset.type,
        });
      } else {
        await reference.putFile(asset.uri);
      }

      photoURL = response ? await reference.getDownloadURL() : null;
    }
    const user = {
      id: uid,
      displayName,
      photoURL,
    };
    createUser(user);
    setUser(user);
  };

  const onCancel = () => {
    signOut();
    navigation.goBack();
  };

  const onSelectImage = () => {
    launchImageLibrary(
      {
        mediaType: "photo",
        maxWidth: 512,
        maxHeight: 512,
        includeBase64: Platform.OS === "android",
      },
      (res) => {
        if (res.didCancel) {
          return;
        }
        setResponse(res);
        console.log(response)
      }
    );
  };

  useEffect(() => {
  }, [response]);

  return (
    <View style={styles.block}>
      <Pressable onPress={onSelectImage}>
        <Image
          stlye={styles.circle}
          source={response ? { uri: response?.assets[0]?.fileName } : require("../../assets/user.png")}
        />
      </Pressable>

      <View style={styles.form}>
        <BorderedInput
          placeholder="닉네임"
          value={displayName}
          onChangeText={setDisplayName}
          onSubmitEditing={onSubmit}
          returnKeyType="next"
        />
        {loading ? (
          <ActivityIndicator size={32} color="#6200ee" style={styles.spinner} />
        ) : (
          <View style={styles.buttons}>
            <CustomButton style={{}} title="다음" onPress={onSubmit} hasMarginBottom />
            <CustomButton title="취소" onPress={onCancel} theme="secondary" />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    alignItems: "center",
    marginTop: 24,
    paddingHorizontal: 16,
    width: "100%",
  },
  circle: {
    backgroundColor: "#cdcdcd",
    borderRadius: 64,
    width: 128,
    height: 128,
  },
  form: {
    marginTop: 16,
    width: "100%",
  },
  buttons: {
    
    marginTop: 48,
    flexDirection: 'row',
    justifyContent: "space-between",
  },
});

export default SetupProfile;
