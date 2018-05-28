import React from 'react';
import axios from 'axios';
import { Table, Button, Modal, Input, message } from 'antd';
// 引入面包屑
import BreadcrumbCustom from '../../BreadcrumbCustom';

class RoomManage extends React.Component {
    state = {
        changevisible: false,
        addvisible: false,
        room: "",
        hold:"",
        id: "",
        tabledata: []
    }
    componentWillMount() {
        this.getData();
    }

    // 获取数据
    getData = () => {
        let _this = this;
        axios.post('http://localhost/ExamArrange/roomManage/findAll.php', {})
            .then((response) => {
                // console.log(response.data);
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
        console.log(a);
        this.setState({
            changevisible: true,
            id: a.id,
            room: a.room,
            hold:a.hold
        })
    }
    // 删除
    deleteCourse = (a) => {
        console.log(a);
        let _this = this;
        axios.post('http://localhost/ExamArrange/roomManage/deleteRoom.php', {
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
            room: ""
        })
    }

    // 更改课程信息
    changeCourseOk = () => {
        let _this = this;
        if (this.state.room) {
            axios.post('http://localhost/ExamArrange/roomManage/updateRoom.php', {
                id: _this.state.id,
                room: _this.state.room,
                hold:_this.state.hold
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
                changevisible: false
            })
        } else {
            message.error('请将修改信息输入完整');
        }
    }

    addCourseOk = () => {
        let _this = this;
        if (this.state.room) {
            axios.post('http://localhost/ExamArrange/roomManage/addRoom.php', {
                room: _this.state.room,
                hold:_this.state.hold
            })
                .then((response) => {
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
            message.error('请输入课程信息');
        }

    }
    changeCancel = () => {
        this.setState({
            changevisible: false
        })
    }


    inpChange = (a,e) => {
        let v = e.target.value;
        if (a=="room") {
        this.setState({
            room: v
        })
        }else if (a=="hold") {
            this.setState({
                hold: v
            }) 
        }
 
    }
    render() {
        const columns = [{
            title: '考试地点',
            dataIndex: 'room',
            key: 'room',
            render: text => <a>{text}</a>,
        }, {
                title: '座位数',
                dataIndex: 'hold',
                key: 'hold',
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
                <BreadcrumbCustom first="考试管理" second="考场管理" />
                <div className="room_header">
                    <div className="room_option">
                        <Button type="primary" onClick={this.addCourse.bind(this)}>添加考场信息</Button>
                    </div>
                </div>
            
                <Table columns={columns} dataSource={this.state.tabledata} rowKey="id" />

                {/* 修改对话框 */}
                {
                    this.state.changevisible && (<Modal
                        title="修改考场信息"
                        visible={this.state.changevisible}
                        onOk={this.changeCourseOk}
                        onCancel={this.changeCancel}
                        okText="确认"
                        cancelText="取消"
                    >

                        <div className="course_inp_wrapper">
                            <span className="course_span">考试地点</span>  <Input placeholder="请输入修改后的考场地点" value={this.state.room} onChange={this.inpChange.bind(this, "room")} />
                        </div>
                        <div className="course_inp_wrapper">
                            <span className="course_span">容纳人数</span>  <Input type="number" value={this.state.hold} onChange={this.inpChange.bind(this, "hold")} />
                        </div>
                    </Modal>)
                }

                {/* 添加 */}

                {
                    this.state.addvisible && (<Modal
                        title="添加考场信息"
                        visible={this.state.addvisible}
                        onOk={this.addCourseOk}
                        onCancel={() => this.setState({
                            addvisible: false
                        })}
                        okText="确认"
                        cancelText="取消"
                    >

                        <div className="course_inp_wrapper">
                            <span className="course_span">考试地点</span>  <Input placeholder="请输入添加的考场地点" onChange={this.inpChange.bind(this,"room")} />
                        </div>
                        <div className="course_inp_wrapper">
                            <span className="course_span">容纳人数</span>  <Input type="number" placeholder="请输入考场座位数" onChange={this.inpChange.bind(this,"hold")} />
                        </div>
                    </Modal>)
                }
            </div>
        )

    }
}

export default RoomManage;