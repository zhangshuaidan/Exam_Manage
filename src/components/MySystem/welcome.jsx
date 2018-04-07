
import React from 'react';
import { Divider } from 'antd';
import arrange from '../../style/imgs/arrange.png'
class Home extends React.Component {
    render() {
        return (
            <div>
                {/* 欢迎登录1 */}
                {/* <Divider /> */}
                <p className="arr-title">欢迎登录信息工程学院考试安排系统</p>
                {/* <Divider /> */}
                <div>
                    <div className="arr_img_wrapper">
                        <img src={arrange} alt="考试流程"/>
                    </div>
                </div>
            </div>
        )

    }
}

export default Home;