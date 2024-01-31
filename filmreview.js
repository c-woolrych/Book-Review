
console.log('js is loaded');

function showRatingModal() {
    console.log("showRatingModal called");
    $('#watchedMovieModal').modal('hide'); // Hide the first modal debug needed
    $('#ratingModal').modal('show'); // Show the rating modal debug needed
  }
  
document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
    const searchHistoryContainer = document.getElementById('searchHistory');
    let searchHistory = [];
  
    searchButton.addEventListener('click', function() {
      const searchTerm = searchInput.value.trim();
      if (searchTerm) {
        fetchMovieData(searchTerm);
        addToSearchHistory(searchTerm);
      }
    });
  
    function fetchMovieData(searchTerm) {
        const apiKey = '95f5c072'; 
        const url = `https://www.omdbapi.com/?apikey=${apiKey}&t=${encodeURIComponent(searchTerm)}`;
    
        fetch(url)
          .then(response => response.json())
          .then(data => {
            if (data.Response === "True") {
              displayMovieData(data); 
              displayMovieTrailer(data.Title); // Call to display the movie trailer
            } else {
              console.log('Movie not found'); // Consider implementing user-friendly feedback
              // Optionally clear previous movie details and trailers here
            }
          })
          .catch(error => console.error('Error:', error));
          
    }

    function displayMovieTrailer(movieTitle) {
        const apiKey = 'AIzaSyAISHTcHoTAJNoeJqWcaWL9Mskp_OTidDU'; // Replace with your actual YouTube API key
        const searchQuery = `${movieTitle} trailer`;
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery)}&maxResults=1&key=${apiKey}`;
    
        fetch(url)
          .then(response => response.json())
          .then(data => {
              console.log(data); // Add this line to see what the YouTube API returns
              if (data.items.length > 0) {
                  const videoId = data.items[0].id.videoId;
                  embedYoutubeVideo(videoId);
              } else {
                  console.log('Trailer not found');
              }
          })
          .catch(error => console.error('Error fetching YouTube data:', error));
    }

      
      function embedYoutubeVideo(videoId) {
        const playerContainer = document.getElementById('player');
        playerContainer.innerHTML = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
      }

  
      function displayMovieData(movie) {
        // Assuming 'movie' is the object containing all the movie details from the OMDb API
        document.querySelector('.card-img-top').src = movie.Poster || 'search-image.jpg'; // Fallback image if Poster is not available
        document.querySelector('.card-title').textContent = movie.Title || 'Title Unavailable';
        document.getElementById('releaseYear').textContent = movie.Released || 'Release Date Unavailable';
        document.getElementById('runTime').textContent = movie.Runtime || 'Runtime Unavailable';
        document.getElementById('genre').textContent = movie.Genre || 'Genre Unavailable';
        document.getElementById('director').textContent = movie.Director || 'Director Unavailable';
        document.getElementById('actors').textContent = movie.Actors || 'Actors Unavailable';
        document.getElementById('plot').textContent = movie.Plot || 'Plot Unavailable';
        document.getElementById('country').textContent = movie.Country || 'Country Unavailable';
        document.getElementById('awards').textContent = movie.Awards || 'Awards Unavailable';
        document.getElementById('boxOffice').textContent = movie.BoxOffice || 'Box Office Unavailable';
      
        $('#watchedMovieModal').modal('show'); // Use this to show the modal
    }


    function addToSearchHistory(searchTerm) {
      if (!searchHistory.includes(searchTerm)) {
        searchHistory.unshift(searchTerm); // Adds to the start of the history
        searchHistory = searchHistory.slice(0, 5); // Keeps only the latest 5 entries
        updateSearchHistoryUI();
      }
    }
  
    function updateSearchHistoryUI() {
      searchHistoryContainer.innerHTML = searchHistory
        .map(term => `<li class="list-group-item list-group-item-action" onclick="fetchMovieData('${term}')">${term}</li>`)
        .join('');
    }
  });
  