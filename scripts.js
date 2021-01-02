const mainContainer = document.querySelector("#main-container");
const container = document.querySelector("#container");
const searchBar = document.querySelector("#search-bar");
const searchBtn = document.querySelector("#search-btn");
const logo = document.querySelector("#logo");


const fetchSuggestions = async function (searchValue) {
    const url = `https://api.lyrics.ovh/suggest/${searchValue}`;
    const response = await fetch(url)
    return response.json();
};

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

    const response = await fetchSuggestions(searchValue);
    const suggestions = response["data"].map((suggestion) => {
        const { title, preview, artist, album } = suggestion;

        return {
            lyricsTitle: title,
            lyricsPreview: preview,
            artistName: artist.name,
            albumTitle: album.title,
            albumCover: album.cover
        }
    });
}

searchBtn.addEventListener("click", search);
searchBar.addEventListener("keyup", (event) => {
    if (event.keyCode === 13) {
        search();
    }
});
