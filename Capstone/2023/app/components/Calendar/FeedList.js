import React from "react";
import { StyleSheet, FlatList, View } from "react-native";
import FeedListItem from "./FeedListItem";

function FeedList({ logs, onScrolledToBottom, ListHeaderComponent }) {
  const onScroll = (e) => {
    if (!onScrolledToBottom) return;

    const { contentSize, layoutMeasurement, contentOffset } = e.nativeEvent;
    const distanceFromBottom = contentSize.height - layoutMeasurement.height - contentOffset.y;
    if (distanceFromBottom < 72) onScrolledToBottom(true);
    else onScrolledToBottom(false);
  };

  return (
    <FlatList
      style={styles.block}
      ItemSeparatorComponent={() => 
        <View style={{width: "100%", height: "5%"}}>
          <View style={[styles.border]} />
        </View>
      }
      data={logs}
      renderItem={({ item }) => 
        <FeedListItem 
          log={item} 
        />
      }
      keyExtractor={(log) => log.id}
      ListHeaderComponent={ListHeaderComponent}
      onScroll={onScroll}
    />
  );
}

const styles = StyleSheet.create({
  block: {
    flex: 1,

    // 여백
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
  },

  border: {
    height: 1,
    backgroundColor: "#C0CDDF",
  },
});

export default FeedList;
