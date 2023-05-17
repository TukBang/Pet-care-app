import { View, Text, StyleSheet } from "react-native"

function MapInfo ({elapsedTime, distanceTravelled,kcal}) {

    const Timer = ({ elapsedTime }) => {
          const minutes = Math.floor(elapsedTime / 60000);
          const seconds = Math.floor((elapsedTime % 60000) / 1000);
          return (
            <Text>
            {`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}
            </Text>
          )
    }

    return (
        <View style={styles.infoContainer}>
          <View>
            <Text>Time :</Text>
            <Timer elapsedTime={elapsedTime} />
          </View>
          <View style={styles.border} />
          <Text>
            Distance : {"\n"}
            {parseFloat(distanceTravelled).toFixed(2)} km
          </Text>
          <View style={styles.border} />
          <Text>
            Kcal : {"\n"}
            {parseFloat(kcal).toFixed(2)} kcal
          </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    infoContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "stretch",
        justifyContent: "space-between",
        margin: 10,
      },
      border: {
        width: 1,
        height: "100%",
        backgroundColor: "gray",
      },
})

export default MapInfo;