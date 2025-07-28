const CART_BASE_URL = window.__ENV__?.CART_ENDPOINT || 'http://127.0.0.1:5004/orders';


function showSignIn() {
  document.getElementById("signinModal").style.display = "block";
}

function saveUsername() {
  const username = document.getElementById("usernameInput").value.trim();
  if (username) {
    localStorage.setItem("username", username);
    alert(`Welcome, ${username}!`);
    document.getElementById("signinModal").style.display = "none";
  } else {
    alert("Please enter a username");
  }
}

function getUsername() {
  return localStorage.getItem("username");
}

document.addEventListener("DOMContentLoaded", () => {
  const signInLink = document.getElementById("signInLink");
  if (signInLink) {
    signInLink.addEventListener("click", function (e) {
      e.preventDefault();
      showSignIn();
    });
  }

  const cartForm = document.getElementById("cart-form");
  if (cartForm) {
    cartForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const username = getUsername();
      if (!username) {
        alert("Please sign in before adding to cart.");
        showSignIn();
        return;
      }

      if (!window.currentGameData) {
        alert("Game data not loaded yet.");
        return;
      }

      const quantityInput = document.getElementById("quantity");
      const quantity = parseInt(quantityInput.value);
      if (isNaN(quantity) || quantity < 1) {
        alert("Please enter a valid quantity.");
        return;
      }

      const price = window.currentGameData.price;

      const orderPayload = {
        customer_name: username,
        total_price: price * quantity,
        items: [
          {
            game_id: window.currentGameData.game_id,
            game_title: window.currentGameData.title,
            quantity: quantity,
            price: price,
          },
        ],
      };

      const submitButton = cartForm.querySelector("button[type='submit']");

      // Save original styles to restore later
      const originalText = submitButton.innerHTML;
      const originalBg = submitButton.style.backgroundColor;
      const originalColor = submitButton.style.color;

      // Disable and show loading state
      submitButton.disabled = true;
      submitButton.innerHTML = "Adding...";
      submitButton.style.backgroundColor = "#6c757d"; // bootstrap gray
      submitButton.style.color = "#fff";

      fetch(CART_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      })
        .then((res) => {
          if (res.ok) {
            submitButton.innerHTML = "Added ✓";
            submitButton.style.backgroundColor = "#28a745"; // bootstrap green
            submitButton.style.color = "#fff";

            setTimeout(() => {
              submitButton.disabled = false;
              submitButton.innerHTML = originalText;
              submitButton.style.backgroundColor = originalBg;
              submitButton.style.color = originalColor;
            }, 3000);
          } else {
            throw new Error("Failed to add to cart.");
          }
        })
        .catch((err) => {
          console.error("Error:", err);
          alert("Error adding to cart.");

          submitButton.disabled = false;
          submitButton.innerHTML = "Failed!";
          submitButton.style.backgroundColor = "#dc3545"; // bootstrap red
          submitButton.style.color = "#fff";

          setTimeout(() => {
            submitButton.innerHTML = originalText;
            submitButton.style.backgroundColor = originalBg;
            submitButton.style.color = originalColor;
          }, 3000);
        });
    });
  }
});

// Global game data object to be set externally
let currentGameData = null;

function loadGameDetails(gameData) {
  currentGameData = gameData;

  document.getElementById("game-id").innerText = gameData.game_id;
  document.getElementById("game-title").innerText = gameData.title;
  document.getElementById("breadcrumb-title").innerText = gameData.title;
  document.getElementById("product-image").src = gameData.image_url;
  document.getElementById("price").innerText = `$${gameData.price.toFixed(2)}`;
  document.getElementById("original-price").innerText = `$${gameData.original_price.toFixed(2)}`;
  document.getElementById("short-description").innerText = gameData.short_description;
  document.getElementById("long-description").innerText = gameData.long_description;
  document.getElementById("genre-tags").innerText = gameData.genres.join(", ");
  document.getElementById("multi-tags").innerText = gameData.tags.join(", ");
}
