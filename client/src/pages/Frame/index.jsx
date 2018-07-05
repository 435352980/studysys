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

const { Header, Content, Footer, Sider } = Layout;

@connect(state => ({ router: state.router }), dispatch => ({ dispatch }))
class Frame extends React.Component {
	constructor(props) {
		super();
		const urlPath = props.router.location.pathname;
		this.state = {
			collapsed: false,
			keyPath: urlPath === '/' ? [ '欢迎' ] : getParents(MENU_DOC, urlPath.substring(1))
		};
		this.urlPath = urlPath;
	}

	onCollapse = collapsed => this.setState({ collapsed });

	render() {
		console.log(this.state.keyPath);
		const urlPath = this.urlPath;
		const dispatch = this.props.dispatch;
		//反序获取当前索引位置信息
		const keyPath = [ ...this.state.keyPath ].reverse();
		const [ selectedKeys, ...openKeys ] = keyPath;
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
						<a>
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
						onClick={({ item, key, keyPath }) =>
							urlPath === '/' + key ||
							//页面跳转
							this.setState({ keyPath }, () => dispatch(push(key)))}
						menuConfig={buildRelationFromDoc(MENU_DOC, MENU_CONFIG)}
					/>
				</Sider>
				<Layout
					className={classNames(frameStyle.pageWrapper, {
						[frameStyle.pageWrapperCollapsed]: collapsed
					})}
				>
					<Header className={frameStyle.header}>
						<span className="ant-menu-item" onClick={() => dispatch(push('login'))}>
							登录
						</span>
						<span className="ant-menu-item" onClick={() => dispatch(push('/signin'))}>
							注册
						</span>
					</Header>
					<Content className={frameStyle.content}>
						<Breadcrumb className={frameStyle.breadcrumb}>
							{keyPath.map(keyName => (
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
								path="/charts"
								component={props => (
									<Layout className={frameStyle.pageContent}>{<Charts />}</Layout>
								)}
							/>
							<Route
								path="/map"
								component={props => (
									<Layout className={frameStyle.pageContent}>{<GdMap />}</Layout>
								)}
							/>
							<Route component={() => <div className={frameStyle.pageContent}>页面搭建中</div>} />
						</Switch>
					</Content>
					<Footer className={frameStyle.footer}>Ant Design ©2016 Created by Ant UED</Footer>
				</Layout>
			</Layout>
		);
	}
}

export default Frame;
