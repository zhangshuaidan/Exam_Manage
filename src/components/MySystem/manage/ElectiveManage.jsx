import React from 'react';
import axios from 'axios';
import { Table, Modal, Button, Select, message, Upload, Icon, notification, Input } from 'antd';
// 引入面包屑
import BreadcrumbCustom from '../../BreadcrumbCustom';
const Option = Select.Option;
const Search = Input.Search;
class ElectiveManage extends React.Component {
    state = {
        changevisible: false,
        addvisible:false,
        allClasses:[],
        allCourse:[],
        tableData:[],
        changeObj:{},
        addObj:{},
        fileList: [],
        uploading: false
    }

    componentWillMount(){
        this.getAllElective();        
    axios.post('http://localhost/ExamArrange/courseManage/findAll.php', {})
            .then((response) => {
                // console.log("获取所有课程",response.data)
                this.setState({
                    allCourse: response.data
                })
            })
            .catch(function (error) {
                console.log(error);
            });

    }

    getAllElective=()=>{

        axios.post('http://localhost/ExamArrange/electiveManage/findAll.php', {})
            .then((response) => {
                // console.log("获取所有选修课程表",response.data)
                this.setState({
                    tableData: response.data
                })
            })
            .catch(function (error) {
                console.log(error);
            });

    }

