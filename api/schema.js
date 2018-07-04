import path from 'path';
import { makeExecutableSchema, addMockFunctionsToSchema, MockList } from 'graphql-tools';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import { mock } from 'mockjs';

const typesArray = fileLoader(path.join(__dirname, './types'), { recursive: true });

//const typeDefs = mergeTypes(typesArray, { all: true });--合并重名type，不会保留description
const typeDefs = mergeTypes(typesArray);

const resolversArray = fileLoader(path.join(__dirname, './resolvers'));

const resolvers = mergeResolvers(resolversArray);

const schema = makeExecutableSchema({ typeDefs, resolvers });

export default schema;
