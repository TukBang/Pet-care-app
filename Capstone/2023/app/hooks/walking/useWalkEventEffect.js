import { useEffect } from "react";
import events from "../../lib/events";

//업데이트 새로고침을 하기 위한 events를 여기에서 선언해서 사용
//사용시 events.emit('refresh') 등과 같이 사용

export default function useWalkEventEffect({ onerefresh,refresh, enabled }) {
  useEffect(() => {
    if (!enabled) {
      return;
    }
    events.addListener("OneWalkrefresh", onerefresh);
    events.addListener("Walkrefresh", refresh);
    // events.addListener("removeCal", removeCal);
    // events.addListener("updateCal", updateCal);
    return () => {
      events.removeListener("Walkrefresh", refresh);
      // events.removeListener("removeCal", removeCal);
      // events.removeListener("updateCal", updateCal);
    };
  }, [onerefresh, refresh, enabled]);
}
