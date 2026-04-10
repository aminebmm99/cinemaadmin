const FILMS = [
  {
    id: 1,
    title: "Project Hail Mary",
    genre: "Action & Sci-Fi",
    duration: "2h 15min",
    year: 2026,
    price: 15,
    desc: "A science teacher (Ryan Gosling) wakes up alone on a spaceship with amnesia and realizes he is humanity's last hope to save the sun.",
    seances: ["10:00", "14:00", "17:30", "20:00", "22:30"]
  },
  {
    id: 2,
    title: "Dune: Part Two",
    genre: "Action & Sci-Fi",
    duration: "2h 46min",
    year: 2024,
    price: 15,
    desc: "A visually stunning epic that blends political drama with massive action set pieces as Paul Atreides unites with the Fremen for revenge.",
    seances: ["10:30", "14:00", "17:00", "20:30"]
  },
  {
    id: 3,
    title: "Inception",
    genre: "Action & Sci-Fi",
    duration: "2h 28min",
    year: 2010,
    price: 12,
    desc: "A mind-bending thriller where a professional thief enters people's dreams to plant ideas. It perfectly balances high-concept science fiction with intense action.",
    seances: ["11:00", "14:30", "18:00", "21:00"]
  },
  {
    id: 4,
    title: "Godzilla Minus One",
    genre: "Action & Sci-Fi",
    duration: "2h 05min",
    year: 2023,
    price: 13,
    desc: "A rare film that combines giant monster action with a powerful, grounded human drama set in post-war Japan.",
    seances: ["12:00", "15:30", "19:00", "22:00"]
  },
  {
    id: 5,
    title: "Children of Men",
    genre: "Drame & Thriller",
    duration: "1h 49min",
    year: 2006,
    price: 12,
    desc: "A gritty, single-shot-style thriller set in a future where humans have become infertile. It is widely considered a masterpiece of the grounded sci-fi subgenre.",
    seances: ["13:00", "17:00", "20:30"]
  },
  {
    id: 6,
    title: "Parasite",
    genre: "Drame & Thriller",
    duration: "2h 12min",
    year: 2019,
    price: 13,
    desc: "This South Korean thriller-drama is a masterclass in tension and social commentary, keeping you on the edge of your seat until the final frame.",
    seances: ["11:30", "15:00", "19:00", "21:30"]
  },
  {
    id: 7,
    title: "Ex Machina",
    genre: "Drame & Thriller",
    duration: "1h 48min",
    year: 2014,
    price: 12,
    desc: "A tense psychological thriller involving a young programmer invited to test a highly advanced humanoid AI.",
    seances: ["14:00", "18:00", "21:00"]
  },
  {
    id: 8,
    title: "The Prestige",
    genre: "Drame & Thriller",
    duration: "2h 10min",
    year: 2006,
    price: 12,
    desc: "Two rival magicians in Victorian London engage in a dark, escalating battle for supremacy that shifts into the realm of sci-fi thriller.",
    seances: ["12:30", "16:30", "20:00"]
  },
  {
    id: 9,
    title: "Spider-Man: Across the Spider-Verse",
    genre: "Animation",
    duration: "2h 20min",
    year: 2023,
    price: 13,
    desc: "A revolutionary blend of action and animation styles that follows Miles Morales through the multiverse. It carries deep emotional weight and incredible pacing.",
    seances: ["10:00", "13:00", "16:00", "19:00"]
  },
  {
    id: 10,
    title: "Ghost in the Shell",
    genre: "Animation",
    duration: "1h 23min",
    year: 1995,
    price: 10,
    desc: "A seminal sci-fi thriller that explores the philosophy of identity in a world where humans can be fully augmented with cybernetics.",
    seances: ["11:00", "15:00", "18:30"]
  },
  {
    id: 11,
    title: "Princess Mononoke",
    genre: "Animation",
    duration: "2h 14min",
    year: 1997,
    price: 11,
    desc: "An epic animated drama from Studio Ghibli that explores the violent conflict between industrial progress and the natural world.",
    seances: ["10:30", "14:30", "18:00"]
  },
  {
    id: 12,
    title: "Akira",
    genre: "Animation",
    duration: "2h 04min",
    year: 1988,
    price: 10,
    desc: "The gold standard for action animation. Set in a dystopian Neo-Tokyo, it follows a biker gang member who gains uncontrollable psychic powers.",
    seances: ["13:00", "17:00", "21:00"]
  }
];

let activeGenre = "Tous";
let currentFilm = null;
let ticketCount = 1;
let reservations = JSON.parse(localStorage.getItem("user_reservations") || "[]");

document.addEventListener("DOMContentLoaded", function () {
  renderFilms(FILMS);
  renderReservations();
  setupNav();
});

function setupNav() {
  const links = document.querySelectorAll(".nav-link");
  links.forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const section = this.dataset.section;
      links.forEach(function (l) { l.classList.remove("active"); });
      this.classList.add("active");
      document.querySelectorAll(".section").forEach(function (s) { s.classList.remove("active"); });
      document.getElementById("section-" + section).classList.add("active");
      if (section === "reservations") renderReservations();
    });
  });
}

