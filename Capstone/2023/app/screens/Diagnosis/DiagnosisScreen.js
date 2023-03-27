import React from "react";
import { StyleSheet, View } from "react-native";
import CheckList from "../../components/Diagnosis/CheckList";

function DiagnosisScreen() {
    return (
        <View style={styles.block}>
            <CheckList />
        </View>
    );
}

const styles = StyleSheet.create({
    block: {},
});

export default DiagnosisScreen;