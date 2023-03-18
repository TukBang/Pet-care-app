import { useNavigation } from '@react-navigation/native';
import React, {useState} from 'react';
import {Platform, Pressable, StyleSheet,Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import TransparentCircleButton from './TransparentCircleButton';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import format from 'date-fns/format';
import ko from 'date-fns/locale';

function WriteHeader({onSave, onAskRemove, isEditing, date, onChangeDate}) {
    const navigation = useNavigation();
    const onGoBack = () => {
        navigation.pop();
    };

    const [mode, setMode] = useState('date');
    const [visible, setVisible] = useState(false);

    const onPressDate = () => {
        setMode('date');
        setVisible(true);
    };

    const onPressTime = () => {
        setMode('time');
        setVisible(true);
    };

    const onConfirm = (selectedDate) => {
        setVisible(false);
        onChangeDate(selectedDate);
    };

    const onCancel = () => {
        setVisible(false);
    };

    return (
        <View style={styles.block}>
            <View style={styles.iconButtonWrapper}>
                <TransparentCircleButton
                    onPress={onGoBack}
                    name="arrow-back"
                    color="#424242"
                />
            </View>
            <View style={styles.buttons}>
                {isEditing && (
                    <TransparentCircleButton
                            name="delete-forever"
                            color="#ef5350"
                            hasMarginRight
                            onPress={onAskRemove}
                    />
                )}
                <TransparentCircleButton name="check" onPress={onSave}
                    color="#009698"
                />
            </View>
            <View style={styles.center}>
                <Pressable onPress={onPressDate}>
                    <Text style={styles.Text}>
                        {format(new Date(date),'PPP', {
                            locale: ko,
                        })}
                    </Text>
                </Pressable>
                <View style={styles.separator} />
                <Pressable onPress={onPressTime}>
                    <Text style={styles.Text}>{format(new Date(date), 'p', {locale: ko})}</Text>
                </Pressable>
            </View>
            <DateTimePickerModal
              isVisible={visible}
              mode={mode}
              onConfirm={onConfirm}
              onCancel={onCancel}
              date={date}
              textColor="white"
              />
        </View>
    )
}

const styles = StyleSheet.create({
    block: {
        height: 48,
        paddingHorizontal: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    buttons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    center: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: -1,
        flexDirection: 'row',
    },
    separator: {
        width: 8,
    },
    Text: {
        color: 'black'
    }

});

export default WriteHeader;