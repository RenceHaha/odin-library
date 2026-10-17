'use strict'

const myLibrary = [];

function Book(title, author, pages, read=false){
    if(!new.target){
        throw Error("You must use a new keyword to use this constructor.");
    }
    this.uuid = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

function createBook(title, author, pages, read=false){
    if(!title || !author || !pages){
        throw Error('Failed to create a book');
    }

    const book = new Book(title, author, pages, read);
    myLibrary.push(book);
}

function toggleRead(object){
    object.read = !object.read;
}