import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

const postsCollection = firestore().collection("posts");

//게시글을 만드는 함수
export function createPost({ user, category, photoURL, title, description }) {
  return postsCollection.add({
    user,
    category,
    photoURL,
    title,
    description,
    createdAt: firestore.FieldValue.serverTimestamp(),
  });
}
// page size 는 한페이지에 로드할 게시글의 개수
export const PAGE_SIZE = 15;

// 기본 게시글 표시
export async function getPosts(category, isExpert) {
  const currentUser = auth().currentUser;
  let query = postsCollection.orderBy("createdAt", "desc");
  console.log(currentUser)
  console.log(category)
  if (category === "내 게시물") {
    query = query.where("user.id", "==", currentUser.uid);
  }
  else if (category === "상담"){
    if (isExpert === true) {
      query = query.where("category", "==", category);
    }
    else {
      query = query.where("category", "==", category);
      query = query.where("user.id", "==", currentUser.uid);
    }
  }
  else if (category !== "전체") {
    query = query.where("category", "==", category);
  }
  const snapshot = await query.limit(PAGE_SIZE).get();
  const posts = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return posts;
}

// 이전 게시글 표시 - cursorDoc 이후의 글을 표기
export async function getOlderPosts(id, category, isExpert) {
  const currentUser = auth().currentUser;
  const cursorDoc = await postsCollection.doc(id).get();
  let query = postsCollection.orderBy("createdAt", "desc");
  
  if (category === "내 게시물") {
    query = query.where("user.id", "==", currentUser.uid);
  }
  else if (category === "상담"){
    if (isExpert === true) {
      query = query.where("category", "==", category);
    }
    else {
      query = query.where("category", "==", category);
      query = query.where("user.id", "==", currentUser.uid);
    }
  }
  else if (category !== "전체") {
    query = query.where("category", "==", category);
  }
  const snapshot = await query.startAfter(cursorDoc).limit(PAGE_SIZE).get();

  const posts = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return posts;
}

// 새로운 게시글 표시 - curseDoc 이전의 글을 표시
export async function getNewerPosts(id, category, isExpert) {
  const currentUser = auth().currentUser;
  const cursorDoc = await postsCollection.doc(id).get();
  let query = postsCollection.orderBy("createdAt", "desc");
  if (category === "내 게시물") {
    query = query.where("user.id", "==", currentUser.uid);
  }
  else if (category === "상담"){
    if (isExpert === true) {
      query = query.where("category", "==", category);
    }
    else {
      query = query.where("category", "==", category);
      query = query.where("user.id", "==", currentUser.uid);
    }
  }
  else if (category !== "전체") {
    query = query.where("category", "==", category);
  }
  const snapshot = await query.endBefore(cursorDoc).limit(PAGE_SIZE).get();

  const posts = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return posts;
}

//삭제 함수
export function removePost(id) {
  return postsCollection.doc(id).delete();
}

//업데이트 함수
export function updatePost({ id, title, description }) {
  return postsCollection.doc(id).update({
    title,
    description,
  });
}
