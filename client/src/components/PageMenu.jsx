import React from 'react';
import { Menu, Icon } from 'antd';

const MenuItem = Menu.Item;
const SubMenu = Menu.SubMenu;
/**
 * 构建antd菜单，支持配置式与直接书写式
 * @param {*} param0 
 */
const PageMenu = ({ menuConfig, children, ...rest }) => (
	<Menu {...rest} mode="inline">
		{menuConfig ? formatMenuItems(menuConfig) : null}
		{children}
	</Menu>
);
export default PageMenu;

const formatMenuItems = (menuConfig = []) => {
	return menuConfig.map(config => {
		const { key, name = key, icon, children } = config;
		if (children) {
			return (
				<SubMenu
					key={key}
					title={
						<span>
							{icon ? <Icon type={icon} /> : null}
							<span>{name}</span>
						</span>
					}
				>
					{formatMenuItems(children)}
				</SubMenu>
			);
		} else {
			return (
				<MenuItem key={key}>
					{icon ? <Icon type={icon} /> : null}
					<span>{name}</span>
				</MenuItem>
			);
		}
	});
};
