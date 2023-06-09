import React, { useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

function Banner () {
    const navigation = useNavigation();
    
    const onPressConsult = () => {
        navigation.navigate("ChatBot")
    }

    return (
        <>
            <Text style={styles.titleText}>챗봇</Text>
            <View style={styles.banner}>
                <Text style={styles.bannerText}>ChatBot 체험해보기</Text>
                <Text style={styles.bannerText}>처음이신가요?</Text>
                <TouchableOpacity onPress={() => onPressConsult()}>
                    <View style={styles.tutorialButton}>
                        <Text style={styles.tutorialText}>알아보기</Text>
                    </View>
                </TouchableOpacity>
                <Icon style={styles.iconImage} name='chat' size={100} />
            </View>
        </>

)};

const styles = StyleSheet.create({
    banner: {
        backgroundColor: '#FFFAF3',
        borderRadius: 10,
        width: '100%',
        height: '12%',
        padding: 10,
        alignSelf: 'center',
        marginBottom: 25,
        elevation: 7,
    },
    bannerText: {
        color: 'black',
        fontSize: 18,
        // lineHeight: '100%'
    },
    tutorialButton: {
        //position: 'absolute',
        top: 35,
        //left: 10,
        backgroundColor: 'white',
        alignItems: 'center',
        paddingHorizontal: 5,
        paddingVertical: 7,
        borderRadius: 15,
        elevation: 1,
    },  
    tutorialText: {
        fontWeight: "bold",
        // color: 'white',
        // flex: 1,
        fontSize: 15,
    },
    titleText: {
        color: "black",
        fontWeight: "bold",
        paddingTop: 20,
        paddingBottom: 10,
        fontSize: 25,
    },
    iconImage: {
        position: 'absolute',
        alignSelf: 'flex-end',
        color: '#FFDFD4',
        // justifyContent: 'center',
        // width: 50,
        // height: 50,
    }
})

export default Banner;