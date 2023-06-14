import { useEffect, useState, useCallback } from "react";
import { getNewerCal, getOlderCal, getCal, PAGE_SIZE } from "../../lib/calendar";
import { useUserContext } from "../../contexts/UserContext";
import useCalEventEffect from "./useCalEventEffect";

// 비슷한 함수의 재사용을 막기위해 정리

export default function usecal(userId) {
  const [cal, setCal] = useState(null);
  const [noMoreCal, setNoMoreCal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useUserContext();

  // const onLoadMore = async () => {
  //   if (noMoreCal || !cal || cal.length < PAGE_SIZE) {
  //     return;
  //   }
  //   const lastCal = cal[cal.length - 1];
  //   const oldercal = await getOlderCal(lastCal.id, userId);
  //   if (oldercal.length < PAGE_SIZE) {
  //     setNoMoreCal(true);
  //   }
  //   setCal(cal.concat(oldercal));
  // };

  //새로고침
  const onRefresh = useCallback(async () => {
    if (!cal || cal.length === 0 || refreshing) {
      return;
    }
    const firstCal = cal[0];
    setRefreshing(true);
    const newerCal = await getNewerCal(firstCal.id, userId);
    setRefreshing(false);
    if (newerCal.length === 0) {
      return;
    }
    setCal(newerCal.concat(cal));
  }, [cal, userId, refreshing]);

  useEffect(() => {
    getCal({ userId }).then((_cal) => {
      setCal(_cal);
      // if (_cal.length < PAGE_SIZE) {
      //   setNoMoreCal(true);
      // }
    });
  }, [userId]);

  useCalEventEffect({
    refresh: onRefresh,
    enabled: !userId || userId === user.id,
  });

  return {
    cal,
    // noMoreCal,
    refreshing,
    // onLoadMore,
    onRefresh,
  };
}
