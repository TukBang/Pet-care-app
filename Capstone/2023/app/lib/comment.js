import firestore from '@react-native-firebase/firestore';

const CommentCollection = firestore().collection('comments');
export const PAGE_SIZE = 15;
export function createComment({user,postId, txt}) {
    return CommentCollection.add({
      user,
      postId,
      txt,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
  }

// 댓글 표시
export async function getComments() {
    const snapshot = await CommentCollection
      .orderBy('createdAt', 'desc')
      .limit(PAGE_SIZE)
      .get();
    const comments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return comments;
  }

  // 이전 게시글 표시 - cursorDoc 이후의 글을 표기
  export async function getOlderComments(id) {
    const cursorDoc = await CommentCollection.doc(id).get();
    const snapshot = await CommentCollection
      .orderBy('createdAt', 'desc')
      .startAfter(cursorDoc)
      .limit(PAGE_SIZE)
      .get();
  
    const comments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  
    return comments;
  }

// 새로운 게시글 표시 - curseDoc 이전의 글을 표시
  export async function getNewerComments(id) {
    const cursorDoc = await CommentCollection.doc(id).get();
    const snapshot = await CommentCollection
      .orderBy('createdAt', 'desc')
      .endBefore(cursorDoc)
      .limit(PAGE_SIZE)
      .get();
  
    const comments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  
    return comments;
  }

  //삭제 함수
  export function removeComment(id) {
    return CommentCollection.doc(id).delete();
  }

  export function updateComment({id, comment}) {
    return CommentCollection.doc(id).update({
      comment,
    });
  }