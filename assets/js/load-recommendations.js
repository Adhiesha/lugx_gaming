const BASE_URL = "http://127.0.0.1:5002/recommendations";

function createGameCard(game, type = "trending") {
  const detailLink = `product-details.html?game_id=${encodeURIComponent(game.game_id)}`;
  const priceHtml = game.original_price && game.original_price > game.price
    ? `<span class="price"><em>$${game.original_price}</em>$${game.price}</span>`
    : `<span class="price">$${game.price}</span>`;

  const card = `
    <div class="${type === 'most_played' ? 'col-lg-2 col-md-6 col-sm-6' : 'col-lg-3 col-md-6'}">
      <div class="item">
        <div class="thumb">
          <a href="${detailLink}">
            <img src="${game.image_url}" alt="${game.display_name}">
          </a>
          ${type !== 'most_played' ? priceHtml : ''}
        </div>
        <div class="down-content">
          <span class="category">${game.category || ''}</span>
          <h4>${game.display_name}</h4>
          <a href="${detailLink}">${type === 'most_played' ? 'Explore' : '<i class="fa fa-shopping-bag"></i>'}</a>
        </div>
      </div>
    </div>
  `;
  return card;
}

function loadSection(endpoint, containerId, cardType = "trending") {
  fetch(endpoint)
    .then(res => res.json())
    .then(games => {
      const container = document.getElementById(containerId);
      if (!container) return;

      container.innerHTML = ""; // Clear existing
      games.forEach(game => {
        container.innerHTML += createGameCard(game, cardType);
      });
    })
    .catch(err => console.error(`Error loading ${cardType} section:`, err));
}

document.addEventListener("DOMContentLoaded", () => {
  loadSection(`${BASE_URL}/trending?k=4`, "trending-games", "trending");
  loadSection(`${BASE_URL}/most_played?k=6`, "most-played", "most_played");
  loadSection(`${BASE_URL}/top_categories?k=5`, "top-categories", "category");
});
