import React from "react";
import { StyleSheet, Text, View, processColor } from "react-native";
import { HorizontalBarChart } from "react-native-charts-wrapper";

// 진단 결과 화면에 나오는 6가지 label의 차트
// label 명 및 차트, 확률로 구성되어 있음

class ProbChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chartTitle: this.props.chartTitle === null ? styles.chartTitle : this.props.chartTitle, 
      chartView: this.props.chartView === null ? styles.chartView : this.props.chartView,
      chartStyle: this.props.chartStyle === null ? styles.chart : this.props.chartStyle,

      legend: {
        enabled: false,
      },

      data: {
        dataSets: [
          {
            values: [
              { y: this.props.prediction[4] },
              { y: this.props.prediction[3] },
              { y: this.props.prediction[2] },
              { y: this.props.prediction[1] },
              { y: this.props.prediction[0] },
            ],

            label: "",

            config: {
              color: processColor("#2296F3"),
              barShadowColor: processColor("lightgrey"),
              highlightAlpha: 30,
              highlightColor: processColor("red"),
            },
          },
        ],
      },

      xAxis: {
        textSize: 11,
        valueFormatter: [
          "결절, 종괴",
          "미란, 궤양",
          "농포, 여드름",
          "태선화, 과다색소침착",
          "구진, 플라크",
        ],
        position: "BOTTOM",
        granularityEnabled: true,
        granularity: 1,
        labelCount: 6,
        gridLineWidth: 0,
        drawAxisLine: false,
        drawGridLines: false,
      },

      yAxis: {
        left: {
          enabled: false,
          drawAxisLine: false,
          drawGridLines: false,
          axisMinimum: 0,
        },

        right: {
          enabled: false,
        },
      },
    };
  }

  handleSelect(event) {
    let entry = event.nativeEvent;
    if (entry == null) this.setState({ ...this.state, selectedEntry: null });
    else this.setState({ ...this.state, selectedEntry: JSON.stringify(entry) });
    console.log(event.nativeEvent);
  }

  render() {
    let chartTitleText = "진단 확률";

    return (
      <View style={{flex: 1}}>
        <Text style={this.state.chartTitle}>{chartTitleText}</Text>
        <View style={this.state.chartView}>
          <HorizontalBarChart
            style={this.state.chartStyle}
            data={this.state.data}
            xAxis={this.state.xAxis}
            yAxis={this.state.yAxis}
            legend={this.state.legend}
            chartDescription={{ text: "" }}
            touchEnabled={false}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  chartTitle: {
    fontSize: 15,
    fontWeight: "bold",
    height: 30,
  },

  chartView: {
    flex: 1,
    
    height: "100%",
    width: "100%",

    borderWidth: 1,
    borderColor: "#C0CDDF",
  },

  chart: {
    backgroundColor: "#FFFFFF",
    height: 200,
    width: "100%",
  },
});

export default ProbChart;
