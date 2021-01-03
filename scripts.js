const mainContainer = document.querySelector("#main-container");
const container = document.querySelector("#container");
const searchBar = document.querySelector("#search-bar");
const searchBtn = document.querySelector("#search-btn");
const logo = document.querySelector("#logo");
const root = document.querySelector("#root");


const fetchSuggestions = async function (searchValue) {
    const url = `https://api.lyrics.ovh/suggest/${searchValue}`;
    const response = await fetch(url)
    return response.json();
};

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

const renderSuggestions = function (suggestions) {
    clearRoot();

    const suggestionTemplate = suggestions.map((suggestion) => {
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
    const suggestions = response["data"].map((suggestion) => {
        const { title, preview, artist, album } = suggestion;

        return {
            lyricsTitle: title,
            lyricsPreview: preview,
            artistName: artist.name,
            albumCover: album.cover_medium
        }
    });

    renderSuggestions(suggestions);
}

searchBtn.addEventListener("click", search);
searchBar.addEventListener("keyup", (event) => {
    if (event.keyCode === 13) {
        search();
    }
});
