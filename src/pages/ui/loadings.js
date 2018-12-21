import React from 'react'
import {Card, Button, Spin, Icon, Alert} from 'antd'
import './ui.less'
export default class Loadings extends React.Component{
    render(){
        return (
            <div>
                <Card title="Spin的用法" className="card-warp">
                    {/* <Spin size="small"/>
                    <Spin size="default"/>
                    <Spin size="large"/> */}
                    <Spin></Spin>
                </Card>
                <Card>
                    
                </Card>
            </div>
        )
    }
}