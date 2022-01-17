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

for (book in localStorage) {
  if (localStorage.hasOwnProperty(book)) {
    let bookObj = JSON.parse(localStorage[book]);
    console.log(bookObj);
    AddBookToLibrary(bookObj);
  }
}

function makeChangeReadStatusButton(BookKey, bookInDisplay) {
  let changeReadStatusButton = document.createElement("button");
  changeReadStatusButton.textContent = "change Read Status";
  changeReadStatusButton.addEventListener("click", () => {
    let bookObject = JSON.parse(localStorage[BookKey]);
    if (bookObject.read == true) {
      bookInDisplay.children[3].textContent = "status: Not read";
      bookObject.read = false;
    } else {
      bookInDisplay.children[3].textContent = "status: read";
      bookObject.read = true;
    }
    localStorage[BookKey] = JSON.stringify(bookObject);
  });
  return changeReadStatusButton;
}

function makeDeletionButton(deletedBooKey, deletedBook) {
  let button = document.createElement("button");
  button.textContent = "delete book";
  button.addEventListener("click", () => {
    booksDisplay.removeChild(deletedBook);
    localStorage.removeItem(deletedBooKey);
  });
  return button;
}

function AddBookToLibrary(newBook) {
  let bookInDisplay = document.createElement("div");
  bookInDisplay.classList.add("Book");

  let localStorageKey = `${newBook["title"]}${newBook["author"]}`;
  let localStorageValue = JSON.stringify(newBook);
  localStorage.setItem(localStorageKey, localStorageValue);

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
    localStorageKey,
    bookInDisplay
  );
  bookButtons.append(ChangeReadStatusButton);

  booksDisplay.append(bookInDisplay);

  /**/
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
  AddBookToLibrary(book);

  form.reset();
});

submitBtn.addEventListener("submit", () => {
  form.submit();
});
