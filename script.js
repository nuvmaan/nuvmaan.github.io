class SnowLayer {
  constructor(canvasId, layerProps) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.layerProps = layerProps;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * window.devicePixelRatio;
    this.canvas.height = this.height * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    this.snowflakes = [];
    this.snowPileHeight = SNOWPILE_HEIGHT; // Initialize snow pile height
    this.createSnowflakes(TOTAL_NUM_FLAKES);
  }

  createSnowflakes(numFlakes) {
    for (let i = 0; i < numFlakes; i++) {
      this.snowflakes.push(this.createSnowflake());
    }
  }

  createSnowflake() {
    const symbol = this.layerProps.symbols[
      Math.floor(Math.random() * this.layerProps.symbols.length)
    ];
    const size =
      Math.random() * (this.layerProps.sizeMax - this.layerProps.sizeMin) +
      this.layerProps.sizeMin;
    const fallSpeed = size * this.layerProps.speedFactor + Math.random() * 0.5;
    const colorVariation =
      Math.floor(
        Math.random() *
          (this.layerProps.colorVariationMax - this.layerProps.colorVariationMin + 1)
      ) + this.layerProps.colorVariationMin;
    const color = `rgba(${colorVariation}, ${colorVariation}, ${colorVariation}, ${this.layerProps.opacity})`;

    return {
      x: Math.random() * this.width,
      y: Math.random() * -this.height, // Make sure snowflakes start above the canvas
      size: size,
      symbol: symbol,
      fallSpeed: fallSpeed,
      color: color,
    };
  }

  drawSnowPile() {
    // Draw the snow pile at the bottom
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.snowPileHeight);
    this.ctx.lineTo(this.width, this.snowPileHeight);
    this.ctx.lineTo(this.width, this.height);
    this.ctx.lineTo(0, this.height);
    this.ctx.closePath();

    this.ctx.fillStyle = "rgba(255, 255, 255, 0.5)"; // White snow color with some opacity
    this.ctx.fill();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.drawSnowPile(); // Draw the snow pile on every frame

    for (let flake of this.snowflakes) {
      this.ctx.font = `${flake.size}px sans-serif`;
      this.ctx.fillStyle = flake.color;
      this.ctx.fillText(flake.symbol, flake.x, flake.y);

      // Update snowflake position
      flake.y += flake.fallSpeed;

      // If the snowflake reaches the pile, settle it and create a new one
      if (flake.y >= this.snowPileHeight - flake.size) {
        flake.y = this.snowPileHeight - flake.size;
        this.snowPileHeight += flake.size * 0.05; // Increase snow pile height based on flake size
        Object.assign(flake, this.createSnowflake()); // Create a new snowflake
      }

      // Loop snowflakes to the top if they go out of view
      if (flake.y > this.height) {
        flake.y = -flake.size;
        flake.x = Math.random() * this.width;
      }
    }

    requestAnimationFrame(() => this.animate());
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * window.devicePixelRatio;
    this.canvas.height = this.height * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }
}

const TOTAL_NUM_FLAKES = 100; // Adjust the number of snowflakes as needed
const snowLayer = new SnowLayer('snowfall', {
  layer: 1,
  sizeMin: 10,
  sizeMax: 20,
  speedFactor: 0.1,
  symbols: ["❄"],
  opacity: 0.8,
  colorVariationMin: 200,
  colorVariationMax: 255,
});

window.addEventListener("resize", () => snowLayer.resize());

snowLayer.animate();

// Get the form and submit button
const form = document.getElementById("contact-form");
const submitButton = document.getElementById("submit-button");
const recaptchaError = document.getElementById("recaptcha-error");

// Add event listener to the submit button
submitButton.addEventListener("click", function (event) {
    // Check if reCAPTCHA is verified
    const recaptchaResponse = grecaptcha.getResponse();

    // If reCAPTCHA is not verified, prevent form submission and show the error message
    if (recaptchaResponse.length === 0) {
        event.preventDefault(); // Prevent form submission
        recaptchaError.style.display = "block"; // Show the error message
    } else {
        recaptchaError.style.display = "none"; // Hide the error message if reCAPTCHA is verified
    }
});
async function loadPortfolioItems() {
  const portfolioGrid = document.getElementById("portfolio-grid");

  try {
      // Fetch the portfolio markdown files
      const response = await fetch("/content/portfolio");
      const files = await response.json(); // Ensure your site supports fetching these files

      // Iterate through the portfolio items and create the HTML
      files.forEach((file) => {
          const { title, description, image } = file;

          const portfolioItem = document.createElement("div");
          portfolioItem.className = "portfolio-item";

          portfolioItem.innerHTML = `
              <img src="${image}" alt="${title}">
              <div class="portfolio-overlay">
                  <div class="overlay-content">
                      <h3>${title}</h3>
                      <p>${description}</p>
                  </div>
              </div>
          `;

          portfolioGrid.appendChild(portfolioItem);
      });
  } catch (error) {
      console.error("Error loading portfolio items:", error);
  }
}

// Call the function when the page loads
document.addEventListener("DOMContentLoaded", loadPortfolioItems);
