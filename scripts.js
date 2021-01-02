const searchBar = document.querySelector("#search-bar");
const searchBtn = document.querySelector("#search-btn");


const fetchSuggestions = async function (searchValue) {
    const url = `https://api.lyrics.ovh/suggest/${searchValue}`;
    const response = await fetch(url)
    return response.json();
};

const search = async function () {
    const searchValue = searchBar.value;

    if (!searchValue) {
        return;
    }

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
