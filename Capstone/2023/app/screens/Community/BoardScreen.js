import React, { useMemo, useState, useCallback, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ScrollView,
  windowHeight,
  Alert,
} from "react-native";
import { Dimensions } from 'react-native';

import { useUserContext } from "../../contexts/UserContext";
import usePosts from "../../hooks/posts/usePosts";
import { getComments, createComment } from "../../lib/comment";
import useComments from "../../hooks/comments/useComments";
import { RefreshControl } from "react-native";
import events from "../../lib/events";
import CommentCard from "../../components/Community/CommentCard";
import DetailPostCard from "../../components/Community/DetailPostCard";
import LinearGradient from "react-native-linear-gradient";

// CommunityScreen 에서 게시글을 클릭하면 나오는 화면
// PostCard의 navigation.push 를 통해서 온다

function BoardScreen({ route }) {
  // route에서 post에 대한 파라미터를 불러온다.
  const { post_param } = route.params;
  const { user: me } = useUserContext();
  //me.id ( 현재 로그인 되어있는 세션) 와 user.id (게시글의 주인)
  //을 비교하여 isMyPost 에 내 게시물인지 bool 형태로 저장

  //------------------------댓글 관련------------------------//

  // postId 에 따라 댓글을 가져오기 위한 filteredComments 변수
  const [filteredComments, setFilteredComments] = useState(null);

  //업로드할 댓글을 담고 있는 변수
  const [txt, setTxt] = useState("");

  //useComment에서 가져온 함수들
  const {
    comments,
    noMoreComment,
    refreshingComment,
    onLoadMoreComments,
    onRefreshComment,
    removeComment,
  } = useComments();

  //필터를 통해 같은 postId를 가지고 있는 댓글만 표기
  useEffect(() => {
    if (comments) {
      setFilteredComments(comments.filter((comment) => comment.postId === post_param.id));
    }
  }, [post_param.id, comments]);

  // 작성 버튼 onPress
  const onSubmit = useCallback(async () => {
    const profanityList = ['18년', '18놈', '18새끼', 'ㄱㅐㅅㅐㄲl', 'ㄱㅐㅈㅏ', 
    '가슴만져', '가슴빨아', '가슴빨어', '가슴조물락', '가슴주물럭', '가슴쪼물딱', 
    '가슴쪼물락', '가슴핧아', '가슴핧어', '강간', '개가튼년', '개가튼뇬', '개같은년', 
    '개걸레', '개고치', '개너미', '개넘', '개년', '개놈', '개늠', '개떡', '개라슥', 
    '개보지', '개부달', '개부랄', '개불랄', '개붕알', '개새', '개세', '개쓰래기', 
    '개쓰레기', '개씁년', '개씁블', '개씁자지', '개씨발', '개씨블', '개자식', 
    '개자지', '개잡년', '개젓가튼넘', '개좆', '개지랄', '개후라년', '개후라들놈', 
    '개후라새끼', '걔잡년', '거시기', '걸래년', '걸레같은년', '걸레년', '걸레핀년', 
    '게부럴', '게세끼', '게새끼', '게늠', '게자식', '게지랄놈', '고환', '귀두', '깨쌔끼', 
    '난자마셔', '난자먹어', '난자핧아', '내꺼빨아', '내꺼핧아', '내버지', '내자지', '내잠지', 
    '내조지', '너거애비', '노옴', '누나강간', '니기미', '니뿡', '니뽕', '니씨브랄', '니아범', 
    '니아비', '니애미', '니애뷔', '니애비', '니할애비', '닝기미', '닌기미', '니미', '닳은년', 
    '덜은새끼', '돈새끼', '돌으년', '돌은넘', '돌은새끼', '동생강간', '동성애자', '딸딸이', 
    '똥구녁', '똥꾸뇽', '똥구뇽', '띠발뇬', '띠팔', '띠펄', '띠벌', '띠벨', '막간년', '막대쑤셔줘', 
    '막대핧아줘', '맛간년', '맛없는년', '맛이간년', '미친구녕', '미친구멍', '미친넘', '미친년', 
    '미친놈', '미친눔', '미친새끼', '미친쇄리', '미친쇠리', '미친쉐이', '미친씨부랄', '미튄', '미티넘', 
    '미틴', '미틴넘', '미틴년', '미틴놈', '미틴것', '백보지', '버따리자지', '버지구녕', '버지구멍', 
    '버지냄새', '버지따먹기', '버지뚫어', '버지뜨더', '버지물마셔', '버지벌려', '버지벌료', '버지빨아', 
    '버지빨어', '버지썰어', '버지쑤셔', '버지털', '버지핧아', '버짓물', '버짓물마셔', '벌창같은년', 
    '벵신', '병닥', '병딱', '병신', '보쥐', '보지', '보지핧어', '보짓물', '보짓물마셔', '봉알', 
    '부랄', '불알', '붕알', '붜지', '뷩딱', '븅쉰', '븅신', '빙띤', '빙신', '빠가십새', 
    '빠가씹새', '빠구리', '빠굴이', '뻑큐', '뽕알', '뽀지', '뼝신', '사까시', '상년', '새꺄', 
    '새뀌', '새끼', '색갸', '색끼', '색스', '색키', '샤발', '서버', '써글', '써글년', '성교', 
    '성폭행', '세꺄', '세끼', '섹스', '섹스하자', '섹스해', '섹쓰', '섹히', '수셔', '쑤셔', '쉐끼', 
    '쉑갸', '쉑쓰', '쉬발', '쉬방', '쉬밸년', '쉬벌', '쉬불', '쉬붕', '쉬빨', '쉬이발', '쉬이방', 
    '쉬이벌', '쉬이불', '쉬이붕', '쉬이빨', '쉬이팔', '쉬이펄', '쉬이풀', '쉬팔', '쉬펄', '쉬풀', '쉽쌔', 
    '시댕이', '시발', '시발년', '시발놈', '시발새끼', '시방새', '시밸', '시벌', '시불', '시붕', '시이발', '시이벌', '시이불', 
    '시이붕', '시이팔', '시이펄', '시이풀', '시팍새끼', '시팔', '시팔넘', '시팔년', '시팔놈', '시팔새끼', '시펄', '실프', '십8', 
    '십때끼', '십떼끼', '십버지', '십부랄', '십부럴', '십새', '십세이', '십셰리', '십쉐', '십자석', '십자슥', '십지랄', '십창녀', 
    '십창', '십탱', '십탱구리', '십탱굴이', '십팔새끼', 'ㅆㅂ', 'ㅆㅂㄹㅁ', 'ㅆㅂㄻ', 'ㅆㅣ', '쌍넘', '쌍년', '쌍놈', '쌍눔', '쌍보지', 
    '쌔끼', '쌔리', '쌕스', '쌕쓰', '썅년', '썅놈', '썅뇬', '썅늠', '쓉새', '쓰바새끼', '쓰브랄쉽세', '씌발', '씌팔', 
    '씨가랭넘', '씨가랭년', '씨가랭놈', '씨발', '씨발년', '씨발롬', '씨발병신', '씨방새', '씨방세', '씨밸', '씨뱅가리',
    '씨벌', '씨벌년', '씨벌쉐이', '씨부랄', '씨부럴', '씨불', '씨불알', '씨붕', '씨브럴', '씨블', '씨블년', '씨븡새끼', 
    '씨빨', '씨이발', '씨이벌', '씨이불', '씨이붕', '씨이팔', '씨파넘', '씨팍새끼', '씨팍세끼', '씨팔', '씨펄', '씨퐁넘', '씨퐁뇬', 
    '씨퐁보지', '씨퐁자지', '씹년', '씹물', '씹미랄', '씹버지', '씹보지', '씹부랄', '씹브랄', '씹빵구', '씹뽀지', '씹새', '씹새끼', 
    '씹세', '씹쌔끼', '씹자석', '씹자슥', '씹자지', '씹지랄', '씹창', '씹창녀', '씹탱', '씹탱굴이', '씹탱이', '씹팔', '아가리', '애무', 
    '애미', '애미랄', '애미보지', '애미씨뱅', '애미자지', '애미잡년', '애미좃물', '애비', '애자', '양아치', '어미강간', '어미따먹자', 
    '어미쑤시자', '영자', '엄창', '에미', '에비', '염병', '염병할', '염뵹', '엿먹어라', '오랄', '오르가즘', 
    '왕버지', '왕자지', '왕잠지', '왕털버지', '왕털보지', '왕털자지', '왕털잠지', '우미쑤셔', '유두', '유두빨어', '유두핧어', '유방', 
    '유방만져', '유방빨아', '유방주물럭', '유방쪼물딱', '유방쪼물럭', '유방핧아', '유방핧어', '육갑', '이년', '자기핧아', '자지', 
    '자지구녕', '자지구멍', '자지꽂아', '자지넣자', '자지뜨더', '자지뜯어', '자지박어', '자지빨아', '자지빨아줘', '자지빨어', '자지쑤셔', 
    '자지쓰레기', '자지정개', '자지짤라', '자지털', '자지핧아', '자지핧아줘', '자지핧어', '작은보지', '잠지', '잠지뚫어', '잠지물마셔', '잠지털', 
    '잠짓물마셔', '잡년', '잡놈', '저년', '점물', '젓가튼', '젓가튼쉐이', '젓같내', '젓같은', '젓까', '젓나', '젓냄새', '젓대가리', '젓떠', '젓마무리',
    '젓만이', '젓물', '젓물냄새', '젓밥', '정액마셔', '정액먹어', '정액발사', '정액짜', '정액핧아', '정자마셔', '정자먹어', '정자핧아', '젖같은', 
    '젖까', '젖밥', '젖탱이', '조개넓은년', '조개따조', '조개마셔줘', '조개벌려조', '조개속물', '조개쑤셔줘', '조개핧아줘', '조까', '조또', '족같내',
    '족까', '족까내', '존나', '존나게', '존니', '졸라', '좀마니', '좀물', '좀쓰레기', '좁빠라라', '좃가튼뇬', '좃간년', '좃까', '좃까리', '좃깟네', 
    '좃냄새', '좃넘', '좃대가리', '좃도', '좃또', '좃만아', '좃만이', '좃만한것', '좃만한쉐이', '좃물', '좃물냄새', '좃보지', '좃부랄', '좃빠구리', 
    '좃빠네', '좃빠라라', '좃털', '좆같은놈', '좆같은새끼', '좆까', '좆까라', '좆나', '좆년', '좆도', '좆만아', '좆만한년', '좆만한놈', '좆만한새끼', 
    '좆먹어', '좆물', '좆밥', '좆빨아', '좆새끼', '좆털', '좋만한것', '주글년', '주길년', '쥐랄', '지랄', '지랼', '지럴', '지뢀', '쪼까튼', '쪼다', 
    '쪼다새끼', '찌랄', '찌질이', '창남', '창녀', '창녀버지', '창년', '처먹고', '처먹을', '쳐먹고', '쳐쑤셔박어', '촌씨브라리', '촌씨브랑이', '촌씨브랭이',
    '크리토리스', '큰보지', '클리토리스', '트랜스젠더', '페니스', '항문수셔', '항문쑤셔', '허덥', '허버리년', '허벌년', '허벌보지', '허벌자식', '허벌자지', 
    '허접', '허젚', '허졉', '허좁', '헐렁보지', '혀로보지핧기', '호냥년', '호로', '호로새끼', '호로자슥', '호로자식', '호로짜식', '호루자슥', '호모', 
    '호졉', '호좁', '후라덜넘', '후장', '후장꽂아', '후장뚫어', '흐접', '흐젚', '흐졉', 'bitch', 'fuck', 'fuckyou', 'penis', 'pennis', 'pussy', 'sex']; // 욕설 및 불용어 목록
    const containsProfanity = profanityList.some(word => txt.includes(word));
    if (containsProfanity) {
      Alert.alert("실패", "욕설 또는 비속어를 포함하고 있습니다.");
      return;
    }
    if (txt === "" || txt === null) {
      Alert.alert("실패", "내용을 입력해주세요.");
      return;
    }
    await createComment({
      txt: txt,
      postId: post_param.id,
      user: me,
      // photoURL: me.photoURL,
    });
    setTxt("");
    events.emit("refreshComment");
  });

  //------------------------댓글 관련------------------------//

  //------------------------게시글 관련------------------------//

  // post.id 에 따라 댓글을 가져오기 위한 filteredPosts 변수
  const [filteredPosts, setFilteredPosts] = useState([]);
  const { posts, noMorePost, refreshing, onLoadMore, onRefresh, removePost } = usePosts('전체',false);
  const [ board, setBoard ] = useState({
    createdAt: "",
    description: "",
    title: "",
    category: "",
    id: "",
    user: "",
    photoURL: null,
    // isExpert: null,
  })
  // const [description, setDescription] = useState("");
  // const DetailPostCard = ({ description }) => {
  //   return <Text>{description}</Text>;
  // };

  // 화면의 높이 가져오기
  const windowHeight = Dimensions.get('window').height;

  // useEffect로 filteredPost에 post.id 에 따라 post 저장
  useEffect(() => {
    if (posts) {
      setFilteredPosts(posts.filter((post) => post.id === post_param.id));
      console.log(filteredPosts)  
    }
  }, [post_param, posts]);

  // filteredPosts 배열이 업데이트되었을 때 board 상태를 업데이트
  useEffect(() => {
    if (filteredPosts.length > 0) {
      const post = filteredPosts[0]; // 첫 번째 요소를 사용하거나 필요에 따라 적절한 방식으로 선택
      setBoard({
        createdAt: post.createdAt,
        description: post.description,
        title: post.title,
        category: post.category,
        id: post.id,
        user: post.user,
        photoURL: post.photoURL,
      });
      // setDescription(post.description);
    }
  }, [filteredPosts]);


  //------------------------게시글 관련------------------------//


  const onCombinedRefresh = useCallback(() => {
    onRefresh();
    onRefreshComment();
  }, []);

  return (
    <LinearGradient
      colors={['#F6FAFF', '#F6FAFF']}
      style={{flex : 1}}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
    <View style={{ flex: 1 }}>
      <ScrollView 
        refreshControl={<RefreshControl onRefresh={onCombinedRefresh} refreshing={refreshing || refreshingComment} />}
      >
        <View style={styles.block}>
          {/* 게시물 공간 */}
          <DetailPostCard {...board} />
         
          <View style={{width: "100%"}}>
            <View style={[styles.border]} />
          </View>

          {/* 댓글 목록 및 업데이트 */}

          <View style={styles.commentContainer}>
            {filteredComments !== null && filteredComments.map((comment) => (
              <CommentCard
                key={comment.id}
                createdAt={comment.createdAt}
                txt={comment.txt}
                postId={comment.postId}
                user={comment.user}
                id={comment.id}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* 댓글 입력 텍스트 박스 */}
      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="  댓글을 입력하세요."
          placeholderTextColor="#707D7F"
          value={txt}
          onChangeText={(value) => setTxt(value)}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={onSubmit} 
        >
          <Text style={styles.buttonText}>작성</Text>
        </TouchableOpacity>
      </View>
    </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  block: {
    margin: 10,
  },

  paddingBlock: {
    paddingHorizontal: 0,
  },

  border: {
    height: 2,
    backgroundColor: "#C0CDDF",
    marginTop: 20,
    marginBottom: 10,
  },

  commentInputContainer: {
    flexDirection: "row",
    width: "100%",
    marginRight: 10,

    paddingHorizontal: 10,
    paddingVertical: 10,
  },

  commentInput: {
    width: "84%",
    marginRight: "1%",
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "#C0CDDF",
    backgroundColor: "#C0CDDF",
  },

  button: {
    // 정렬
    justifyContent: "center",
    alignItems: "center",
    width: "15%",

    // 모양
    borderRadius: 5,

    // 배경색
    backgroundColor: "#3A8DF8",
  },

  // 버튼 텍스트
  buttonText: {
    fontSize: 15,
    color: "#FFFFFF",
  },
});

export default BoardScreen;