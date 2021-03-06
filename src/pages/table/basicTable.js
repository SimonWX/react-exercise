import React from 'react';
import {Card, Table, Modal, message, Button} from 'antd';
import axios from './../../axios/index';
import Utils from './../../utils/utils';
export default class BasicTable extends React.Component{
  state = {
    dataSource2: []
  }
  params = {
    page: 1
  }
  componentDidMount(){
    const data = [
      {
        id: '0',
        userName: 'LinDa',
        sex: '1',
        state: '1',
        interest: '1',
        birthDay: '2000-01-01',
        address: '北京市海淀区奥林匹克公园',
        time:'08:00'
      },
      {
        id: '1',
        userName: 'Merry',
        sex: '1',
        state: '1',
        interest: '1',
        birthDay: '2010-01-01',
        address: '北京市海淀区奥林匹克公园',
        time:'07:00'
      },
      {
        id: '2',
        userName: 'Jane',
        sex: '1',
        state: '1',
        interest: '1',
        birthDay: '2018-01-01',
        address: '北京市海淀区奥林匹克公园',
        time:'06:00'
      }
    ]
    data.map((item,index)=>{
      item.key = index;
    })
    this.setState({
      dataSource: data
    })
    this.request();
  }
  // 动态获取mock数据
  request = () => {
    let _this = this;
    axios.ajax({
      url: '/table/list',
      data:{
        params:{
          page:this.params.page
        },
        isShowLoading: true
      }
    }).then((res)=>{
      if(res.code === 0){
        res.result.list.map( (item,index) => {
          item.key = index;
        })
        this.setState({
          dataSource2: res.result.list,
          selectedRowKeys: [],
          selectedRows: null,
          pagination: Utils.pagination(res,(current)=>{
             // to-do
            _this.params.page = current;
            this.request();
          })
        })
      }
    })
  }
  onRowClick = (record,index) => {
    let selectKey = [index];
    Modal.info({
      title: '信息',
      content: `用户名：${record.userName},您好：${record.interest}`
    })
    this.setState({
      selectedRowKeys: selectKey,
      selectedItem: record
    })
  }
  // 多选执行删除动作
  handleDelete = (() =>{
    let rows = this.state.selectedRows;
    let ids = [];
    rows.map((item)=>{
      ids.push(item.id)
    })
    Modal.confirm({
      title: '删除提示',
      content: `您确定要删除 ${ids.join(',')} 这些数据？`,
      onOk: ()=>{
        message.success('删除成功！')
        this.request();
      }
    })
  })
  render(){
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id'
      },
      {
        title: '用户名',
        dataIndex: 'userName'
      },
      {
        title: '性别',
        dataIndex: 'sex',
        render(sex){
          return sex === 1 ? '男' : '女'
        }
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
    const {selectedRowKeys} = this.state;
    const rowSelection = {
      type: 'radio',
      selectedRowKeys
    }
    const rowCheckSelection = {
      type: 'checkbox',
      selectedRowKeys,
      onChange: (selectedRowKeys,selectedRows)=>{
        this.setState({
          selectedRowKeys,
          selectedRows 
        })
      }
    }
    return (
      <div>
        <Card title="基础表格">
          <Table
              bordered
              columns={columns}
              dataSource={this.state.dataSource}
              pagination={false}
          />
        </Card>
        <Card title="动态数据渲染表格-Mock" style={{margin:'10px 0'}}>
          <Table
              bordered
              columns={columns}
              dataSource={this.state.dataSource2}
              pagination={false}
          />
        </Card>
        <Card title="Mock-单选" style={{margin:'10px 0'}}>
          <Table
              bordered
              rowSelection={rowSelection}
              onRow={(record,index)=>{
                return {
                  onClick:()=>{
                    this.onRowClick(record,index)
                  }  // 点击行
                };
              }}
              columns={columns}
              dataSource={this.state.dataSource2}
              pagination={false}
          />
        </Card>
        <Card title="Mock-多选" style={{margin:'10px 0'}}>
          <div style={{marginBottom: '10px'}}>
            <Button onClick={this.handleDelete}>删除</Button>
          </div>
          <Table
              bordered
              rowSelection={rowCheckSelection}
              columns={columns}
              dataSource={this.state.dataSource2}
              pagination={false}
          />
        </Card>
        <Card title="Mock-表格分页" style={{margin:'10px 0'}}>
          <Table
              bordered
              columns={columns}
              dataSource={this.state.dataSource2}
              pagination={this.state.pagination}
          />
        </Card>
      </div>
    );
  }
}