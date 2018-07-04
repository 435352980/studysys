import React from 'react';
import { connect } from 'react-redux';
import { Layout, Button, Row, Col } from 'antd';
import ReactEcharts from 'echarts-for-react';
import { fetchChartsData } from '../../actions/chartsAction';

const Content = Layout.Content;

const Charts = ({ charts, dispatch }) => {
	return (
		<Content>
			<Row>
				<Button
					onClick={() => {
						dispatch(fetchChartsData());
					}}
				>
					mock测试
				</Button>
			</Row>

			<Row gutter={8}>
				<Col xs={24}>
					<ReactEcharts
						theme="vintage"
						option={{
							legend: { data: [ '柱图' ] },
							tooltip: {},
							xAxis: {
								type: 'category',
								data: charts.barChart.category
							},
							yAxis: {
								type: 'value'
							},
							series: [
								{
									data: charts.barChart.data,
									type: 'bar',
									name: '柱图',
									barMaxWidth: 50
								}
							]
						}}
						loadingOption={{ text: '加载中' }}
						showLoading={charts.loading}
						notMerge={true}
						//onChartReady={chart => chart.hideLoading()}
						lazyUpdate={true}
						//showLoading={true}
					/>
				</Col>
			</Row>
			<Row gutter={8}>
				<Col xs={24}>
					<ReactEcharts
						theme="vintage"
						option={{
							title: {
								text: '饼图测试',
								// subtext: '纯属虚构',
								x: 'center'
							},
							tooltip: {
								trigger: 'item',
								formatter: '{a} <br/>{b} : {c} ({d}%)'
							},
							legend: {
								type: 'scroll',
								orient: 'vertical',
								right: 10,
								top: 20,
								bottom: 20,
								data: charts.pieChart.map(data => data.name)
							},
							series: [
								{
									name: '姓名',
									type: 'pie',
									radius: '55%',
									center: [ '40%', '50%' ],
									data: charts.pieChart,
									itemStyle: {
										emphasis: {
											shadowBlur: 10,
											shadowOffsetX: 0,
											shadowColor: 'rgba(0, 0, 0, 0.5)'
										}
									}
								}
							]
						}}
						loadingOption={{ text: '加载中' }}
						showLoading={charts.loading}
						notMerge={true}
						//onChartReady={chart => chart.hideLoading()}
						lazyUpdate={true}
						//showLoading={true}
					/>
				</Col>
			</Row>
		</Content>
	);
};

export default connect(state => ({ charts: state.charts }), dispatch => ({ dispatch }))(Charts);
