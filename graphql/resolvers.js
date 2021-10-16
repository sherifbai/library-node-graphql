const Book = require('../models/book');
const Genre = require('../models/genre');
const Author = require('../models/author');
const User = require('../models/user');

const BookGenre = require('../models/book-genre');
const BookAuthor = require('../models/book-author');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    register: async function ({userInput}, req) {
        const existingUser = await User.findOne({where: {email: userInput.email}});

        if (existingUser) {
            const error = new Error('User already exists');
            error.status = 401;
            throw error;
        }

        const hashedPw = await bcrypt.hash(userInput.password, 12);

        const user = await User.create({
            username: userInput.username,
            email: userInput.email,
            password: hashedPw,
            role: 'user',
        });

        return {
            username: user.username,
            email: user.email,
            role: user.role,
            id: user.id
        }
    },

    login: async function ({email, password}, req) {
        const user = await User.findOne({where: {email: email}});

        if (!user) {
            const error = new Error('User does not found');
            error.status = 404;
            throw error;
        }

        const isEqualPw = bcrypt.compare(password, user.password);

        if (!isEqualPw) {
            const error = new Error('Passwords does not match');
            error.status = 401;
            throw  error;
        }

        const token = jwt.sign(
            {
                username: user.username,
                role: user.role,
                email: user.email,
                id: user.id
            },
            'secretKey',
            {expiresIn: '1h'}
        );

        return {
            token: token,
            id: user.id
        }
    },

    makeManager: async function ({userId}, req) {
        if (!req.isAuth) {
            const error = new Error('Not Authenticated');
            error.status = 403;
            throw error
        }

        if (req.role !== 'admin') {
            const error = new Error('You have not permission here');
            error.status = 403;
            throw error;
        }

        const user = await User.findOne({where: {id: userId}});

        user.role = 'manager';
        await user.save();

        return {
            username: user.username,
            role: user.role,
            email: user.email,
            id: user.id
        }
    },

    createAuthor: async function ({name}, req) {
        if (!req.isAuth) {
            const error = new Error('Not authenticated');
            error.status = 403;
            throw error;
        }

        if (req.role !== 'admin' && req.role !== 'manager') {
            const error = new Error('You have not permission here');
            error.status = 403;
            throw error;
        }

        const author = await Author.create({
            name: name,
        });

        return {
            id: author.id,
            name: author.name
        }
    },

    getAuthor: async function ({id}, req) {
        if (!req.isAuth) {
            const error = new Error('Not authenticated');
            error.status = 403;
            throw error;
        }

        if (req.role !== 'admin' && req.role !== 'manager') {
            const error = new Error('You have not permission here');
            error.status = 403;
            throw error;
        }

        const author = await Author.findOne({where: {id: id}});

        if (!author) {
            const error = new Error('Author not found');
            error.status = 404;
            throw error;
        }

        return {
            id: author.id,
            name: author.name
        }
    },

    getAuthors: async function ({}, req) {
        if (!req.isAuth) {
            const error = new Error('Not authenticated');
            error.status = 403;
            throw error;
        }

        if (req.role !== 'admin' && req.role !== 'manager') {
            const error = new Error('You have not permission here');
            error.status = 403;
            throw error;
        }

        return await Author.findAll()

    },

    updateAuthor: async function ({id, name}, req) {
        if (!req.isAuth) {
            const error = new Error('Not authenticated');
            error.status = 403;
            throw error;
        }

        if (req.role !== 'admin' && req.role !== 'manager') {
            const error = new Error('You have not permission here');
            error.status = 403;
            throw error;
        }

        const author = await Author.findOne({where: {id: id}});

        if (!author) {
            const error = new Error('Author not found');
            error.status = 404;
            throw error
        }

        author.name = name;

        await author.save();

        return {
            id: author.id,
            name: author.name
        }
    },

    deleteAuthor: async function ({id}, req) {
        if (!req.isAuth) {
            const error = new Error('Not authenticated');
            error.status = 403;
            throw error;
        }

        if (req.role !== 'admin' && req.role !== 'manager') {
            const error = new Error('You have not permission here');
            error.status = 403;
            throw error;
        }

        const author = await Author.findOne({where: {id: id}});

        if (!author) {
            const error = new Error('Author not found');
            error.status = 404;
            throw error;
        }

        await Author.destroy({where: {id: id}});

        return {
            id: id
        }
    },

    createGenre: async function ({name}, req) {
        if (!req.isAuth) {
            const error = new Error('Not authenticated');
            error.status = 403;
            throw error;
        }

        if (req.role !== 'admin' && req.role !== 'manager') {
            const error = new Error('You have not permission here');
            error.status = 403;
            throw error;
        }

        const genre = await Genre.create({
            name: name
        });

        return {
            id: genre.id,
            name: genre.name
        }
    },

    getGenre: async function ({id}, req) {
        if (!req.isAuth) {
            const error = new Error('Not authenticated');
            error.status = 403;
            throw error;
        }

        if (req.role !== 'admin' && req.role !== 'manager') {
            const error = new Error('You have not permission here');
            error.status = 401;
            throw error;
        }

        const genre = await Genre.findOne({where: {id: id}});

        if (!genre) {
            const error = new Error('Genre not found');
            error.status = 404;
            throw error;
        }

        return {
            id: genre.id,
            name: genre.name
        }
    },

    getGenres: async function ({}, req) {
        if (!req.isAuth) {
            const error = new Error('Not authenticated');
            error.status = 403;
            throw error;
        }

        if (req.role !== 'admin' && req.role !== 'manager') {
            const error = new Error('You have not permission here');
            error.status = 401;
            throw error;
        }

        return await Genre.findAll();
    },

    updateGenre: async function ({id, name}, req) {
        if (!req.isAuth) {
            const error = new Error('Not authenticated');
            error.status = 403;
            throw error;
        }

        if (req.role !== 'admin' && req.role !== 'manager') {
            const error = new Error('You have not permission here');
            error.status = 401;
            throw error;
        }

        const genre = await Genre.findOne({where: {id: id}});

        if (!genre) {
            const error = new Error('Genre not found');
            error.status = 404;
            throw error;
        }

        genre.name = name;

        await genre.save();

        return {
            name: genre.name,
            id: genre.id
        }
    },

    deleteGenre: async function ({id}, req) {
        if (!req.isAuth) {
            const error = new Error('Not authenticated');
            error.status = 403;
            throw error;
        }

        if (req.role !== 'admin' && req.role !== 'manager') {
            const error = new Error('You have not permission here');
            error.status = 401;
            throw error;
        }

        const genre = await Genre.findOne({where: {id: id}});

        if (!genre) {
            const error = new Error('Genre not found');
            error.status = 404;
            throw error;
        }

        await Genre.destroy({where: {id: id}});

        return {
            id: id
        }
    },

    createBook: async function ({name, genres, authors}, req) {
        if (!req.isAuth) {
            const error = new Error('Not authenticated');
            error.status = 403;
            throw error;
        }

        if (req.role !== 'admin' && req.role !== 'manager') {
            const error = new Error('You have not permission here');
            error.status = 401;
            throw error;
        }

        const book = await Book.create({
            name: name,
        });

        let genres_list;
        genres_list = [];

        let authors_list;
        authors_list = [];

        for (const item of genres) {
            const genre = await Genre.findOne({where: {id: item}});

            genres_list.push(genre);

            await BookGenre.create({
                book_id: book.id,
                genre_id: genre.id
            });
        }

        for (const item of authors) {
            const author = await Author.findOne({where: {id: item}});

            authors_list.push(author);

            await BookAuthor.create({
                book_id: book.id,
                author_id: author.id
            });
        }

        return {
            id: book.id,
            name: book.name,
            genres: genres_list,
            authors: authors_list
        }
    },

    updateBook: async function ({id, name, genres, authors}, req) {
        if (!req.isAuth) {
            const error = new Error('Not authenticated');
            error.status = 403;
            throw error;
        }

        if (req.role !== 'admin' && req.role !== 'manager') {
            const error = new Error('You have not permission here');
            error.status = 401;
            throw error;
        }

        const book = await Book.findOne({where: {id: id}});

        if (!book) {
            const error = new Error('Book not found');
            error.status = 404;
            throw error;
        }

        book.name = name;

        await book.save();

        let genres_list;
        genres_list = [];

        let authors_list;
        authors_list = [];

        for (const item of genres) {
            const genre = await Genre.findOne({where: {id: item}});

            genres_list.push(genre);

            const book_genre = await BookGenre.findAll({where: {book_id: id}});

            for (const j of book_genre) {
                if (!j.genre_id !== genre.id) {
                    await BookGenre.create({
                        book_id: book.id,
                        genre_id: genre.id
                    });
                }

                j.genre_id = genre.id;

                await j.save();

                break;
            }
        }


        return {
            id: book.id,
            name: name,
            genres: genres_list,
            authors: authors_list
        }
    }
}