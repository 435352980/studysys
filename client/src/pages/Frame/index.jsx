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
import ExportExcel from '../ExportExcel';
import Login from '../Login';
import Signin from '../Signin';

const { Header, Content, Footer, Sider } = Layout;

//页面容器
const Page = props => <Layout className={frameStyle.pageContent}>{props.children}</Layout>;

@connect(state => ({ user: state.login || {}, router: state.router }), dispatch => ({ dispatch }))
class Frame extends React.Component {
	state = {
		collapsed: false
	};

	onCollapse = collapsed => this.setState({ collapsed });

	render() {
		const { host } = window.location;
		const dispatch = this.props.dispatch;
		//获取路由地址
		const pathKey = this.props.router.location.pathname.substring(1);

		//登录注册页
		if (pathKey === 'signin') {
			return <Signin />;
		}
		if (pathKey === 'login') {
			return <Login />;
		}

		//直接键入地址时判断菜单地址是否存在
		const hasThisMenu = pathKey === '' ? true : MENU_CONFIG.find(({ key }) => key === pathKey);
		//获取当前路由父级菜单信息
		const breadcrumbs = pathKey === '' ? [ '欢迎' ] : hasThisMenu ? getParents(MENU_DOC, pathKey) : [];
		// //反序层级得到Breadcrumb数据
		const keysInfo = [ ...breadcrumbs ].reverse();
		//获取默认展开菜单项，选中菜单项
		const [ selectedKeys, ...openKeys ] = keysInfo;

		const collapsed = this.state.collapsed;

		/**
		 * 页面跳转，需要考虑浏览器地址来判断加载规则
		 * @param {*} urlKey 
		 */
		const toUrl = urlKey => {
			hasThisMenu
				? pathKey === urlKey || dispatch(push(urlKey))
				: (window.location.href = `http://${host}/${urlKey}`);
		};

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
						onClick={({ key }) => toUrl(key)}
						menuConfig={buildRelationFromDoc(MENU_DOC, MENU_CONFIG)}
					/>
				</Sider>
				<Layout
					className={classNames(frameStyle.pageWrapper, {
						[frameStyle.pageWrapperCollapsed]: collapsed
					})}
				>
					<Header className={frameStyle.header}>
						<span className="ant-menu-item" onClick={() => toUrl('login')}>
							登录
						</span>
						<span className="ant-menu-item" onClick={() => toUrl('signin')}>
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
							<Route exact path="/" render={() => <Page>欢迎页</Page>} />
							<Route exact path="/printVouch" render={() => <Page>{<PrintVouch />}</Page>} />
							<Route exact path="/exportExcel" render={() => <Page>{<ExportExcel />}</Page>} />
							<Route exact path="/charts" render={() => <Page>{<Charts />}</Page>} />
							<Route exact path="/map" render={() => <Page>{<GdMap />}</Page>} />
							<Route render={() => <Page>404</Page>} />
						</Switch>
					</Content>
					<Footer className={frameStyle.footer}>Ant Design ©2016 Created by Ant UED</Footer>
				</Layout>
			</Layout>
		);
	}
}

export default Frame;
