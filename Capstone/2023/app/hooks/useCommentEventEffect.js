import { useEffect } from "react";
import events from "../lib/events";

//업데이트 새로고침을 하기 위한 events를 여기에서 선언해서 사용
//사용시 events.emit('refreshComment') 등과 같이 사용

export default function useCommentEventEffect({
  refreshComment,
  removeComment,
  updateComment,
  enabled,
}) {
  useEffect(() => {
    if (!enabled) {
      return;
    }
    events.addListener("refreshComment", refreshComment);
    events.addListener("removeComment", removeComment);
    events.addListener("updateComment", updateComment);
    return () => {
      events.removeListener("refreshComment", refreshComment);
      events.removeListener("removeComment", removeComment);
      events.removeListener("updateComment", updateComment);
    };
  }, [refreshComment, removeComment, updateComment, enabled]);
}
