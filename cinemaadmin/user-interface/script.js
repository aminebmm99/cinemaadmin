const PRICE = 9.5;

const films = [
  {
    id: 1,
    title: "anabel",
    genre: "Thriller",
    duree: "2h18",
    desc: "Un détective enquête sur des disparitions mystérieuses.",
    seances: [
      { date: "Lun 18 Nov", heure: "14:30", places: 48 },
      { date: "Lun 18 Nov", heure: "20:00", places: 12 }
    ]
  },
  {
    id: 2,
    title: "sahbek rajel",
    genre: "humeur",
    duree: "2h35",
    desc: "Une expédition spatiale découvre un secret ancien.",
    seances: [
      { date: "Mar 19 Nov", heure: "19:00", places: 8 },
      { date: "Mer 20 Nov", heure: "21:45", places: 42 }
    ]
  }
];

let currentFilm = null;
let selectedSeance = null;
let tickets = 1;

function showPage(name) {
  document.querySelectorAll(".page").forEach(p =>
    p.classList.remove("active")
  );
  document.getElementById("page-" + name).classList.add("active");
}

function renderFilms() {
  const grid = document.getElementById("filmsGrid");

  grid.innerHTML = films.map(f => `
    <div class="film-card" onclick="openFilm(${f.id})">
      <h3>${f.title}</h3>
      <p>${f.duree}</p>
      <span class="genre">${f.genre}</span>
    </div>
  `).join("");
}

function openFilm(id) {
  currentFilm = films.find(f => f.id === id);
  selectedSeance = null;
  tickets = 1;

  document.getElementById("filmDetail").innerHTML = `
    <h2>${currentFilm.title}</h2>
    <p>${currentFilm.desc}</p>
    <p>${currentFilm.genre} • ${currentFilm.duree}</p>
  `;

  document.getElementById("seancesGrid").innerHTML =
    currentFilm.seances.map((s, i) => `
      <div class="seance-btn" onclick="selectSeance(${i})">
        <p>${s.date}</p>
        <strong>${s.heure}</strong>
        <p>${s.places} places</p>
      </div>
    `).join("");

  document.getElementById("resaForm").classList.remove("visible");
  showPage("seances");
}

function selectSeance(i) {
  selectedSeance = i;
  document.querySelectorAll(".seance-btn").forEach((el, idx) =>
    el.classList.toggle("selected", idx === i)
  );
  document.getElementById("resaForm").classList.add("visible");
  updatePrice();
}

function changeTickets(d) {
  tickets = Math.max(1, tickets + d);
  document.getElementById("ticketCount").textContent = tickets;
  updatePrice();
}

function updatePrice() {
  const total = (tickets * PRICE).toFixed(2).replace(".", ",");
  document.getElementById("priceLabel").textContent =
    `${tickets} ticket × 9,50€`;
  document.getElementById("priceTotal").textContent =
    `${total}€`;
}

function confirmer() {
  const nom = document.getElementById("inputNom").value.trim();
  const email = document.getElementById("inputEmail").value.trim();

  if (!nom || !email) {
    alert("Veuillez remplir tous les champs.");
    return;
  }

  const code =
    "CM-" + Math.random().toString(36).substring(2, 7).toUpperCase();

  document.getElementById("confirmCode").textContent = code;
  document.getElementById("confirmRecap").innerHTML = `
    <p>Film: ${currentFilm.title}</p>
    <p>Tickets: ${tickets}</p>
    <p>Total: ${(tickets * PRICE).toFixed(2)}€</p>
  `;

  showPage("confirmation");
}

renderFilms();