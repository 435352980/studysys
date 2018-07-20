import React from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { Row, Col, Layout, Form, Input, Icon, Button, Checkbox, message } from 'antd';
import style from './style.less';

import { login as loginAction } from '../../actions';

const Header = Layout.Header;
const FormItem = Form.Item;
const Footer = Layout.Footer;

const FormItemStyle = {
	wrapperCol: {
		// xs: { span: 6 },
		sm: { offset: 2, span: 20 }
	}
};

@connect(state => ({ login: state.login }), dispatch => ({ dispatch }))
class Login extends React.Component {
	componentDidUpdate() {
		const { login: { error } } = this.props;
		error && message.info(error.message);
	}

	render() {
		const { form: { getFieldDecorator, validateFields }, login, dispatch } = this.props;
		return (
			<Layout className={style.loginContent}>
				<Form
					className={style.loginForm}
					onSubmit={e => {
						e.preventDefault();
						validateFields((err, values) => {
							if (err) {
								return console.log(err);
							}
							message.destroy();
							dispatch(loginAction.login(values));
						});
					}}
				>
					<Header className={style.loginHeader}>用户登录</Header>
					<FormItem {...FormItemStyle}>
						{getFieldDecorator('username', {
							rules: [ { required: true, message: '请输入账号!' } ]
						})(
							<Input
								size="large"
								prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
								placeholder="账号"
							/>
						)}
					</FormItem>
					<FormItem {...FormItemStyle}>
						{getFieldDecorator('password', {
							rules: [ { required: true, message: '请输入密码!' } ]
						})(
							<Input
								size="large"
								prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
								type="password"
								placeholder="密码"
							/>
						)}
					</FormItem>
					<FormItem {...FormItemStyle}>
						<Button size="large" type="primary" htmlType="submit" style={{ width: '100%' }}>
							登录
						</Button>
						没有账号？赶紧 <a onClick={() => this.props.dispatch(push('/signin'))}>注册</a> 一个吧
					</FormItem>
				</Form>
			</Layout>
		);
	}
}

export default Form.create()(Login);
