import React, { useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

function Banner () {
    const navigation = useNavigation();
    
    const bannerButtonText = "바로 가기";
    
    const onPressConsult = () => {
        navigation.navigate("ChatBot")
    }

    return (
        <>
            <View style={{
                flexDirection: 'row',
                alignItems: "flex-start",
                justifyContent: "center",
            }}>
                <Text style={styles.titleSign}>■ </Text>
                <Text style={styles.titleText}> 챗봇 </Text>
            </View>
            <View style={styles.banner}>
                <Text style={styles.bannerText}>Chatbot</Text>
                <Text style={styles.bannerText}>궁금증을 해결해보세요.</Text>
                <TouchableOpacity onPress={() => onPressConsult()}>
                    <View style={styles.tutorialButton}>
                        <Text style={styles.tutorialText}>{bannerButtonText}</Text>
                    </View>
                </TouchableOpacity>
                <Icon style={styles.iconImage} name='chat' size={100} />
            </View>
        </>
)};

const styles = StyleSheet.create({
    banner: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        width: '100%',
        // height: '12%',
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
        // top: 35,
        marginTop: 45,
        backgroundColor: "#3A8DF0",
        alignItems: 'center',
        paddingHorizontal: 5,
        paddingVertical: 7,
        borderRadius: 15,
        elevation: 4,
    },  

    tutorialText: {
        fontWeight: "bold",
        color: 'white',
        fontSize: 15,
    },

    titleSign: {
        paddingTop: 24,
        marginBottom: 10,
        fontSize: 15,
        color: "#3A8DF0",
    },

    titleText: {
        color: "black",
        fontWeight: "bold",
        paddingTop: 20,
        marginBottom: 10,
        fontSize: 20,
    },

    iconImage: {
        position: 'absolute',
        alignSelf: 'flex-end',
        top: 5,
        left: 268,        
        color: '#3A8DF0',
    }
})

export default Banner;