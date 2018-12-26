import React from 'react'
import {Card, Button, message, Tabs, Icon} from 'antd'
import './ui.less'
const TabPane = Tabs.TabPane;
export default class Tables extends React.Component{
    newTabIndex = 0;
    handleCallBack = (key)=>{
        message.info('Hi,您选择了页签：'+key)
    }
    componentWillMount () {
        const panes = [
            {
                title: 'Tab 1',
                content: 'Tab 1',
                key: '1'
            },
            {
                title: 'Tab 2',
                content: 'Tab 2',
                key: '2'
            },
            {
                title: 'Tab 3',
                content: 'Tab 3',
                key: '3'
            }
        ]
        this.setState({
            // panes: panes
            activeKey: panes[0].key,
            panes
        })
    }
    onChange = (activeKey)=>{
        this.setState({
            activeKey
        })
    }
    onEdit = (targetKey, action)=>{
        this[action](targetKey);
    }
    add = ()=>{
        const panes = this.state.panes;
        const activeKey = `newTab ${this.newTabIndex++}`;
        panes.push({title: activeKey, content: 'New Tab Pane', key: activeKey});
        this.setState({panes, activeKey});
    }
    remove = (targetKey)=>{
        let activeKey = this.state.activeKey;
        let lastIndex;
        this.state.panes.forEach((pane,i)=>{
            if (pane.key === targetKey){
                lastIndex = i - 1;
            }
        });
        const panes = this.state.panes.filter(pane=>pane.key !== targetKey);
        if(lastIndex >= 0 && activeKey === targetKey){
            activeKey = panes[lastIndex].key;
        }
        this.setState({panes,activeKey})
    }
    render () {
        return (
            <div>
                <Card title="Tab页签" className="card-wrap"> 
                    <Tabs defaultActiveKey="1" onChange={this.handleCallBack}>
                        <TabPane tab="Tab 1" key="1">欢迎学习react</TabPane>
                        <TabPane tab="Tab 2" key="2" disabled>欢迎学习vue</TabPane>
                        <TabPane tab="Tab 3" key="3">欢迎学习angular</TabPane>
                    </Tabs>
                </Card>
                <Card title="Tab页签(Icon)" className="card-wrap"> 
                    <Tabs defaultActiveKey="1" onChange={this.handleCallBack}>
                        <TabPane tab={<span><Icon type="plus"/>Tab 1</span>} key="1">欢迎学习react</TabPane>
                        <TabPane tab={<span><Icon type="edit"/>Tab 2</span>} key="2">欢迎学习vue</TabPane>
                        <TabPane tab={<span><Icon type="delete"/>Tab 3</span>} key="3">欢迎学习angular</TabPane>
                    </Tabs>
                </Card>
                <Card title="Tab页签(可编辑增删)" className="card-wrap"> 
                    <Tabs 
                        onChange={this.onChange}
                        activeKey={this.state.activeKey}
                        type="editable-card"
                        onEdit={this.onEdit}
                    >
                        {
                            this.state.panes.map((panel)=>{
                                return  <TabPane 
                                    tab={panel.title}
                                    key={panel.key}
                                    content={panel.content}
                                />
                            })
                        }
                    </Tabs>
                </Card>
            </div>
        )
    }
}