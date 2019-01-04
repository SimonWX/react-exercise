import React from 'react'
import {Card} from 'antd'
import echartTheme1 from './../echartTheme'
// import echartTheme2 from './../themeLight'
// 全部导入
// import echarts from 'echarts'

// 按需加载
import echarts from 'echarts/lib/echarts'
// 导入柱形图
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/markPoint'
import ReactEcharts from 'echarts-for-react'
export default class Bar extends React.Component{
  componentWillMount(){
    echarts.registerTheme('Imooc', echartTheme1);
  }
  
  getOption = ()=>{
    let option = {
      title: {
        text: '用户骑行订单'
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        data: ['周一','周二','周三','周四','周五','周六','周日']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '订单量',
          type: 'bar',
          data: [1800, 2000, 3000, 2500, 1200, 3900, 4400]
        }
      ]
    }
    return option;
  }

  getOption2 = ()=>{
    let option = {
      title: {
        text: '用户骑行订单'
      },
      legend: {
        data: ['OFO', '摩拜', '小蓝']
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        data: ['周一','周二','周三','周四','周五','周六','周日']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'OFO',
          type: 'bar',
          data: [1800, 2000, 3000, 2500, 1200, 3900, 4400]
        },
        {
          name: '摩拜',
          type: 'bar',
          data: [2200, 3000, 2800, 3500, 4200, 3900, 6100]
        },
        {
          name: '小蓝',
          type: 'bar',
          data: [1600, 2000, 3000, 4500, 2200, 3100, 4400]
        },
      ]
    }
    return option;
  }

  render(){
    return (
      <div>
        <Card title="柱形图表之一">
          <ReactEcharts option={this.getOption()} theme="Imooc" style={{height: 500}}/>
        </Card>
        <Card title="柱形图表之二" style={{marginTop: 10}}>
          <ReactEcharts option={this.getOption2()} theme="Imooc" style={{height: 500}}/>
        </Card>
      </div>
    )
  }
}