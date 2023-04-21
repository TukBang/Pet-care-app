import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  processColor
} from 'react-native';
import { HorizontalBarChart } from 'react-native-charts-wrapper';

class ProbChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      legend: {
        enabled: false,
      },

      data: {
        dataSets: [{
          values: [
            {y: this.props.prediction[5]}, 
            {y: this.props.prediction[4]}, 
            {y: this.props.prediction[3]}, 
            {y: this.props.prediction[2]}, 
            {y: this.props.prediction[1]}, 
            {y: this.props.prediction[0]}
          ],

          label: "",

          config: {
            color: processColor('#2296F3'),
            barShadowColor: processColor('lightgrey'),
            highlightAlpha: 30,
            highlightColor: processColor('red'),        
          }
        }],
      },

      xAxis: {
        textSize: 11,
        valueFormatter: [
          "결절, 종괴", 
          "미란, 궤양", 
          "농포, 여드름", 
          "태선화, 과다색소침착", 
          "비듬, 각질, 상피성잔고리", 
          "구진, 플라크", 
        ],
        position: 'BOTTOM',
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

        right:{
          enabled: false,
        }
      }

    };
  }

  handleSelect(event) {
    let entry = event.nativeEvent
    if (entry == null) this.setState({...this.state, selectedEntry: null})
    else               this.setState({...this.state, selectedEntry: JSON.stringify(entry)})
    console.log(event.nativeEvent)
  }

  render() {
    let chartTitleText = "진단 확률"

    return (
      <View style={{flex: 1}}>
        <Text style={styles.chartTitle}>{chartTitleText}</Text>
        <View style={styles.chartView}>
          <HorizontalBarChart
            style={styles.chart}
            data={this.state.data}
            xAxis={this.state.xAxis}
            yAxis={this.state.yAxis}
            legend={this.state.legend}
            chartDescription={{text: ''}}
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
  },

  chart: {
    backgroundColor: '#DDDDDD',
    height: 200,
    width: '100%'
  }
});

export default ProbChart