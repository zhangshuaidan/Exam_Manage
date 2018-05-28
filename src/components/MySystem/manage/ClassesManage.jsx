import React from 'react';
import axios from 'axios';
import { Table, Modal, Button, Input, Select, Upload, Icon, message, notification} from 'antd';
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
            class_name:"请选择",
            count:""

        },
        addobj:{},
        tabledata:[],
        fileList: [],
        uploading: false
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
        // console.log(this.state.addobj);
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
        if(response.data.msg=="success"){
            message.success(response.data.data.tip);
            _this.getData();
        }else{
            message.error(response.data.data.tip);
        }
            })
            .catch(function (error) {
                console.log(error);
            });
        this.setState({
            addvisible: false,
        })
        }else{
            message.error('请将信息填写完整');
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
        // console.log(this.state.obj);
        axios.post('http://localhost/ExamArrange/classManage/updateClasses.php', {
            data:JSON.stringify(this.state.obj)
        })
            .then((response) => {
                console.log(response.data);
   
                if (response.data.msg == "success") {
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
     let v;
     if (a=="count") {
         v=value.target.value;
     }else{
         v=value;
     }
     obj[a]=v;
        this.setState({
            obj
        })
    }
    handleUpload = () => {
        let _this = this;
        const { fileList } = this.state;
        const formData = new FormData();
        // console.log(fileList);
        this.setState({
            uploading: true,
        });
        formData.append('myfile', fileList[0], fileList[0].name);//通过append向form对象添加数据
        let config = {
            headers: { 'Content-Type': 'multipart/form-data' }
        };  //添加请求头
        axios.post('http://localhost/ExamArrange/classManage/importClasses.php', formData, config)
            .then(response => {
                console.log(response.data);
                _this.getData();
                this.openNotification("班级数据导入成功", response.data.data.txt);
                this.setState({
                    uploading: false,
                });
            })
    }
    addChange = (a, value) => {
        // console.log("a=====>>>",a);
        // console.log("value===>>>>",value);

        let addobj = JSON.parse(JSON.stringify(this.state.addobj));
        let v;
        if (a=="count") {
            v=value.target.value;
        }else{
            v=value;
        }
        addobj[a] = v;
        this.setState({
            addobj
        })
    }
    //成功通知提醒框
    openNotification = (m, d) => {
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
            icon: <Icon type="smile-circle" style={{ color: '#108ee9' }} />,
        });
    }; 
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
                title: '人数',
                dataIndex: 'count',
                key: 'count',
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
        const { uploading } = this.state;
        const props = {
            onRemove: (file) => {
                this.setState(({ fileList }) => {
                    const index = fileList.indexOf(file);
                    const newFileList = fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList,
                    };
                });
            },
            beforeUpload: (file) => {
                this.setState(({ fileList }) => ({
                    fileList: [...fileList, file],
                }));
                return false;
            },
            fileList: this.state.fileList,
        };
        return (
            <div>
                <BreadcrumbCustom first="考试管理" second="班级管理" />
                <div className="course_header">
                    <div className="import_excel">

                        {/* 请选择你要上传的文件
              <input type="file" name="myfile" onChange={this.uploadUpdate}/> */}

                        <Upload {...props}>
                            <Button>
                                <Icon type="upload" /> 导入学生表
                      </Button>
                        </Upload>
                        <Button
                            className="upload-course-start"
                            type="primary"
                            onClick={this.handleUpload}
                            disabled={this.state.fileList.length === 0}
                            loading={uploading}
                        >
                            {uploading ? 'Uploading' : '开始导入'}
                        </Button>

                    </div>
                    <div className="class_option">
                        <Button type="primary" onClick={this.addClasses.bind(this)}>添加班级信息</Button>
                    </div>  
                    
                </div>
              
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
                                <Option value="数字媒体技术">数字媒体技术</Option>
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
                        <div className="ClassSelect">
                            <div className="class_inp_wrapper">
                                <span className="course_span">人数</span>
                                <Input placeholder="请输入人数" value={this.state.obj.count} onChange={this.handleChange.bind(this, "count")} />

                            </div>
                        </div>
                
                        {/* 班级:{this.state.obj.major}
                        年级:{this.state.obj.grade}
                        班级:{this.state.obj.class_name} */}
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
                            <span>专业:</span>
                            <Select defaultValue="请选择" style={{ width: 250 }} onChange={this.addChange.bind(this, "major")} >
                                <Option value="网络工程">网络工程</Option>
                                <Option value="计算机科学与技术">计算机科学与技术</Option>
                                <Option value="物联网工程">物联网工程</Option>
                                <Option value="数字媒体技术">数字媒体技术</Option>
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
                        <div className="ClassSelect">
                            <div className="class_inp_wrapper">
                                <span className="course_span">人数</span>
                                <Input placeholder="请输入人数" onChange={this.addChange.bind(this, "count")}/>

                            </div>
                        </div>
              
                        {/* <div className="ClassSelect">
                            <span>人数:</span>
                           
                        </div> */}
                    </div>)}
                  

                </Modal>         


                 <Table columns={columns} dataSource={this.state.tabledata} rowKey="id" />

            </div>
        )

    }
}

export default ClassesManage;