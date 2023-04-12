// import React from "react";
// import { StyleSheet, View, Text } from "react-native";
// import { useUserContext } from "../../contexts/UserContext";
// import Ggupdeagi from "../Ggupdeagi";



// function HomeScreen() {

//   const {user} = useUserContext();
//     return (
//     <View style={styles.block}>
//       <Ggupdeagi />
//       {user.photoURL && (
//         <Image
//           source={{uri: user.photoURL}}
//           style={{width: 128, height: 128, marginBottom: 16}}
//           resizeMode="cover"
//         />
//       )}
//     </View>
//     )
// }

// const styles = StyleSheet.create({
//     block: {},
// });

// export default HomeScreen;
import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TextInput, Button } from "react-native";
import { useUserContext } from "../../contexts/UserContext";

function HomeScreen() {
  const [petname, setPetname] = useState("");
  const [id, setId] = useState("");
  const [gender, setGender] = useState("");
  const [weight, setWeight] = useState("");
  const [birth, setBirth] = useState("");
  const [kind, setKind] = useState("");
  const [saving, setSaving] = useState(false);
  const {user} = useUserContext();

  useEffect(() => {
    return () => {
      // cleanup function
      setSaving(false); // cancel saving if component unmounts
    };
  }, []);

  const savePet = async () => {
    setSaving(true);
    try {
      const response = await fetch("http://127.0.0.1:3000/pet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          petname,
          id,
          gender,
          weight,
          birth,
          kind,
        }),
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    } finally {
      // check if component is still mounted before updating state
      if (!saving) return;
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>새로운 애완동물 정보를 추가하세요.</Text>
      <TextInput
        style={styles.input}
        placeholder="애완동물 이름"
        onChangeText={(text) => setPetname(text)}
        value={petname}
      />
      <TextInput
        style={styles.input}
        placeholder="ID"
        onChangeText={(text) => setId(text)}
        value={id}
      />
      <TextInput
        style={styles.input}
        placeholder="성별"
        onChangeText={(text) => setGender(text)}
        value={gender}
      />
      <TextInput
        style={styles.input}
        placeholder="무게"
        onChangeText={(text) => setWeight(text)}
        value={weight}
      />
      <TextInput
        style={styles.input}
        placeholder="생년월일"
        onChangeText={(text) => setBirth(text)}
        value={birth}
      />
      <TextInput
        style={styles.input}
        placeholder="종류"
        onChangeText={(text) => setKind(text)}
        value={kind}
      />
      <Button title="애완동물 정보 저장" onPress={savePet} />
      <Text>{user.id}입니다</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    margin: 8,
    width: "80%",
    maxWidth: 400,
  },
});

export default HomeScreen;