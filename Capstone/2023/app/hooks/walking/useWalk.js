import { useEffect, useState,  } from "react";
import { getNextClosestWalkingByUser } from "../../lib/walkInfo";
import { useUserContext } from "../../contexts/UserContext";
import useWalkEventEffect from "./useWalkEventEffect";
import { useCallback } from "react";

// 비슷한 함수의 재사용을 막기위해 정리

export default function usewalk(userId) {
  const [walk, setWalk] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useUserContext();

  // const onLoadMore = async () => {
  //   if (noMorewalk || !walk || walk.length < PAGE_SIZE) {
  //     return;
  //   }
  //   const lastwalk = walk[walk.length - 1];
  //   const olderwalk = await getOlderwalk(lastwalk.id, userId);
  //   if (olderwalk.length < PAGE_SIZE) {
  //     setNoMorewalk(true);
  //   }
  //   setwalk(walk.concat(olderwalk));
  // };

  //새로고침
  const onRefresh = useCallback(async () => {
    if (!walk || walk.length === 0 || refreshing) {
      return;
    }
    const firstwalk = walk[0];
    setRefreshing(true);
    const oneNewerwalk = await getNextClosestWalkingByUser(firstwalk.id);
    setRefreshing(false);
    if (oneNewerwalk.length === 0) {
      return;
    }
    setWalk(oneNewerwalk)
    // setWalk(newerwalk.concat(walk));
  }, [walk, userId, refreshing]);

  useEffect(() => {
    getNextClosestWalkingByUser().then((_walk) => {
      setWalk(_walk);
    });
  }, []);

  useWalkEventEffect({
    refresh: onRefresh,
    enabled: !userId || userId === user.id,
  });

  return {
    walk,
    refreshing,
    onRefresh,
  };
}
