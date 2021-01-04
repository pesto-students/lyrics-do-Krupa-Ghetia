const mainContainer = document.querySelector("#main-container");
const container = document.querySelector("#container");
const searchBar = document.querySelector("#search-bar");
const searchBtn = document.querySelector("#search-btn");
const logo = document.querySelector("#logo");
const root = document.querySelector("#root");

let resultantSuggestions;
let paginationTemplate;


const fetchSuggestions = async function (searchValue) {
    const url = `https://api.lyrics.ovh/suggest/${searchValue}`;
    const response = await fetch(url);
    return response.json();
};

const fetchLyrics = async function (artist, title) {
    const url = `https://api.lyrics.ovh/v1/${artist}/${title}`;
    const response = await fetch(url);
    return response.json();
}

const handleRequestError = function () {
    clearRoot();

    root.classList.add("root");
    root.innerHTML = `<p class="request-error-empty">Invalid Request!</p>`
}

const handleEmptyResponse = function () {
    clearRoot();

    root.classList.add("root");
    root.innerHTML = `<p class="request-error-empty">Artist/Title not found!</p>`
}

const handleEmptyLyrics = function () {
    clearRoot();

    root.classList.add("root");
    root.innerHTML = `<p class="request-error-empty">Lyrics not found!</p>`
}

const clearRoot = function () {
    root.removeAttribute('class');
    root.innerHTML = "";
}

const showLoader = function () {
    clearRoot();

    const loaderTemplate = "<div class='loader display'></div>";
    root.classList.add("display-loader");
    root.classList.add("display");
    root.innerHTML = loaderTemplate;
}

const createChunks = function (suggestions) {
    const chunkSize = 4;

    const result = suggestions.reduce((resultantArray, suggestion, index) => {
        const chunkIndex = Math.floor(index / chunkSize);

        if(!resultantArray[chunkIndex]) {
            resultantArray[chunkIndex] = [];
        }

        resultantArray[chunkIndex].push(suggestion);

        return resultantArray;
    }, []);

    return result;
}

const createPages = function () {
    let pages = '';
    for(let index=0; index< resultantSuggestions.length; index++) {
        pages += `<div id="${index}" class="page">${index + 1}</div>`;
    }
    
    paginationTemplate = `<div id="pagination" class="pagination display">${pages}</div>`
}

const addSuggestionListeners = function () {
    
    document.querySelectorAll(".suggestion").forEach(item => {
        item.addEventListener("click", async event => {
            if (event.target.tagName === "A") {
                return;
            }

            const artist = item.querySelector(".artist").textContent;
            const title = item.querySelector(".title").textContent;

            showLoader();

            const response = await fetchLyrics(artist, title);
            if (response["lyrics"] === "") {
                handleEmptyLyrics();
                return;
            }

            renderLyrics(response["lyrics"]);
        });
    });
}

const addPaginationListeners = function () {
    document.querySelectorAll(".page").forEach(item => {
        item.addEventListener("click", event => {
            renderSuggestions(item.id);
        });
    });
}

const renderLyrics = function (lyrics) {
    clearRoot();

    root.classList.add("root");
    root.innerHTML = `<pre class="lyrics">${lyrics}</pre>`;
}

const renderSuggestions = function (chunkTodisplay=0) {
    clearRoot();

    const suggestionsTodisplay = resultantSuggestions[chunkTodisplay]
    const suggestionTemplate = suggestionsTodisplay.map((suggestion) => {
        const { lyricsTitle, lyricsPreview, artistName, albumCover } = suggestion;

        return `<div class="suggestion">
        <img
          src="${albumCover}"
          alt="Album Cover"
        />
        <div>
          <h4 class="title">${lyricsTitle}</h4>
          <p class="artist">${artistName}</p>
          <p class="audio-preview">
            <a
              href="${lyricsPreview}"
              target="_blank"
              >Song Preview</a
            >
          </p>
        </div>
      </div>`
    });

    root.classList.add("root");
    root.innerHTML = suggestionTemplate;
    root.innerHTML += paginationTemplate;
    document.getElementById(`${chunkTodisplay}`).classList.add("page-selected");

    addSuggestionListeners();
    addPaginationListeners();
}

const moveSearch = function () {
    mainContainer.classList.remove("display");

    container.classList.remove("display");
    container.classList.remove("container");
    container.classList.add("container-shrink");

    logo.classList.remove("logo");
    logo.classList.add("logo-shrink");

    searchBtn.classList.remove("search-btn");
    searchBtn.classList.add("search-btn-shrink");
}

const search = async function () {
    const searchValue = searchBar.value;

    if (!searchValue) {
        return;
    }
    
    moveSearch();
    showLoader();

    const response = await fetchSuggestions(searchValue);

    if (response.hasOwnProperty('error')) {
        handleRequestError();
        return;
    }

    if (response["data"].length === 0) {
        handleEmptyResponse();
        return;
    }

    const suggestions = response["data"].map((suggestion) => {
        const { title, preview, artist, album } = suggestion;

        return {
            lyricsTitle: title,
            lyricsPreview: preview,
            artistName: artist.name,
            albumCover: album.cover
        }
    });

    resultantSuggestions = createChunks(suggestions);
    createPages();
    renderSuggestions();
}

searchBtn.addEventListener("click", search);
searchBar.addEventListener("keyup", (event) => {
    if (event.keyCode === 13) {
        search();
    }
});