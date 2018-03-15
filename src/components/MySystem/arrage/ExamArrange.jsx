import React from 'react';
import axios from 'axios';

import moment from 'moment';
import { Table, Modal, Button, Select, message, DatePicker, notification, Icon  } from 'antd';
import BreadcrumbCustom from '../../BreadcrumbCustom';
const Option = Select.Option;
class ExamArrange extends React.Component {
    state = { 
        visible: false,
        allCourse:[],
        allRoom:[],
        allinvigilator:[],
        addObj:{},
        tableData:[]
     }
    componentWillMount() {
        this.getData();
        axios.post('http://localhost/ExamArrange/courseManage/findAll.php', {})
            .then((response) => {
                // console.log(response.data);
                this.setState({
                    allCourse: response.data
                })
            })
            .catch(function (error) {
                console.log(error);
            });

        axios.post('http://localhost/ExamArrange/roomManage/findAll.php', {})
            .then((response) => {
                this.setState({
                    allRoom: response.data
                })
            })
            .catch(function (error) {
                console.log(error);
            });

        axios.post('http://localhost/ExamArrange/invigilatorManage/findAll.php', {})
            .then((response) => {
                this.setState({
                    allinvigilator:response.data
                })
            })
            .catch(function (error) {
                console.log(error);
            });
}

