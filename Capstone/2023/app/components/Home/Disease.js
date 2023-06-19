import React from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import Swiper from 'react-native-swiper';

function Disease() {
  return (
    <View style={styles.container}>
      <View style={{
        flexDirection: 'row',
        alignItems: "flex-start",
      }}>
        <Text style={styles.titleSign}>■ </Text>
        <Text style={styles.title}> 질병 사전</Text>
      </View>
      <Swiper 
        loop
        // autoplay
        // autoplayTimeout={10}
        containerStyle={styles.diseaseBox}
        dotStyle={styles.swiperDot}
        activeDotStyle={styles.swiperActiveDot} >
        <View style={styles.diseaseContent}>
          <Text style={styles.diseaseTitle}>다음은 진단 할 수 있는 질병이에요!</Text>
          <Text style={styles.subDiseaseTitle}>1. 구진, 플라크 </Text>
          <Text style={styles.subDiseaseTitle}>2. 비듬, 각질, 상피성진고리</Text>
          <Text style={styles.subDiseaseTitle}>3. 태선화, 과다색소침착</Text>
          <Text style={styles.subDiseaseTitle}>4. 농포, 여드름</Text>
          <Text style={styles.subDiseaseTitle}>5. 미란, 궤양</Text>
          <Text style={styles.subDiseaseTitle}>6. 결절, 종괴</Text>
        </View>
        <View style={styles.diseaseContent}>
          <Text style={styles.diseaseTitle}>구진</Text>
          <Text style={styles.diseaseDescription}>  염증성 여드름 병변과 비염증성 여드름 병변의 중간 형태이며 피부의 단단한 덩어리로 직경이 0.5cm~1cm 정도 됩니다. 작고 딱딱한 붉은 색의 병변으로 안에 고름은 잡히지 않은 상태로 나타납니다.</Text>
        </View>
        <View style={styles.diseaseContent}>
          <Text style={styles.diseaseTitle}>플라크</Text>
          <Text style={styles.diseaseDescription}>  일반적으로 피부의 비듬 또는 각질 형태로 나타나는 상태를 말합니다. 플라크는 피부의 과도한 각질 생성으로 인해 발생할 수 있으며, 흰색이나 회색의 작은 비늘 형태로 피부 표면에 나타납니다.</Text>
        </View>
        <View style={styles.diseaseContent}>
          <Text style={styles.diseaseTitle}>태선화</Text>
          <Text style={styles.diseaseDescription}>  피부에 과다한 색소침착이 발생하는 피부 질환입니다. 태선화는 일반적으로 멍, 주근깨, 검은 점 또는 피부의 어두운 반점과 같은 색소 침착을 특징으로 합니다.</Text>
        </View>
        <View style={styles.diseaseContent}>
          <Text style={styles.diseaseTitle}>과다색소침착</Text>
          <Text style={styles.diseaseDescription}>  피부에 색소가 비정상적으로 많이 침착되는 상태를 의미합니다. 이는 멜라닌이라는 색소가 피부에 과도하게 생성되거나 분포되는 결과로 발생합니다.</Text>
        </View>
        <View style={styles.diseaseContent}>
          <Text style={styles.diseaseTitle}>농포</Text>
          <Text style={styles.diseaseDescription}>  여드름이나 뾰루지와 비슷한 모양의 피부 병변을 나타냅니다. 농포는 피지선의 비정상적인 작동으로 인해 피지가 고여 염증이 생기고, 피부에 작은 발진이나 종기 형태로 나타나는 것을 말합니다.</Text>
        </View>
        <View style={styles.diseaseContent}>
          <Text style={styles.diseaseTitle}>여드름</Text>
          <Text style={styles.diseaseDescription}>  피지선의 비정상적인 작동으로 인해 피지가 고여 염증이 생기고, 작은 여드름 형태로 나타나는 피부 질환입니다. 여드름은 주로 얼굴, 등, 목, 등에 발생할 수 있으며, 반려동물의 피부에 작은 붉은 발진이나 흰색 농포로 나타납니다.</Text>
        </View>
        <View style={styles.diseaseContent}>
          <Text style={styles.diseaseTitle}>미란</Text>
          <Text style={styles.diseaseDescription}>  피부의 염증과 궤양이 동반되는 질환입니다. 미란은 주로 알러지 반응, 피부 감염, 자가 면역 질환 등으로 인해 발생할 수 있습니다. 피부에 붉은 발진이나 작은 상처 형태로 나타나며, 피부가 가렵고 염증이 동반될 수 있습니다.</Text>
        </View>
        <View style={styles.diseaseContent}>
          <Text style={styles.diseaseTitle}>궤양</Text>
          <Text style={styles.diseaseDescription}>  피부의 손상이나 염증으로 인해 생긴 상처 또는 피부 조직의 손상을 의미합니다. 궤양은 주로 피부의 표면이나 깊은 부위에서 발생할 수 있으며, 다양한 원인에 의해 발생할 수 있습니다.</Text>
        </View>
        <View style={styles.diseaseContent}>
          <Text style={styles.diseaseTitle}>결절</Text>
          <Text style={styles.diseaseDescription}>  피부나 피부 아래 조직에서 발생하는 종괴 또는 종양을 의미합니다. 결절은 일반적으로 피부의 표면에 돋아나거나 피부 아래에 굳어진 형태로 나타납니다. 다양한 원인에 의해 발생할 수 있으며, 종류와 특징은 원인에 따라 다를 수 있습니다.</Text>
        </View>
        <View style={styles.diseaseContent}>
          <Text style={styles.diseaseTitle}>종괴</Text>
          <Text style={styles.diseaseDescription}>   피부 또는 피부 아래 조직에서 발생하는 종양을 의미합니다. 종괴는 일반적으로 피부의 표면이나 피부 아래에 형성되며, 다양한 크기와 형태를 가질 수 있습니다. 종류에 따라 양성 종괴와 악성 종괴로 구분될 수 있으며, 정확한 진단을 위해서는 수의사의 도움이 필요합니다.</Text>
        </View>
      </Swiper>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  
  titleSign: {
    paddingTop: 7,
    marginBottom: 10,
    fontSize: 15,
    color: "#3A8DF0",
  },

  title: {
    paddingTop: 2,
    color: "black",
    fontWeight: "bold",
    fontSize: 20,
  },

  subtitle: {
    color: "gray",
    fontSize: 15,
  },

  scrollView: {
    top: -10,
  },

  diseaseBox: {
    marginTop: 10,
    // width: 370,
    height: 240,
    width: "100%",
    // height: "30%",
    // marginRight: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    // padding: 10,
    elevation: 7,
    // marginBottom: 10,
  },

  diseaseContent: {
    margin: 10,
  },

  diseaseTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    marginBottom: 5,
  },

  subDiseaseTitle:{
    paddingTop: 1,
    paddingLeft: 8,
    fontSize: 14,
    marginBottom: 5,
    color: '#616161',
  },

  diseaseDescription: {
    fontSize: 14,
    color: "black",
  },

  swiperDot: {
    marginBottom: 0, 
  },

  swiperActiveDot: {
    marginBottom: 0, 
    // backgroundColor: "blue",
  },
});

export default Disease;
