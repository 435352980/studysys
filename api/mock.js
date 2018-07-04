import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { graphiqlExpress, graphqlExpress } from 'graphql-server-express';
import { addMockFunctionsToSchema, MockList } from 'graphql-tools';
import { mock } from 'mockjs';
import schema from './schema';

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

app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
app.use('/graphql', graphqlExpress({ schema }));
app.listen(3000);
