function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}
Book.prototype.changeReadStatus = function () {
  this.read ? (this.read = false) : (this.read = true);
};

let body = document.querySelector("body");
let form = document.querySelector("form");
let submitBtn = document.querySelector(".submit");
let booksDisplay = document.querySelector(".BooksDisplay");
let FormContainer = document.querySelector(".FormContainer");
let FormCloseButton = document.querySelector(".CloseButton");

let theme2Flag = false;

function loadStoredBooks() {
  for (let book in localStorage) {
    if (localStorage.hasOwnProperty(book)) {
      let bookObj = JSON.parse(localStorage[book]);
      bookObj.__proto__ = Book.prototype;
      AddBookToLibrary(bookObj, 0);
    }
  }
}

loadStoredBooks();

function AddBookToLibrary(newBook, loadflag) {
  let bookInDisplay = document.createElement("div");
  bookInDisplay.classList.add("BookCard");
  if (theme2Flag) {
    bookInDisplay.classList.add("theme2");
  }
  let localStorageKey = `${newBook["title"]}${newBook["author"]}`;
  let localStorageValue = JSON.stringify(newBook);
  if (loadflag) {
    localStorage.setItem(localStorageKey, localStorageValue);
  }
  for (bookAttribute in newBook) {
    if (newBook.hasOwnProperty(bookAttribute)) {
      let bookAttributeDisplay = document.createElement("div");
      bookAttributeDisplay.classList.add(bookAttribute);
      if (bookAttribute == "read") {
        newBook[bookAttribute]
          ? (bookAttributeDisplay.innerText = `status: ${bookAttribute}`)
          : (bookAttributeDisplay.innerText = `status: Not ${bookAttribute}`);
      } else {
        bookAttributeDisplay.innerText = `${bookAttribute}: ${newBook[bookAttribute]}`;
      }

      bookInDisplay.appendChild(bookAttributeDisplay);
    }
  }

  let bookButtons = document.createElement("div");
  bookButtons.classList.add("bookButtons");
  bookInDisplay.appendChild(bookButtons);
  let deleteButton = makeDeletionButton(localStorageKey, bookInDisplay);
  bookButtons.appendChild(deleteButton);

  let ChangeReadStatusButton = makeChangeReadStatusButton(
    newBook,
    localStorageKey,
    bookInDisplay
  );
  bookButtons.append(ChangeReadStatusButton);
  booksDisplay.append(bookInDisplay);
}

function makeChangeReadStatusButton(bookObject, BookKey, bookInDisplay) {
  let changeReadStatusButton = document.createElement("button");
  if (theme2Flag) {
    changeReadStatusButton.classList.add("theme2");
  }
  changeReadStatusButton.textContent = "change Read Status";

  changeReadStatusButton.addEventListener("click", () => {
    bookObject.changeReadStatus();
    localStorage[BookKey] = JSON.stringify(bookObject);
    if (bookObject.read) {
      bookInDisplay.children[3].textContent = "status: read";
    } else {
      bookInDisplay.children[3].textContent = "status: Not read";
    }
  });
  return changeReadStatusButton;
}

function makeDeletionButton(deletedBooKey, deletedBook) {
  let button = document.createElement("button");
  if (theme2Flag) {
    button.classList.add("theme2");
  }
  button.textContent = "delete book";
  button.addEventListener("click", () => {
    booksDisplay.removeChild(deletedBook);
    localStorage.removeItem(deletedBooKey);
  });
  return button;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  let formData = new FormData(form);
  const title = formData.get("title");
  const author = formData.get("author");
  const pages = formData.get("pages");
  let read = "";
  document.querySelector('input[type="checkbox"]').checked
    ? (read = true)
    : (read = false);

  const book = new Book(title, author, pages, read);

  if (title && author && pages) {
    AddBookToLibrary(book, 1);
  }

  form.reset();

  FormCloseButton.click();
});

submitBtn.addEventListener("submit", () => {
  form.submit();
});

let addBookButton = document.querySelector(".AddBookButton");
addBookButton.onclick = () => {
  classToggle("invisible", FormContainer);
  classToggle("dim", FormContainer);
  FormContainer.focus();
};

FormCloseButton.addEventListener("click", () => {
  classToggle("invisible", FormContainer);
  classToggle("dim", FormContainer);
});

let ChangeThemeButton = document.querySelector(".ChangeThemeButton");

ChangeThemeButton.addEventListener("click", () => {
  if (theme2Flag == false) {
    theme2Flag = true;
  } else {
    theme2Flag = false;
  }

  let themeRelatedElements = [
    body,
    FormContainer,
    FormCloseButton,
    loadElementsIntoArray("input"),
    loadElementsIntoArray(".BookCard"),
    loadElementsIntoArray("h1"),
    loadElementsIntoArray("button"),
  ];
  themeRelatedElements.forEach((themee) => {
    classToggle("theme2", themee);
  });
});

function loadElementsIntoArray(elementSelector) {
  return Array.from(document.querySelectorAll(elementSelector));
}

function classToggle(AddedClass, ...elements) {
  elements.forEach((element) => {
    if (Array.isArray(element)) {
      element.forEach((member) => {
        member.classList.toggle(AddedClass);
      });
    } else {
      element.classList.toggle(AddedClass);
    }
  });
}
