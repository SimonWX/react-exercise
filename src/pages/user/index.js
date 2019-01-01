import React from 'react'
import {Card, Button} from 'antd'
import axios from './../../axios'
import Utils from './../../utils/utils'
import BaseForm from './../../components/BaseForm'
import ETable from './../../components/ETable'

export default class User extends React.Component{
  formList = [
    {
      type: 'INPUT',
      label: '用户名',
      field: 'user_name',
      placeholder: '请输入名称',
      width: 100,
    },
    {
      type: 'INPUT',
      label: '用户手机号',
      field: 'user_mobile',
      placeholder: '请输入用户手机号',
      width: 100,
    },
    {
      type: 'DATE',
      label: '请选择入职日期',
      field: 'user_date',
      placeholder: '请输入日期',
      width: 120,
    }
  ]
  render(){
    return (
      <div>
        <Card>
          <BaseForm formList={this.formList}/>
        </Card>
      </div>
    )
  }
}