import React from 'react';
import axios from 'axios';
import { Table, Button, Modal, Input, message } from 'antd';
// 引入面包屑
import BreadcrumbCustom from '../../BreadcrumbCustom';

class CourseManage extends React.Component {
    state={
        changevisible:false,
        addvisible:false,
        coursevalue:"",
        id:"",
        tabledata:[]
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
            coursevalue: "",
            
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

        return (
            <div>
                {/* 面包屑 */}
                <BreadcrumbCustom first="考试管理" second="课程管理" />
                <div className="import_excel">
                    <form encType="multipart/form-data" action="http://localhost/ExamArrange/courseManage/importCourse.php" method="post">
        
        请选择你要上传的文件
        <input type="file" name="myfile"/>
        {/* application/vnd.openxmlformats-officedocument.spreadsheetml.sheet */}
        {/* application/vnd.openxmlformats-officedocument.wordprocessingml.document */}
      <input type="submit" value="上传文件" />
   
</form>

                </div>
                <Button type="primary" onClick={this.addCourse.bind(this)}>添加课程信息</Button>
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
                            <span className="course_span">课程</span>  <Input placeholder="请输入修改后的课程" onChange={this.inpChange} />
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