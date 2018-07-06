import React from 'react';
import { Layout, Breadcrumb } from 'antd';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router';
import { push } from 'react-router-redux';

import classNames from 'classnames';
import PageMenu from '../../components/PageMenu';
import { MENU_CONFIG, MENU_DOC } from '../../config';
import { buildRelationFromDoc, getParents } from '../../lib/relation';
import frameStyle from './frame.less';

import Charts from '../Charts';
import GdMap from '../GdMap';
import PrintVouch from '../PrintVouch';

const { Header, Content, Footer, Sider } = Layout;

@connect(state => ({ router: state.router }), dispatch => ({ dispatch }))
class Frame extends React.Component {
	state = {
		collapsed: false
	};

	onCollapse = collapsed => this.setState({ collapsed });

	render() {
		const dispatch = this.props.dispatch;
		//获取路由地址
		const pathKey = this.props.router.location.pathname.substring(1);
		//直接键入地址时判断菜单地址是否存在
		const hasThisMenu = MENU_CONFIG.find(({ key }) => key === pathKey);
		//获取当前路由父级菜单信息
		const breadcrumbs = pathKey === '' ? [ '欢迎' ] : hasThisMenu ? getParents(MENU_DOC, pathKey) : [];
		// //反序层级得到Breadcrumb数据
		const keysInfo = [ ...breadcrumbs ].reverse();
		//获取默认展开菜单项，选中菜单项
		const [ selectedKeys, ...openKeys ] = keysInfo;

		const collapsed = this.state.collapsed;
		return (
			<Layout className={frameStyle.mainFrame}>
				<Sider
					className={frameStyle.sider}
					theme="dark"
					collapsible
					collapsed={collapsed}
					onCollapse={this.onCollapse}
				>
					<div className={frameStyle.logo}>
						<a onClick={() => (window.location.href = '/')}>
							<div className={frameStyle.logoIcon} />
							<span
								className={classNames(frameStyle.logoName, {
									[frameStyle.logoNameCollapsed]: collapsed
								})}
							>
								测试系统
							</span>
						</a>
					</div>
					<PageMenu
						theme="dark"
						defaultSelectedKeys={selectedKeys}
						defaultOpenKeys={openKeys}
						//防止点击同一菜单造成非必要的二次加载
						onClick={({ item, key }) => {
							if (hasThisMenu) {
								pathKey === key || dispatch(push(key));
							} else {
								const { host, port } = window.location;
								window.location.href = `http://${host}/${key}`;
							}
						}}
						menuConfig={buildRelationFromDoc(MENU_DOC, MENU_CONFIG)}
					/>
				</Sider>
				<Layout
					className={classNames(frameStyle.pageWrapper, {
						[frameStyle.pageWrapperCollapsed]: collapsed
					})}
				>
					<Header className={frameStyle.header}>
						<span
							className="ant-menu-item"
							onClick={() => {
								if (hasThisMenu) {
									pathKey === key || dispatch(push('login'));
								} else {
									window.location.href = `http://${host}/login`;
								}
							}}
						>
							登录
						</span>
						<span
							className="ant-menu-item"
							onClick={() => {
								if (hasThisMenu) {
									pathKey === key || dispatch(push('signin'));
								} else {
									window.location.href = `http://${host}/signin`;
								}
							}}
						>
							注册
						</span>
					</Header>
					<Content className={frameStyle.content}>
						<Breadcrumb className={frameStyle.breadcrumb}>
							{breadcrumbs.map(keyName => (
								<Breadcrumb.Item key={`br_${keyName}`}>
									{(MENU_CONFIG.find(({ key }) => key === keyName) || {}).name || keyName}
								</Breadcrumb.Item>
							))}
						</Breadcrumb>

						<Switch>
							<Route
								exact
								path="/"
								component={props => <Layout className={frameStyle.pageContent}>欢迎页</Layout>}
							/>
							<Route
								exact
								path="/printVouch"
								component={props => (
									<Layout className={frameStyle.pageContent}>{<PrintVouch />}</Layout>
								)}
							/>
							<Route
								exact
								path="/charts"
								component={props => (
									<Layout className={frameStyle.pageContent}>{<Charts />}</Layout>
								)}
							/>
							<Route
								exact
								path="/map"
								component={props => (
									<Layout className={frameStyle.pageContent}>{<GdMap />}</Layout>
								)}
							/>
							<Route component={() => <div className={frameStyle.pageContent}>404</div>} />
						</Switch>
					</Content>
					<Footer className={frameStyle.footer}>Ant Design ©2016 Created by Ant UED</Footer>
				</Layout>
			</Layout>
		);
	}
}

export default Frame;
