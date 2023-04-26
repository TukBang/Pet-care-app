import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';

function CommentForm({txt, onPress}) {
  return (
    <View>
      <TextInput
        value={txt}
        onChangeText={(value) => setText(value)}
        placeholder="댓글을 입력하세요"
      />
      <Button onPress={onPress} title="작성" />
    </View>
  );
};

export default CommentForm;