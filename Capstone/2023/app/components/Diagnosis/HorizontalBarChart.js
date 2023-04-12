import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  processColor
} from 'react-native';

import {HorizontalBarChart} from 'react-native-charts-wrapper';

class HorizontalBarChartScreen extends React.Component {

  constructor() {
    super();

    this.state = {
      // 안씀
      legend: {
        enabled: false,
        textSize: 30,
        form: 'CIRCLE',
        formSize: 14,
        xEntrySpace: 10,
        yEntrySpace: 5,
        formToTextSpace: 5,
        wordWrapEnabled: true,
        maxSizePercent: 0.5,
      },
      data: {
        dataSets: [{
          values: [{y: 10}, {y: 40}, {y: 20}, {y: 50}, {y: 70}, {y: 99}],
          label: 'Diease Acc',
          config: {
            color: processColor('teal'),
            barShadowColor: processColor('lightgrey'),
            highlightAlpha: 90,
            highlightColor: processColor('red'),
        
          }
        }],
      },
      xAxis: {
        valueFormatter: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
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
            enabled: false, // y축 라벨 표시 여부
            drawAxisLine: false, // y축 선 표시 여부
            drawGridLines: false, // y축 그리드 라인 표시 여부
            axisMinimum: 0,
            // labelCount: -1, // y축 라벨 개수
          },
        right:{
            enabled: false,
            // labelCount: -1,
        }
    }
    };
  }

  handleSelect(event) {
    let entry = event.nativeEvent
    if (entry == null) {
      this.setState({...this.state, selectedEntry: null})
    } else {
      this.setState({...this.state, selectedEntry: JSON.stringify(entry)})
    }

    console.log(event.nativeEvent)
  }


  render() {
    return (
      <View style={{flex: 1}}>

        <View style={{height:20}}>
          <Text> Result </Text>
          <Text> {this.state.selectedEntry}</Text>
        </View>


        <View style={styles.container}>
          <HorizontalBarChart
            style={styles.chart}
            
            data={this.state.data}
            xAxis={this.state.xAxis}
            yAxis={this.state.yAxis}
            animation={{durationX: 300}}
            legend={this.state.legend}
            gridBackgroundColor={processColor('#ffffff')}
            // drawBarShadow={false}
            drawValueAboveBar={true}
            // drawHighlightArrow={false}

            chartDescription={{ text: '' }}
            valueFormatter={(value) => `${value} %`} // value 값을 % 단위로 변환
            valueFormatterTextColor={'red'}
            // axisLineWidth={0}
            // gridLineWidth={0}
            // gridLineColor={'transparent'}
            // drawBorders={false}
            // drawGridBackground={false}
            
            onSelect={this.handleSelect.bind(this)}
            onChange={(event) => console.log(event.nativeEvent)}
          />

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  },
  chart: {
    height: 150,
    width: '100%'
  }
});

export default HorizontalBarChartScreen