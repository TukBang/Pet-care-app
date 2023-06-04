import React from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";

function Disease() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>질병 사전</Text>
      <ScrollView contentContainerStyle={styles.scrollView} horizontal={true}>
        <View style={styles.diseaseBox}>
          <Text style={styles.diseaseTitle}>주의!! 사진이 포함되어 있어요</Text>
          <Text style={styles.subDiseaseTitle}>1. 구진, 플라크 </Text>
          <Text style={styles.subDiseaseTitle}>2. 비듬, 각질, 상피성진고리</Text>
          <Text style={styles.subDiseaseTitle}>3. 태선화, 과다색소침착</Text>
          <Text style={styles.subDiseaseTitle}>4. 농포, 여드름</Text>
          <Text style={styles.subDiseaseTitle}>5. 미란, 궤양</Text>
          <Text style={styles.subDiseaseTitle}>6. 결절, 종괴</Text>
        </View>
        <View style={styles.diseaseBox}>
          <Text style={styles.diseaseTitle}>구진</Text>
          <Text style={styles.diseaseDescription}> 구진은 염증성 여드름 병변과 비염증성 여드름 병변의 중간 형태이며 피부의 단단한 덩어리로 직경이 0.5cm~1cm 정도 됩니다. 작고 딱딱한 붉은 색의 병변으로 안에 고름은 잡히지 않은 상태로 나타납니다.</Text>

        </View>
        <View style={styles.diseaseBox}>
          <Text style={styles.diseaseTitle}>플라크</Text>
          <Text style={styles.diseaseDescription}> 플라크는 일반적으로 피부의 비듬 또는 각질 형태로 나타나는 상태를 말합니다. 플라크는 피부의 과도한 각질 생성으로 인해 발생할 수 있으며, 흰색이나 회색의 작은 비늘 형태로 피부 표면에 나타납니다.</Text>
        </View>

        <View style={styles.diseaseBox}>
          <Text style={styles.diseaseTitle}>비듬</Text>
          <Text style={styles.diseaseDescription}> 비듬은 피부 상피 층의 과도한 각질 형성으로 인해 발생하는 현상입니다. 일반적으로 피부의 지루 형태로 나타나며, 피부의 가려움과 발색 변화를 동반할 수 있습니다.</Text>
        </View>
        <View style={styles.diseaseBox}>
          <Text style={styles.diseaseTitle}>각질</Text>
          <Text style={styles.diseaseDescription}> 각질은 피부 상피 세포의 이상적인 형성과 정상적인 업데이트 과정이 교란되어 발생하는 상태입니다. 이로 인해 피부의 각질 층이 두꺼워지고 불규칙한 형태를 보이게 됩니다.</Text>
        </View>
        <View style={styles.diseaseBox}>
          <Text style={styles.diseaseTitle}>상피성진고리</Text>
          <Text style={styles.diseaseDescription}> 상피성진고리는 피부 상피 세포의 비정상적인 증식으로 인해 발생하는 피부 질환입니다. 이 질환은 피부 상피 세포의 증식과 이상적인 형태 변화로 인해 피부의 진관이 형성되고 이로 인해 진과 고리 형태의 변화가 나타나는 특징적인 증상을 보입니다.</Text>
        </View>
        <View style={styles.diseaseBox}>
          <Text style={styles.diseaseTitle}>태선화</Text>
          <Text style={styles.diseaseDescription}> 태선화는 피부에 과다한 색소침착이 발생하는 피부 질환입니다. 태선화는 일반적으로 멍, 주근깨, 검은 점 또는 피부의 어두운 반점과 같은 색소 침착을 특징으로 합니다.</Text>
        </View>
        <View style={styles.diseaseBox}>
          <Text style={styles.diseaseTitle}>과다색소침착</Text>
          <Text style={styles.diseaseDescription}> 과다색소침착은 피부에 색소가 비정상적으로 많이 침착되는 상태를 의미합니다. 이는 멜라닌이라는 색소가 피부에 과도하게 생성되거나 분포되는 결과로 발생합니다.</Text>
        </View>
        <View style={styles.diseaseBox}>
          <Text style={styles.diseaseTitle}>농포</Text>
          <Text style={styles.diseaseDescription}> 농포는 여드름이나 뾰루지와 비슷한 모양의 피부 병변을 나타냅니다. 농포는 피지선의 비정상적인 작동으로 인해 피지가 고여 염증이 생기고, 피부에 작은 발진이나 종기 형태로 나타나는 것을 말합니다.</Text>
        </View>
        <View style={styles.diseaseBox}>
          <Text style={styles.diseaseTitle}>여드름</Text>
          <Text style={styles.diseaseDescription}> 여드름은 피지선의 비정상적인 작동으로 인해 피지가 고여 염증이 생기고, 작은 여드름 형태로 나타나는 피부 질환입니다. 여드름은 주로 얼굴, 등, 목, 등에 발생할 수 있으며, 반려동물의 피부에 작은 붉은 발진이나 흰색 농포로 나타납니다.</Text>
        </View>
        <View style={styles.diseaseBox}>
          <Text style={styles.diseaseTitle}>미란</Text>
          <Text style={styles.diseaseDescription}> 미란은 피부의 염증과 궤양이 동반되는 질환입니다. 미란은 주로 알러지 반응, 피부 감염, 자가 면역 질환 등으로 인해 발생할 수 있습니다. 피부에 붉은 발진이나 작은 상처 형태로 나타나며, 피부가 가렵고 염증이 동반될 수 있습니다.</Text>
        </View>
        <View style={styles.diseaseBox}>
          <Text style={styles.diseaseTitle}>궤양</Text>
          <Text style={styles.diseaseDescription}> 궤양은 피부의 손상이나 염증으로 인해 생긴 상처 또는 피부 조직의 손상을 의미합니다. 궤양은 주로 피부의 표면이나 깊은 부위에서 발생할 수 있으며, 다양한 원인에 의해 발생할 수 있습니다.</Text>
        </View>
        <View style={styles.diseaseBox}>
          <Text style={styles.diseaseTitle}>결절</Text>
          <Text style={styles.diseaseDescription}> 결절은 피부나 피부 아래 조직에서 발생하는 종괴 또는 종양을 의미합니다. 결절은 일반적으로 피부의 표면에 돋아나거나 피부 아래에 굳어진 형태로 나타납니다. 다양한 원인에 의해 발생할 수 있으며, 종류와 특징은 원인에 따라 다를 수 있습니다.</Text>
        </View>
        <View style={styles.diseaseBox}>
          <Text style={styles.diseaseTitle}>종괴</Text>
          <Text style={styles.diseaseDescription}>  종괴는 피부 또는 피부 아래 조직에서 발생하는 종양을 의미합니다. 종괴는 일반적으로 피부의 표면이나 피부 아래에 형성되며, 다양한 크기와 형태를 가질 수 있습니다. 종류에 따라 양성 종괴와 악성 종괴로 구분될 수 있으며, 정확한 진단을 위해서는 수의사의 도움이 필요합니다.</Text>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: 20,
  },
  title: {
    paddingTop: 10,
    color: "black",
    fontWeight: "bold",
    fontSize: 25,
  },
  subtitle: {
    color: "gray",
    fontSize: 15,
  },
  scrollView: {
    flexDirection: "row",
    alignItems: "center",
    height: 230,
  },
  diseaseBox: {
    marginTop: 10,
    width: 370,
    height: 200,
    marginRight: 20,
    backgroundColor: "#F9F2F2",
    borderRadius: 15,
    padding: 10,
    elevation: 7,
  },
  diseaseTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "black",
  },
  subDiseaseTitle:{
    paddingLeft: 10,
    fontSize: 14,
    marginBottom: 5,
    color: 'gray',
  },
  diseaseDescription: {
    fontSize: 14,
    color: "black",
  },
});

export default Disease;
