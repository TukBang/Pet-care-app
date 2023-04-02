import DocumentPicker from 'react-native-document-picker';

const selectImage = async () => {
  try {
    const result = await DocumentPicker.pick({
      type: [DocumentPicker.types.images]
    });

    // 선택된 이미지 처리 로직
    console.log(
        'URI : ' + result.uri,
        'TYPE : ' + result.type,
        'NAME : ' + result.name,
        'SIZE : ' + result.size,
    );
    return result;
  } catch (error) {
    if (DocumentPicker.isCancel(error)) {
      // 사용자가 취소한 경우
    } else {
      // 에러 처리
      console.error(error);
      return null;
    }
  }
};

export default selectImage;