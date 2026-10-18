'use strict'

const myLibrary = [];
const bookForm = document.getElementById('add-book-form');
const dialog = document.getElementById('form-dialog');
const cancelBtn = document.getElementById('cancel-btn');
const bookContainer = document.getElementById('book-container');

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

Book.prototype.toggleRead = function (){
    this.read = !this.read;
}

function createBook(title, author, pages, read=false){
    if(!title || !author || !pages){
        throw Error('Failed to create a book');
    }
    const book = new Book(title, author, pages, read);
    myLibrary.push(book);
    return book;
}

function createBookElement(obj){
    const book = document.createElement("div");
    book.className = "book";
    book.id = `${obj.uuid}`;
    book.dataset.title = `${obj.title}`;
    book.dataset.author = `${obj.author}`;
    book.dataset.pages = `${obj.pages}`;
    book.dataset.read = `${obj.read}`;
    book.innerHTML = `
        <div class="title-wrapper">   
            <h2>${obj.title}</h2>
            <div class="menu-wrapper">
                <button class="more-btn" aria-expanded="false">
                    <svg width="16px" height="16px" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="48" height="48" fill="white" fill-opacity="0.01"/>
                        <circle cx="12" cy="24" r="3" fill="#000000"/>
                        <circle cx="24" cy="24" r="3" fill="#000000"/>
                        <circle cx="36" cy="24" r="3" fill="#000000"/>
                    </svg>
                </button>
                <div class="menu-panel">
                    <ul class="menu-list">
                        <li class="read-btn">Mark as ${obj.read ? 'unread' : 'read'}</li>
                        <li class="remove-btn">Remove</li>
                    </ul>
                </div>
            </div>
        </div>
        <h3>by ${obj.author}</h3>
        <p>${obj.pages} pages</p>
    `;
    return book;
}


bookForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const data = new FormData(this);

    const book = createBook(data.get('title'), data.get('author'), data.get('pages'));
    const bookElement = createBookElement(book);

    bookContainer.appendChild(bookElement);
    e.target.reset();
    dialog.close();
});

cancelBtn.addEventListener('click', () => {
    bookForm.reset();
});


// EVENT DELEGATOR
document.addEventListener('click', (e) => {
    // console.log(e.target);
    const moreBtn = e.target.closest('.more-btn');

    const openMenus = document.querySelectorAll('.more-btn[aria-expanded="true"]');
    openMenus.forEach((menu) => {
        const menuWrapper = menu.closest('.menu-wrapper');
        // console.log(menuWrapper);
        if(menuWrapper && !menuWrapper.contains(e.target)){
            menu.setAttribute('aria-expanded', 'false');
        }
    });

    if(moreBtn){
        const isExpanded = moreBtn.getAttribute('aria-expanded') === 'true';
        moreBtn.setAttribute('aria-expanded', String(!isExpanded));
    }

    if(e.target.matches('li.read-btn')){
        const book = e.target.closest('div.book');
        const isRead = book.dataset.read === 'true';
        book.dataset.read = String(!isRead);
        e.target.textContent = isRead ? 'Mark as read' : 'Mark as unread';
        for(const myBook of myLibrary){
            if(myBook.uuid === book.id){
                myBook.toggleRead();
                // console.log(myBook);
            }
        }
    }

    if(e.target.matches('li.remove-btn')){
        const book = e.target.closest('div.book');
        book.remove();
        myLibrary.forEach((myBook, index) => {
            if(myBook.uuid === book.id){
                myLibrary.splice(index, 1);
            }
        })
    }

});

