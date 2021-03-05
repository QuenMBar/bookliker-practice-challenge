let currentBookData = {};

document.addEventListener("DOMContentLoaded", function () {
    fetchCurrentBooks().then((bookData) => {
        currentBookData = bookData;
        // console.log(currentBookData);
        if (JSON.stringify(currentBookData) != "{}") {
            popBookList();
        }
    });
});

async function fetchCurrentBooks() {
    try {
        let response = await fetch("http://localhost:3000/books");
        return (data = await response.json());
    } catch (e) {
        console.log(e);
        return {};
    }
}

function popBookList() {
    const bookList = document.getElementById("list");
    currentBookData.forEach((book) => {
        const newBookLi = document.createElement("li");
        newBookLi.append(book.title);
        newBookLi.data = { id: book.id };
        newBookLi.addEventListener("click", getBookByID);
        bookList.append(newBookLi);
    });
}

function getBookByID(e) {
    let bookInfo = currentBookData.find((book) => book.id === e.target.data.id);
    const bookInfoDiv = document.getElementById("show-panel");
    bookInfoDiv.innerHTML = "";

    const bookImg = document.createElement("img");
    bookImg.src = bookInfo.img_url;
    bookImg.style.height = "25vh";

    const bookTitle = document.createElement("h1");
    bookTitle.textContent = bookInfo.title;

    const bookSubtitle = document.createElement("h2");
    bookSubtitle.textContent = bookInfo.subtitle;

    const bookAuthor = document.createElement("h2");
    bookAuthor.textContent = bookInfo.author;

    const bookDesc = document.createElement("p");
    bookDesc.textContent = bookInfo.description;

    const likeButton = document.createElement("button");
    if (bookInfo.users.find((user) => user.id == 1) != undefined) {
        likeButton.textContent = "UNLIKE";
        likeButton.data = {
            liked: true,
            id: e.target.data.id,
        };
    } else {
        likeButton.textContent = "LIKE";
        likeButton.data = {
            liked: false,
            id: e.target.data.id,
        };
    }
    likeButton.addEventListener("click", (e) => {
        if (e.target.data.liked) {
            let currentUsers = currentBookData.find((book) => book.id == e.target.data.id).users;
            currentUsers.splice(
                currentUsers.findIndex((user) => user.id == 1),
                1
            );
            let postObj = {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({ users: currentUsers }),
            };
            fetch(`http://localhost:3000/books/${e.target.data.id}`, postObj)
                .then((patchResponse) => patchResponse.json())
                .then((patchData) => {
                    e.target.textContent = "LIKE";
                    e.target.data = { liked: false, id: e.target.data.id };
                    currentUsers = patchData;
                });
        } else {
            let currentUsers = currentBookData.find((book) => book.id == e.target.data.id).users;
            currentUsers.push({
                id: 1,
                username: "pouros",
            });
            let postObj = {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({ users: currentUsers }),
            };
            fetch(`http://localhost:3000/books/${e.target.data.id}`, postObj)
                .then((patchResponse) => patchResponse.json())
                .then((patchData) => {
                    e.target.textContent = "UNLIKE";
                    e.target.data = { liked: true, id: e.target.data.id };
                    currentUsers = patchData;
                });
        }
    });

    bookInfoDiv.append(bookImg, bookTitle, bookSubtitle, bookAuthor, bookDesc, likeButton);
}
