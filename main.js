const elForm = document.querySelector(".js-form");
const elInput = document.querySelector(".js-input");
const container = document.querySelector(".js-container");
const output = document.querySelector(".js-p");
const template = document.querySelector(".movie-template").content;
const movieArray = document.querySelector(".offcanvas-body");
const selectGenre = document.querySelector(".js-select");
const selectSort = document.querySelector(".js-select-sort");
const modal = document.getElementById("movieModal");
const closeModal = document.getElementById("closeModal");
const modalTrailer = document.getElementById("movieTrailer");
const modalTitle = document.getElementById("movieTitle");
const modalRating = document.getElementById("movieRating");
const modalDate = document.getElementById("movieDate");
const modalRuntime = document.getElementById("movieRuntime");
const modalSummary = document.getElementById("movieSummary");

const movieHourAndMinute = function (time) {
  const hour = time / 60;
  const minute = time % 60;

  if (time < 60) {
    return `${time} minutes`;
  } else if (time === 60) {
    return "1 hour";
  } else {
    return `${Math.floor(hour)} hour ${Math.round(minute)} minutes`;
  }
};

function renderMovies(fullMovie) {
  container.innerHTML = "";
  output.innerHTML = "";

  const slicedMovies = fullMovie.slice(0, 20);
  slicedMovies.sort((a, b) => a.title.charCodeAt(0) - b.title.charCodeAt(0));

  const fragment = document.createDocumentFragment();

  slicedMovies.forEach((movie) => {
    const clone = template.cloneNode(true);

    clone.querySelector("img").src = movie.movie_max_image;
    clone.querySelector("img").alt = movie.title;
    clone.querySelector(".movie-title").textContent = movie.title;
    clone.querySelector(".movie-year").textContent = movie.movie_year;
    clone.querySelector(".movie-category").textContent = movie.categories;
    clone.querySelector(".movie-imdb").textContent = movie.imdb_rating;
    clone.querySelector(".movie-runtime").textContent = movie.movie_duration;
    clone.querySelector(".movie-language").textContent = movie.movie_language;
    clone.querySelector(".movie-trailer").href = movie.movie_youtube_id;

    const moreInfoBtn = clone.querySelector(".movie-info");
    moreInfoBtn.dataset.imdbId = movie.imdb_id;

    moreInfoBtn.addEventListener("click", (evt) => {
      evt.preventDefault();

      modalTrailer.src = `https://www.youtube.com/embed/${movie.ytid}`;
      modalTitle.textContent = movie.title;
      modalRating.textContent = movie.imdb_rating;
      modalDate.textContent = movie.movie_year;
      modalRuntime.textContent = movie.movie_duration;
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
          <img src="${movie.movie_medium_image}" alt="">
          <p><strong>${movie.title}</strong> (${movie.movie_year})</p>
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
  const selectedGenre = selectGenre.value; 

  const filteredMovies = movies.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchVal);
    const matchesGenre = selectedGenre === "" || item.categories.includes(selectedGenre);

    return matchesSearch && matchesGenre;
  });

  if(selectSort.value == "A-Z"){
    filteredMovies.sort((a, b) => a.title.charCodeAt(0) - b.title.charCodeAt(0));
  }else if (selectSort.value == "Z-A"){
    filteredMovies.sort((a, b) => b.title.charCodeAt(0) - a.title.charCodeAt(0));
  }else if(selectSort.value == "The oldest"){
    filteredMovies.sort((a, b) => a.movie_year - b.movie_year);
  }else{
    filteredMovies.sort((a, b) => b.movie_year - a.movie_year);
  }

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
    const categories = movie.categories.split("|");

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
