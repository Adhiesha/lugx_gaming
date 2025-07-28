const GAME_BASE_URL = window.__ENV__?.GAMES_ENDPOINT || 'http://127.0.0.1:5001/games';
const perPage = 8;

let currentPage = 1;
let currentTag = '';

document.addEventListener("DOMContentLoaded", () => {
  loadGames(currentPage, currentTag);

  // Tag Filter Clicks
  const tagFilter = document.getElementById("tag-filter");
  tagFilter.querySelectorAll("a").forEach(anchor => {
    anchor.addEventListener("click", (e) => {
      e.preventDefault();
      const tag = anchor.getAttribute("data-tag") || '';
      if (tag !== currentTag) {
        currentTag = tag;
        currentPage = 1;
        updateActiveTag(tag);
        loadGames(currentPage, currentTag);
      }
    });
  });
});

function updateActiveTag(tag) {
  const tagFilter = document.getElementById("tag-filter");
  tagFilter.querySelectorAll("a").forEach(anchor => {
    anchor.classList.toggle("is_active", anchor.getAttribute("data-tag") === tag);
  });
}

function loadGames(page = 1, tag = '') {
  const url = `${GAME_BASE_URL}?page=${page}&per_page=${perPage}${tag ? `&tag=${encodeURIComponent(tag)}` : ''}`;

  fetch(url)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      renderGames(data.items);
      renderPagination(data.page, data.pages);
      currentPage = data.page;
    })
    .catch((error) => {
      console.error("Failed to load games:", error);
      document.getElementById("game-list").innerHTML = `<p class="text-danger">Failed to load games. Please try again later.</p>`;
      document.getElementById("pagination").innerHTML = "";
    });
}

function renderGames(games) {
  const container = document.getElementById("game-list");
  container.innerHTML = "";

  if (!games.length) {
    container.innerHTML = "<p>No games found.</p>";
    return;
  }

  games.forEach((game) => {
    const tagsHtml = game.tags.map(tag => `<span class="badge badge-secondary mr-1">${tag}</span>`).join(" ");

    const gameHtml = `
      <div class="col-lg-3 col-md-6 align-self-center mb-30 trending-items">
        <div class="item">
          <div class="thumb">
            <a href="product-details.html?game_id=${encodeURIComponent(game.game_id)}">
              <img src="${game.image_url}" alt="${escapeHtml(game.title)}" />
            </a>
            <span class="price"><em>$${game.original_price.toFixed(2)}</em> $${game.price.toFixed(2)}</span>
          </div>
          <div class="down-content">
            <span class="category">${escapeHtml(game.category)}</span>
            <h4>${escapeHtml(game.title)}</h4>
            <p>${escapeHtml(game.short_description)}</p>
            <div>${tagsHtml}</div>
            <a href="product-details.html?game_id=${encodeURIComponent(game.game_id)}"><i class="fa fa-shopping-bag"></i></a>
          </div>
        </div>
      </div>
    `;

    container.insertAdjacentHTML("beforeend", gameHtml);
  });
}

function renderPagination(currentPage, totalPages) {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  // Prev button
  const prevLi = document.createElement("li");
  prevLi.className = currentPage === 1 ? "disabled" : "";
  prevLi.innerHTML = `<a href="#" aria-label="Previous">&lt;</a>`;
  prevLi.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentPage > 1) {
      loadGames(currentPage - 1, currentTag);
    }
  });
  pagination.appendChild(prevLi);

  // Page numbers (show max 7 pages centered)
  const maxPagesToShow = 7;
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = startPage + maxPagesToShow - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    const pageLi = document.createElement("li");
    pageLi.className = i === currentPage ? "is_active" : "";
    pageLi.innerHTML = `<a href="#">${i}</a>`;
    pageLi.addEventListener("click", (e) => {
      e.preventDefault();
      if (i !== currentPage) {
        loadGames(i, currentTag);
      }
    });
    pagination.appendChild(pageLi);
  }

  // Next button
  const nextLi = document.createElement("li");
  nextLi.className = currentPage === totalPages ? "disabled" : "";
  nextLi.innerHTML = `<a href="#" aria-label="Next">&gt;</a>`;
  nextLi.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentPage < totalPages) {
      loadGames(currentPage + 1, currentTag);
    }
  });
  pagination.appendChild(nextLi);
}

function escapeHtml(text) {
  if (!text) return "";
  return text.replace(/[&<>"']/g, (m) => {
    switch (m) {
      case "&": return "&amp;";
      case "<": return "&lt;";
      case ">": return "&gt;";
      case '"': return "&quot;";
      case "'": return "&#039;";
      default: return m;
    }
  });
}
