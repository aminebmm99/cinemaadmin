// Movie Details Page JavaScript

class MovieDetailsPage {
  constructor() {
    this.movie = null;
    this.selectedDate = null;
    this.init();
  }

  navigateToHome() {
    const homeUrl = '../index/index.html';
    if (window.self !== window.top) {
      window.top.location.href = homeUrl;
      return;
    }
    window.location.href = homeUrl;
  }

  async init() {
    await this.loadMovieData();
    if(this.movie) {
        this.setupEventListeners();
    }
  }

  async loadMovieData() {
    // Get movie ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = parseInt(urlParams.get('id'));

    if (!movieId) {
      this.navigateToHome();
        return;
    }

    try {
        const response = await fetch(`../../backend/movies/get-movie-details.php?id=${movieId}`);
        const result = await response.json();

        if (result.success) {
            this.movie = result.data;
            this.renderMovieDetails();
            this.setupDateselector();
            this.displayShowtimes();
        } else {
            console.error("Movie not found");
          this.navigateToHome();
        }
    } catch (error) {
        console.error("Failed to load movie details", error);
        this.navigateToHome();
    }
  }

  renderMovieDetails() {
    const movie = this.movie;

    // Banner
    const bannerSection = document.getElementById('movieBanner');
    if(bannerSection) bannerSection.style.backgroundImage = `url('${movie.banner}')`;

    // Poster & title
    const posterEl = document.getElementById('posterImage');
    if(posterEl) posterEl.src = movie.poster;
    
    const titleEl = document.getElementById('movieTitle');
    if(titleEl) titleEl.textContent = movie.title;

    // Meta info
    const genreEl = document.getElementById('movieGenre');
    if(genreEl) genreEl.textContent = movie.genre;
    
    const durationEl = document.getElementById('movieDuration');
    if(durationEl) durationEl.textContent = movie.duration;
    
    const directorEl = document.getElementById('movieDirector');
    if(directorEl) directorEl.textContent = movie.director;
    
    const languagesEl = document.getElementById('movieLanguages');
    if(languagesEl) languagesEl.textContent = movie.languages.join(', ');



    // Description & Cast
    const descEl = document.getElementById('movieDescription');
    if(descEl) descEl.textContent = movie.description;
    
    const castEl = document.getElementById('movieCast');
    if(castEl) castEl.textContent = movie.cast;

    // Trailer
    const trailerEl = document.getElementById('trailerEmbed');
    if(trailerEl) trailerEl.src = movie.trailer;

    // Page title
    document.title = `${movie.title} - CineMax`;
  }

  setupDateselector() {
    const dateSelect = document.getElementById('dateSelect');
    if(!dateSelect) return;
    
    dateSelect.innerHTML = '';
    
    if(!this.movie.availableDates || Object.keys(this.movie.availableDates).length === 0) {
        dateSelect.innerHTML = '<option value="">No showtimes available</option>';
        return;
    }

    const dates = Object.keys(this.movie.availableDates);

    dates.forEach((date) => {
      const option = document.createElement('option');
      const dateObj = new Date(date);
      const formattedDate = dateObj.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
      option.value = date;
      option.textContent = formattedDate;
      dateSelect.appendChild(option);
    });

    this.selectedDate = dates[0];
    dateSelect.addEventListener('change', (e) => {
      this.selectedDate = e.target.value;
      this.displayShowtimes();
    });
  }

  displayShowtimes() {
    const showTimesGrid = document.getElementById('showTimesGrid');
    if(!showTimesGrid) return;
    
    showTimesGrid.innerHTML = '';

    if (!this.selectedDate || !this.movie.availableDates || !this.movie.availableDates[this.selectedDate]) {
      showTimesGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary);">No showtimes available for this date</p>';
      return;
    }

    const t = this.movie.availableDates[this.selectedDate];
    t.forEach(seance => {
      const btn = document.createElement('button');
      btn.className = 'showtime-btn available';
      btn.textContent = `${seance.time} (${seance.room})`;
      btn.addEventListener('click', () => {
        this.selectShowtime(seance);
      });
      showTimesGrid.appendChild(btn);
    });
  }

  selectShowtime(seance) {
    localStorage.setItem('selectedMovie', JSON.stringify(this.movie));
    localStorage.setItem('selectedShowtime', JSON.stringify({
      date: this.selectedDate,
      time: seance.time,
      id: seance.id,
      price: seance.price,
      room: seance.room
    }));
    window.location.href = '../booking/booking.html';
  }

  setupEventListeners() {
    const bookBtn = document.getElementById('bookTicketsBtn');
    if(bookBtn) {
        bookBtn.addEventListener('click', () => {
          const showTimesGrid = document.getElementById('showTimesGrid');
          if(showTimesGrid) showTimesGrid.scrollIntoView({ behavior: 'smooth' });
        });
    }

    const shareBtn = document.getElementById('shareBtn');
    if(shareBtn) {
        shareBtn.addEventListener('click', () => {
          if (navigator.share) {
            navigator.share({
              title: this.movie.title,
              text: `Check out ${this.movie.title} on CineMax!`,
              url: window.location.href
            });
          } else {
            alert('Share: ' + window.location.href);
          }
        });
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new MovieDetailsPage();
});
