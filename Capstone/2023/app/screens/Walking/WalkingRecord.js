import React, {useState, useEffect} from 'react';
import {View, Button, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl} from 'react-native';
import WalkResultCard from '../../components/Walking/WalkResultCard';
import usewalk from '../../hooks/walking/useWalk';
import { useUserContext } from "../../contexts/UserContext";

// 그라데이션
import LinearGradient from 'react-native-linear-gradient';

function WalkRecord() {
  const [results, setResults] = useState([]);

  const {walk, oneWalk, refreshing, oneRefreshing, noMoreWalk, onOneRefresh, onRefresh, onLoadMore } = usewalk();
  const {user} = useUserContext();
  
  useEffect(() => {
      if (walk) {
          setResults(walk);
    }
    }, [walk]);

  return (
    <>
      <LinearGradient
        colors={['#f6faff', '#f6faff']}
        // colors={['#F0F8FF', '#D1EEFD']}

        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        {
          results.length !== 0 ? (
            <>
              <View style={{height: "100%"}}>
                <FlatList
                  data={results}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.container}
                  onEndReached={onLoadMore}
                  onEndReachedThreshold={0.75}
                  refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={refreshing} />}
                />
              </View>
            </>
          ) : (
            <View style={{height: "100%", backgroundColor: "#F6FAFF"}}>
              <Text></Text>
            </View>
          )
        }        
      </LinearGradient>
    </>
  )
}

const renderItem = ({ item }) => (
    <WalkResultCard
      walkID={item.walkID}
      time={item.time}
      distance={item.distance}
      kcal={item.kcal}
      userID={item.userID}
      petID={item.petID}
      walkingImage={item.walkingImage}
      createdAt={item.createdAt}
    />
  );

  const styles = StyleSheet.create({
    block: {
      flex: 1,
      zIndex: 0,
    },
    container: {
      paddingBottom: 48,
    },
    spinner: {
      height: 64,
    },
  });

export default WalkRecord;