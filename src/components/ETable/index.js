import React from 'react'
import Utils from '../../utils/utils'
import {Table} from 'antd'
// import "./index.less"
export default class ETable extends React.Component{
  state = {}
  
  getOptions = ()=>{
    let p = this.props;
    const name_list = {
      "订单编号": 170,
      "车辆编号": 80,
      "手机号码": 96,
      "用户姓名": 70,
      "密码":70,
      "运维区域": 300,
      "车型": 42,
      "故障编号": 76,
      "代理商编码": 97,
      "角色ID": 64
    };
    if(p.columns && p.columns.length > 0){
      p.columns.forEach((item)=>{
        // 开始/结束 时间
        if(!item.title){
          return
        }
        if(!item.width){
          if(item.title.indexOf('时间')> -1 && item.title.indexOf('持续时间')<0){
            item.width = 132
          }else if(item.title.indexOf('图片')>-1){
            item.width = 86
          }else if(item.title.indexOf('权限')>-1 || item.title.indexOf('负责城市')>-1){
            item.width = "40%";
            item.className = 'text-left';
          }else{
            if(name_list[item.title]){
              item.width = name_list[item.title];
            }
          }
        }
        item.bordered = true;
      })
    }
  }
  
  render=()=>{
    return (
      <div>
        {this.getOptions()}
      </div>
    )
  }
}