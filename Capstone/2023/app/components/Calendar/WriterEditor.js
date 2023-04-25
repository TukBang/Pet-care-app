import React, { useRef } from "react";
import { 
  View,
  StyleSheet,
  TextInput
} from "react-native";

function WriteEditor({title, body, onChangeTitle, onChangeBody}) {
  const bodyRef = useRef();

  let titlePlaceHolder = "제목"
  let bodyPlaceHolder = "메모"
  let placeholderTextColor = "#BCBCBC"

  return (
    <View style={styles.block}>
      {/* 제목 */}
      <TextInput
        style={styles.titleTextInput}
        placeholder={titlePlaceHolder}
        placeholderTextColor={placeholderTextColor}
        onChangeText={onChangeTitle}

        value={title}

        returnKeyType="next"
        onSubmitEditing={()=> {
          bodyRef.current.focus()
        }}
      />
      
      {/* 메모 */}
      <TextInput
        style={styles.bodyTextInput}
        placeholder={bodyPlaceHolder}
        placeholderTextColor={placeholderTextColor}
        onChangeText={onChangeBody}
                
        value={body}

        multiline={true}
        ref={bodyRef}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  block: {flex: 1, padding: 12},
  
  titleTextInput: {
    borderWidth: 2,
    borderRadius: 5,
    borderColor: "#CDCDCD",
    paddingVertical: 5,
    paddingHorizontal: 12,
    
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 15,
  },

  bodyTextInput: {
    textAlignVertical: "top",
    borderWidth: 2,
    borderRadius: 5,
    borderColor: "#CDCDCD",
    paddingVertical: 10,
    paddingHorizontal: 12,
    height: 400,
    
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default WriteEditor;