// import React from "react";
// import { StyleSheet, View } from "react-native";

// function CommunityScreen() {
//     return <View style={styles.block} />;
// }

// const styles = StyleSheet.create({
//     block: {},
// });

// export default CommunityScreen;



import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from "@react-native-community/async-storage";

const CommunityScreen = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [memos, setMemos] = useState([]);
  const [newMemo, setNewMemo] = useState('');

  const addMemo = async (memo, date) => {
    try {
      const savedMemos = await AsyncStorage.getItem('memos');
      const memos = savedMemos ? JSON.parse(savedMemos) : {};

      if (!memos[date]) {
        memos[date] = [];
      }
      memos[date].push(memo);

      await AsyncStorage.setItem('memos', JSON.stringify(memos));
    } catch (e) {
      console.error(e);
    }
  };

  const getMemos = async (date) => {
    try {
      const savedMemos = await AsyncStorage.getItem('memos');
      const memos = savedMemos ? JSON.parse(savedMemos) : {};

      return memos[date] || [];
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  const clearMemos = async () => {
    try {
      await AsyncStorage.removeItem('memos');
    } catch (e) {
      console.error(e);
    }
  };

  const onDayPress = async (day) => {
    setSelectedDate(day.dateString);

    const memos = await getMemos(day.dateString);
    setMemos(memos);
  };

  const addMemoButtonPressed = async () => {
    if (!selectedDate) return;

    await addMemo(newMemo, selectedDate);
    const memos = await getMemos(selectedDate);
    setMemos(memos);
    setNewMemo('');
  };

  return (
    <View style={styles.container}>
      <Calendar onDayPress={onDayPress} />
      <Text style={styles.dateText}>{selectedDate}</Text>
      <TextInput
        style={styles.memoInput}
        multiline={true}
        onChangeText={(text) => setNewMemo(text)}
        value={newMemo}
      />
      <TouchableOpacity style={styles.addButton} onPress={addMemoButtonPressed}>
        <Text style={styles.addButtonText}>Add Memo</Text>
      </TouchableOpacity>
      <View style={styles.memoList}>
        {memos.map((memo, index) => (
          <Text style={styles.memoItem} key={index}>
            {memo}
          </Text>
        ))}
      </View>
      <TouchableOpacity style={styles.clearButton} onPress={clearMemos}>
        <Text style={styles.clearButtonText}>Clear Memos</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  dateText: {
    marginTop: 20,
    fontSize: 20,
  },
  memoInput: {
    width: '80%',
    height: 100,
    borderWidth: 1,
    borderColor: 'gray',
    marginTop: 20,
    padding: 10,
  },
  addButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  memoList: {
    marginTop: 20,
    width: '80%',
  },
  memoItem: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginTop: 10,
  },
  clearButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  clearButtonText: {
    color: 'white',
    fontSize: 16,
  },
};

export default CommunityScreen;