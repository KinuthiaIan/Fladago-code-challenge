const container = document.querySelector('.container');
const movieDetails = document.querySelector('.movie-details');
const filmList = document.getElementById('films');

// Fetch the first movie when the page loads
fetch('/films/1')
  .then(response => response.json())
  .then(data => {
    displayMovieDetails(data);
  })
  .catch(error => console.error('Error fetching the first movie:', error));

// Fetch all movies and display them in the film list
fetch('/films')
  .then(response => response.json())
  .then(data => {
    displayFilmList(data);
  })
  .catch(error => console.error('Error fetching all movies:', error));

// Function to display movie details
function displayMovieDetails(movie) {
  // Clear the movie-details element
  movieDetails.innerHTML = '';

  // Create and append elements for movie details
  const moviePoster = document.createElement('img');
  moviePoster.src = movie.poster;
  moviePoster.alt = movie.title;
  movieDetails.appendChild(moviePoster);

  // ... add other elements for title, runtime, showtime, available tickets
}

// Function to display the film list
function displayFilmList(films) {
  // Clear the film-list element
  filmList.innerHTML = '';

  // Iterate through the films and create list items
  films.forEach(film => {
    const listItem = document.createElement('li');
    listItem.classList.add('film', 'item');
    listItem.innerText = film.title;

    // Add event listener for buying a ticket
    listItem.addEventListener('click', () => {
      buyTicket(film.id);
    });

    filmList.appendChild(listItem);
  });
}

// Function to buy a ticket
function buyTicket(filmId) {
  // Fetch the movie with the given ID
  fetch(`/films/${filmId}`)
    .then(response => response.json())
    .then(data => {
      // Check if tickets are available
      if (data.tickets_sold < data.capacity) {
        data.tickets_sold++;

        // Update the movie on the server
        fetch(`/films/${filmId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ tickets_sold: data.tickets_sold })
        })
        .then(response => response.json())
        .then(updatedMovie => {
          // Update the movie details and film list on the frontend
          displayMovieDetails(updated