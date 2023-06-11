import { useEffect } from "react";
import events from "../lib/events";

//업데이트 새로고침을 하기 위한 events를 여기에서 선언해서 사용
//사용시 events.emit('refresh') 등과 같이 사용

export default function useDiagEventEffect({ refresh, enabled }) {
  useEffect(() => {
    if (!enabled) {
      return;
    }
    events.addListener("Diagrefresh", refresh);
    // events.addListener("removeDiag", removeDiag);
    // events.addListener("updateDiag", updateDiag);
    return () => {
      events.removeListener("Diagrefresh", refresh);
      // events.removeListener("removeDiag", removeDiag);
      // events.removeListener("updateDiag", updateDiag);
    };
  }, [refresh, enabled]);
}
