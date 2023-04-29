import AsyncStorage from "@react-native-community/async-storage";

const key = "logs";

// 저장하는 것을 가져오는데 사용하는 함수

const logsStorage = {
  async get() {
    try {
      const raw = await AsyncStorage.getItem(key);
      const parsed = JSON.parse(raw);
      return parsed;
    } catch (e) {
      throw new Error("로그를 로드하는데 실패했습니다.");
    }
  },
  async set(data) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      throw new Error("로그를 저장하는데 실패했습니다.");
    }
  },
};

export default logsStorage;
