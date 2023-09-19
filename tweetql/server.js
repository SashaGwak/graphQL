import { ApolloServer, gql } from "apollo-server";

// graphql의 schema definition language(SDL) 선언 
// Query type은 필수값
// GET /text 
// GET /hello 
// REST api의 위와 같은 의미라고 생각하면 됨 
const typeDefs = gql`
    type Query {
        text : String
        hello : String 
        allFilms : X
    }
`; 

const server = new ApolloServer({typeDefs}); 

server.listen().then(({ url }) => {
    console.log(`Running on ${url}`);
}); 