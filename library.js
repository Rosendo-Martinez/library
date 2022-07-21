const form = document.querySelector('form');
const titleInput = document.querySelector('#title');
const authorInput = document.querySelector('#author');
const numberOfPagesInput = document.querySelector('#number-of-pages');
const numberOfReadPagesInput = document.querySelector('#number-of-read-pages');
const cardsContainer = document.querySelector('.cards')
const table = document.querySelector('.table');
const rowsContainer = document.querySelector('.rows');
const tableDisplayModeBtn = document.querySelector('#table-display-mode')
const sortBySelect = document.querySelector('#sort-by');
const reverseOrderInput = document.querySelector('#reverse-order');
const openModuleBtn = document.querySelector('#open-module-btn');
const module = document.querySelector('.module');
const closeModuleBtn = document.querySelector('#close-module-btn');

titleInput.onchange = () => {
    for (let i = 0; i < myLibrary.length; i++) {
        if (myLibrary[i].title === titleInput.value) {
            titleInput.setCustomValidity("Book with this title already exists");
            return;
        }
    }
    titleInput.setCustomValidity("");
}

numberOfReadPagesInput.onchange = () => {
    if ((parseInt(numberOfReadPagesInput.value ) > parseInt(numberOfPagesInput.value))) {
        numberOfReadPagesInput.setCustomValidity("Number of read pages must be less than number of pages");
    } else {
        numberOfReadPagesInput.setCustomValidity("");
        numberOfPagesInput.setCustomValidity("");
    }
}

numberOfPagesInput.onchange = () => {
    if ((parseInt(numberOfReadPagesInput.value ) > parseInt(numberOfPagesInput.value))) {
        numberOfPagesInput.setCustomValidity("Number of pages must be greater than number of read pages");
    } else {
        numberOfReadPagesInput.setCustomValidity("");
        numberOfPagesInput.setCustomValidity("");
    }
}

openModuleBtn.onclick = () => {
    toggleHidden(openModuleBtn);
    toggleHidden(module);
}
closeModuleBtn.onclick = () => {
    toggleHidden(openModuleBtn);
    toggleHidden(module);
    resetForm();
    isBookBeingEdited = false;
    currentEditingBook = null;
}

reverseOrderInput.onchange = () => {
    isReverseOrderOn = !isReverseOrderOn;
    renderLibrary();
}

sortBySelect.onchange = (e) => {
    sortBy = e.target.value;
    sortLibrary();
    renderLibrary();
}

tableDisplayModeBtn.onclick = (e) => {
    isTableDisplayModeOn = !isTableDisplayModeOn;
    toggleDisplay();
    renderLibrary();
    if (isTableDisplayModeOn) {
        tableDisplayModeBtn.textContent = 'Card Display'
    } else {
        tableDisplayModeBtn.textContent = 'Table Display'
    }
}

form.onsubmit = (e) => {
    e.preventDefault();
    if (isBookBeingEdited) {
        updateEditingBook(titleInput.value, authorInput.value, numberOfPagesInput.value, numberOfReadPagesInput.value);
    } else {
        createAndAddBookToLibrary(titleInput.value, authorInput.value, numberOfPagesInput.value, numberOfReadPagesInput.value);
    }
    toggleHidden(openModuleBtn);
    toggleHidden(module);
    renderLibrary();
    resetForm();
}

let currentEditingBook = null;
let isBookBeingEdited = false;
let isReverseOrderOn = false;
let sortBy = 'date';
let isTableDisplayModeOn = false;
let myLibrary = [];

function Book(title, author, numberOfPages, numberOfReadPages) {
    this.title = title;
    this.author = author;
    this.numberOfPages = numberOfPages;
    this.numberOfReadPages = numberOfReadPages;
    this.date = new Date();
}

