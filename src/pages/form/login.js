import React from 'react';
import {Card, Form, Input, Button, message, Icon, Checkbox} from 'antd';
const FormItem = Form.Item;
class FormLogin extends React.Component{
    handleSubmit = ()=>{
        let userInfo = this.props.form.getFieldsValue();
        this.props.form.validateFields((err,values)=>{
            if(!err){
                message.success(`${userInfo.userName}恭喜，您通过本次表单组件学习，密码为${userInfo.userPassword}`)
            }
        })
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Card title="登录行内表单" className="card-wrap">
                    <Form layout="inline">
                        <FormItem>
                            <Input placeholder="请输入用户名"/>
                        </FormItem>
                        <FormItem>
                            <Input placeholder="请输入用户名"/>
                        </FormItem>
                        <FormItem>
                            <Button type="primary">登录</Button>
                        </FormItem>
                    </Form>
                </Card>
                <Card title="登录水平表单"  className="card-wrap">
                    <Form layout="horizontal" style={{width:300}}>
                        <FormItem>
                            {
                                getFieldDecorator('userName',{
                                    initialValue: '',
                                    rules: [
                                        {
                                            required: true,
                                            messgae:'用户名不能为空！'
                                        },
                                        {
                                            min:5, max:10,
                                            message:'长度不在范围内'
                                        },
                                        {
                                            pattern: new RegExp('^\\w+$','g'),
                                            message:'用户名要以字母为开头'
                                        }
                                    ]
                                })(
                                    <Input prefix={<Icon type="user"/>} placeholder="请输入用户名"/>
                                )
                            }
                        </FormItem>
                        <FormItem>
                            {
                                getFieldDecorator('userPassword',{
                                    initialValue: '',
                                    rules: [
                                        {
                                            required: true,
                                            messgae:'密码不能为空！'
                                        }
                                    ]
                                })(
                                    <Input prefix={<Icon type="lock"/>} placeholder="请输入密码"/>
                                )
                            }
                        </FormItem>
                        <FormItem>
                            {
                                getFieldDecorator('remember',{
                                    initialValue: true,
                                    valuePropName: 'checked'
                                })(
                                    <Checkbox>记住密码</Checkbox>
                                )
                            }
                            <a style={{float:"right"}}>忘记密码？</a>
                        </FormItem>
                        <FormItem>
                            <Button type="primary" onClick={this.handleSubmit}>登录</Button>
                        </FormItem>
                    </Form>
                </Card>
            </div>
        )
    }
}
export default Form.create()(FormLogin);