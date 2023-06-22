import { useEffect, useState,  } from "react";
import { getNextClosestWalkingByUser, getWalk, getOlderWalk, getNewerWalk, PAGE_SIZE } from "../../lib/walkInfo";
import { useUserContext } from "../../contexts/UserContext";
import useWalkEventEffect from "./useWalkEventEffect";
import { useCallback } from "react";

// 비슷한 함수의 재사용을 막기위해 정리

export default function usewalk(userId) {
  const [walk, setWalk] = useState(null);
  const [oneWalk, setOneWalk] = useState(null);
  const [noMoreWalk, setNoMoreWalk] = useState(false);
  const [oneRefreshing, setOneRefreshing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useUserContext();

  const onLoadMore = async () => {
    if (noMoreWalk || !walk || walk.length < PAGE_SIZE) {
      return;
    }
    const lastwalk = walk[walk.length - 1];
    const olderwalk = await getOlderWalk(lastwalk.id, userId);
    if (olderwalk.length < PAGE_SIZE) {
      setNoMoreWalk(true);
    }
    setWalk(walk.concat(olderwalk));
  };

  // 새로고침
  const onOneRefresh = useCallback(async () => {
    if (!oneWalk || oneWalk.length === 0 || oneRefreshing) {
      return;
    }
    const onefirstwalk = oneWalk;
    setOneRefreshing(true);
    const oneNewerwalk = await getNextClosestWalkingByUser(onefirstwalk.id);
    setOneRefreshing(false);
    if (oneNewerwalk.length === 0) {
      return;
    }
    setOneWalk(oneNewerwalk)
  }, [oneWalk, userId, oneRefreshing]);

    //새로고침
    const onRefresh = useCallback(async () => {
      if (!walk || walk.length === 0 || refreshing) {
        return;
      }
      const firstwalk = walk[0];
      setRefreshing(true);
      const Newerwalk = await getWalk(firstwalk.id);
      setRefreshing(false);
      if (Newerwalk.length === 0) {
        return;
      }
      setWalk(Newerwalk)
    }, [walk, userId, refreshing]);

  useEffect(() => {
    getNextClosestWalkingByUser().then((_walk) => {
      setOneWalk(_walk);
    });
  }, []);

  useEffect(() => {
    getWalk().then((_walk) => {
      setWalk(_walk);
    });
  }, []);

  useWalkEventEffect({
    onerefresh: onOneRefresh,
    refresh: onRefresh,
    enabled: !userId || userId === user.id,
  });

  return {
    walk,
    oneWalk,
    refreshing,
    oneRefreshing,
    noMoreWalk,
    onOneRefresh,
    onRefresh,
    onLoadMore,
  };
}
