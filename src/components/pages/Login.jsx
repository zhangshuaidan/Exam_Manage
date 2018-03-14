import React from 'react';
import { Form, Icon, Input, Button, Checkbox, message} from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchData, receiveData } from '@/action';
import axios from 'axios';
const FormItem = Form.Item;

class Login extends React.Component {
    state={
        uname:"",
        pwd:""
    }
    componentWillMount() {
        console.log("props=======>>>>>>",this.props);
        const { receiveData } = this.props;
        receiveData(null, 'auth');
        
        let name = sessionStorage.getItem('myweb')
        if (!name) {
            this.props.history.push('/');
        } else {
            this.props.history.push('/app/myweb/home')
        }
    }
    // componentWillReceiveProps(nextProps) {
    //     const { auth: nextAuth = {} } = nextProps;
    //     const { history } = this.props;
    //     if (nextAuth.data && nextAuth.data.uid) {   // 判断是否登陆
    //         localStorage.setItem('user', JSON.stringify(nextAuth.data));
    //         history.push('/');
    //     }
    // }
    success = () => {
        message.success('登录成功',0.5,()=>{
        this.props.history.push('/app/myweb/home')
        });
    };
    error = () => {
        message.error('账号或密码错误,请重新输入',1);
    };
    handleSubmit = (e) => {
        
    
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            // console.log(values);
            axios.post('http://localhost/ExamArrange/login/login.php', {
                uname: values.userName,
                pwd: values.password
            })
                .then((res) => {
                    if (res.data.status==="success"){
                        sessionStorage.setItem('myweb', values.userName);   
                        this.success();
                    }else{
                        this.error();
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        })
        // const { fetchData } = this.props;
        // this.props.form.validateFields((err, values) => {
        //     if (!err) {
        //         console.log('Received values of form: ', values);
        //         const { fetchData } = this.props;
        //         if (values.userName === 'admin' && values.password === 'admin') fetchData({funcName: 'admin', stateName: 'auth'});
        //         if (values.userName === 'guest' && values.password === 'guest') fetchData({funcName: 'guest', stateName: 'auth'});
        //     }
        // });
    };
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="login">
                <div className="login-form" >
                    <div className="login-logo">
                        <span>System Manage</span>
                    </div>
                    <Form onSubmit={this.handleSubmit} style={{maxWidth: '300px'}}>
                        <FormItem>
                            {getFieldDecorator('userName', {
                                rules: [{ required: true, message: '请输入用户名!' }],
                            })(
                                <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入密码!' }],
                            })(
                                <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('remember', {
                                valuePropName: 'checked',
                                initialValue: true,
                            })(
                                <Checkbox>记住我</Checkbox>
                            )}
                            <a className="login-form-forgot" href="" style={{float: 'right'}}>忘记密码</a>
                            <Button type="primary" htmlType="submit" className="login-form-button" style={{width: '100%'}}>
                                登录
                            </Button>
                        </FormItem>
                    </Form>
                </div>
            </div>

        );
    }
}

const mapStateToPorps = state => {
    const { auth } = state.httpData;
    return { auth };
};
const mapDispatchToProps = dispatch => ({
    fetchData: bindActionCreators(fetchData, dispatch),
    receiveData: bindActionCreators(receiveData, dispatch)
});


export default connect(mapStateToPorps, mapDispatchToProps)(Form.create()(Login));