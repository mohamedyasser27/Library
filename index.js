function Book(name, author, pages, read) {
  this.name = name;
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

let myLibrary = [];
let book1 = new Book("harry Potter", "JK Rollings", 21, true);
let book2 = new Book("The hobbit", "J. R. R. Tolkien", 45, true);

myLibrary.push(book1);
AddBooksToDisplay(book1, 0);
myLibrary.push(book2);
AddBooksToDisplay(book2, 1);

function makeChangeReadStatusButton(displaybook, index) {
  let changeReadStatusButton = document.createElement("button");
  changeReadStatusButton.textContent = "change Read Status";
  changeReadStatusButton.addEventListener("click", () => {
    myLibrary[index].changeReadStatus();
    let readStatus = displaybook.querySelector(".read");
    readStatus.textContent = myLibrary[index].read;
  });
  displaybook.appendChild(changeReadStatusButton);
}

function makeDeletionButton(booksDisplay, displaybook, index) {
  let deleteButton = document.createElement("button");
  deleteButton.textContent = "Remove Book";
  deleteButton.setAttribute("bookIndex", index);
  displaybook.appendChild(deleteButton);
  myLibrary.splice(index, 1);
  deleteButton.addEventListener("click", () => {
    booksDisplay.removeChild(
      booksDisplay.querySelector(`div[bookIndex='${index}']`)
    );
    if (myLibrary.length != 1) {
      reorderDisplayItems();
    }
  });
}

function AddBooksToDisplay(bookToAdd, index) {
  let displaybook = document.createElement("div");
  displaybook.classList.add("Book");
  displaybook.setAttribute("bookIndex", index);
  for (attribute in bookToAdd) {
    if (bookToAdd.hasOwnProperty(attribute)) {
      let child = document.createElement("div");
      child.classList.add(attribute);
      child.innerText = `${attribute}: ${bookToAdd[attribute]}`;
      displaybook.appendChild(child);
    }
  }
  booksDisplay.append(displaybook);

  makeChangeReadStatusButton(displaybook, index);
  makeDeletionButton(booksDisplay, displaybook, index);
  /**/
}

function reorderDisplayItems() {
  let books = Array.from(booksDisplay.childNodes);
  myLibrary.forEach((book, index) => {
    books[index].setAttribute("bookIndex", index);
  });

  console.log("my Library", myLibrary);
  console.log("books display", booksDisplay);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  let formData = new FormData(form);
  const name = formData.get("name");
  const author = formData.get("author");
  const pages = formData.get("pages");
  const read = document.querySelector('input[type="checkbox"]').checked
    ? "read"
    : "not read";
  let warning = document.querySelector(".warning");
  if (name == "" || author == "" || pages == "") {
    warning.classList.remove("invisible");
  } else {
    warning.classList.add("invisible");
    const book = new Book(name, author, pages, read);
    AddBooksToDisplay(book, myLibrary.length - 1);
    myLibrary.push(book);

    form.reset();
  }
});

submitBtn.addEventListener("submit", () => {
  form.submit();
});
