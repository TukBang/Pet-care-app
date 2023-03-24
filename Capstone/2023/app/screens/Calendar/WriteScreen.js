import { useNavigation } from "@react-navigation/native";
import React, {useState, useContext} from "react";
import {StyleSheet, View, KeyboardAvoidingView, Platform, Alert} from 'react-native'
import { SafeAreaView } from "react-native-safe-area-context";
import LogContext from "../../contexts/LogContext";

import WriteHeader from "../../components/Calendar/WriteHeader";
import WriteEditor from "../../components/Calendar/WriterEditor";

function WriteScreen({route}) {

    const log = route.params?.log;
    const selectedDate = route.params.selectedDate

    const [title, setTitle] = useState(log?.title ?? '');
    const [body, setBody] = useState(log?.body ?? '');
    const navigation = useNavigation();
    const [date, setDate] = useState(log ? new Date(log.date) : new Date());
    

    const {onCreate, onModify, onRemove} = useContext(LogContext);
    const onSave = ()=> {
        if (log) {
            onModify({
                id: log.id,
                date: date.toISOString(),
                title,
                body,
            });
        } else {
            onCreate({
                title,
                body,
                date: date.toISOString(),
                // date: selectedDate.toISOString(),
            });
        }
        navigation.pop();
    };

    const onAskRemove = () => {
        Alert.alert(
            '삭제',
            '정말로 삭제하시겠어요?',
            [
                {text: '취소', style: 'cancel'},
                {
                    text: '삭제',
                    onPress: () => {
                        onRemove(log?.id);
                        navigation.pop();
                    },
                    style: 'destructive',
                },
            ],
            {
                cancelable: true,
            },
        );
    };

    return(
        <SafeAreaView style={styles.block}>
            <KeyboardAvoidingView
              style={styles.avoidingView}
              behavior={Platform.OS==='ios'? 'padding' : undefined}>
                <WriteHeader onSave={onSave} 
                    onAskRemove={onAskRemove} 
                    isEditing={!!log}
                    date={date}
                    // date={selectedDate}

                    onChangeDate={setDate}
                    />
                <WriteEditor 
                  title={title}
                  body={body}
                  onChangeTitle={setTitle}
                  onChangeBody={setBody}
                />

            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    block: {
        flex: 1,
        backgroundColor: 'white',
    },
    avoidingView: {
        flex: 1,
    },
});

export default WriteScreen;