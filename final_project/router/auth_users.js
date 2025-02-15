const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    if (users.map(user => user.username).includes(username)){
        return true
    } else {
        return false
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const { username, password } = req.body
    if (!username || !password) {
      res.status(400).json({message: 'You should provide both username & password'})
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: username
        }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send({ accessToken, username });
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const review = req.body.review
    const book_nums = Object.keys(books)
    const isbn = req.params.isbn;
    if (book_nums.includes(`${isbn}`)){
        books[`${isbn}`].reviews[`${req.user}`] = review
        res.json({message: 'Review added successfully', book: books[`${isbn}`].title, reviews: books[`${isbn}`].reviews})
    } else {
        res.status(404).json({message: 'Invalid book number'})
    }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const book_nums = Object.keys(books)
    const isbn = req.params.isbn;
    if (book_nums.includes(`${isbn}`)){
        delete books[`${isbn}`].reviews[`${req.user}`]
        res.json({message: 'Review deleted successfully', book: books[`${isbn}`].title, reviews: books[`${isbn}`].reviews})
    } else {
        res.status(404).json({message: 'Invalid book number'})
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
