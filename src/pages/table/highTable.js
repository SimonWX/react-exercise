import React from 'react';
import {Card, Table, Modal, message, Button, Badge} from 'antd';
import axios from './../../axios/index';
// import Utils from './../../utils/utils';
export default class HighTable extends React.Component{
  state = {

  }
  params = {
    page: 1
  }

  componentDidMount(){
    // 动态获取mock数据
    this.request();
  }

  request = () => {
    let _this = this;
    axios.ajax({
      url: '/table/high/list',
      data:{
        params:{
          page:this.params.page
        },
        isShowLoading: true
      }
    }).then((res)=>{
      if(res.code == 0){
        res.result.list.map( (item,index) => {
          item.key = index;
        })
        this.setState({
          dataSource: res.result.list
        })
      }
    })
  }

  handleChange = (pagination, filters, sorter)=>{
    this.setState({
      sortOrder: sorter.order
    })
  }

  //删除操作
  handleDelete = (item) =>{
    let  id = item.id;
    Modal.confirm({
      title: '确认',
      content: '您确认要删除此条数据吗？',
      onOk:()=>{
        message.success('删除成功！');
        this.request();
      }
    })
  }

  render(){
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 80
      },
      {
        title: '用户名',
        width: 80,
        dataIndex: 'userName'
      },
      {
        title: '性别',
        width: 80,
        dataIndex: 'sex',
        render(sex){
          return sex == 1 ? '男' : '女'
        }
      },
      {
        title: '状态',
        width: 80,
        dataIndex: 'state',
        render(state){
          let config = {
            '1': '咸鱼一条',
            '2': '风华浪子',
            '3': '北大才子',
            '4': '百度FE',
            '5': '创业皇帝',
          }
          return config[state];
        }
      },
      {
        title: '爱好',
        width: 80,
        dataIndex: 'interest',
        render(abc){
          let config = {
            '1': '游泳',
            '2': '打篮球',
            '3': '踢足球',
            '4': '跑步',
            '5': '爬山',
            '6': '远足',
            '7': '攀岩',
            '8': '高尔夫'
          }
          return config[abc];
        }
      },
      {
        title: '生日',
        width: 120,
        dataIndex: 'birthDay'
      },
      {
        title: '地址',
        width: 120,
        dataIndex: 'address'
      },
      {
        title: '早起时间',
        width: 80,
        dataIndex: 'time'
      },
    ]
    const columns2 = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        fixed: 'left',
        width: 80
      },
      {
        title: '用户名',
        width: 100,
        fixed: 'left',
        dataIndex: 'userName'
      },
      {
        title: '性别',
        width: 80,
        dataIndex: 'sex',
        render(sex){
          return sex == 1 ? '男' : '女'
        }
      },
      {
        title: '状态',
        width: 120,
        dataIndex: 'state',
        render(state){
          let config = {
            '1': '咸鱼一条',
            '2': '风华浪子',
            '3': '北大才子',
            '4': '百度FE',
            '5': '创业皇帝',
          }
          return config[state];
        }
      },
      {
        title: '爱好',
        width: 120,
        dataIndex: 'interest',
        render(abc){
          let config = {
            '1': '游泳',
            '2': '打篮球',
            '3': '踢足球',
            '4': '跑步',
            '5': '爬山',
            '6': '远足',
            '7': '攀岩',
            '8': '高尔夫'
          }
          return config[abc];
        }
      },
      {
        title: '生日',
        width: 120,
        dataIndex: 'birthDay'
      },
      {
        title: '生日',
        width: 120,
        dataIndex: 'birthDay'
      },
      {
        title: '生日',
        width: 120,
        dataIndex: 'birthDay'
      },
      {
        title: '生日',
        width: 120,
        dataIndex: 'birthDay'
      },
      {
        title: '生日',
        width: 120,
        dataIndex: 'birthDay'
      },
      {
        title: '生日',
        width: 120,
        dataIndex: 'birthDay'
      },
      {
        title: '生日',
        width: 120,
        dataIndex: 'birthDay'
      },
      {
        title: '生日',
        width: 120,
        dataIndex: 'birthDay'
      },
      {
        title: '生日',
        width: 120,
        dataIndex: 'birthDay'
      },
      {
        title: '生日',
        width: 120,
        dataIndex: 'birthDay'
      },
      {
        title: '生日',
        width: 120,
        dataIndex: 'birthDay'
      },
      {
        title: '生日',
        width: 120,
        dataIndex: 'birthDay'
      },
      {
        title: '地址',
        width: 260,
        dataIndex: 'address',
        fixed:'right'
      },
      {
        title: '早起时间',
        width: 100,
        dataIndex: 'time',
        fixed:'right'
      },
    ]
    const columns3 = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '用户名',
        dataIndex: 'userName'
      },
      {
        title: '性别',
        dataIndex: 'sex',
        render(sex){
          return sex == 1 ? '男' : '女'
        }
      },
      {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
        sorter:(a,b)=>{
          return a.age - b.age;
        },
        sortOrder: this.state.sortOrder
      },
      {
        title: '状态',
        dataIndex: 'state',
        render(state){
          let config = {
            '1': '咸鱼一条',
            '2': '风华浪子',
            '3': '北大才子',
            '4': '百度FE',
            '5': '创业皇帝',
          }
          return config[state];
        }
      },
      {
        title: '爱好',
        dataIndex: 'interest',
        render(abc){
          let config = {
            '1': '游泳',
            '2': '打篮球',
            '3': '踢足球',
            '4': '跑步',
            '5': '爬山',
            '6': '远足',
            '7': '攀岩',
            '8': '高尔夫'
          }
          return config[abc];
        }
      },
      {
        title: '生日',
        dataIndex: 'birthDay'
      },
      {
        title: '地址',
        dataIndex: 'address'
      },
      {
        title: '早起时间',
        dataIndex: 'time'
      },
    ]
    const columns4 = [
      {
        title: 'ID',
        dataIndex: 'id',
      },
      {
        title: '用户名',
        dataIndex: 'userName'
      },
      {
        title: '性别',
        dataIndex: 'sex',
        render(sex){
          return sex == 1 ? '男' : '女'
        }
      },
      {
        title: '年龄',
        dataIndex: 'age',
      },
      {
        title: '状态',
        dataIndex: 'state',
        render(state){
          let config = {
            '1': '咸鱼一条',
            '2': '风华浪子',
            '3': '北大才子',
            '4': '百度FE',
            '5': '创业皇帝',
          }
          return config[state];
        }
      },
      {
        title: '爱好',
        dataIndex: 'interest',
        render(abc){
          let config = {
            '1': <Badge status="success" text="成功"/>,
            '2': <Badge status="error" text="报错"/>,
            '3': <Badge status="default" text="正常"/>,
            '4': <Badge status="processing" text="进行中"/>,
            '5': <Badge status="warning" text="警告"/>,
            '6': <Badge status="success" text="正常"/>,
            '7': <Badge status="success" text="正常"/>,
            '8': <Badge status="success" text="正常"/>
          }
          return config[abc];
        }
      },
      {
        title: '生日',
        dataIndex: 'birthDay'
      },
      {
        title: '地址',
        dataIndex: 'address'
      },
      {
        title: '操作',
        render:(text,item)=>{
          return <Button size="small" onClick={ (item) => {this.handleDelete(item)} }>删除</Button>
        }
      },
    ]
    return(
      <div>
        <Card title="头部固定">
          <Table
              bordered
              columns={columns}
              dataSource={this.state.dataSource}
              pagination={false}
              scroll={{y:240}}
          />
        </Card>
        <Card title="左侧固定" style={{margin:'10px 0'}}>
          <Table
              bordered
              columns={columns2}
              dataSource={this.state.dataSource}
              pagination={false}
              scroll={{x:2330}}
          />
        </Card>
        <Card title="表格排序" style={{margin:'10px 0'}}>
          <Table
              bordered
              columns={columns3}
              dataSource={this.state.dataSource}
              pagination={false}
              onChange={this.handleChange}
          />
        </Card>
        <Card title="操作按钮表格" style={{margin:'10px 0'}}>
          <Table
              bordered
              columns={columns4}
              dataSource={this.state.dataSource}
              pagination={false}
          />
        </Card>
      </div>
    )
  }
}