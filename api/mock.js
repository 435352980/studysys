import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { graphiqlExpress, graphqlExpress } from 'graphql-server-express';
import { addMockFunctionsToSchema, MockList } from 'graphql-tools';
import { mock } from 'mockjs';
import schema from './schema';

import { writeexcel } from './router';

addMockFunctionsToSchema({
	schema,
	mocks: {
		//Int: () => mock('@integer(300,800)'),
		Query: () => ({
			getUser: () => new MockList(20)
		}),
		User: () =>
			mock({
				signdate: '@integer(1993,2015)-@date("MM-dd")',
				username: '@name',
				nickname: '@cname',
				email: '@email',
				gender: '@pick(["男","女"])',
				description: '@cparagraph',
				role: '@boolean(1,6,false)'
			}),
		VouchInfo: () => ({
			header: mock({
				code: /\d{15}/,
				iwh: '@city()仓库',
				owh: '@city()仓库'
			}),
			details: () => new MockList(30)
		}),
		VouchDetail: () => ({
			id: mock('@id'),
			cat: mock('@pick(["类别1", "类别2", "类别3", "类别4"])'),
			model: mock('@pick(["型号1", "型号2", "型号3", "型号4"])'),
			color: mock('@pick(["颜色1","颜色2","颜色3"])'),
			qty: mock('@integer(1,20)'),
			price: mock('@float(200, 4000, 0, 2)')
		}),
		Charts: () => ({
			pieChart: () => new MockList(8)
		}),
		BarChart: () =>
			mock({
				'category|8': [ '@first' ],
				'data|8': [ '@integer(300,800)' ]
			}),

		PieChart: () =>
			mock({
				name: '@first',
				value: '@integer(300,800)'
			})
	}
});

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/excel', writeexcel);

app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
app.use('/graphql', graphqlExpress({ schema }));
app.listen(3000);
