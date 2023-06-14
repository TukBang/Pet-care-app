import { useEffect } from "react";
import events from "../../lib/events";

//업데이트 새로고침을 하기 위한 events를 여기에서 선언해서 사용
//사용시 events.emit('refresh') 등과 같이 사용

export default function usePostsEventEffect({ refresh, removePost, updatePost, enabled }) {
  useEffect(() => {
    if (!enabled) {
      return;
    }
    events.addListener("refresh", refresh);
    events.addListener("removePost", removePost);
    events.addListener("updatePost", updatePost);
    return () => {
      events.removeListener("refresh", refresh);
      events.removeListener("removePost", removePost);
      events.removeListener("updatePost", updatePost);
    };
  }, [refresh, removePost, updatePost, enabled]);
}
