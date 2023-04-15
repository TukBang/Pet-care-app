// import React, { useState, useEffect } from "react";
// import { StyleSheet, View, Text, TextInput, Button } from "react-native";
// import { useUserContext } from "../../contexts/UserContext";

// function HomeScreen() {
//   const [petname, setPetname] = useState("");
//   const [gender, setGender] = useState("");
//   const [weight, setWeight] = useState("");
//   const [birth, setBirth] = useState("");
//   const [kind, setKind] = useState("");
//   const [saving, setSaving] = useState(false);
//   const {user} = useUserContext();

//   const uid = user["id"];

//   useEffect(() => {
//     return () => {
//       // cleanup function
//       setSaving(false); // cancel saving if component unmounts
//     };
//   }, []);

//   const savePet = async () => {
//     setSaving(true);
//     try {
//       const response = await fetch("http://127.0.0.1:4000/pet", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           petname,
//           id: uid,
//           gender,
//           weight,
//           birth,
//           kind,
//         }),
//       });
//       const data = await response.json();
//       console.log(data);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       // check if component is still mounted before updating state
//       if (!saving) return;
//       setSaving(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Add new pet information.</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Pet name"
//         onChangeText={(text) => setPetname(text)}
//         value={petname}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Gender"
//         onChangeText={(text) => setGender(text)}
//         value={gender}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Weight"
//         onChangeText={(text) => setWeight(text)}
//         value={weight}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Birth date"
//         onChangeText={(text) => setBirth(text)}
//         value={birth}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Kind"
//         onChangeText={(text) => setKind(text)}
//         value={kind}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="User ID"
//         onChangeText={() => {}}
//         value={uid}
//         editable={false}
//       />
//       <Button title="Save pet information" onPress={savePet} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 16,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 4,
//     padding: 8,
//     margin: 8,
//     width: "80%",
//     maxWidth: 400,
//   },
// });

// export default HomeScreen;
import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TextInput, Button, ScrollView, TouchableOpacity } from "react-native";
import { useUserContext } from "../../contexts/UserContext";
import { Calendar } from "react-native-calendars";

function HomeScreen() {
  const [petname, setPetname] = useState("");
  const [gender, setGender] = useState("");
  const [weight, setWeight] = useState("");
  const [birth, setBirth] = useState("");
  const [kind, setKind] = useState("");
  const [saving, setSaving] = useState(false);
  const [petInfo, setPetInfo] = useState(null);
  const { user } = useUserContext();
  const uid = user["id"];
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    return () => {
      // cleanup function
      setSaving(false); // cancel saving if component unmounts
    };
  }, []);

  useEffect(() => {
    // GET request to retrieve pet information for the user
    const fetchPetInfo = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:4000/pet?uid=${uid}`);
        const data = await response.json();
        setPetInfo(data); // Assuming there is only one pet per user
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPetInfo();
  }, [uid]);

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
          id: uid,
          gender,
          weight,
          birth,
          kind,
        }),
      });
      const data = await response.json();
      console.log(data);
      setPetInfo(data);
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
      <ScrollView horizontal={true} contentContainerStyle={styles.scrollViewContent}>
        {petInfo && petInfo.map((pet, index) => (
          <View key={index}>
            <Text style={styles.subtitle}></Text>
            <Text>Name: {pet.petname}</Text>
            <Text>Gender: {pet.gender}</Text>
            <Text>Weight: {pet.weight}</Text>
            <Text>Birth date: {pet.birth}</Text>
            <Text>Kind: {pet.kind}</Text>
          </View>
        ))}
      </ScrollView>
      {showModal && (
        <View style={styles.modalBackground}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Add new pet</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Pet name"
              onChangeText={(text) => setPetname(text)}
              value={petname}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Gender"
              onChangeText={(text) => setGender(text)}
              value={gender}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Weight"
              onChangeText={(text) => setWeight(text)}
              value={weight}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Birth date"
              onChangeText={(text) => setBirth(text)}
              value={birth}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Kind"
              onChangeText={(text) => setKind(text)}
              value={kind}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="User ID"
              onChangeText={() => {}}
              value={uid}
              editable={false}
            />
            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                onPress={() => setShowModal(false)}
                color="gray"
              />
              <Button title="Save" onPress={savePet} />
            </View>
          </View>
        </View>
      )}
      <TouchableOpacity style={styles.addButton} onPress={() => setShowModal(true)}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  scrollViewContent: {
    flexDirection: "row",
  },
  input: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: "80%",
  },
  subtitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  errorText: {
    color: "red",
    marginTop: 5,
  },
  saving: {
    marginTop: 10,
  },
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#2196F3",
    position: "absolute",
    bottom: 20,
    right: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 24,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 20,
    width: "80%",
  },
  modalTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: "100%",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
  },
  modalButton: {
    marginLeft: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default HomeScreen;