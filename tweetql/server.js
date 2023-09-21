import { ApolloServer, gql } from "apollo-server";

let tweets = [
    {
        id:"1", 
        text:"firsg one!", 
        userId:"2",
    }, 
    {
        id:"2", 
        text:"second one", 
        userId:"1",
    }
]

let users = [
    {
        id:"1", 
        firstName:"gwak", 
        lastName:"sha"
    }, 
    {
        id:"2",
        firstName:"go",
        lastName:"nyang"   
    }
];

// graphql의 schema definition language(SDL) 선언 
// Query type은 필수값
const typeDefs = gql`
    type User {
        id:ID!
        username:String!
        firstName:String!
        lastName:String
        """
        fullName = firstName + lastName 리턴
        """
        fullName:String!
    }
    """
    트위터 게시물에 대한 정보
    """
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
        """ 트위터 id 존재하는지 검사 후 존재한다면 삭제함. id 찾지못하면 false return """
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
        allUsers(root) {
            console.log(root);
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
            if (!user.find((user) => user.id === userId)) {
                return false;
            }
            const newTweet = {
                id: tweets.length + 1, 
                text, 
                userId,
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
    }, 
    User: {
        // type resolver의 첫번째 argument는 return 되고있는 object의 data를 줌!!! (root X)
        fullName({firstName, lastName}) {  
            return`${firstName} ${lastName}`;
        }
    }, 
    Tweet: {
        author({userId}) {
            return users.find((user)=> user.id === userId); 
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

// resolver argument 함수에는 네가지 인수가 순서대로 전달됨 
// parent(root or source), args, context, info
// https://www.apollographql.com/docs/apollo-server/data/resolvers/#resolver-arguments

const server = new ApolloServer({typeDefs, resolvers}); 

server.listen().then(({ url }) => {
    console.log(`Running on ${url}`);
}); 