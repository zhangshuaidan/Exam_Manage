import React from 'react';
import axios from 'axios';
import { Table, Button, Modal, Input, message, Upload, Icon, notification} from 'antd';
// 引入面包屑
import BreadcrumbCustom from '../../BreadcrumbCustom';

class CourseManage extends React.Component {
    state={
        changevisible:false,
        addvisible:false,
        coursevalue:"",
        id:"",
        tabledata:[],
        fileList: [],
        uploading: false
    }

    componentWillMount() {
        this.getData();
    }

    // 获取数据
    getData = () => {
        let _this=this;
        axios.post('http://localhost/ExamArrange/courseManage/findAll.php', {})
            .then((response) => {
                // console.log(response.data)
                _this.setState({
                    tabledata: response.data
                })
                
            })
            .catch(function (error) {
                console.log(error);
            });
    }

// 更改课程
    changeCourse=(a)=>{
        // console.log(a)   
        this.setState({
            changevisible:true,
            id:a.id,
            coursevalue: a.coursename,
            
        })
    }
    // 删除课程
    deleteCourse=(a)=>{
        // console.log(a)
        let _this = this;
        axios.post('http://localhost/ExamArrange/courseManage/deleteCourse.php', {
            id: a.id
        })
            .then((response) => {
                if (response.data>0){
                    _this.getData();
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    // 添加课程信息
    addCourse=()=>{
        this.setState({
            addvisible:true,
            coursevalue: ""
        })
    }
    
    // 更改课程信息
    changeCourseOk=()=>{
        let _this = this;
        // console.log(this.state.coursevalue)
        // console.log(this.state.id)
        if (this.state.coursevalue) {
            axios.post('http://localhost/ExamArrange/courseManage/updateCourse.php', {
                id: _this.state.id,
                coursename: _this.state.coursevalue
            })
                .then((response) => {
                    // console.log(response.data);
                    // if (response.data > 0) {
                    //     _this.getData();
                    // }
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
                changevisible: false
            })
        }else{
            message.error('请将修改信息输入完整');
        }
 

    }

    addCourseOk=()=>{
        // console.log("okok")
        // console.log(this.state.coursevalue);
        let _this=this;
        if (this.state.coursevalue) {
            axios.post('http://localhost/ExamArrange/courseManage/addCourse.php', {
                coursename: _this.state.coursevalue
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
                addvisible: false
            })
        }else{
            message.error('请输入课程信息');
        }

    }
    changeCancel=()=>{
        this.setState({
            changevisible: false
        })
    }


    inpChange=(e)=>{
        let v = e.target.value;
        this.setState({
            coursevalue:v
        })
    }
    uploadUpdate=(e)=>{
        let file = e.target.files[0];
        // console.log(file);
        let param = new FormData(); //创建form对象
        param.append('myfile', file, file.name);//通过append向form对象添加数据
        let config = {
            headers: { 'Content-Type': 'multipart/form-data' }
        };  //添加请求头
        axios.post('http://localhost/ExamArrange/courseManage/importCourse.php', param, config)
            .then(response => {
                console.log(response.data);
            })      
    }

    handleUpload = () => {
        let _this=this;
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
        axios.post('http://localhost/ExamArrange/courseManage/importCourse.php', formData, config)
            .then(response => {
                // console.log(response.data);
                _this.getData();
                this.openNotification("课程数据导入成功", response.data.data.txt);
                this.setState({
                    uploading: false,
                });
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
            title: '课程名称',
            dataIndex: 'coursename',
            key: 'coursename',
            render: text => <a>{text}</a>,
        },{
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <span>
                    <Button onClick={this.changeCourse.bind(this,record)}>修改</Button>
                    <Button type="danger" onClick={this.deleteCourse.bind(this,record)}> 删除</Button>
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
                <BreadcrumbCustom first="考试管理" second="课程管理" />

                <div className="course_header">
                    <div className="import_excel">

                        {/* 请选择你要上传的文件
              <input type="file" name="myfile" onChange={this.uploadUpdate}/> */}

                        <Upload {...props}>
                            <Button>
                                <Icon type="upload" /> 导入课程表
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

                    <div className="course_option">
                        <Button type="primary" onClick={this.addCourse.bind(this)}>添加课程信息</Button>
                    </div>
                </div>

              
                <Table columns={columns} dataSource={this.state.tabledata} rowKey="id"/>

                 {/* 修改对话框 */}
                 {
                    this.state.changevisible && (<Modal
                        title="修改课程"
                        visible={this.state.changevisible}
                        onOk={this.changeCourseOk}
                        onCancel={this.changeCancel}
                        okText="确认"
                        cancelText="取消"
                    >

                        <div className="course_inp_wrapper">
                            <span className="course_span">课程</span>  <Input placeholder="请输入修改后的课程" value={this.state.coursevalue} onChange={this.inpChange} />
                        </div>
                    </Modal>)
                 }

                 {/* 添加 */}
                {
                    this.state.addvisible && (<Modal
                        title="添加课程"
                        visible={this.state.addvisible}
                        onOk={this.addCourseOk}
                        onCancel={()=>this.setState({
                            addvisible:false
                        })}
                        okText="确认"
                        cancelText="取消"
                    >

                        <div className="course_inp_wrapper">
                            <span className="course_span">课程</span>  <Input placeholder="请输入添加的课程" onChange={this.inpChange} />
                        </div>
                    </Modal>)
                }
            </div>
        )

    }
}

export default CourseManage;