    getData=()=>{
          axios.post(' http://localhost/ExamArrange/Arrage/findAll.php', {})
            .then((response) => {
                // console.log("安排记录",response.data)
                this.setState({
                    tableData: response.data
                })
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    //     axios.post('http://localhost/ExamArrange/classManage/findAll.php', {})
    //         .then((response) => {
    //             console.log("获取所有班级",response.data)
    //         })
    //         .catch(function (error) {
    //             console.log(error);
    //         });



    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    handleOk = (e) => {
        // console.log(e);
        // console.log(this.state.addObj.subject);
        // let _this=this;
        axios.post('http://localhost/ExamArrange/Arrage/addArrange.php', {
            obj: JSON.stringify(this.state.addObj)
        })
            .then((response) => {
                console.log(response.data); 
                if (response.data.msg=="success") {
                    this.getData();
                    this.openNotification("安排成功", '已为你安排包含：班级信息为' + response.data.data.str + "  考试科目为" + this.state.addObj.subject+"的"+response.data.data.count+"条考试安排");
                    this.setState({
                        visible:false
                    })
                }else{
                    this.openNotificationerr("考试安排失败","考试安排失败原因为: "+response.data.data.txt+","+response.data.data.tip+"请重新选择考试安排")
                }

            })
            .catch(function (error) {
                console.log(error);
            });

    }
    handleCancel = (e) => {
        // console.log(e);
        this.setState({
            visible: false,
        });
    }
    dateChange = (date, dateString)=>{
        // console.log(date, dateString);
        // console.log(dateString)
        let obj = JSON.parse(JSON.stringify(this.state.addObj));;
        obj['date'] = dateString;
        this.setState({
            addObj: obj
        })
    }
    arrangeChange=(a,v)=>{
        let obj = JSON.parse(JSON.stringify(this.state.addObj));;
        obj[a] = v;
        this.setState({
            addObj: obj
        })

    }

    // 删除记录
    deleteRecord=(v)=>{
        // console.log(v);
        // this.openNotification("删除成功", '删除成功,已为你删除考试科目为:  ' + v.subject + '相关的 ' + 1 + '条考试安排记录');
        axios.post('http://localhost/ExamArrange/Arrage/deleteArrange.php', {
          subject:v.subject,
          date:v.date,
          time:v.time
        })
            .then((response) => {
                console.log(response.data);
                if (response.data>0) {
                    // `删除成功${response.data}`
                    // let a = '删除成功'+response.data;
                    this.openNotification("删除成功", '删除成功,已为你删除考试科目为:  '+v.subject+'相关的 '+response.data+'条考试安排记录');
                    // this.openNotification("删除成功", `删除成功${response.data}条记录`);
                    this.getData();
                }
            })
            .catch(function (error) {
                console.log(error);
            });

    }

    //成功通知提醒框
    openNotification = (m,d) => {
        const key = `open${Date.now()}`;    
        const btn = (
            <Button type="primary" size="small" onClick={() => notification.close(key)}>
                知道了
             </Button>
        );
        notification.open({
            message: m,
            description: d,
            duration:null,
            btn,
            key,
            icon: <Icon type="smile-circle" style={{ color: '#108ee9' }} />,
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
        notification.open({
            message: m,
            description: d,
            duration: null,
            btn,
            key,
            icon: <Icon type="frown" style={{ color: '#FF0B56' }} />,
            style: {

            },
        });
    }; 


    // 不能选择时间
    disabledDate = (current)=> {
        return current && current < moment().endOf('day');
    }
  
    // 导出excel
    exportexcel=()=>{
        console.log("测试导出数据");
        axios.post('http://localhost/ExamArrange/exportexcel/exporttest.php', {
   
        })
            .then((response) => {
                console.log(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {
        const columns = [{
            title: '考试科目',
            dataIndex: 'subject',
            key: 'subject',
            render: text => <a>{text}</a>,
        }, {
            title: '日期',
            dataIndex: 'date',
             key: 'date',
        }, {
            title: '时间',
            dataIndex: 'time',
             key: 'time',
         }, {
            title: '专业',
            dataIndex: 'major',
            key: 'major',
        }, {
             title: '年级',
            dataIndex: 'grade',
            key: 'grade',
        },{
            title: '考场',
            dataIndex: 'room',
            key: 'room',
        },{
            title: '监考人员',
            dataIndex: 'invigilator',
            key: 'invigilator',
        },{
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <span>
                    <Button>修改</Button>
                    <Button type="danger" onClick={this.deleteRecord.bind(this,record)}> 删除</Button>
                </span>
            ),
        }];

        const data = [{
            key: '1',
            subject:"计算机网络",  
            date: '2018-3-10',
            time:"1",
            major:"网络工程",
            grade:"2014",
            classes:"1",
            room: "401",
            invigilator: "张监考"
        }, {
                key: '2',
                subject: "计算机网络",
                date: '2018-3-10',
                time: "1",
                major: "计算机科学与技术",
                grade: "2014",
                classes: "1",
                room:"401",
                invigilator:"张监考"
            }, {
                key: '3',
                subject: "计算机网络",
                date: '2018-3-10',
                time: "1",
                major: "物联网工程",
                grade: "2014",
                classes: "1",
                room: "401",
                invigilator: "张监考"
            }];
        return (
            <div>
                <BreadcrumbCustom first="考试安排" second="考试安排" />
                <div className="arrange_header">
                        <div className="arrange_option">
                        <div className="download">
                            <Button type="dashed" icon="download" onClick={()=> window.location.href ="http://localhost/ExamArrange/exportexcel/exporttest.php"}>导出</Button>
                        </div>
                        <div className="newarrange">
                            <Button type="primary" onClick={this.showModal}>新增考试安排</Button>
                        </div>
                      
                        </div>
                </div>
             
                
                {/* <Button type="primary" onClick={this.exportexcel}>测试导出数据</Button> */}
                {/* <a href="http://localhost/ExamArrange/exportexcel/exporttest.php">测试导出数据
                </a> */}
                <Modal
                    title="新增考试安排"
                    visible={this.state.visible}
                    okText="确认"
                    cancelText="取消"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                <div className="arrange_wrapper">
                    <div className="select_wrapper">
                        <span>请选择科目</span>
                            <Select defaultValue="请选择" style={{ width: 240 }} onChange={this.arrangeChange.bind(this,"subject")}>
                                {
                                    this.state.allCourse.map((item, index) =>
                                        <Option key={index} value={item.coursename} >{item.coursename}</Option>
                                    )
                                }     
                            </Select>
                    </div>
                        <div className="select_wrapper">
                            <span>请选择日期</span>
                            <DatePicker onChange={this.dateChange} disabledDate={this.disabledDate} />
                        </div>

                        <div className="select_wrapper">
                            <span>请选择具体考试时间</span>
                            <Select defaultValue="请选择" style={{ width: 240 }} onChange={this.arrangeChange.bind(this, "time")} >
                                <Option value="08:00-09:50">08:00-09:50</Option>
                                <Option value="10:10-12:00">10:10-12:00</Option>
                                <Option value="14:30-16:20">14:30-16:20</Option>
           
                            </Select>
                        </div>
                        <div className="select_wrapper">
                            <span>请选择考场</span>
                            <Select defaultValue="请选择" style={{ width: 240 }} onChange={this.arrangeChange.bind(this, "room")}>
                                {
                                    this.state.allRoom.map((item, index) =>
                                        <Option key={index} value={item.room} >{item.room}</Option>)
                                }
                            </Select>
                        </div>
                        <div className="select_wrapper">
                            <span>请选择监考人员</span>
                            <Select defaultValue="请选择" style={{ width: 240 }} onChange={this.arrangeChange.bind(this, "invigilator")}>
                                {
                                    this.state.allinvigilator.map((item, index) =>
                                        <Option key={index} value={item.invigilator} >{item.invigilator}</Option>)
                                }
                            </Select>
                        </div>

                </div>
                </Modal>

                <Table columns={columns} dataSource={this.state.tableData} rowKey="id"/>
            </div>
        )

    }
}

export default ExamArrange;