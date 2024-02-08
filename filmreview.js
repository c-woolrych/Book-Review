document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.querySelector('.search-button button');
    const searchInput = document.getElementById('search-box');
    const searchHistoryContainer = document.getElementById('searchHistory');
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
  
  
  
    function updateSearchHistoryUI() {
      searchHistoryContainer.innerHTML = searchHistory
          .map(term => `<li class="list-group-item list-group-item-action">${term}
          <button class="btn reviewBtn" id="green"><i class="fa fa-thumbs-up fa-lg icon" aria-hidden="true"></i></button>
          <button class="btn reviewBtn" id="red"><i class="fa fa-thumbs-down fa-lg icon" aria-hidden="true"></i></button>
          </li>`)
          .join('');
  };
  
  
  
  // Attach the event listener to a parent element
  searchHistoryContainer.addEventListener('click', (event) => {
      const btn1 = document.querySelector('#green');
      const btn2 = document.querySelector('#red');
      const target = event.target;
      // Check if the clicked element has the ID 'green'
      if (target.id === 'green') {
        console.log('Green button clicked');
        target.classList.add('green');
        btn2.classList.remove('red');
      }
      if (target.id === 'red') {
        console.log('red button clicked');
          target.classList.add('red');
          btn1.classList.remove('green');
      }
    });
  
  
  
  searchHistoryContainer.addEventListener('click', function(event) {
    if (event.target && event.target.nodeName === "LI") {
        const searchTerm = event.target.textContent;
        fetchMovieData(searchTerm);
    }
  });
  
  
  
  
  
      function addToSearchHistory(searchTerm) {
        if (!searchHistory.includes(searchTerm)) {
            searchHistory.unshift(searchTerm);
            searchHistory = searchHistory.slice(0, 5); // storing the latest 5 entries
            localStorage.setItem('searchHistory', JSON.stringify(searchHistory)); // Update local storage
            updateSearchHistoryUI();
        }
    }
  
    function displayMovieTrailer(movieTitle) {
  
      const apiKey = 'AIzaSyAISHTcHoTAJNoeJqWcaWL9Mskp_OTidDU';
      const searchQuery = `${movieTitle} trailer`;
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery)}&maxResults=1&key=${apiKey}`;
  
      fetch(url)
        .then(response => response.json())
        .then(data => {
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
  
      const playerContainer = document.getElementById('movie-trailer-container');
      playerContainer.innerHTML = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
  }
  
  
  
  
  
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
                      displayMovieTrailer(data.Title);
                  } else {
                      console.log('Movie not found');
                      handleNoMovieFound(searchTerm); //if no movie is found
                  }
              })
              .catch(error => console.error('Error:', error));
      }
  
      //ERROR OPTIONS
  
      function handleNoMovieFound(searchTerm) {
          showErrorModal('Movie not found', `We could not find any movie matching "${searchTerm}". Please try another search.`);
  
          // place here animage within the trailer container
          document.getElementById('movie-trailer-container').innerHTML = `<img src="assets/Images/AdobeStock_132886518.jpeg" alt="Movie not found" style="max-width: 100%; height: auto;">`;
  
          clearMovieInfo();
        }
  
  
  
        //thumbs up icon button
  
        function showErrorModal(title, message) {
          // title and message for the error modal
          document.getElementById('errorModalLabel').textContent = title;
          document.getElementById('errorModalBody').textContent = message;
  
          // modal's footer for modification
          const modalFooter = document.querySelector('#errorModal .modal-footer');
  
          // add the thumbs up button
          modalFooter.innerHTML = `
              <button type="button" class="btn btn-light" id="errorModalThumbsUp" data-bs-dismiss="modal">
                  <i class="bi bi-hand-thumbs-up-fill"></i>
              </button>
          `;
  
          // any specific event listener can be added to the thumbs up button if necessary
          document.getElementById('errorModalThumbsUp').addEventListener('click', () => {
              console.log('Thumbs up clicked in error modal');
          });
  
          // Show the modal
          $('#errorModal').modal('show');
      }
  
  //OK button generic
      // function showErrorModal(title, message) {
      //     // Display error modal
      //     document.getElementById('errorModalLabel').textContent = title;
      //     document.getElementById('errorModalBody').textContent = message;
      //     $('#errorModal').modal('show');
      // }
  
      function clearMovieInfo() {
          // Clear movie information fields
          document.getElementById('movieTitle').textContent = 'Unavailable';
          document.getElementById('plot').textContent = 'Unavailable';
          document.getElementById('rating').textContent = 'Unavailable';
          document.getElementById('releaseYear').textContent = 'Unavailable';
          document.getElementById('runTime').textContent =  'Unavailable';
          document.getElementById('genre').textContent =  'Unavailable';
          document.getElementById('director').textContent = 'Unavailable';
          document.getElementById('actors').textContent = 'Unavailable';
  
          // Clear other fields as necessary
      }
  
  
  
  function displayMovieData(movie) {
  
      document.getElementById('movieTitle').textContent = movie.Title || 'Title Unavailable';
      document.getElementById('plot').textContent = movie.Plot || 'Plot Unavailable';
      document.getElementById('rating').textContent = movie.imdbRating || 'Rating Unavailable';
      document.getElementById('releaseYear').textContent = movie.Released || 'Release Date Unavailable';
      document.getElementById('runTime').textContent = movie.Runtime || 'Runtime Unavailable';
      document.getElementById('genre').textContent = movie.Genre || 'Genre Unavailable';
      document.getElementById('director').textContent = movie.Director || 'Director Unavailable';
      document.getElementById('actors').textContent = movie.Actors || 'Actors Unavailable';
        // we can add any additional movie details here
  
        var watchedModal = new bootstrap.Modal(document.getElementById('watchedModal'));
      watchedModal.show();    //this is modal
    }
  
  
  
    //1st MODAL
  
    document.getElementById('watchedYes').addEventListener('click', function() {
      // Hide the first modal
      $('#watchedModal').modal('hide');
  
      // Show the second modal asking for the movie rating
      var ratingModal = new bootstrap.Modal(document.getElementById('ratingModal'));
      ratingModal.show();
  });
  
  //2nd MODAL
  
  document.getElementById('thumbsUp').addEventListener('click', function() {
      console.log('User liked the movie.');
      // Here, implement the logic to store the response need to fix - nowhere to store
      $('#ratingModal').modal('hide');
  });
  
  document.getElementById('thumbsDown').addEventListener('click', function() {
      console.log('User disliked the movie.');
      // Here, implement the logic to store the response need fixing- nowehere to store
      $('#ratingModal').modal('hide');
  });
  
  
  
  
  
  
  
  
  
  
  
      // here is search history functionality
      const clearStorageBtn = document.getElementById('clear-storage-btn');
      clearStorageBtn.addEventListener('click', () => {
          localStorage.clear();
          searchHistory = [];
          updateSearchHistoryUI();
      });
  
  
  
  
  
      updateSearchHistoryUI();
  });