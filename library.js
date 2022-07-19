const form = document.querySelector('form');
const titleInput = document.querySelector('#title');
const authorInput = document.querySelector('#author');
const numberOfPagesInput = document.querySelector('#number-of-pages');
const numberOfReadPagesInput = document.querySelector('#number-of-read-pages');
const cardsDiv = document.querySelector('.cards')

form.onsubmit = (e) => {
    e.preventDefault();
    createAndAddBookToLibrary(titleInput.value, authorInput.value, numberOfPagesInput.value, numberOfReadPagesInput.value);
    cardsDiv.innerHTML = getLibraryHTML();
}

let myLibrary = [];

function Book(title, author, numberOfPages, numberOfReadPages) {
    this.title = title;
    this.author = author;
    this.numberOfPages = numberOfPages;
    this.numberOfReadPages = numberOfReadPages;
}

Book.prototype.getCardHTML = function () {
    const {title, author, numberOfPages, numberOfReadPages} = this;
    return `
        <div class='card'> 
            <p>${title}<p>
            <p>By: ${author}<p>
            <p>Number of Pages: ${numberOfPages}<p>
            <p>Number of Read Pages: ${numberOfReadPages}<p>
        </div>
    `
}

function getLibraryHTML() {
    let libraryHTML = '';
    for (let i = 0; i < myLibrary.length; i++) {
        libraryHTML += myLibrary[i].getCardHTML();
    };
    return libraryHTML;
}

function createAndAddBookToLibrary(title, author, numberOfPages, numberOfReadPages) {
    myLibrary.push(new Book(title, author, numberOfPages, numberOfReadPages));
}


