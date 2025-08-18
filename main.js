const elForm = document.querySelector(".js-form");
const elInput = document.querySelector(".js-input");
const container = document.querySelector(".js-container");
const output = document.querySelector(".js-p");

function renderMovies(fullMovie) {
  container.innerHTML = "";
  output.innerHTML = ""; 

  const slicedMovies = fullMovie.slice(0, 20);
  slicedMovies.sort((a, b) => {
    return a.Title.charCodeAt(0) - b.Title.charCodeAt(0);
  });

  slicedMovies.forEach((movie) => {
    const card = document.createElement("div");
    card.className = "movie-card";

    card.innerHTML = `
      <img src="http://i3.ytimg.com/vi/${movie.ytid}/hqdefault.jpg" alt="${movie.Title}">
      <h2>${movie.Title}</h2>
      <p><strong>Year:</strong> ${movie.movie_year}</p>
      <p><strong>Category:</strong> ${movie.Categories}</p>
      <p><strong>IMDb:</strong> ${movie.imdb_rating}</p>
      <p><strong>Runtime:</strong> ${movie.runtime} min</p>
      <p><strong>Language:</strong> ${movie.language}</p>
      <a href="https://www.youtube.com/watch?v=${movie.ytid}" target="_blank">Watch Trailer</a>
    `;

    container.appendChild(card);
  });
}

renderMovies(movies);

elForm.addEventListener("submit", function (evt) {
  evt.preventDefault();

  const searchVal = elInput.value.trim().toLowerCase();

  const filteredMovies = movies.filter((item) =>
    String(item.Title).toLowerCase().includes(searchVal)
  );

  if (filteredMovies.length === 0) {
    container.innerHTML = ""; 
    output.innerHTML = "<p>Not found</p>";
  } else {
    renderMovies(filteredMovies);
  }
});
