import React from 'react';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import themes from '../style/theme';

class BreadcrumbCustom extends React.Component {
    state = {
        switcherOn: false,
        theme: null,
        themes: JSON.parse(localStorage.getItem('themes')) || [
            {type: 'info', checked: false},
            {type: 'grey', checked: false},
            {type: 'danger', checked: false},
            {type: 'warn', checked: false},
            {type: 'white', checked: false},
        ],
    };
    componentDidMount() {
        this.state.themes.forEach(val => {
            val.checked && this.setState({
                theme: themes['theme' + val.type] || null
            });
        })
    }
    switcherOn = () => {
        this.setState({
            switcherOn: !this.state.switcherOn
        })
    };
    render() {
        const first = <Breadcrumb.Item>{this.props.first}</Breadcrumb.Item> || '';
        const second = <Breadcrumb.Item>{this.props.second}</Breadcrumb.Item> || '';
        return (
            <span>
                <Breadcrumb style={{ margin: '12px 0' }}>
                    <Breadcrumb.Item><Link to={'/app/dashboard/index'}>首页</Link></Breadcrumb.Item>
                        {first}
                        {second}
                </Breadcrumb>
            </span>
        )
    }
}

export default BreadcrumbCustom;
