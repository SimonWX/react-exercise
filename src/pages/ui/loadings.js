import React from 'react'
import {Card, Spin, Icon, Alert} from 'antd'
import './ui.less'
export default class Loadings extends React.Component{
    render(){
        const iconL = <Icon type="loading" style={{fontSize:32}}/>
        return (
            <div>
                <Card title="Spin的用法" className="card-wrap">
                    <Spin size="small"></Spin>
                    <Spin style={{marin:'0 10px'}}></Spin>
                    <Spin size="large"></Spin>
                    <Spin indicator={iconL} style={{marginLeft:10}} spinning={true}></Spin>
                </Card>
                <Card title="内容遮罩" className="card-wrap">
                    <Alert 
                        message="Info"
                        description="欢迎来到react高级实战课程"
                        type="info"
                    />
                    <Alert 
                        message="Warning"
                        description="欢迎来到react高级实战课程"
                        type="warning"
                    />
                    <Alert 
                        message="Success"
                        description="欢迎来到react高级实战课程"
                        type="success"
                    />
                    <Spin indicator={iconL}>
                        <Alert 
                            message="嵌套"
                            description="欢迎来到react高级实战课程"
                            type="success"
                        />
                    </Spin>
                    <Spin tip="加载中...">
                        <Alert 
                            message="嵌套"
                            description="欢迎来到react高级实战课程"
                            type="success"
                        />
                    </Spin>
                </Card>
            </div>
        )
    }
}