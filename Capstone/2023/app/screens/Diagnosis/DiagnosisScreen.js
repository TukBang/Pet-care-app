import React, { useState } from "react";
import { Button, StyleSheet, useAnimatedValue, View } from "react-native";
import CheckList from "../../components/Diagnosis/CheckList";
import selectImage from "../../components/Diagnosis/SelectImage";

function DiagnosisScreen() {

    // const [imageUri, setImageUri] = useState(null);

    // const handleImageSelect = async () => {
    //     const result = await selectImage();
    //     if (result) {
    //     setImageUri(result.uri);
    //     }
    // };

    return (
        <View style={styles.block}>
            {/* {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />} */}
            <CheckList style={styles.checklist} />
        </View>
    );
}

const styles = StyleSheet.create({
    block: {
        flex:1
    },
    image: {
        width: 200,
        height: 200,
      },
});

export default DiagnosisScreen;