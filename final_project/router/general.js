const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body
  if (!username || !password) {
    res.status(400).json({message: 'You should provide both username & password'})
  } else if (isValid(username)) {
    res.status(400).json({message: 'Username already taken'})
  } else {
    users.push({username, password})
    return res.status(201).json({message: "User created"});
  }
  
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
//   console.log(books)
    res.json(books)

//   return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const book_nums = Object.keys(books)
    const isbn = req.params.isbn;
    if (book_nums.includes(`${isbn}`)){
        res.json(books[`${isbn}`])
    } else {
        res.status(404).json({message: 'Invalid book number'})
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const book_authors = Object.values(books).map(book => book.author)
  const author = req.params.author;
  if (book_authors.includes(author)){
    const foundbook = Object.values(books).filter(book => book.author == author)
    res.json(foundbook)
  } else {
    res.status(404).json({message: 'Invalid author'})
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const book_titles = Object.values(books).map(book => book.title)
    const title = req.params.title;
    if (book_titles.includes(title)){
      const foundbook = Object.values(books).filter(book => book.title == title)
      res.json(foundbook)
    } else {
      res.status(404).json({message: 'Invalid title'})
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const book_nums = Object.keys(books)
    const isbn = req.params.isbn;
    if (book_nums.includes(`${isbn}`)){
        res.json({book: books[`${isbn}`].title, reviews: books[`${isbn}`].reviews})
    } else {
        res.status(404).json({message: 'Invalid book number'})
    }
});

module.exports.general = public_users;