Book.prototype.getCardHTML = function () {
    const {title, author, numberOfPages, numberOfReadPages} = this;
    return `
        <div class='card'> 
            <div class='card-top'>
                <p class='edit' onclick='editBook("${title}")'>
                    <span class="material-symbols-outlined">
                        settings
                    </span>
                </p>
                <p class='delete' onclick='deleteBook("${title}")'>
                    <span class="material-symbols-outlined">
                        close
                    </span>
                </p>
            </div>
            <div>
                <p class='title'>${title}<p>
                <p class='author'>By: ${author}<p>
                <p class='number-of-pages'>Number of Pages: ${numberOfPages}<p>
                <p class='number-of-read-pages'>Number of Read Pages: ${numberOfReadPages}<p>
                <p class='percentage'>Percentage of Book Done: ${Math.floor(numberOfReadPages/numberOfPages * 100)}%</p>
            </div>
            <div class='card-bottom'>
                <p class='increment' onclick='incrementReadPages("${title}")'>
                    <span class="material-symbols-outlined">
                        add
                    </span>
                </p>
                <p class='finish' onclick='finishReadingBook("${title}")'>
                    <span class="material-symbols-outlined">
                        done
                    </span>
                </p>
                <p class='decrement' onclick='decrementReadPages("${title}")'>
                    <span class="material-symbols-outlined">
                        remove
                    </span>
                </p>
            </div>
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
            <td>${Math.floor(numberOfReadPages/numberOfPages * 100)}%</td>
            <td class='increment' onclick='incrementReadPages("${title}")'>
                <span class="material-symbols-outlined">
                    add
                </span>
            </td>
            <td class='finish' onclick='finishReadingBook("${title}")'>
                <span class="material-symbols-outlined">
                    done
                </span>
            </td>
            <td class='decrement' onclick='decrementReadPages("${title}")'>
                <span class="material-symbols-outlined">
                    remove
                </span>
            </td>
        </tr>
    `
}

function getLibraryHTML() {
    let libraryHTML = '';
    if (isReverseOrderOn) {
        for (let i = myLibrary.length - 1; i > -1; i--) {
            if (isTableDisplayModeOn) {
                libraryHTML += myLibrary[i].getRowHTML();
            } else {
                libraryHTML += myLibrary[i].getCardHTML();
            }
        }
    } else {
        for (let i = 0; i < myLibrary.length; i++) {
            if (isTableDisplayModeOn) {
                libraryHTML += myLibrary[i].getRowHTML();
            } else {
                libraryHTML += myLibrary[i].getCardHTML();
            }
        }
    }
    return libraryHTML;
}

function createAndAddBookToLibrary(title, author, numberOfPages, numberOfReadPages) {
    myLibrary.push(new Book(title, author, numberOfPages, numberOfReadPages));
}

function renderLibrary() {
    if (isTableDisplayModeOn) {
        rowsContainer.innerHTML = getLibraryHTML();
        renderTableSummary();
    } else {
        cardsContainer.innerHTML = getLibraryHTML();
    }
}

function toggleDisplay() {
    table.classList.toggle('hidden');
    cardsContainer.classList.toggle('hidden');
}

function sortLibrary() {
    if (sortBy === 'date') {
        myLibrary.sort((a,b) => {
            if (a.date > b.date) {
                return 1
            } else if (a.date === b.date) {
                return 0;
            } else {
                return -1;
            }
        })
    } else if (sortBy === 'title') {
        myLibrary.sort((a,b) => a.title.localeCompare(b.title))
    } else if (sortBy === 'author') {
        myLibrary.sort((a,b) => a.author.localeCompare(b.author))
    } else if (sortBy === 'percentage') {
        myLibrary.sort((a,b) => {
            let aPercentage = Math.floor(a.numberOfReadPages / a.numberOfPages * 100);
            let bPercentage = Math.floor(b.numberOfReadPages / b.numberOfPages * 100);
            return aPercentage - bPercentage;
        });
    };
}

function resetForm() {
    authorInput.value = '';
    titleInput.value = '';
    numberOfPagesInput.value = '';
    numberOfReadPagesInput.value = '';
}

function toggleHidden(element) {
    element.classList.toggle('hidden');
}

function editBook(title) {
    if (!isBookBeingEdited && module.classList.contains('hidden')) {
        toggleHidden(module);
    }
    if (!openModuleBtn.classList.contains('hidden')) {
        toggleHidden(openModuleBtn);
    }
    isBookBeingEdited = true;
    currentEditingBook = getBook(title);
    titleInput.value = currentEditingBook.title;
    authorInput.value = currentEditingBook.author;
    numberOfPagesInput.value = currentEditingBook.numberOfPages;
    numberOfReadPagesInput.value = currentEditingBook.numberOfReadPages;
}

