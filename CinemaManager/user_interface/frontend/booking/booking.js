// Booking Page JavaScript

// Booking Page JavaScript

class BookingPage {
  constructor() {
    this.movie = null;
    this.showtime = null;
    this.ticketCount = 1;
    this.ticketPrice = 12; // default
    this.hall = { name: "Standard Hall" }; // default
    this.init();
  }

  navigateToHome() {
    const homeUrl = '../index/index.html';
    if (window.self !== window.top) {
      window.top.location.replace(homeUrl);
      return;
    }
    window.location.href = homeUrl;
  }

  async init() {
    const userSession = localStorage.getItem('userSession');
    if (!userSession) {
      alert("You must be logged in to book a ticket.");
      window.top.location.replace('../login/login.html');
      return;
    }

    await this.checkLoginState(userSession);
    this.loadBookingData();
    this.setupEventListeners();
    this.updateSummary();
  }

  async checkLoginState(userSessionData) {
    try {
        const user = JSON.parse(userSessionData);
        if(user && user.username) {
            // Pre-fill name from session
            const nameField = document.getElementById('fullName');
            if(nameField) {
                nameField.value = user.username;
            }

            // Fetch user profile from database
            await this.loadUserProfile(user.username);
        }
    } catch(e) {
        console.error('Error parsing user session:', e);
    }
  }

  async loadUserProfile(username) {
    try {
      console.log('Loading user profile for:', username);
      
      const response = await fetch('../../backend/user/get-profile.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username })
      });

      console.log('Profile API response status:', response.status);

      if (!response.ok) {
        console.error('Failed to fetch user profile:', response.status);
        return;
      }

      const result = await response.json();
      console.log('Profile API result:', result);

      if (result.success && result.profile) {
        const profile = result.profile;
        console.log('User profile retrieved:', profile);

        // Pre-fill email from database
        const emailField = document.getElementById('email');
        if (emailField && profile.email) {
          emailField.value = profile.email;
          console.log('Email field filled:', profile.email);
        }

        // Pre-fill phone from database
        const phoneField = document.getElementById('phone');
        if (phoneField && profile.tel) {
          phoneField.value = profile.tel;
          console.log('Phone field filled:', profile.tel);
        }
      } else {
        console.warn('Could not retrieve user profile:', result.message);
      }
    } catch (e) {
      console.error('Error loading user profile:', e);
    }
  }

  loadBookingData() {
    const movieData = localStorage.getItem('selectedMovie');
    const showtimeData = localStorage.getItem('selectedShowtime');

    if (!movieData || !showtimeData) {
      this.navigateToHome();
      return;
    }

    this.movie = JSON.parse(movieData);
    this.showtime = JSON.parse(showtimeData);

    if (this.showtime.price) {
        this.ticketPrice = parseFloat(this.showtime.price);
    }
    
    if (this.showtime.room) {
        this.hall.name = this.showtime.room;
    }

    // Update page content
    const titleEl = document.getElementById('movieTitle');
    if(titleEl) titleEl.textContent = this.movie.title;
    
    const summaryTitleEl = document.getElementById('summaryMovieTitle');
    if(summaryTitleEl) summaryTitleEl.textContent = this.movie.title;

    const dateObj = new Date(this.showtime.date);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
    const dateTimeStr = `${formattedDate} at ${this.showtime.time}`;
    
    const summaryDateEl = document.getElementById('summaryDateTime');
    if(summaryDateEl) summaryDateEl.textContent = dateTimeStr;

    const hallEl = document.getElementById('hallName');
    if(hallEl) hallEl.textContent = this.hall.name;
  }

  updateSummary() {
    const total = this.ticketCount * this.ticketPrice;

    // Update prices
    const seatPriceEl = document.getElementById('seatPrice');
    if(seatPriceEl) seatPriceEl.textContent = `${this.ticketPrice.toFixed(3)}TND`;
    
    const numSeatsEl = document.getElementById('numSeats');
    if(numSeatsEl) numSeatsEl.textContent = this.ticketCount;
    
    const totalEl = document.getElementById('totalPrice');
    if(totalEl) totalEl.textContent = `${total.toFixed(3)}TND`;
  }

  setupEventListeners() {
    const input = document.getElementById('ticketCountInput');
    if (input) {
        input.addEventListener('change', (e) => {
            let val = parseInt(e.target.value);
            if (isNaN(val) || val < 1) val = 1;
            if (val > 10) val = 10;
            e.target.value = val;
            this.ticketCount = val;
            this.updateSummary();
        });
    }

    const submitBtn = document.getElementById('submitBookingBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.submitBooking();
        });
    }
  }

  async submitBooking() {
    const form = document.getElementById('bookingForm');
    if(form && !form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Get form data
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    
    const totalAmount = this.ticketCount * this.ticketPrice;

    const payload = {
        seance_id: this.showtime.id,
        customer_name: fullName,
        customer_email: email,
        tickets_count: this.ticketCount,
        total_amount: totalAmount
    };

    console.log('Booking payload:', payload);

    try {
        const response = await fetch('../../backend/movies/api-book.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        console.log('API Response status:', response.status);
        const result = await response.json();
        
        console.log('API Response:', result);

        if (result.success) {
            // Create booking object for confirmation page
            const booking = {
              bookingId: result.booking_code,
              movie: this.movie,
              showtime: this.showtime,
              seats: [`${this.ticketCount} General Admission Ticket(s)`],
              customer: {
                fullName,
                email,
                phone
              },
              paymentMethod: 'Cash',
              bookingDate: new Date().toISOString(),
              totalPrice: totalAmount.toFixed(2)
            };

            // Store booking data
            localStorage.setItem('booking', JSON.stringify(booking));

            // Redirect to confirmation
            window.location.href = '../confirmation/confirmation.html';
        } else {
            const errorMsg = result.message || 'Unknown error - check browser console for details';
            alert('Failed to book: ' + errorMsg);
            console.error('Booking error details:', result);
        }
    } catch (e) {
        console.error('Error submitting booking', e);
        alert('Server error while submitting your booking. Check browser console (F12) for more details.');
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new BookingPage();
});
