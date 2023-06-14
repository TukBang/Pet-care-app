import { useEffect } from "react";
import events from "../../lib/events";

//업데이트 새로고침을 하기 위한 events를 여기에서 선언해서 사용
//사용시 events.emit('refresh') 등과 같이 사용

export default function useCalEventEffect({ refresh, enabled }) {
  useEffect(() => {
    if (!enabled) {
      return;
    }
    events.addListener("Calrefresh", refresh);
    // events.addListener("removeCal", removeCal);
    // events.addListener("updateCal", updateCal);
    return () => {
      events.removeListener("Calrefresh", refresh);
      // events.removeListener("removeCal", removeCal);
      // events.removeListener("updateCal", updateCal);
    };
  }, [refresh, enabled]);
}
