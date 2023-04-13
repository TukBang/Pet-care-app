import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TextInput, Button } from "react-native";
import { useUserContext } from "../../contexts/UserContext";

function HomeScreen() {
  const [petname, setPetname] = useState("");
  const [gender, setGender] = useState("");
  const [weight, setWeight] = useState("");
  const [birth, setBirth] = useState("");
  const [kind, setKind] = useState("");
  const [saving, setSaving] = useState(false);
  const {user} = useUserContext();
  const uid = user.uid;

  useEffect(() => {
    return () => {
      // cleanup function
      setSaving(false); // cancel saving if component unmounts
    };
  }, []);

  const savePet = async () => {
    setSaving(true);
    try {
      const response = await fetch("http://127.0.0.1:4000/pet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          petname,
          uid,
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
      <Text style={styles.title}>Add new pet information.</Text>
      <TextInput
        style={styles.input}
        placeholder="Pet name"
        onChangeText={(text) => setPetname(text)}
        value={petname}
      />
      <TextInput
        style={styles.input}
        placeholder="Gender"
        onChangeText={(text) => setGender(text)}
        value={gender}
      />
      <TextInput
        style={styles.input}
        placeholder="Weight"
        onChangeText={(text) => setWeight(text)}
        value={weight}
      />
      <TextInput
        style={styles.input}
        placeholder="Birth date"
        onChangeText={(text) => setBirth(text)}
        value={birth}
      />
      <TextInput
        style={styles.input}
        placeholder="Kind"
        onChangeText={(text) => setKind(text)}
        value={kind}
      />
      <TextInput
        style={styles.input}
        placeholder="User ID"
        onChangeText={() => {}}
        value={user.id}
        editable={false}
      />
      <Button title="Save pet information" onPress={savePet} />
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
