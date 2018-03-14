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
                console.log(response.data);
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
        console.log(a)
        this.setState({
            changevisible: true,
            id: a.id,
            room: "",
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
                room: _this.state.room
            })
                .then((response) => {
                    console.log(response.data);
                    if (response.data > 0) {
                        _this.getData();
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
        console.log('room===>',this.state.room);
        if (this.state.room) {
            axios.post('http://localhost/ExamArrange/roomManage/addRoom.php', {
                room: _this.state.room
            })
                .then((response) => {
                    // console.log(response.data);
                    if (response.data > 0) {
                        _this.getData();
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


    inpChange = (e) => {
        let v = e.target.value;
        this.setState({
            room: v
        })
    }
    render() {
        const columns = [{
            title: '考试地点',
            dataIndex: 'room',
            key: 'room',
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
        const data = [{
            id: 1,
            room: "教室A",
        }, {
            id: 2,
            room: "教室B",
        }, {
            id: 3,
            room: "教室C",
        },
        ];
        return (
            <div>
                {/* 面包屑 */}
                <BreadcrumbCustom first="考试管理" second="教室管理" />

                <Button type="primary" onClick={this.addCourse.bind(this)}>添加教室信息</Button>
                <Table columns={columns} dataSource={this.state.tabledata} rowKey="id" />

                {/* 修改对话框 */}
                {
                    this.state.changevisible && (<Modal
                        title="修改教室信息"
                        visible={this.state.changevisible}
                        onOk={this.changeCourseOk}
                        onCancel={this.changeCancel}
                        okText="确认"
                        cancelText="取消"
                    >

                        <div className="course_inp_wrapper">
                            <span className="course_span">考试地点</span>  <Input placeholder="请输入修改后的教室地点" onChange={this.inpChange} />
                        </div>
                    </Modal>)
                }

                {/* 添加 */}

                {
                    this.state.addvisible && (<Modal
                        title="添加教室信息"
                        visible={this.state.addvisible}
                        onOk={this.addCourseOk}
                        onCancel={() => this.setState({
                            addvisible: false
                        })}
                        okText="确认"
                        cancelText="取消"
                    >

                        <div className="course_inp_wrapper">
                            <span className="course_span">考试地点</span>  <Input placeholder="请输入添加的教室地点" onChange={this.inpChange} />
                        </div>
                    </Modal>)
                }
            </div>
        )

    }
}

export default RoomManage;