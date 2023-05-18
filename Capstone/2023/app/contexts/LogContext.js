import "react-native-get-random-values";
import React, { useEffect, useRef } from "react";
import { useState, createContext } from "react";
import { v4 as uuidv4 } from "uuid";
import logsStorage from "../storages/logsStorage";
import { calendarCollection } from "../lib/calendar";

// 오프라인에 저장하는 데이터 위한 모듈

const LogContext = createContext();
export let calendarID = '';

export function LogContextProvider({ children }) {
  const initialLogsRef = useRef(null);
  const [logs, setLogs] = useState(
    Array.from({ length: 0 })
      .map((_, index) => ({
        id: uuidv4(),
        title: `Log ${index}`,
        body: `Log ${index}`,
        date: new Date().toISOString(),
      }))
      .reverse()
  );

  // uuid 로 난수 생성 후 id로 설정, 제목, 내용, 날짜로 구성
  const onCreate = ({ id, title, body, date }) => {
    const log = {
      id,
      title,
      body,
      date,
    };
    // logs를 log와 기존 로그를 합쳐 설정
    setLogs([log, ...logs]);
  };



  //id가 일치하면 log를 교체하는 함수
  const onModify = (modified) => {
    const nextLogs = logs.map((log) => (log.id === modified.id ? modified : log));
    setLogs(nextLogs);
  };

  //id를 제외한 log로 업데이트
  const onRemove = (id) => {
    // Remove from UI (assuming logs state is used to render the logs)
    const nextLogs = logs.filter((log) => log.id !== id);
    setLogs(nextLogs);
    console.log("333333");
    console.log(id);
    // Remove from Firestore
    calendarCollection
      .doc(id)
      .delete()
      .then(() => {
        console.log('Data deleted successfully');
      })
      .catch((error) => {
        console.error('Error deleting data:', error);
        // Handle error accordingly
      });
  };

  // useEffect 내에서 async 함수를 만들고 바로 호출
  useEffect(() => {
    (async () => {
      const savedLogs = await logsStorage.get();
      if (savedLogs) {
        initialLogsRef.current = savedLogs;
        setLogs(savedLogs);
      }
    })();
  }, []);

  useEffect(() => {
    if (logs === initialLogsRef.current) {
      return;
    }
    logsStorage.set(logs);
  }, [logs]);

  return (
    <LogContext.Provider value={{ logs, onCreate, onModify, onRemove }}>
      {children}
    </LogContext.Provider>
  );
}

export default LogContext;