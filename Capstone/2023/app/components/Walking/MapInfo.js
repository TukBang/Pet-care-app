import { View, Text, StyleSheet } from "react-native"

function MapInfo ({elapsedTime, distanceTravelled,kcal}) {
  const Timer = ({ elapsedTime }) => {
    const minutes = Math.floor(elapsedTime / 60000);
    const seconds = Math.floor((elapsedTime % 60000) / 1000);
    return (
      <Text style={[styles.recordText, {alignSelf: "center", fontSize: 12,}]}>
        {`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}
      </Text>
    )
  }

  return (    
    <View style={styles.infoContainer}>
      <View style={styles.recordView}>
        <Text style={[styles.recordText, {alignSelf: "center", marginBottom: 2}]}>시간</Text>
        <Timer elapsedTime={elapsedTime} />
      </View>

      <View style={styles.recordView}>
        <Text style={[styles.recordText, {alignSelf: "center", marginBottom: 2}]}>거리</Text>
        <Text style={[styles.recordText, {alignSelf: "center", fontSize: 12,}]}>{parseFloat(distanceTravelled).toFixed(1)} km</Text>
      </View>

      <View style={styles.recordView}>
        <Text style={[styles.recordText, {alignSelf: "center", marginBottom: 2}]}>칼로리</Text>
        <Text style={[styles.recordText, {alignSelf: "center", fontSize: 12,}]}>{parseFloat(kcal).toFixed(1)} kcal</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },

  recordView: {
    flexDirection: "column",
    width: "33%", 
    marginRight: 2, 
    
    borderWidth: 1, 
    borderRadius: 5, 
    borderColor: "#C0CDDF"
  },

  recordText: {
    fontSize: 14,
    color: "#282828",
  },
})

export default MapInfo;