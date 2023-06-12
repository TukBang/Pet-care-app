import { useEffect, useState, useCallback } from "react";
import { getNewerDiags, getOlderDiags, getDiags, PAGE_SIZE } from "../lib/diagnosis";
import { useUserContext } from "../contexts/UserContext";
import useDiagEventEffect from "./useDiagEventEffect";

// 비슷한 함수의 재사용을 막기위해 정리

export default function useDiags(userId) {
  const [diags, setDiags] = useState(null);
  const [noMoreDiag, setNoMoreDiag] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useUserContext();

  const onLoadMore = async () => {
    if (noMoreDiag || !diags || diags.length < PAGE_SIZE) {
      return;
    }
    const lastDiag = diags[diags.length - 1];
    const olderDiags = await getOlderDiags(lastDiag.id, userId);
    if (olderDiags.length < PAGE_SIZE) {
      setNoMoreDiag(true);
    }
    setDiags(diags.concat(olderDiags));
  };

  //새로고침
  const onRefresh = useCallback(async () => {
    if (!diags || diags.length === 0 || refreshing) {
      return;
    }
    const firstDiag = diags[0];
    setRefreshing(true);
    const newerdiags = await getNewerDiags(firstDiag.id, userId);
    setRefreshing(false);
    if (newerdiags.length === 0) {
      return;
    }
    setDiags(newerdiags.concat(diags));
  }, [diags, userId, refreshing]);

  useEffect(() => {
    getDiags({ userId }).then((_diags) => {
      setDiags(_diags);
      if (_diags.length < PAGE_SIZE) {
        setNoMoreDiag(true);
      }
    });
  }, [userId]);

  useDiagEventEffect({
    refresh: onRefresh,
    enabled: !userId || userId === user.id,
  });

  return {
    diags,
    noMoreDiag,
    refreshing,
    onLoadMore,
    onRefresh,
  };
}
