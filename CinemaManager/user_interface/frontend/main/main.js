// Home Page JavaScript

class HomePage {
  constructor() {
    this.currentSlide = 0;
    this.movies = [];
    this.nowShowing = [];
    this.comingSoon = [];
    this.init();
  }

  async init() {
    await this.fetchMovies();
    if (this.movies.length > 0) {
        this.setupCarousel();
    }
    this.renderNowShowing();
    this.renderComingSoon();
    this.setupEventListeners();
  }

  async fetchMovies() {
      try {
          const response = await fetch('../../backend/movies/get-movies.php');
          const result = await response.json();
          if (result.success) {
              this.nowShowing = result.data.nowShowing;
              this.comingSoon = result.data.comingSoon;
              this.movies = this.nowShowing.length > 0 ? this.nowShowing : this.comingSoon; // Carousel needs something
              
              // Expose for other scripts if needed
              window.moviesData = result.data; 
          }
      } catch (error) {
          console.error("Error fetching movies:", error);
      }
  }

  setupCarousel() {
    const carouselTrack = document.getElementById('carouselTrack');
    const dotsContainer = document.getElementById('dots');
    
    if (!carouselTrack || !dotsContainer) return;
    
    carouselTrack.innerHTML = '';
    dotsContainer.innerHTML = '';

    // Create slides
    this.movies.slice(0, 5).forEach((movie, index) => { // show up to 5 on carousel
      const slide = document.createElement('div');
      slide.className = 'carousel-slide';
      slide.style.backgroundImage = `url('${movie.banner}')`;
      carouselTrack.appendChild(slide);

      // Create dot
      const dot = document.createElement('div');
      dot.className = `dot ${index === 0 ? 'active' : ''}`;
      dot.addEventListener('click', () => this.goToSlide(index));
      dotsContainer.appendChild(dot);
    });

    this.updateHeroContent(0);

    // Auto-advance carousel
    setInterval(() => {
      this.nextSlide();
    }, 8000);
  }

  updateHeroContent(index) {
    if (this.movies.length === 0) return;
    const movie = this.movies[index];
    document.getElementById('heroTitle').textContent = movie.title;
    document.getElementById('heroDescription').textContent = movie.description;

    // Update buttons
    const bookBtn = document.getElementById('bookNow');
    if (bookBtn) {
        bookBtn.onclick = () => {
          window.location.href = `../movie-details/movie-details.html?id=${movie.id}`;
        };
    }

    const trailerBtn = document.getElementById('watchTrailer');
    if (trailerBtn) {
        trailerBtn.onclick = () => {
          this.showTrailer(movie.trailer);
        };
    }
  }

  nextSlide() {
    if (this.movies.length === 0) return;
    this.currentSlide = (this.currentSlide + 1) % Math.min(this.movies.length, 5);
    this.goToSlide(this.currentSlide);
  }

  prevSlide() {
    if (this.movies.length === 0) return;
    const limit = Math.min(this.movies.length, 5);
    this.currentSlide = (this.currentSlide - 1 + limit) % limit;
    this.goToSlide(this.currentSlide);
  }

  goToSlide(index) {
    this.currentSlide = index;
    const carouselTrack = document.getElementById('carouselTrack');
    if(carouselTrack) carouselTrack.style.transform = `translateX(-${index * 100}%)`;

    // Update dots
    document.querySelectorAll('.dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });

    this.updateHeroContent(index);
  }

  renderNowShowing() {
    const grid = document.getElementById('nowShowingGrid');
    if (!grid) return;
    grid.innerHTML = '';

    if (this.nowShowing.length === 0) {
        grid.innerHTML = '<p>No movies currently showing.</p>';
        return;
    }

    this.nowShowing.forEach(movie => {
      const card = this.createMovieCard(movie);
      grid.appendChild(card);
    });
  }

  renderComingSoon() {
    const grid = document.getElementById('comingSoonGrid');
    if (!grid) return;
    grid.innerHTML = '';
    
    if (this.comingSoon.length === 0) {
        grid.innerHTML = '<p>No upcoming movies at the moment.</p>';
        return;
    }

    this.comingSoon.forEach(movie => {
      const card = this.createMovieCard(movie, true);
      grid.appendChild(card);
    });
  }

  createMovieCard(movie, isComingSoon = false) {
    const card = document.createElement('div');
    card.className = 'movie-card fade-in';
    card.style.animationDelay = `${Math.random() * 0.3}s`;

    const ratingHTML = movie.rating
      ? `
        <div class="movie-rating">
          <span class="rating-stars">★★★★★</span>
          <span class="rating-value">${movie.rating}</span>
        </div>
      `
      : '<div class="movie-rating"><span class="rating-value">Coming Soon</span></div>';

    const buttonHTML = isComingSoon
      ? `<button class="btn btn-secondary btn-small" style="cursor: default;">Coming Soon</button>`
      : `<button class="btn btn-primary btn-small" onclick="window.location.href='../movie-details/movie-details.html?id=${movie.id}'">Book Now</button>`;

    card.innerHTML = `
      <img src="${movie.poster}" alt="${movie.title}" class="movie-poster">
      <div class="movie-info">
        <h3 class="movie-title">${movie.title}</h3>
        <div class="movie-meta">
          <span class="movie-genre">${movie.genre}</span>
          <span class="movie-duration">${movie.duration}</span>
        </div>
        ${ratingHTML}
        <div class="movie-card-footer">
          ${buttonHTML}
        </div>
      </div>
    `;

    card.addEventListener('click', () => {
      if (!isComingSoon) {
        window.location.href = `../movie-details/movie-details.html?id=${movie.id}`;
      }
    });

    return card;
  }

  showTrailer(trailerUrl) {
    const modal = document.getElementById('trailerModal');
    const trailerVideo = document.getElementById('trailerVideo');
    if (!modal || !trailerVideo) return;
    
    trailerVideo.src = trailerUrl;
    modal.classList.add('active');

    const closeBtn = document.getElementById('closeModal');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          modal.classList.remove('active');
          trailerVideo.src = '';
        });
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        trailerVideo.src = '';
      }
    });
  }

  setupEventListeners() {
    const prevBtn = document.getElementById('prevBtn');
    if (prevBtn) prevBtn.addEventListener('click', () => this.prevSlide());
    
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) nextBtn.addEventListener('click', () => this.nextSlide());

    // Newsletter
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        alert(`Thank you for subscribing with ${email}!`);
        newsletterForm.reset();
      });
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new HomePage();
});
