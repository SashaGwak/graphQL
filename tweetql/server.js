import { ApolloServer, gql } from "apollo-server";

// graphql의 schema definition language(SDL) 선언 
// Query type은 필수값
const typeDefs = gql`
    type User {
        id:ID!
        username:String!
        firstName:String!
        lastName:String!
    }
    type Tweet {
        id:ID!
        text:String!
        author:User!
    }
    type Query {
        allTweets:[Tweet!]!
        tweet(id:ID!) :Tweet
    }
    type Mutation {
        postTweet(text:String!, userId:ID!):Tweet!
        deleteTweet(id:ID!):Boolean!
    }
`; 

// Query는
// GET /api/v1/tweets 
// GET /api/v1/tweet/:id 같은 의미 

// Mutation은 user가 보낸 데이터로 mutate하는 동작들을 모두 넣음

// 만약 어떤 요소를 required로 만들고 싶다면 !쓰면됨(아니면 Null도 허용된다고 알려주는 거얌)
// tweet(id:ID!) :Tweet!
// 예를 들어 위에는 id이라는 파라미터가 필수값으로 들어오고 필수로 Tweet이라는 데이터를 리턴할 예정임

const server = new ApolloServer({typeDefs}); 

server.listen().then(({ url }) => {
    console.log(`Running on ${url}`);
}); 