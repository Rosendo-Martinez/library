const form = document.querySelector('form');
const titleInput = document.querySelector('#title');
const authorInput = document.querySelector('#author');
const numberOfPagesInput = document.querySelector('#number-of-pages');
const numberOfReadPagesInput = document.querySelector('#number-of-read-pages');
const cardsContainer = document.querySelector('.cards')
const table = document.querySelector('.table');
const rowsContainer = document.querySelector('.rows');
const tableDisplayModeBtn = document.querySelector('#table-display-mode')

tableDisplayModeBtn.onclick = (e) => {
    isTableDisplayModeOn = !isTableDisplayModeOn;
    toggleDisplay();
    renderLibrary();
}

form.onsubmit = (e) => {
    e.preventDefault();
    createAndAddBookToLibrary(titleInput.value, authorInput.value, numberOfPagesInput.value, numberOfReadPagesInput.value);
    renderLibrary();
}

let isTableDisplayModeOn = false;
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

Book.prototype.getRowHTML = function () {
    const {title, author, numberOfPages, numberOfReadPages} = this;
    return `
        <tr>
            <td>${title}</td>
            <td>${author}</td>
            <td>${numberOfPages}</td>
            <td>${numberOfReadPages}</td>
        </tr>
    `
}

function getLibraryHTML() {
    let libraryHTML = '';
    for (let i = 0; i < myLibrary.length; i++) {
        if (isTableDisplayModeOn) {
            libraryHTML += myLibrary[i].getRowHTML();
        } else {
            libraryHTML += myLibrary[i].getCardHTML();
        }
    };
    return libraryHTML;
}

function createAndAddBookToLibrary(title, author, numberOfPages, numberOfReadPages) {
    myLibrary.push(new Book(title, author, numberOfPages, numberOfReadPages));
}

function renderLibrary() {
    if (isTableDisplayModeOn) {
        rowsContainer.innerHTML = getLibraryHTML();
    } else {
        cardsContainer.innerHTML = getLibraryHTML();
    }
}

function toggleDisplay() {
    table.classList.toggle('hidden');
    cardsContainer.classList.toggle('hidden');
}


