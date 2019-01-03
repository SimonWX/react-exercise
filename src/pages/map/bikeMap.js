import React from 'react'
import {Card, Form} from 'antd'
import axios from './../../axios'
import BaseForm from '../../components/BaseForm';
export default class BikeMap extends React.Component{
    
    state = {}

    map = '';

    formList = [
        {
            type: '城市'
        },
        {
            type: '时间查询'
        },
        {
            type: 'SELECT',
            label: '订单状态',
            field: 'order_status',
            placeholder: '全部',
            initialValue: '0',
            list: [{id: '0', name: '全部'},{id: '1', name: '进行中'},{id: '2', name: '行程结束'}]
        }
    ]

    requestList = ()=>{
        axios.ajax({
            url: '/map/bike_list',
            data: {
                parmas: this.params
            }
        }).then((res)=>{
            if(res){
                this.setState({
                    total_count: res.result.total_count
                })
                this.renderMap(res);
            }
        })
    }
    
    componentWillMount(){
        this.requestList();
    }

    // 查询表单
    handelFilterSubmit = (filterParams)=>{
        this.params = filterParams;
        this.requestList();
    }

    // 渲染地图数据
    renderMap = (res)=>{
        let list = res.result.route_list;
        this.map = new window.BMap.Map('container')
        let gps1 = list[0].split(',');
        let startPoint = new window.BMap.Point(gps1[0], gps1[1]);
        let gps2 = list[list.length - 1].split(',');
        let endPoint = new window.BMap.Point(gps2[0], gps2[1]);
        this.map.centerAndZoom(endPoint, 11); // 保证地图在中间

        let startPointIcon =  new window.BMap.Icon('/assets/start_point.png', new window.BMap.Size(36,42), {
            imageSize: new window.BMap.Size(36,42)
        })
        let bikeMarkerStart = new window.BMap.Marker(startPoint, {icon: startPointIcon});
        this.map.addOverlay(bikeMarkerStart);
        let endPointIcon =  new window.BMap.Icon('/assets/end_point.png', new window.BMap.Size(36,42), {
            imageSize: new window.BMap.Size(36,42)
        })
        let bikeMarkerEnd = new window.BMap.Marker(endPoint, {icon: endPointIcon});
        this.map.addOverlay(bikeMarkerEnd);
    }

    render(){
        return(
            <div>
                <Card>
                    <BaseForm formList={this.formList} filterSubmit={this.handelFilterSubmit}/>
                </Card>
                <Card style={{marginTop:10}}>
                    <div>共{this.state.total_count}辆车</div>
                    <div id="container" style={{height: 500}}></div>
                </Card>
            </div>
        );
    }
}