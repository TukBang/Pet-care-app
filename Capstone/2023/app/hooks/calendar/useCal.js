import { useEffect, useState, useCallback } from "react";
import { getAllCalendarsByUser, getNextClosestCalendarByUser, getOneNewerCal } from "../../lib/calendar";
import { useUserContext } from "../../contexts/UserContext";
import useCalEventEffect from "./useCalEventEffect";

// 비슷한 함수의 재사용을 막기위해 정리

export default function useCal(userId) {
  const [cal, setCal] = useState(null);
  const [onecal, setOneCal] = useState(null);
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
    if (!onecal || onecal.length === 0 || refreshing) {
      return;
    }
    const firstCal = onecal;
    setRefreshing(true);
    const oneNewerCal = await getNextClosestCalendarByUser(firstCal.id);
    setRefreshing(false);
    if (oneNewerCal.length === 0) {
      return;
    }
    setOneCal(oneNewerCal)

  }, [onecal,  userId, refreshing]);

  useEffect(() => {
    getNextClosestCalendarByUser().then((_cal) => {
      setOneCal(_cal);
  })
  }, []);

  useCalEventEffect({
    refresh: onRefresh,
    enabled: !userId || userId === user.id,
  });

  return {
    onecal,
    // noMoreCal,
    refreshing,
    // onLoadMore,
    onRefresh,
  };
}
