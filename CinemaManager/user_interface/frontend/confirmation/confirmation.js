// Confirmation Page JavaScript

class ConfirmationPage {
  constructor() {
    this.booking = null;
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

  init() {
    this.loadBookingData();
    this.renderConfirmation();
    this.setupEventListeners();
  }

  loadBookingData() {
    const bookingData = localStorage.getItem('booking');

    if (!bookingData) {
      this.navigateToHome();
      return;
    }

    this.booking = JSON.parse(bookingData);
  }

  renderConfirmation() {
    const booking = this.booking;

    // Booking ID
    document.getElementById('bookingId').textContent = booking.bookingId;

    // Movie Details
    document.getElementById('movieName').textContent = booking.movie.title;
    document.getElementById('movieGenre').textContent = booking.movie.genre;
    document.getElementById('movieDuration').textContent = booking.movie.duration;

    // Show Details
    const dateObj = new Date(booking.showtime.date);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
    document.getElementById('showDate').textContent = formattedDate;
    document.getElementById('showTime').textContent = booking.showtime.time;

    // Seats/Tickets
    const seatsDisplay = document.getElementById('seatsDisplay');
    if(seatsDisplay) {
        seatsDisplay.innerHTML = booking.seats
          .map(seat => `<span class="seat-badge">${seat}</span>`)
          .join('');
    }

    // Customer Details
    document.getElementById('customerName').textContent = booking.customer.fullName;
    document.getElementById('customerEmail').textContent = booking.customer.email;
    document.getElementById('customerPhone').textContent = booking.customer.phone;

    // Price Details
    let numSeats = 1;
    let total = parseFloat(booking.totalPrice);
    
    // Extract the ticket count from our new payload format (e.g., "2 General Admission Ticket(s)")
    if (booking.seats && booking.seats.length > 0) {
        const match = booking.seats[0].match(/^(\d+)/);
        if (match) {
            numSeats = parseInt(match[1]);
        }
    }
    
    const ticketPrice = total / numSeats;

    document.getElementById('ticketPrice').textContent = `TND ${ticketPrice.toFixed(3)}`;
    document.getElementById('numSeats').textContent = numSeats;
    document.getElementById('totalAmount').textContent = `TND ${total.toFixed(3)}`;

    // Page title
    document.title = `Booking Confirmation - CineMax`;
  }

  setupEventListeners() {
    // Copy Booking ID
    document.getElementById('copyBtn').addEventListener('click', () => {
      const bookingId = this.booking.bookingId;
      navigator.clipboard.writeText(bookingId).then(() => {
        const btn = document.getElementById('copyBtn');
        const originalText = btn.textContent;
        btn.textContent = '✓ Copied!';
        setTimeout(() => {
          btn.textContent = originalText;
        }, 2000);
      });
    });



    // Home Button
    document.getElementById('homeBtn').addEventListener('click', () => {
      this.clearBookingData();
      this.navigateToHome();
    });

    // Share buttons
    document.querySelectorAll('.share-btn').forEach((btn, index) => {
      btn.addEventListener('click', () => {
        this.shareBooking(index);
      });
    });
  }


  shareBooking(index) {
    const booking = this.booking;
    const shareText = `Check out my booking at CineMax! 🎬\nMovie: ${booking.movie.title}\nDate: ${new Date(booking.showtime.date).toLocaleDateString()}\nTime: ${booking.showtime.time}\nBooking ID: ${booking.bookingId}`;
    const shareUrl = window.location.href;

    switch (index) {
      case 0: // Facebook
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 1: // Twitter
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 2: // WhatsApp
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
        break;
      case 3: // Copy Link
        navigator.clipboard.writeText(shareUrl).then(() => {
          alert('Link copied to clipboard!');
        });
        break;
    }
  }

  clearBookingData() {
    localStorage.removeItem('selectedMovie');
    localStorage.removeItem('selectedShowtime');
    localStorage.removeItem('booking');
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ConfirmationPage();
});
