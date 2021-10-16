const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type User {
        id: ID!
        username: String!
        email: String!
        role: String!
    }
    
    input UserInputData {
        username: String!
        email: String!
        password: String!
    }
    type AuthData {
        id: ID!
        token: String!
    }
    
    type Author {
        id: ID!
        name: String!
    }
    
    type Genre {
        id: ID!
        name: String!
    }
    
    type Book {
        id: ID!
        name: String!
        genres: [Genre!]!
        authors: [Author!]!
    }
    
    type RootMutation {
        register(userInput: UserInputData): User!
        makeManager(userId: Int!): User!
        
        createAuthor(name: String!): Author!
        updateAuthor(id: Int!, name: String!): Author!
        deleteAuthor(id: Int): Author!
        
        createGenre(name: String!): Genre!
        updateGenre(id: Int!, name: String!): Genre!
        deleteGenre(id: Int): Genre!
        
        createBook(name: String!, genres: [Int!], authors: [Int!]): Book!
    }
    
    type RootQuery {
        login(email: String!, password: String!): AuthData!
        
        getAuthor(id: Int!): Author!
        getAuthors: [Author]!
        
        getGenre(id: Int!): Genre!
        getGenres: [Genre!]!
    }
    
    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
