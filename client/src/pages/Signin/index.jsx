import React from 'react';
import { Layout, Card, Form, Input, Button, message } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { signIn as signInAction } from '../../actions';
import { isEmail } from '../../lib/util';
import axios from 'axios';

const Content = Layout.Content;
const FormItem = Form.Item;
const FormLayout = {
	labelCol: {
		// xs: { span: 2 },
		sm: { offset: 2, span: 4 }
	},
	wrapperCol: {
		// xs: { span: 6 },
		sm: { span: 14 }
	}
};

const BtnLayout = {
	wrapperCol: {
		xs: { span: 6 },
		sm: { offset: 6, span: 14 }
	}
};

@connect(state => ({ signIn: state.signIn }), dispatch => bindActionCreators(signInAction, dispatch))
class SignIn extends React.Component {
	//ajax远程验证字段
	valiField(name, value, callback) {
		if (name === 'username') {
			return this.props.valiUserName(value, callback);
		}
		if (name === 'email') {
			return this.props.valiEmail(value, callback);
		}
		if (name === 'nickname') {
			return this.props.valiNickname(value, callback);
		}
		callback();
	}

	//用户注册
	signIn(e) {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				const { confirm, ...rest } = values;
				//this.signIn(rest);
			}
		});
		// try {
		// 	let result = await axios.post(`${SERVER_PORT}/user/signin`, params);
		// 	const { status, data } = result;
		// 	if (status === 200) {
		// 		message.destroy();
		// 		if (data.error) {
		// 			return message.error(data.message);
		// 		}
		// 		message.success('注册成功!');
		// 		document.location.href = '/login';
		// 	} else {
		// 		message.error('注册失败!');
		// 	}
		// } catch (error) {
		// 	message.error('注册失败!');
		// }
	}

	render() {
		const { form: { getFieldDecorator, validateFields, getFieldValue, getFieldsError } } = this.props;
		return (
			<Content
				style={{
					minHeight: '100vh',
					color: '#fff',
					display: 'flex',
					alignItems: 'center',
					background: 'linear-gradient(-338deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
					backgroundSize: '400% 400%'
				}}
			>
				<Card title="用户注册" style={{ margin: '0 auto' }}>
					<Form style={{ minWidth: 450 }} onSubmit={e => this.signIn(e)}>
						<FormItem {...FormLayout} label="用户名">
							{getFieldDecorator('username', {
								// validateTrigger: 'onBlur',
								rules: [
									{ required: true, message: '用户名不能为空' },
									{ min: 5, message: '用户名长度不能小于5位' },
									{
										validator: (rule, value, callback) =>
											value && value.length >= 5
												? this.valiField('username', value, callback)
												: callback()
									}
								]
							})(<Input size="large" placeholder="用户名" />)}
						</FormItem>
						<FormItem {...FormLayout} label="昵称">
							{getFieldDecorator('nickname', {
								// validateTrigger: 'onBlur',
								rules: [
									{ required: true, message: '昵称不能为空' },
									{ min: 2, message: '昵称长度不能小于2位' },
									{
										validator: (rule, value, callback) =>
											value && value.length >= 2
												? this.valiField('nickname', value, callback)
												: callback()
									}
								]
							})(<Input size="large" placeholder="昵称" />)}
						</FormItem>
						<FormItem {...FormLayout} label="密码">
							{getFieldDecorator('password', {
								rules: [
									{ required: true, message: '密码不能为空' },
									{
										validator: (rule, value, callback) => {
											//输入密码同时也需要强制验证核对的密码
											validateFields([ 'confirm' ], { force: true });
											callback();
										}
									}
								]
							})(<Input size="large" type="password" placeholder="密码" />)}
						</FormItem>
						<FormItem {...FormLayout} label="确认密码">
							{getFieldDecorator('confirm', {
								rules: [
									{ required: true, message: '请核对密码' },
									{
										validator: (rule, value, callback) => {
											if (value && value !== getFieldValue('password')) {
												callback('密码核对不一致!');
											} else {
												callback();
											}
										}
									}
								]
							})(<Input size="large" type="password" placeholder="密码" />)}
						</FormItem>
						<FormItem {...FormLayout} label="邮箱">
							{getFieldDecorator('email', {
								// validateTrigger: 'onBlur',
								rules: [
									{ required: true, message: '邮箱不能为空' },
									{ type: 'email', message: '邮箱格式有误' },
									{
										validator: (rule, value, callback) => {
											value && isEmail(value)
												? this.valiField('email', value, callback)
												: callback();
										}
									}
								]
							})(<Input size="large" placeholder="邮箱" />)}
						</FormItem>

						<FormItem {...BtnLayout}>
							<Button size="large" type="primary" htmlType="submit" style={{ width: '100%' }}>
								注册
							</Button>
						</FormItem>
					</Form>
				</Card>
			</Content>
		);
	}
}

export default Form.create()(SignIn);