function getBook(title) {
    for (let i = 0; i < myLibrary.length; i++) {
        if (myLibrary[i].title === title) {
            return myLibrary[i];
        }
    };
}

function updateEditingBook(title, author, numberOfPages, numberOfReadPages) {
    currentEditingBook.title = title;
    currentEditingBook.author = author;
    currentEditingBook.numberOfPages = numberOfPages;
    currentEditingBook.numberOfReadPages = numberOfReadPages;
    isBookBeingEdited = false;
    currentEditingBook = null;
}

function incrementReadPages(title) {
    let book = getBook(title) 
    if (book.numberOfPages > book.numberOfReadPages) {
        book.numberOfReadPages++;
        if (sortBy === 'percentage') {
            sortLibrary();
        }
        renderLibrary();
    }
}

function decrementReadPages(title) {
    let book = getBook(title) 
    if (book.numberOfReadPages > 0) {
        book.numberOfReadPages--;
        if (sortBy === 'percentage') {
            sortLibrary();
        }
        renderLibrary();
    }
}

function finishReadingBook(title) {
    let book = getBook(title) 
    if (book.numberOfPages !== book.numberOfReadPages) {
        book.numberOfReadPages = book.numberOfPages;
        if (sortBy === 'percentage') {
            sortLibrary();
        }
        renderLibrary();
    }
}

function deleteBook(title) {
    for (let i = 0; i < myLibrary.length; i++) {
        if (myLibrary[i].title === title) {
            myLibrary.splice(i, 1);
            renderLibrary();
            return;
        }
    }
}

function renderTableSummary() {
    const numberOfBooksTd = document.querySelector('#number-of-books-td');
    const numberOfBookAuthorsTd = document.querySelector('#number-of-book-authors-td');
    const totalReadPagesTd = document.querySelector('#total-read-pages-td');
    const booksReadTd = document.querySelector('#books-read-td');
    const totalPagesTd = document.querySelector('#total-pages-td');
    const booksNoteDoneTd = document.querySelector('#books-note-done-td');
    numberOfBooksTd.textContent = getNumberOfBooks();
    numberOfBookAuthorsTd.textContent = getNumberOfUniqueBookAuthors();
    totalReadPagesTd.textContent = getTotalNumberOfReadPages();
    booksReadTd.textContent = getTotalNumberOfBooksRead();
    totalPagesTd.textContent = getTotalNumberOfPages();
    booksNoteDoneTd.textContent = getBooksNotDone();
}

function getNumberOfBooks() {
    return myLibrary.length;
}

function getNumberOfUniqueBookAuthors() {
    const authors = []
    for (let i = 0; i < myLibrary.length; i++) {
        authors.push(myLibrary[i].author);
    };
    return new Set(authors).size;
}

function getTotalNumberOfPages() {
    let totalNumberOfPages = 0;
    for (let i = 0; i < myLibrary.length; i++) {
        totalNumberOfPages += myLibrary[i].numberOfPages;
    }
    return totalNumberOfPages;
}

function getTotalNumberOfReadPages() {
    let totalNumberOfReadPages = 0;
    for (let i = 0; i < myLibrary.length; i++) {
        totalNumberOfReadPages += myLibrary[i].numberOfReadPages;
    }
    return totalNumberOfReadPages;
}

function getTotalNumberOfBooksRead() {
    let booksRead = 0;
    for (let i = 0; i < myLibrary.length; i++) {
        if (myLibrary[i].numberOfPages === myLibrary[i].numberOfReadPages) {
            booksRead++;
        }
    }
    return booksRead;
}

function getBooksNotDone() {
    let booksNotDone = 0;
    for (let i = 0; i < myLibrary.length; i++) {
        if (myLibrary[i].numberOfPages !== myLibrary[i].numberOfReadPages) {
            booksNotDone++;
        }
    }
    return booksNotDone;
}