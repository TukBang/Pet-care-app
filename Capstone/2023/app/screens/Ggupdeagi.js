import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
// import { useUserContext } from "../../contexts/UserContext";
import { useNavigation } from "@react-navigation/native";

function Ggupdeagi() {
    const navigation = useNavigation();
    return (
        <View>
            <View style={styles.block}>
                <Text style={styles.header}>가까운 일정</Text>
                <TouchableOpacity style={[styles.sentence, {paddingRight: 15,letterSpacing: 1}]} activeOpacity={1} onPress={() => navigation.navigate('CalendarScreen')}>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={styles.sentence}>건강 검진 가기</Text>
                        <Text style={[styles.sentence, {marginLeft: 'auto',paddingRight: 15,letterSpacing: 3}]}>D-7</Text>
                    </View>
                    <Text style={styles.detail}>오전 11:00~</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.block}>
                <Text style={styles.header}>오늘의 산책 : 아직 하지 않았어요</Text>
                    <View style={{ flexDirection: 'row' }}>
                        {/* <Text style={styles.sentence}>건강 검진 가기</Text> */}
                        <TouchableOpacity style={[styles.sentence, {marginLeft: 'auto',paddingRight: 15,letterSpacing: 1}]} activeOpacity={1} onPress={() => navigation.navigate('WalkingScreen')}>
                            <Text style={styles.detail} >하러가기 &gt;&gt;</Text>
                        </TouchableOpacity>
                    </View>
                    {/* <Text style={styles.detail}></Text> */}
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    block: {
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        borderRadius: 14,
        margin: 5,
        opacity: 1,
    },
    header: {
      color: 'black',
      fontWeight: 'bold',
      paddingLeft:16,
      paddingTop: 16,
      paddingBottom: 10,
      fontSize: 25,
    },
    detail: {
        color: 'gray',
        paddingLeft: 25,
        fontSize: 15,
        paddingBottom: 10,
        
    },
    sentence: {
        color: 'black',
        paddingLeft: 10,
        fontSize: 25,
    }
});

export default Ggupdeagi;