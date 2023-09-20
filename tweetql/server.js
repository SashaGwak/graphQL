import { ApolloServer, gql } from "apollo-server";

let tweets = [
    {
        id:"1", 
        text:"firsg one!", 
    }, 
    {
        id:"2", 
        text:"second one", 
    }
]

let users = [
    {
        id:"1", 
        firstName:"gwak", 
        lastName:"sha"
    }, 
];

// graphql의 schema definition language(SDL) 선언 
// Query type은 필수값
const typeDefs = gql`
    type User {
        id:ID!
        username:String!
        firstName:String!
        lastName:String
    }
    type Tweet {
        id:ID!
        text:String!
        author:User
    }
    type Query {
        allUsers:[User!]!
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

const resolvers = {
    Query : { 
        allUsers() {
            return users;
        },
        allTweets() {
            return tweets; 
        },
        tweet(root, {id}) {
            return tweets.find((tweet) => tweet.id === id);
        }
    }, 
    Mutation: {
        postTweet(__, {text, userId}) {
            const newTweet = {
                id: tweets.length + 1, 
                text, 
            }; 
            tweets.push(newTweet);
            return newTweet;
        }, 
        deleteTweet(__, {id}) { 
            const tweet = tweets.find((tweet) => tweet.id === id);
            if (!tweet) return false;
            tweets = tweets.filter((tweet) => tweet.id !== id);
            return true;
        }
    }
}
// typeDefs 의 Query와 꼭 이름 일치해야함!!! 
// user의 argument 다루는 방법
// tweet(root, args) {
//     console.log(args);
//     return null;
// }
// 이런식으로 args 파라미터로 받아올 수 있음. 혹은 객체구조분해

const server = new ApolloServer({typeDefs, resolvers}); 

server.listen().then(({ url }) => {
    console.log(`Running on ${url}`);
}); 