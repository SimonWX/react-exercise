import React from 'react'
import {Card} from 'antd'
import echartTheme1 from './../echartTheme'
// import echartTheme2 from './../themeLight'
// 全部导入
// import echarts from 'echarts'

// 按需加载
import echarts from 'echarts/lib/echarts'
// 导入饼状图
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/markPoint'
import ReactEcharts from 'echarts-for-react'
export default class Line extends React.Component{
  componentWillMount(){
    echarts.registerTheme('Imooc', echartTheme1);
  }
  
  getOption = ()=>{
    let option = {
      title: {
        text:'用户骑行订单',
      },
      tooltip: {
        trigger:  'item',
      },
      xAxis: {
        data: [
          '周一','周二','周三','周四','周五','周六','周日'
        ]
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '订单量',
          type: 'line',
          data: [
            1000, 2000, 1800, 3400, 4300, 5500, 5900
          ]
        }
      ],
    }
    return option;
  }

  getOption2 = ()=>{
    let option = {
      title: {
        text:'用户骑行订单',
      },
      tooltip: {
        trigger:  'item',
      },
      legend: {
        data: ['OFO订单量', '摩拜订单量']
      },
      xAxis: {
        data: [
          '周一','周二','周三','周四','周五','周六','周日'
        ]
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'OFO订单量',
          type: 'line',
          data: [
            1000, 2000, 1800, 3400, 4300, 5500, 5900
          ]
        },
        {
          name: '摩拜订单量',
          type: 'line',
          data: [
            1300, 1400, 1900, 3400, 4900, 8500, 7900
          ]
        },
      ],
    }
    return option;
  }

  getOption3 = ()=>{
    let option = {
      title: {
        text:'用户骑行订单',
      },
      tooltip: {
        trigger:  'item',
      },
      xAxis: {
        bpundaryGap:false,
        data: [
          '周一','周二','周三','周四','周五','周六','周日'
        ]
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'OFO订单量',
          type: 'line',
          data: [
            1000, 2000, 1800, 3400, 4300, 5500, 5900
          ],
          areaStyle: {}
        }
      ],
    }
    return option;
  }

  render(){
    return (
      <div>
        <Card title="折线图表之一">
          <ReactEcharts option={this.getOption()} theme="Imooc" style={{height: 500}}/>
        </Card>
        <Card title="折线图表之二" style={{marginTop: 10}}>
          <ReactEcharts option={this.getOption2()} theme="Imooc" style={{height: 500}}/>
        </Card>
        <Card title="折线图表之三" style={{marginTop: 10}}>
          <ReactEcharts option={this.getOption3()} theme="Imooc" style={{height: 500}}/>
        </Card>
      </div>
    )
  }
}