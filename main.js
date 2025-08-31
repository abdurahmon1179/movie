const elForm = document.querySelector(".js-form");
const elInput = document.querySelector(".js-input");
const container = document.querySelector(".js-container");
const output = document.querySelector(".js-p");
const template = document.querySelector(".movie-template").content;
const movieArray = document.querySelector(".offcanvas-body");
const selectGenre = document.querySelector(".js-select");
const modal = document.getElementById("movieModal");
const closeModal = document.getElementById("closeModal");
const modalTrailer = document.getElementById("movieTrailer");
const modalTitle = document.getElementById("movieTitle");
const modalRating = document.getElementById("movieRating");
const modalDate = document.getElementById("movieDate");
const modalRuntime = document.getElementById("movieRuntime");
const modalSummary = document.getElementById("movieSummary");


function renderMovies(fullMovie) {
  container.innerHTML = "";
  output.innerHTML = "";

  const slicedMovies = fullMovie.slice(0, 20);
  slicedMovies.sort((a, b) => a.Title.charCodeAt(0) - b.Title.charCodeAt(0));

  const fragment = document.createDocumentFragment();

  slicedMovies.forEach((movie) => {
    const clone = template.cloneNode(true);

    clone.querySelector("img").src = `http://i3.ytimg.com/vi/${movie.ytid}/hqdefault.jpg`;
    clone.querySelector("img").alt = movie.Title;
    clone.querySelector(".movie-title").textContent = movie.Title;
    clone.querySelector(".movie-year").textContent = movie.movie_year;
    clone.querySelector(".movie-category").textContent = movie.Categories;
    clone.querySelector(".movie-imdb").textContent = movie.imdb_rating;
    clone.querySelector(".movie-runtime").textContent = movie.runtime + " min";
    clone.querySelector(".movie-language").textContent = movie.language;
    clone.querySelector(".movie-trailer").href = `https://www.youtube.com/watch?v=${movie.ytid}`;

    
    const moreInfoBtn = clone.querySelector(".movie-info");
    moreInfoBtn.dataset.imdbId = movie.imdb_id; 

    moreInfoBtn.addEventListener("click", (evt) => {
      evt.preventDefault();

      
      modalTrailer.src = `https://www.youtube.com/embed/${movie.ytid}`;
      modalTitle.textContent = movie.Title;
      modalRating.textContent = movie.imdb_rating;
      modalDate.textContent = movie.movie_year;
      modalRuntime.textContent = movie.runtime;
      modalSummary.textContent = movie.summary || "No summary available...";
      modal.style.display = "flex";
    });

    const addWatchList = clone.querySelector(".js-add");

    addWatchList.addEventListener("click", () => {
      if (addWatchList.textContent === "Add To Watchlist") {
        addWatchList.textContent = "Added to Watchlist ✅";

        const movieItem = document.createElement("div");
        movieItem.classList.add("watchlist-item");
        movieItem.innerHTML = `
          <img src="http://i3.ytimg.com/vi/${movie.ytid}/hqdefault.jpg" alt="">
          <p><strong>${movie.Title}</strong> (${movie.movie_year})</p>
          <button class="btn btn-sm btn-danger js-remove">Remove</button>
        `;

        movieArray.appendChild(movieItem);

        movieItem.querySelector(".js-remove").addEventListener("click", () => {
          movieItem.remove();
          addWatchList.textContent = "Add To Watchlist";
        });
      } else {
        addWatchList.textContent = "Add To Watchlist";
      }
    });

    fragment.appendChild(clone);
  });

  container.appendChild(fragment);
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

const genres = [];

function getUniqueGenres() {
  for (const movie of movies) {
    const categories = movie.Categories.split("|");

    for (const category of categories) {
      if (!genres.includes(category)) {
        genres.push(category);
      }
    }
  }

  genres.sort();

  renderGenresOptions(genres, selectGenre);
}

function renderGenresOptions(genres, selectElement) {
  for (const genre of genres) {
    const option = document.createElement("option");
    option.value = genre;
    option.textContent = genre;
    selectElement.appendChild(option);
  }
}

getUniqueGenres();


closeModal.onclick = () => {
  modal.style.display = "none";
};

