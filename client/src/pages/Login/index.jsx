import React from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { Row, Col, Layout, Form, Input, Icon, Button, Checkbox, message } from 'antd';
import style from './style.less';

const Header = Layout.Header;
const FormItem = Form.Item;
const Footer = Layout.Footer;

const FormItemStyle = { wrapperCol: { span: 18, offset: 3 } };

@connect(state => ({ user: state.user || {} }), dispatch => ({ dispatch }))
class Login extends React.Component {
	render() {
		const { form: { getFieldDecorator, validateFields }, user } = this.props;
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
							message.info(JSON.stringify(values));
							console.log(values);
							this.props.dispatch(push('/'));
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
