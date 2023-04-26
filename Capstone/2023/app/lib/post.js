import firestore from '@react-native-firebase/firestore';

const postsCollection = firestore().collection('posts');


export function createPost({user,category, photoURL, title, description}) {
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
  export async function getPosts() {
    const snapshot = await postsCollection
      .orderBy('createdAt', 'desc')
      .limit(PAGE_SIZE)
      .get();
    const posts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return posts;
  }
// 이전 게시글 표시 - cursorDoc 이후의 글을 표기
  export async function getOlderPosts(id) {
    const cursorDoc = await postsCollection.doc(id).get();
    const snapshot = await postsCollection
      .orderBy('createdAt', 'desc')
      .startAfter(cursorDoc)
      .limit(PAGE_SIZE)
      .get();
  
    const posts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  
    return posts;
  }

// 새로운 게시글 표시 - curseDoc 이전의 글을 표시
  export async function getNewerPosts(id) {
    const cursorDoc = await postsCollection.doc(id).get();
    const snapshot = await postsCollection
      .orderBy('createdAt', 'desc')
      .endBefore(cursorDoc)
      .limit(PAGE_SIZE)
      .get();
  
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

  export function updatePost({id, title,description}) {
    return postsCollection.doc(id).update({
      title,
      description,
    });
  }