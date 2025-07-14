const BASE_URL = "http://127.0.0.1:5001/games";

// Get the game_id from the URL query string
function getGameIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("game_id");
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  if (!text) return "";
  return text.replace(/[&<>"']/g, function (m) {
    switch (m) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#039;";
      default:
        return m;
    }
  });
}

// Load and render product details
function loadProductDetails() {
  const gameId = getGameIdFromURL();
  console.log("Get Game:", gameId);
  if (!gameId) return;

  fetch(`${BASE_URL}/${encodeURIComponent(gameId)}`)
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch game details.");
      return res.json();
    })
    .then(game => {
      document.getElementById("game-title-heading").textContent = game.title;
      document.getElementById("breadcrumb-title").textContent = game.title;
      document.getElementById("game-title").textContent = game.title;
      document.getElementById("original-price").textContent = `$${game.original_price.toFixed(2)}`;
      document.getElementById("price").textContent = `$${game.price.toFixed(2)}`;
      document.getElementById("short-description").textContent = game.short_description;
      document.getElementById("long-description").textContent = game.long_description || game.short_description;
      document.getElementById("game-id").textContent = game.game_id;
      document.getElementById("product-image").src = game.image_url;
      document.getElementById("product-image").alt = escapeHtml(game.title);

      // Category (Genre)
      const genreHtml = game.category ? `<a href="#">${escapeHtml(game.category)}</a>` : "";
      document.getElementById("genre-tags").innerHTML = genreHtml;

      // Tags
      const tagHtml = game.tags.map(tag => `<a href="#">${escapeHtml(tag)}</a>`).join(", ");
      document.getElementById("multi-tags").innerHTML = tagHtml;
    })
    .catch(err => {
      console.error("Error loading product details:", err);
    });
}

// Load details after DOM is ready
document.addEventListener("DOMContentLoaded", loadProductDetails);
