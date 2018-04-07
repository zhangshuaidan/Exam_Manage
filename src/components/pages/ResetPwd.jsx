import React from "react";
import axios from 'axios';
import { Form, Input, Row, Col, Checkbox, Button, AutoComplete, Icon,notification  } from 'antd';
const FormItem = Form.Item;

class ResetPwd extends React.Component{
    
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
    };
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                axios.post('http://localhost/ExamArrange/login/resetpwd.php', {
                values
                })
                    .then((res) => {
                        console.log(res.data);
                         if(res.data.msg=="success"){
                             sessionStorage.removeItem('myweb');
                             this.openNotification(res.data.data.txt,res.data.data.tip)
                         }else{
                             this.openNotificationerr(res.data.data.txt, res.data.data.tip)
                         }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        });
    }
    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }
    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('两次密码输入不一致');
        } else {
            callback();
        }
    }
    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    }

    //成功通知提醒框
    openNotification = (m, d) => {
        const key = `open${Date.now()}`;
        const btn = (
            <Button type="primary" size="small" onClick={() => 
                {
                notification.close(key)
                this.props.history.push('/')
                }
            
            
            }>
                前去登录
             </Button>
        );
        notification['success']({
            message: m,
            description: d,
            duration: null,
            btn,
            key,
            style: {

            },
        });
    }; 

    //失败通知提醒框
    openNotificationerr = (m, d) => {
        const key = `open${Date.now()}`;
        const btn = (
            <Button type="primary" size="small" onClick={() => notification.close(key)}>
                知道了
             </Button>
        );
        notification['error']({
            message: m,
            description: d,
            duration: null,
            btn,
            key,
            style: {

            },
        });
    }; 

render(){
 
    const { getFieldDecorator } = this.props.form;
    const { autoCompleteResult } = this.state;

    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 8 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
        },
    };
    const tailFormItemLayout = {
        wrapperCol: {
            xs: {
                span: 24,
                offset: 0,
            },
            sm: {
                span: 16,
                offset: 8,
            },
        },
    };

    return(
        <div style={{ "background":"#f3f3f3","height":"100%"}}>
            <div className="resetpwd">
                <p className="title"> 重置密码</p>
                <Row type="flex" justify="center">
                   
                    <Col span={8} className="pwd_wrapper">
                        <Form onSubmit={this.handleSubmit}>
                            <FormItem
                                {...formItemLayout}
                                label="用户名"
                            >
                                {getFieldDecorator('username', {
                                    rules: [ {
                                        required: true, message: '请输入你的用户名',
                                    }],
                                })(
                                    <Input />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="原始密码"
                            >   {getFieldDecorator('oldpwd', {
                                rules: [{ required: true, message: '请输入原始密码', whitespace: true }],
                            })(
                                    <Input type="password"/>
                            )}

                            </FormItem>
   
                            <FormItem
                                {...formItemLayout}
                                label="密码"
                            >
                                {getFieldDecorator('password', {
                                    rules: [{
                                        required: true, message: '请输入你的密码',
                                    }, {
                                        validator: this.validateToNextPassword,
                                    }],
                                })(
                                    <Input type="password" />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="确认密码"
                            >
                                {getFieldDecorator('confirm', {
                                    rules: [{
                                        required: true, message: '请确认输入你的密码',
                                    }, {
                                        validator: this.compareToFirstPassword,
                                    }],
                                })(
                                    <Input type="password" onBlur={this.handleConfirmBlur} />
                                )}
                            </FormItem>




                            <FormItem {...tailFormItemLayout}>
                                <Button type="primary" htmlType="submit">修改</Button>
                            </FormItem>
                        </Form>
                    </Col>

                </Row>
            </div>

              
        </div>
    )
}
}
// const WrappedRegistrationForm = Form.create()(RegistrationForm);
export default Form.create()(ResetPwd);