import React from 'react';
import axios from 'axios';
import { Table, Modal, Button, Select, message} from 'antd';
// 引入样式
import "../../../style/Mysystem/classmanager.less";

// 引入面包屑
import BreadcrumbCustom from '../../BreadcrumbCustom';

const Option = Select.Option;
class ClassesManage extends React.Component {
    state = { 
        visible: false,
        addvisible:false,
        obj:{
            department:"请选择",
            major:"请选择",
            grade:"请选择",
            class_name:"请选择"

        },
        addobj:{},
        tabledata:[],
    }
    
    componentWillMount(){
        this.getData();
    }
    // add=()=>{
    //     console.log("add")
    // this.setState({
    //     addvisible: true,
    // })
    // }

    getData=()=>{
        axios.post('http://localhost/ExamArrange/classManage/findAll.php', {})
            .then((response) => {
                this.setState({
                    tabledata: response.data
                })
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    // 添加班级信息
    addClasses=()=>{
        this.setState({
            addvisible: true, 
            addobj:{}
        })
    }

    // 添加成功
    addhandleOk=()=>{
        let _this=this;
        let a = this.state.addobj.hasOwnProperty("department");
        let b = this.state.addobj.hasOwnProperty("major");
        let c = this.state.addobj.hasOwnProperty("grade");
        let d = this.state.addobj.hasOwnProperty("class_name");
        if (a&&b&&c&&d) {
        axios.post('http://localhost/ExamArrange/classManage/addClasses.php', {
            data:JSON.stringify(_this.state.addobj)
        })
            .then((response) => {
           console.log(response.data);
             if (response.data>0) {
                 _this.getData();
           }
            })
            .catch(function (error) {
                console.log(error);
            });


        this.setState({
            addvisible: false,
        })
        }else{
            // _this.error();
            message.error('请将信息填写完整');
            // console.log("未包含");
        }
      
       
    }
    //   删除记录
     deleteRocord=(r)=>{
    // console.log(r)
        let _this=this;
         axios.post('http://localhost/ExamArrange/classManage/deleteClasses.php', {
            id:r.id
         })
             .then((response) => {
                //  console.log(response.data);
                 if (response.data) {
                     _this.getData();
                }
         
             })
             .catch(function (error) {
                 console.log(error);
             });

}
    addhandleCancel=()=>{
        this.setState({
            addvisible: false
        })
    }

    showModal = (a) => {
        // console.log("a=====>>>>>",a);
        this.setState({
            visible: true,
            obj:a
        });
    }
    
    handleOk = (e) => {
        let _this=this;
        axios.post('http://localhost/ExamArrange/classManage/updateClasses.php', {
            data:JSON.stringify(this.state.obj)
        })
            .then((response) => {
                // console.log(response.data);
                if (response.data>0) {
                    _this.getData();
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        this.setState({
            visible: false,
        });
    }
    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }

    test=(q)=>{
        console.log(q);
    }

    handleChange=(a,value)=> {
     let obj=JSON.parse(JSON.stringify(this.state.obj));
     obj[a]=value;
        this.setState({
            obj
        })
    }
    addChange = (a, value) => {
        let addobj = JSON.parse(JSON.stringify(this.state.addobj));
        addobj[a] = value;
        this.setState({
            addobj
        })
    }

    render() {
        const columns = [{
            title: '院系',
            dataIndex: 'department',
            key: 'department',
            render: text => <a>{text}</a>,
        }, {
            title: '专业',
            dataIndex: 'major',
            key: 'major',
        },{
            title: '年级',
            dataIndex: 'grade',
            key: 'grade',
        }, {
            title: '班级',
            dataIndex: 'classes',
            key: 'classes',
                render: (text, record) => (<a>{record.class_name}</a>)
            
            }, 
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <span>
                    <Button onClick={this.showModal.bind(this,record)}>修改</Button>
                    <Button type="danger" onClick={this.deleteRocord.bind(this,record)}> 删除</Button>
                    
                </span>
            ),
        }];
        const data = [{
            key:1,
            department:"信息工程学院",
            major:"网络工程",
            grade:"2014",
            classes:"1"
        },{
                key: 2,
                department: "信息工程学院",
                major: "计算科学与技术",
                grade: "2015",
                classes: "2"
            },{
                key: 3,
                department: "信息工程学院",
                major: "物联网工程",
                grade: "2016",
                classes: "3"
            },
    ];
        return (
            <div>
                <BreadcrumbCustom first="考试管理" second="班级管理" />
                <Button type="primary" onClick={this.addClasses.bind(this)}>添加班级信息</Button>
                <Modal
                    title="班级信息修改"
                    visible={this.state.visible}
                    okText="确认"
                    cancelText="取消"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                <div className="ClassesForm">
                    <div className="ClassSelect">
                        <span>
                             院系:
                        </span>
        
                            <Select value={this.state.obj.department} style={{ width: 250 }} onChange={this.handleChange.bind(this,"department")}>
                            <Option value="信息工程学院">信息工程学院</Option>
                   
                        </Select>
                    
                    </div>
                        <div className="ClassSelect">
                            <span>专业:</span>
                            <Select value={this.state.obj.major} style={{ width: 250 }} onChange={this.handleChange.bind(this,"major")}>
                                <Option value="网络工程">网络工程</Option>
                                <Option value="计算机科学与技术">计算机科学与技术</Option>
                                <Option value="物联网工程">物联网工程</Option>
                                <Option value="数字媒体">数字媒体</Option>
                            </Select>
                        </div>

                        <div className="ClassSelect">
                            <span>年级:</span>
                            <Select value={this.state.obj.grade} style={{ width: 250 }} onChange={this.handleChange.bind(this,"grade")}>
                                <Option value="2014">2014</Option>
                                <Option value="2015">2015</Option>
                                <Option value="2016">2016</Option>
                                <Option value="2017">2017</Option>
                                <Option value="2018">2018</Option>
                            </Select>
                        </div>
                        <div className="ClassSelect">
                            <span>班级:</span>
                            <Select value={this.state.obj.class_name} style={{ width: 250 }} onChange={this.handleChange.bind(this,"class_name")}>
                                <Option value="1">1</Option>
                                <Option value="2">2</Option>
                                <Option value="3">3</Option>
                            </Select>
                        </div>
                        班级:{this.state.obj.major}
                        年级:{this.state.obj.grade}
                        班级:{this.state.obj.class_name}
                </div>
             
                </Modal>

                <Modal
                    title="添加班级信息"
                    visible={this.state.addvisible}
                    okText="确认"
                    cancelText="取消"
                    onOk={this.addhandleOk}
                    onCancel={this.addhandleCancel}
                >
                    {this.state.addvisible && (<div className="ClassesForm">
                        <div className="ClassSelect">
                            <span>
                                院系:
                        </span>
                            <Select defaultValue="请选择" style={{ width: 250 }} onChange={this.addChange.bind(this, "department")}>
                                <Option value="信息工程学院">信息工程学院</Option>

                            </Select>

                        </div>
                        <div className="ClassSelect">
                            <span>班级:</span>
                            <Select defaultValue="请选择" style={{ width: 250 }} onChange={this.addChange.bind(this, "major")} >
                                <Option value="网络工程">网络工程</Option>
                                <Option value="计算机科学与技术">计算机科学与技术</Option>
                                <Option value="物联网工程">物联网工程</Option>
                                <Option value="数字媒体">数字媒体</Option>
                            </Select>
                        </div>

                        <div className="ClassSelect">
                            <span>年级:</span>
                            <Select defaultValue="请选择" style={{ width: 250 }} onChange={this.addChange.bind(this, "grade")}>
                                <Option value="2014">2014</Option>
                                <Option value="2015">2015</Option>
                                <Option value="2016">2016</Option>
                                <Option value="2017">2017</Option>
                                <Option value="2018">2018</Option>

                            </Select>
                        </div>
                        <div className="ClassSelect">
                            <span>班级:</span>
                            <Select defaultValue="请选择" style={{ width: 250 }} onChange={this.addChange.bind(this, "class_name")}>
                                <Option value="1">1</Option>
                                <Option value="2">2</Option>
                                <Option value="3">3</Option>


                            </Select>
                        </div>
                    </div>)}
                  

                </Modal>         


                 <Table columns={columns} dataSource={this.state.tabledata} rowKey="id" />

            </div>
        )

    }
}

export default ClassesManage;