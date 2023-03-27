import React, { useState } from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import CheckBox from '@react-native-community/checkbox';

function CheckList() {
  const [data, setData] = useState([
    { id: 1, text: '숙', checked: false },
    { id: 2, text: '지', checked: false },
    { id: 3, text: '했', checked: false },
    { id: 4, text: '다', checked: false },
    // { id: 5, text: '항목 5', checked: false },
  ]);

  const handleCheck = (id) => {
    setData(
      data.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const isAllChecked = data.every((item) => item.checked);

  return (
    <View>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <CheckBox
              value={item.checked}
              onValueChange={() => handleCheck(item.id)}
            />
            <Text style={{ marginLeft: 10 }}>{item.text}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
      <Button title="활성화" disabled={!isAllChecked} />
    </View>
  );
}

export default CheckList;