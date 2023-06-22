import React, {useState, useEffect} from 'react';
import {View, Button, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl} from 'react-native';
import DiagResultCard from '../../components/Diagnosis/DiagResultCard';
import useDiags from '../../hooks/diagnosisResult/useDiags';
import auth from "@react-native-firebase/auth";
import { useUserContext } from "../../contexts/UserContext";

// 그라데이션
import LinearGradient from 'react-native-linear-gradient';

function DiagRecord() {
  const [results, setResults] = useState([]);

  let { diags, noMoreDiag, refreshing, onLoadMore, onRefresh } = useDiags();
  const {user} = useUserContext();

  useEffect(() => {
    if (diags) {
      setResults(diags);
    }
  }, [diags]);

  return (
    <>
      <LinearGradient
        colors={['#f6faff', '#f6faff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        {/* <Text>{auth().currentUser.uid}</Text> */}
        {/* <Text>{user.id}</Text> */}
        {
          
        }
        {
          results.length !== 0 ? (
            <FlatList
              data={results}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.container}
              onEndReached={onLoadMore}
              onEndReachedThreshold={0.75}
              refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={refreshing} />}
            />
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
  <DiagResultCard
    diagID={item.diagID}
    userID={item.userID}
    petName={item.petName}
    petSpecies={item.petSpecies}
    petGender={item.petGender}
    petWeight={item.petWeight}
    petAge={item.petAge}
    petID={item.petID}
    prediction={item.prediction}
    petImage={item.petImage}
    image={item.image}
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

export default DiagRecord;