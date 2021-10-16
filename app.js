const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const bcrypt = require('bcrypt');

const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');

const auth = require('./middleware/auth');
const connection = require('./config/connection');

const Book = require('./models/book');
const Genre = require('./models/genre');
const Author = require('./models/author');
const User = require('./models/user');

const app = express();

app.use(express.json());

app.use(auth);

app.use('/graphql', graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true
}));

const port = process.env.PORT || 3000;

Book.belongsToMany(Genre, { through: 'book_genres', as: 'genres', foreignKey: 'book_id' });
Genre.belongsToMany(Book, { through: 'book_genres', as: 'books', foreignKey: 'genre_id' });

Book.belongsToMany(Author, { through: 'book_authors', as: 'authors', foreignKey: 'book_id' });
Author.belongsToMany(Book, { through: 'book_authors', as: 'books', foreignKey: 'author_id' });

app.listen({port}, async ()=>{
    const hashedPw = await bcrypt.hash('564789123', 12);

    connection.sync().then(() => {
        return User.findOne({ where: { username: 'admin' } });
    }).then(user => {
        if (!user) {
            return User.create({
                username: 'admin',
                password: hashedPw,
                role: 'admin',
                email: 'admin@gmail.com',
            });
        }
        return user;
    }).then(result => {
        console.log('Connected');
    });
})
