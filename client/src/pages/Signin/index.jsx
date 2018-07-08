import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
// import { page, hiddenWithLogin } from '../decorator';
import { API_PORT } from '../../config';
import { isEmail } from '../../lib/util';
import axios from 'axios';

const FormItem = Form.Item;
const FormLayout = {
	labelCol: {
		xs: { span: 24 },
		sm: { span: 5 }
	},
	wrapperCol: {
		xs: { span: 24 },
		sm: { span: 12 }
	}
};

@connect(state => ({ user: state.user || {} }), dispatch => ({ dispatch }))
class SignIn extends React.Component {
	// /**
	//  * 登录验证主方法，配合antd自定义验证
	//  * @param {*} name 字段名
	//  * @param {*} value 字段值
	//  * @param {*} callback 验证回调
	//  */
	// async valiField(name, value, callback) {
	// 	try {
	// 		let result = await axios.post(`${API_PORT}/user/valisignparam`, { [name]: value });
	// 		const { status, data } = result;
	// 		if (status === 200) {
	// 			if (data.error) {
	// 				callback(data.message);
	// 			}
	// 			callback();
	// 		} else {
	// 			callback('验证失败');
	// 		}
	// 	} catch (error) {
	// 		callback('验证失败');
	// 	}
	// }

	// /**
	//  * 用户注册
	//  * @param {*} params
	//  */
	// async signIn(params) {
	// 	try {
	// 		let result = await axios.post(`${API_PORT}/user/signin`, params);
	// 		const { status, data } = result;
	// 		if (status === 200) {
	// 			message.destroy();
	// 			if (data.error) {
	// 				return message.error(data.message);
	// 			}
	// 			message.success('注册成功!');
	// 			document.location.href = '/login';
	// 		} else {
	// 			message.error('注册失败!');
	// 		}
	// 	} catch (error) {
	// 		message.error('注册失败!');
	// 	}
	// }

	render() {
		const { form } = this.props;
		const { getFieldDecorator, validateFields, getFieldsError } = form;
		return (
			<Form
				style={{ width: 600, margin: '0 auto', paddingTop: 60 }}
				onSubmit={e => {
					e.preventDefault();
					validateFields((err, values) => {
						if (!err) {
							const { confirm, ...rest } = values;
							this.props.dispatch(push('login'));
							//this.signIn(rest);
						}
					});
				}}
			>
				<FormItem {...FormLayout} label="用户名">
					{getFieldDecorator('username', {
						rules: [
							{ required: true, message: '用户名不能为空' },
							{ min: 5, message: '用户名长度不能小于5位' },
							{
								validator: (rule, value, callback) => {
									if (value && value.length >= 5) {
										//this.valiField('username', value, callback);
										callback();
									} else {
										callback();
									}
								}
							}
						]
					})(<Input size="large" placeholder="用户名" />)}
				</FormItem>
				<FormItem {...FormLayout} label="昵称">
					{getFieldDecorator('nickname', {
						rules: [
							{ required: true, message: '昵称不能为空' },
							{
								validator: (rule, value, callback) => {
									if (value) {
										// this.valiField('nickname', value, callback);
										callback();
									} else {
										callback();
									}
								}
							}
						]
					})(<Input size="large" placeholder="昵称" />)}
				</FormItem>
				<FormItem {...FormLayout} label="密码">
					{getFieldDecorator('password', { rules: [ { required: true, message: '密码不能为空' } ] })(
						<Input size="large" type="password" placeholder="密码" />
					)}
				</FormItem>
				<FormItem {...FormLayout} label="确认密码">
					{getFieldDecorator('confirm', { rules: [ { required: true, message: '请核对密码' } ] })(
						<Input size="large" type="password" placeholder="密码" />
					)}
				</FormItem>
				<FormItem {...FormLayout} label="邮箱">
					{getFieldDecorator('email', {
						rules: [
							{ required: true, message: '邮箱不能为空' },
							{
								validator: (rule, value, callback) => {
									if (value) {
										if (!isEmail(value)) {
											return callback('邮箱格式有误!');
										}
										//this.valiField('email', value, callback);
										callback();
									} else {
										callback();
									}
								}
							}
						]
					})(<Input size="large" placeholder="邮箱" />)}
				</FormItem>

				<FormItem {...FormLayout} wrapperCol={{ span: 12, offset: 5 }}>
					<Button size="large" type="primary" htmlType="submit" style={{ width: '100%' }}>
						注册
					</Button>
				</FormItem>
			</Form>
		);
	}
}

export default Form.create()(SignIn);
