import React from 'react';
import ReactDOM from 'react-dom';
import { Layout, Input, Row, Col, Card, message } from 'antd';

const Content = Layout.Content;

export default class GdMap extends React.Component {
	componentDidMount() {
		const mapEl = ReactDOM.findDOMNode(this.refs.map);
		const searchEl = ReactDOM.findDOMNode(this.refs.search);
		const addressEl = ReactDOM.findDOMNode(this.refs.address);
		const lnglatEl = ReactDOM.findDOMNode(this.refs.lnglat);
		const onChange = this.props.onChange || function() {};

		var map = new AMap.Map(mapEl, { resizeEnable: true });
		// var station = new AMap.StationSearch({
		// 	pageIndex: 1, //页码
		// 	pageSize: 60, //单页显示结果条数
		// 	city: '0755'
		// });

		// station.search('银坑', function(status, result) {
		// 	if (status === 'complete' && result.info === 'OK') {
		// 		handleSearch(result);
		// 	} else {
		// 		console.log(result);
		// 	}
		// });

		// const handleSearch = result => {
		// 	var stationArr = result.stationInfo;
		// 	var searchNum = stationArr.length;
		// 	if (searchNum > 0) {
		// 		//document.getElementById('result').innerHTML = '查询结果：共' + searchNum + '个站点';
		// 		for (var i = 0; i < searchNum; i++) {
		// 			var marker = new AMap.Marker({
		// 				position: stationArr[i].location,
		// 				map: map,
		// 				title: stationArr[i].name
		// 			});
		// 			marker.info = new AMap.InfoWindow({
		// 				content: stationArr[i].name,
		// 				offset: new AMap.Pixel(0, -30)
		// 			});
		// 			marker.on('click', function(e) {
		// 				e.target.info.open(map, e.target.getPosition());
		// 			});
		// 		}
		// 		map.setFitView();
		// 	}
		// };

		AMap.plugin([ 'AMap.Marker', 'AMap.Geocoder', 'AMap.Autocomplete' ], function() {
			//搜索框
			let auto = new AMap.Autocomplete({ input: searchEl });
			//点标记
			let marker = new AMap.Marker({
				position: map.getCenter(),
				draggable: true,
				cursor: 'move',
				raiseOnDrag: true
			});
			marker.setMap(map);
			//转换
			let geocoder = new AMap.Geocoder();

			map.on('click', function(e) {
				const lng = e.lnglat.getLng();
				const lat = e.lnglat.getLat();

				map.setCenter(e.lnglat);
				marker.setPosition(e.lnglat);
				geocoder.getAddress(e.lnglat, function(status, result) {
					if (status === 'complete' && result.info === 'OK') {
						onChange({ address: result.regeocode.formattedAddress, jd: lng, wd: lat });
						addressEl.value = result.regeocode.formattedAddress;
						lnglatEl.value = `经度:${lng} 纬度:${lat}`;
					} else {
						message.destroy();
						message.error('获取位置信息失败!');
					}
				});
			});
			AMap.event.addListener(auto, 'select', e => {
				if (e.poi) {
					if (e.poi.location) {
						const { lng, lat } = e.poi.location;
						map.setZoom(15);
						map.setCenter(e.poi.location);
						marker.setPosition(e.poi.location);
						geocoder.getAddress(e.poi.location, function(status, result) {
							if (status === 'complete' && result.info === 'OK') {
								onChange({ address: result.regeocode.formattedAddress, jd: lng, wd: lat });
								addressEl.value = result.regeocode.formattedAddress;
								lnglatEl.value = `经度:${lng} 纬度:${lat}`;
							} else {
								message.destroy();
								message.error('获取位置信息失败!');
							}
						});
					} else {
						message.destroy();
						message.error('获取位置信息失败!');
					}
				}
			});
			AMap.event.addListener(marker, 'dragend', e => {
				const lng = e.lnglat.getLng();
				const lat = e.lnglat.getLat();

				map.setCenter(e.lnglat);
				geocoder.getAddress(e.lnglat, function(status, result) {
					if (status === 'complete' && result.info === 'OK') {
						onChange({ address: result.regeocode.formattedAddress, jd: lng, wd: lat });
						addressEl.value = result.regeocode.formattedAddress;
						lnglatEl.value = `经度:${lng} 纬度:${lat}`;
					} else {
						alert('获取位置信息失败!');
					}
				});
			});
		});
	}

	render() {
		return (
			<Content>
				<Card title={'查询位置&搜索站点'}>
					<div style={{ position: 'absolute', zIndex: 1, right: 30 }}>
						<Row>
							<Col>
								<Input
									style={{ width: 500 }}
									ref="search"
									type="text"
									placeholder="请输入关键字进行搜索"
								/>
							</Col>
						</Row>
						<Row>
							<Col>
								<Input style={{ width: 500 }} ref="address" disabled />
							</Col>
						</Row>
						<Row>
							<Col>
								<Input style={{ width: 500 }} ref="lnglat" disabled />
							</Col>
						</Row>
					</div>
					<div ref="map" style={{ height: 300 }} />
				</Card>
			</Content>
		);
	}
}
