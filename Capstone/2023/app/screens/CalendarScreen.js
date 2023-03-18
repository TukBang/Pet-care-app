import React, {useContext, useEffect, useMemo, useRef, useState} from "react";
import { StyleSheet, View, Animated, Button } from "react-native"
import format from "date-fns/format";
import CalendarView from "../components/CalendarView";
import FeedList from "../components/FeedList";

import FloatingWriteButton from "../components/FloatingWriteButton";
import LogContext from "../contexts/LogContext";

function CalendarScreen() {

    const {logs} = useContext(LogContext);
    const [selectedDate, setSelectedDate] = useState(
        format(new Date(), 'yyyy-MM-dd'),
    );
    
    const [hidden, setHidden ]= useState(false);
    const onScrolledToBottom = (isBottom) => {
        if (hidden !== isBottom) {
            setHidden(isBottom);
        }
    };

    const markedDates = useMemo(
        ()=>
            logs.reduce((acc,current) => {
                const formattedDate = format(new Date(current.date), 'yyyy-MM-dd');
                acc[formattedDate] = {marked: true};
                return acc;
        }, {}),
        [logs],
    );

    const filteredLogs = logs.filter(
        (log) => format(new Date(log.date), 'yyyy-MM-dd') === selectedDate,
    );

    return (
        <View style= {styles.block} >
            <CalendarView markedDates={markedDates}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate} />
            <FeedList logs={filteredLogs} onScroll={onScrolledToBottom} />
            <FloatingWriteButton hidden={hidden} selectedDate={selectedDate} onSelectDate={setSelectedDate}/>
        </View>
    )
}

const styles = StyleSheet.create({
    block: {
        flex: 1,
    },
    // rectangle: {width: 100, height: 100, backgroundColor: 'black'},
});

export default CalendarScreen;