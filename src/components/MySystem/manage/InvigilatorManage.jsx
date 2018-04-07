import React from 'react';
import axios from 'axios';
import { Table, Button, Modal, Input, message } from 'antd';
// 引入面包屑
import BreadcrumbCustom from '../../BreadcrumbCustom';

class InvigilatorManage extends React.Component {
    state = {
        changevisible: false,
        addvisible: false,
        invigilator: "",
        id: "",
        tabledata: []
    }
    componentWillMount() {
        this.getData();
    }

    // 获取数据
    getData = () => {
        let _this = this;
        axios.post('http://localhost/ExamArrange/invigilatorManage/findAll.php', {})
            .then((response) => {
                _this.setState({
                    tabledata: response.data
                })
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    // 更改课程
    changeCourse = (a) => {
        // console.log(a);
        this.setState({
            changevisible: true,
            id: a.id,
            invigilator: a.invigilator,
        })
    }
    // 删除课程
    deleteCourse = (a) => {
        // console.log(a);
        let _this = this;
        axios.post('http://localhost/ExamArrange/invigilatorManage/deleteInvigilator.php', {
            id: a.id
        })
            .then((response) => {
                if (response.data > 0) {
                    _this.getData();
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    // 添加课程信息
    addCourse = () => {
        this.setState({
            addvisible: true,
            invigilator: ""
        })
    }

    // 更改课程信息
    changeCourseOk = () => {
        let _this = this;

        if (this.state.invigilator) {
            axios.post('http://localhost/ExamArrange/invigilatorManage/updateInvigilator.php', {
                id: _this.state.id,
                invigilator: _this.state.invigilator
            })
                .then((response) => {

                    // console.log(response.data);
                    // if (response.data > 0) {
                    //     _this.getData();
                    // }

                    if (response.data.msg === "success") {
                        message.success(response.data.data.tip);
                        _this.getData();
                    } else {
                        message.error(response.data.data.tip);
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });

            this.setState({
                changevisible: false
            })
        } else {
            message.error('请将修改信息输入完整');
        }


    }

    addCourseOk = () => {
        let _this = this;
        if (this.state.invigilator) {
            axios.post('http://localhost/ExamArrange/invigilatorManage/addInvigilator.php', {
                invigilator: _this.state.invigilator
            })
                .then((response) => {
                    // console.log(response.data);
                    if (response.data.msg === "success") {
                        message.success(response.data.data.tip);
                        _this.getData();
                    } else {
                        message.error(response.data.data.tip);
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
            this.setState({
                addvisible: false
            })
        } else {
            message.error('请输入监考信息');
        }

    }
    changeCancel = () => {
        this.setState({
            changevisible: false
        })
    }


    inpChange = (e) => {
        let v = e.target.value;
        this.setState({
            invigilator: v
        })
    }
    render() {
        const columns = [{
            title: '监考人员',
            dataIndex: 'invigilator',
            key: 'invigilator',
            render: text => <a>{text}</a>,
        }, {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <span>
                    <Button onClick={this.changeCourse.bind(this, record)}>修改</Button>
                    <Button type="danger" onClick={this.deleteCourse.bind(this, record)}> 删除</Button>
                </span>
            ),
        }];
        return (
            <div>
                {/* 面包屑 */}
                <BreadcrumbCustom first="考试管理" second="监考管理" />
                    <div className="ingilator_header">
                    <div className="ingilatoroption">
                        <Button type="primary" onClick={this.addCourse.bind(this)}>添加监考人员</Button>
                    </div>
                   
                    </div>
             
                <Table columns={columns} dataSource={this.state.tabledata} rowKey="id" />

                {/* 修改对话框 */}
                {
                    this.state.changevisible && (<Modal
                        title="修改监考人员"
                        visible={this.state.changevisible}
                        onOk={this.changeCourseOk}
                        onCancel={this.changeCancel}
                        okText="确认"
                        cancelText="取消"
                    >

                        <div className="course_inp_wrapper">
                            <span className="course_span">监考人员</span>  <Input placeholder="请输入修改后的监考人员" value={this.state.invigilator} onChange={this.inpChange} />
                        </div>
                    </Modal>)
                }

                {/* 添加 */}

                {
                    this.state.addvisible && (<Modal
                        title="添加监考信息"
                        visible={this.state.addvisible}
                        onOk={this.addCourseOk}
                        onCancel={() => this.setState({
                            addvisible: false
                        })}
                        okText="确认"
                        cancelText="取消"
                    >

                        <div className="course_inp_wrapper">
                            <span className="course_span">监考人员</span>  <Input placeholder="请输入监考名称" onChange={this.inpChange} />
                        </div>
                    </Modal>)
                }
            </div>
        )

    }
}

export default InvigilatorManage;