import React, { useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

function Banner () {

    return (
    <View style={styles.banner}>
        <Text style={styles.bannerText}>Pet Care App 에 어서오세요!</Text>
        <Text style={styles.bannerText}>처음이신가요?</Text>
        <TouchableOpacity >
          <View style={styles.tutorialButton}>
            <Text style={styles.tutorialText}>알아보기</Text>
          </View>
        </TouchableOpacity>
        <Icon style={styles.iconImage} name='info-outline' size={100} />
      </View>
)};

const styles = StyleSheet.create({
    banner: {
        backgroundColor: '#827397',
        borderRadius: 10,
        width: '100%',
        // height: '20%',
        padding: 10,
        alignSelf: 'center',
        marginBottom: 25,
    },
    bannerText: {
        color: 'white',
        fontSize: 18,
        // lineHeight: '100%'
    },
    tutorialButton: {
        // flex: 1,
        width: '30%',
        backgroundColor: 'white',
        alignItems: 'center',
        margin: 10,
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 8,
    },
    tutorialText: {
        // color: 'white',
        // flex: 1,
        fontSize: 15,
    },
    titleText: {
        color: "black",
        fontWeight: "bold",
        paddingLeft: 16,
        paddingTop: 10,
        paddingBottom: 10,
        fontSize: 25,
    },
    iconImage: {
        position: 'absolute',
        alignSelf: 'flex-end',
        color: 'white',
        // justifyContent: 'center',
        // width: 50,
        // height: 50,
    }
})

export default Banner;