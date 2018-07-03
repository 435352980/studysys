import React from 'react';
import { Layout, Breadcrumb } from 'antd';

import classNames from 'classnames';
import PageMenu from '../../components/PageMenu';
import { MENU_CONFIG, MENU_DOC } from '../../config';
import { buildRelationFromDoc } from '../../lib/relation';
import frameStyle from './frame.less';

const { Header, Content, Footer, Sider } = Layout;

class Frame extends React.Component {
	state = {
		collapsed: false,
		keyPath: [ '欢迎' ]
	};

	onCollapse = collapsed => this.setState({ collapsed });

	render() {
		//反序获取当前索引位置信息
		const keyPath = [ ...this.state.keyPath ].reverse();
		const collapsed = this.state.collapsed;
		return (
			<Layout className={frameStyle.mainFrame}>
				<Sider
					className={frameStyle.sider}
					theme="light"
					collapsible
					collapsed={collapsed}
					onCollapse={this.onCollapse}
				>
					<div className={frameStyle.logo}>
						<div className={frameStyle.logoIcon} />
						<div
							className={classNames(frameStyle.logoName, {
								[frameStyle.logoNameCollapsed]: collapsed
							})}
						>
							测试系统
						</div>
					</div>
					<PageMenu
						onClick={({ item, key, keyPath }) => this.setState({ keyPath })}
						menuConfig={buildRelationFromDoc(MENU_DOC, MENU_CONFIG)}
					/>
				</Sider>
				<Layout
					className={classNames({
						[frameStyle.pageWrapper]: !collapsed,
						[frameStyle.pageWrapperCollapsed]: collapsed
					})}
				>
					<Header className={frameStyle.header} />
					<Content className={frameStyle.content}>
						<Breadcrumb className={frameStyle.breadcrumb}>
							{keyPath.map(keyName => (
								<Breadcrumb.Item key={`br_${keyName}`}>
									{(MENU_CONFIG.find(({ key }) => key === keyName) || {}).name || keyName}
								</Breadcrumb.Item>
							))}
						</Breadcrumb>
						<div className={frameStyle.pageContent}>Bill is a cat.</div>
					</Content>
					<Footer className={frameStyle.footer}>Ant Design ©2016 Created by Ant UED</Footer>
				</Layout>
			</Layout>
		);
	}
}

export default Frame;