function getInitials(title) {
  return title
    .split(" ")
    .filter(function (w) { return w.length > 2; })
    .slice(0, 2)
    .map(function (w) { return w[0].toUpperCase(); })
    .join("");
}

function renderFilms(list) {
  const grid = document.getElementById("films-grid");
  const noRes = document.getElementById("no-results");

  if (list.length === 0) {
    grid.innerHTML = "";
    noRes.style.display = "block";
    return;
  }
  noRes.style.display = "none";

  grid.innerHTML = list.map(function (film, i) {
    return `
      <div class="film-card" style="animation-delay:${i * 0.05}s" onclick="openModal(${film.id})">
        <div class="film-poster">
          <span class="film-poster-initial">${getInitials(film.title)}</span>
        </div>
        <div class="film-info">
          <div class="film-genre">${film.genre}</div>
          <div class="film-title">${film.title}</div>
          <div class="film-meta">${film.year} &bull; ${film.duration} &bull; ${film.price} DT</div>
          <button class="btn-book" onclick="event.stopPropagation(); openModal(${film.id})">
            Réserver
          </button>
        </div>
      </div>
    `;
  }).join("");
}

function filterFilms() {
  const query = document.getElementById("search-input").value.trim().toLowerCase();
  const filtered = FILMS.filter(function (f) {
    const matchGenre = activeGenre === "Tous" || f.genre === activeGenre;
    const matchQuery = f.title.toLowerCase().includes(query) || f.genre.toLowerCase().includes(query);
    return matchGenre && matchQuery;
  });
  renderFilms(filtered);
}

function setGenre(genre, btn) {
  activeGenre = genre;
  document.querySelectorAll(".filter-btn").forEach(function (b) { b.classList.remove("active"); });
  btn.classList.add("active");
  filterFilms();
}

function openModal(filmId) {
  currentFilm = FILMS.find(function (f) { return f.id === filmId; });
  ticketCount = 1;

  document.getElementById("modal-title").textContent = currentFilm.title;
  document.getElementById("modal-meta").textContent = currentFilm.genre + " \u2022 " + currentFilm.year + " \u2022 " + currentFilm.duration;
  document.getElementById("modal-desc").textContent = currentFilm.desc;
  document.getElementById("modal-poster").innerHTML = '<span class="film-poster-initial">' + getInitials(currentFilm.title) + '</span>';
  document.getElementById("ticket-count").textContent = 1;
  updatePrice();

  const sel = document.getElementById("modal-seance");
  sel.innerHTML = currentFilm.seances.map(function (s) {
    return '<option value="' + s + '">' + s + '</option>';
  }).join("");

  document.getElementById("modal-overlay").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal(e) {
  if (e.target === document.getElementById("modal-overlay")) closeModalBtn();
}

function closeModalBtn() {
  document.getElementById("modal-overlay").classList.remove("open");
  document.body.style.overflow = "";
}

function changeTickets(delta) {
  ticketCount = Math.max(1, Math.min(10, ticketCount + delta));
  document.getElementById("ticket-count").textContent = ticketCount;
  updatePrice();
}

function updatePrice() {
  const total = currentFilm.price * ticketCount;
  document.getElementById("modal-price").textContent = total + " DT";
}

function confirmBooking() {
  const seance = document.getElementById("modal-seance").value;
  const today = new Date();
  const dateStr = today.toISOString().split("T")[0];
  const code = "RES" + String(Date.now()).slice(-4);

  const reservation = {
    code: code,
    film: currentFilm.title,
    date: dateStr,
    heure: seance,
    tickets: ticketCount,
    status: "Confirm\u00e9e"
  };

  reservations.unshift(reservation);
  localStorage.setItem("user_reservations", JSON.stringify(reservations));

  closeModalBtn();
  showToast("\u2713 R\u00e9servation confirm\u00e9e \u2014 " + currentFilm.title + " \u00e0 " + seance);
}

function renderReservations() {
  const tbody = document.getElementById("res-tbody");
  const empty = document.getElementById("empty-res");

  if (reservations.length === 0) {
    tbody.innerHTML = "";
    empty.style.display = "block";
    return;
  }
  empty.style.display = "none";

  tbody.innerHTML = reservations.map(function (r, i) {
    return '<tr>' +
      '<td><strong>' + r.code + '</strong></td>' +
      '<td>' + r.film + '</td>' +
      '<td>' + r.date + '</td>' +
      '<td>' + r.heure + '</td>' +
      '<td>' + r.tickets + '</td>' +
      '<td><span class="badge badge-confirmed">' + r.status + '</span></td>' +
      '<td><button class="btn-cancel" onclick="cancelReservation(' + i + ')">Annuler</button></td>' +
      '</tr>';
  }).join("");
}

function cancelReservation(index) {
  reservations.splice(index, 1);
  localStorage.setItem("user_reservations", JSON.stringify(reservations));
  renderReservations();
  showToast("R\u00e9servation annul\u00e9e.");
}

function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(function () { t.classList.remove("show"); }, 3500);
}
