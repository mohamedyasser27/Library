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
let book2 = new Book("The hobbit", "J. R. R. Tolkien", 45, false);
myLibrary.push(book1);
AddBookToLibrary(book1, 0);
myLibrary.push(book2);
AddBookToLibrary(book2, 1);

function makeChangeReadStatusButton(displaybook, index) {
  let changeReadStatusButton = document.createElement("button");
  changeReadStatusButton.textContent = "change Read Status";
  changeReadStatusButton.setAttribute("bookIndex", index);
  changeReadStatusButton.addEventListener("click", () => {
    myLibrary[
      changeReadStatusButton.getAttribute("bookIndex")
    ].changeReadStatus();
    let newState = "";
    myLibrary[changeReadStatusButton.getAttribute("bookIndex")].read
      ? (newState = "status: read")
      : (newState = "status: not read");
    let readStatus = displaybook.querySelector(".read");
    readStatus.textContent = newState;
  });
  return changeReadStatusButton;
}

function makeDeletionButton(booksDisplay, displaybook, index) {
  let deleteButton = document.createElement("button");
  deleteButton.textContent = "Remove Book";
  deleteButton.setAttribute("bookIndex", index);

  deleteButton.addEventListener("click", (event) => {
    myLibrary.splice(index, 1);

    booksDisplay.removeChild(
      booksDisplay.childNodes[event.target.getAttribute("bookIndex")]
    );
    if (myLibrary.length != 1) {
      reorderLibrary();
    }
  });
  return deleteButton;
}

function AddBookToLibrary(bookToAdd, index) {
  let displaybook = document.createElement("div");
  displaybook.classList.add("Book");
  displaybook.setAttribute("bookIndex", index);
  for (attribute in bookToAdd) {
    if (bookToAdd.hasOwnProperty(attribute)) {
      let child = document.createElement("div");
      child.classList.add(attribute);
      if (attribute == "read") {
        bookToAdd[attribute]
          ? (child.innerText = `status: ${attribute}`)
          : (child.innerText = `status: ${attribute}`);
      } else {
        child.innerText = `${attribute}: ${bookToAdd[attribute]}`;
      }

      displaybook.appendChild(child);
    }
  }

  let bookButtons = document.createElement("div");
  bookButtons.classList.add("bookButtons");
  displaybook.appendChild(bookButtons);

  let deleteButton = makeDeletionButton(booksDisplay, displaybook, index);
  bookButtons.appendChild(deleteButton);

  let ChangeReadStatusButton = makeChangeReadStatusButton(displaybook, index);
  bookButtons.append(ChangeReadStatusButton);

  booksDisplay.append(displaybook);

  /**/
}

function reorderLibrary() {
  let books = Array.from(booksDisplay.childNodes);
  myLibrary.forEach((book, index) => {
    books[index].setAttribute("bookIndex", index);
    booksDisplay.childNodes[index].childNodes[4].childNodes[0].setAttribute(
      "bookIndex",
      index
    );
    booksDisplay.childNodes[index].childNodes[4].childNodes[1].setAttribute(
      "bookIndex",
      index
    );
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  let formData = new FormData(form);
  const name = formData.get("name");
  const author = formData.get("author");
  const pages = formData.get("pages");
  let read = "";
  document.querySelector('input[type="checkbox"]').checked
    ? (read = true)
    : (read = false);
  let warning = document.querySelector(".warning");
  if (name == "" || author == "" || pages == "") {
    warning.classList.remove("invisible");
  } else {
    warning.classList.add("invisible");
    const book = new Book(name, author, pages, read);
    AddBookToLibrary(book, myLibrary.length);
    myLibrary.push(book);

    form.reset();
  }
});

submitBtn.addEventListener("submit", () => {
  form.submit();
});
