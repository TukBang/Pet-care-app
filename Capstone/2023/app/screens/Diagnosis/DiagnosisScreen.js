import React from "react";
import { Button, StyleSheet, View } from "react-native";
import CheckList from "../../components/Diagnosis/CheckList";

function DiagnosisScreen() {
    return (
        <View style={styles.block}>
            <CheckList />
            <Button title='챗봇한테 물어보기' />
        </View>
    );
}

const styles = StyleSheet.create({
    block: {
        flex:1
    },
});

export default DiagnosisScreen;