    // 更改按钮
    changeOk=()=>{
        // console.log(this.state.changeObj);

        axios.post('http://localhost/ExamArrange/electiveManage/updateElective.php', {
            obj: this.state.changeObj
        })
            .then((response) => {
                
                // console.log(response.data);

                if (response.data.msg === "success") {
                    message.success(response.data.data.tip);
                    this.getAllElective();
                    this.setState({
                        changevisible: false,
                    })
                } else {
                    message.error(response.data.data.tip);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
         
    }

    //确认添加
    addOk=()=>{
        
        // console.log(this.state.addObj);
        let a = this.state.addObj.hasOwnProperty("course");
        let b = this.state.addObj.hasOwnProperty("major");
        let c = this.state.addObj.hasOwnProperty("grade");
        if (a&&b&&c) {
        axios.post('http://localhost/ExamArrange/electiveManage/addElective.php', {
            obj: JSON.stringify(this.state.addObj)
        })
            .then((response) => {
                // console.log(response.data);

                if (response.data.msg === "success") {
                    message.success(response.data.data.tip);
                    this.getAllElective();   
                } else {
                    message.error(response.data.data.tip);
                }

                this.setState({
                    addvisible: false
                })
            })
            .catch(function (error) {
                console.log(error);
            });
        }else{
            message.error('请选择完整信息');
        }
 
    }

    // 修改按钮
    changeBtn=(a)=>{
        // console.log("获取到的值",a)
        this.setState({
            changevisible: true,
            changeObj:a
        })
    }
    // 删除按钮
    deleteBtn=(a)=>{
        console.log("删除的值",a);
        axios.post('http://localhost/ExamArrange/electiveManage/deleteElective.php', {
            id: a.id
        })
            .then((response) => {
                 console.log(response.data);
                if (response.data>0) {
                    this.getAllElective();
                }

            })
            .catch(function (error) {
                console.log(error);
            });
    }

    electiveChange=(a,v)=>{
        let obj = JSON.parse(JSON.stringify(this.state.changeObj));
        obj[a] = v;
        this.setState({
            changeObj:obj
        })
        // console.log("类型=====>",a);
        // console.log("获取到的值===>",v);
    }

    electiveAdd=(a,v)=>{
        let obj = JSON.parse(JSON.stringify(this.state.addObj));
        obj[a] = v;
        this.setState({
            addObj: obj
        })
    }
    // 搜索
    electiveSearch=(v)=>{
        // console.log(v);

        axios.post('http://localhost/ExamArrange/electiveManage/searchElective.php', {
            value:v
        })
            .then((response) => {
                // console.log(response);
                console.log(response.data);
                this.setState({
                    tableData: response.data
                })
                // if (response.data > 0) {
                //     this.getAllElective();
                // }

            })
            .catch(function (error) {
                console.log(error);
            });
    }


    addElective=()=>{
        this.setState({
            addvisible:true
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
    handleUpload = () => {
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
        axios.post('http://localhost/ExamArrange/electiveManage/importElective.php', formData, config)
            .then(response => {
                // console.log(response.data);
                if(response.data.msg="success"){
               this.openNotification("选修记录导入成功", response.data.data.txt);
                this.getAllElective();   
                this.setState({
                    uploading: false,
                });
                }
              
            
            })
    }

    render() {
        const columns = [{
            title: '课程',
            dataIndex: 'course',
            key: 'course',
            render: text => <a>{text}</a>,
        }, {
            title: '专业',
            dataIndex: 'major',
            key: 'major',
        }, {
            title: '年级',
            dataIndex: 'grade',
            key: 'grade',
            }, {
                title: '班级',
                dataIndex: 'class_name',
                key: 'class_name',
            },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <span>
                    <Button onClick={this.changeBtn.bind(this,record)}>修改</Button>
                    <Button type="danger" onClick={this.deleteBtn.bind(this,record)}> 删除</Button>
                    {/* <Button onClick={this.showModal.bind(this, record)}>修改</Button>
                    <Button type="danger" onClick={this.deleteRocord.bind(this, record)}> 删除</Button> */}

                </span>
            ),
        }];
        const { uploading } = this.state;
        const props = {
            // action: '//jsonplaceholder.typicode.com/posts/',
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
                {/* 面包屑 */}
                <BreadcrumbCustom first="考试管理" second="选修管理" />
                <div className="course_header">
                    <div className="import_excel">

                        {/* 请选择你要上传的文件
              <input type="file" name="myfile" onChange={this.uploadUpdate}/> */}

                        <Upload {...props}>
                            <Button>
                                <Icon type="upload" /> 导入选修记录
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
                    <div className="search_wrapper">   
                        <Search
                            placeholder="请输入选修的课程"
                            // onSearch={value => console.log(value)}
                            onSearch={this.electiveSearch}
                            
                            enterButton
                        />

                    </div>
                    <div className="elective_header">
                        <div className="elective_option">
                            <Button type="primary" onClick={this.addElective}>添加选修记录</Button>
                        </div>
                    </div>
                </div>

               
                 <Table columns={columns} dataSource={this.state.tableData} rowKey="id"/>

                 {/* Changeelective */}
                <Modal
                    title="选修课程"
                    visible={this.state.changevisible}
                    onOk={this.changeOk}
                    okText="确认"
                    cancelText="取消"
                    onCancel={()=>this.setState({
                        changevisible:false
                    })}
                >
                    <div className="elect_wrapper">
                        <div className="elect_course_select">
                        <span>
                            请选择课程
                        </span>
                            <Select value={this.state.changeObj.course} style={{ width: 240 }} onChange={this.electiveChange.bind(this,"course")}>
                                {
                                 this.state.allCourse.map((item, index) =>
                                        <Option key={index} value={item.coursename} >{item.coursename}</Option>)            
                                    }                                

                            </Select>
                    </div>
                    <div className="elect_classes_select">
                            <span>
                                请选择专业
                            </span>
                            <Select value={this.state.changeObj.major} style={{ width: 240 }} onChange={this.electiveChange.bind(this, "major")}>
                                <Option value="网络工程">网络工程</Option>
                                <Option value="计算机科学与技术">计算机科学与技术</Option>
                                <Option value="数字媒体技术">数字媒体技术</Option>
                                <Option value="物联网工程">物联网工程</Option>
                            </Select>
                    </div>
                        <div className="elect_classes_select">
                            <span>
                                请选择年级
                            </span>
                            <Select value={this.state.changeObj.grade} style={{ width: 240 }} onChange={this.electiveChange.bind(this, "grade")}>
                                <Option value="2014">2014</Option>
                                <Option value="2015">2015</Option>
                                <Option value="2016">2016</Option>
                                <Option value="2017">2017</Option>
                            </Select>
                        </div>
                        <div className="elect_classes_select">
                            <span>
                                请选择班级
                                  </span>
                            <Select value={this.state.changeObj.class_name} style={{ width: 240 }} onChange={this.electiveChange.bind(this, "class_name")}>
                                <Option value="1">1</Option>
                                <Option value="2">2</Option>
                                <Option value="3">3</Option>
                       
                            </Select>
                        </div>

                    </div>
                </Modal>

                {/* addElective */}
                {
                    this.state.addvisible&&(
                        <Modal
                            title="选修课程"
                            visible={this.state.addvisible}
                            onOk={this.addOk}
                            okText="确认"
                            cancelText="取消"
                            onCancel={() => this.setState({
                                addvisible: false
                            })}
                        >
                            <div className="elect_wrapper">
                                <div className="elect_course_select">
                                    <span>
                                        请选择课程
                        </span>
                                    <Select defaultValue="请选择" style={{ width: 240 }} onChange={this.electiveAdd.bind(this, "course")}>
                                        {
                                            this.state.allCourse.map((item, index) =>
                                                <Option key={index} value={item.coursename} >{item.coursename}</Option>)
                                        }
                                    </Select>
                                </div>
                                <div className="elect_classes_select">
                                    <span>
                                        请选择专业
                            </span>
                                    <Select defaultValue="请选择" style={{ width: 240 }} onChange={this.electiveAdd.bind(this, "major")}>
                                        <Option value="网络工程">网络工程</Option>
                                        <Option value="计算机科学与技术">计算机科学与技术</Option>
                                        <Option value="数字媒体技术">数字媒体技术</Option>
                                        <Option value="物联网工程">物联网工程</Option>
                                    </Select>
                                </div>

                                <div className="elect_classes_select">
                                    <span>
                                        请选择年级
                                  </span>
                                    <Select defaultValue="请选择" style={{ width: 240 }} onChange={this.electiveAdd.bind(this, "grade")}>
                                        <Option value="2014">2014</Option>
                                        <Option value="2015">2015</Option>
                                        <Option value="2016">2016</Option>
                                        <Option value="2017">2017</Option>
                                    </Select>
                                </div>



                                <div className="elect_classes_select">
                                    <span>
                                        请选择班级
                                  </span>
                                    <Select defaultValue="请选择" style={{ width: 240 }} onChange={this.electiveAdd.bind(this, "class_name")}>
                                        <Option value="1">1</Option>
                                        <Option value="2">2</Option>
                                        <Option value="3">3</Option>
                                        {/* <Option value="2017">2017</Option> */}
                                    </Select>
                                </div>
                            </div>
                        </Modal>
                    )
                }
            </div>
        )

    }
}

export default ElectiveManage;