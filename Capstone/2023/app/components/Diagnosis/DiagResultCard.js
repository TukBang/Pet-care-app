import React, { useMemo } from "react";
import { View, StyleSheet, Text, Image, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ProbChart from "./HorizontalBarChart";

import { format, formatDistanceToNow } from "date-fns";
import ko from "date-fns/locale/ko";

function DiagResultCard({
  diagID, 
  userID, 
  petName, 
  petSpecies, 
  petGender, 
  petWeight, 
  petAge, 
  petID, 
  prediction, 
  petImage, 
  image, 
  createdAt }) 
{
  const date = useMemo(
    () => (createdAt ? new Date(createdAt._seconds * 1000) : new Date()),
    [createdAt]
  );
  
  return (
    <>
      <View style={styles.paddingBlock}>
        <View style={{flexDirection: "row"}}>
          <View style={[styles.imageView, {width:50, height: 50}]}>
            <Image
              source={{ uri: petImage }}
              style={styles.image}
            />
          </View>

          <View>
            <Text style={styles.petName}>{petName}</Text>
            <Text date={date} style={[styles.date,]}>{format(date, "MM월 dd일 hh:mm", { locale: ko })}</Text>
          </View>
        </View>

        <View style={{flexDirection: "row", justifyContent: "space-between", marginTop: 5}}>
          <View style={{width: "30%", height: "100%", alignItems: "center"}}>
            <Text style={{fontSize: 16, color: "#282828"}}>진단 사진</Text>
            <View style={[styles.imageView, {height: 100, width: 100,}]}>
              <Image 
                source={{ uri: image }}
                style={styles.image}
              />
            </View>
          </View>

          <ProbChart 
            prediction={prediction["predictions"]} 
            chartTitle={styles.chartTitle}
            chartView={styles.chartView}
            chartStyle={styles.chartStyle}
          />
        </View>

        <View style={{width: "100%"}}>
          <View style={[styles.border]} />
        </View>

      </View>
    </>
  );
}

const styles = StyleSheet.create({
  paddingBlock: {
    paddingHorizontal: 10,
  },

  imageView: {
    flexDirection: "row",
  },

  image: {
    height: "100%",
    width: "100%",
  },

  petName: {
    marginTop: 2,
    marginLeft: 10,

    fontSize: 20,
    fontWeight: "bold",
    color: "#282828",
  },
  
  date: {
    marginLeft: 10,

    fontSize: 12,
    color: "#686868",
  },

  chartTitle: {
    alignSelf: "center",
    
    fontSize: 16,
    color: "#282828",
  },

  chartView: {
    flex: 1,
    
    height: "100%",
    width: "100%",

    borderWidth: 1,
    borderColor: "#C0CDDF",
  },

  chartStyle: {
    height: 100,
    width: "100%",

    borderWidth: 1,
    borderColor: "#C0CDDF",
    backgroundColor: "#FFFFFF",
  },

  border: {
    height: 2,
    marginTop: 10,
    marginBottom: 10,
    
    backgroundColor: "#C0CDDF",
  },
});

export default React.memo(DiagResultCard);
