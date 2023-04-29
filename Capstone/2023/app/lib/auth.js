import auth from "@react-native-firebase/auth";

// firebase인증을 위한 함수

//로그인
export function signIn({ email, password }) {
  return auth().signInWithEmailAndPassword(email, password);
}

//회원가입
export function signUp({ email, password }) {
  return auth().createUserWithEmailAndPassword(email, password);
}

//로그인 상태 반환
//비로그인 시 null 반환, 로그인 시 프로필 설정 유효검사 및 사용자정보
// userContext에 저장
export function subscribeAuth(callback) {
  return auth().onAuthStateChanged(callback);
}

//로그아웃
export function signOut() {
  return auth().signOut();
}
