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
    this.createSnowflakes(layerProps.numFlakes);
  }

  createSnowflakes(numFlakes) {
    for (let i = 0; i < numFlakes; i++) {
      this.snowflakes.push(this.createSnowflake());
    }
  }

  createSnowflake() {
    const symbol =
      this.layerProps.symbols[
        Math.floor(Math.random() * this.layerProps.symbols.length)
      ];
    const size =
      Math.random() * (this.layerProps.sizeMax - this.layerProps.sizeMin) +
      this.layerProps.sizeMin;
    const fallSpeed = size * this.layerProps.speedFactor + Math.random() * 0.5;
    const colorVariation =
      Math.floor(
        Math.random() *
          (this.layerProps.colorVariationMax -
            this.layerProps.colorVariationMin +
            1)
      ) + this.layerProps.colorVariationMin;
    const color = `rgba(${colorVariation}, ${colorVariation}, ${colorVariation}, ${this.layerProps.opacity})`;

    return {
      x: Math.random() * this.width,
      y: Math.random() * -this.height, // Start above the canvas
      size: size,
      symbol: symbol,
      fallSpeed: fallSpeed,
      color: color,
    };
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let flake of this.snowflakes) {
      this.ctx.font = `${flake.size}px sans-serif`;
      this.ctx.fillStyle = flake.color;
      this.ctx.fillText(flake.symbol, flake.x, flake.y);

      // Update snowflake position
      flake.y += flake.fallSpeed;

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

const snowLayer = new SnowLayer("snowfall", {
  numFlakes: 60, // Number of snowflakes
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

// Form Submission with reCAPTCHA Verification
document.getElementById("submit-button").addEventListener("click", function (event) {
  const recaptchaResponse = grecaptcha.getResponse();
  const recaptchaError = document.getElementById("recaptcha-error");

  if (recaptchaResponse.length === 0) {
    event.preventDefault(); // Prevent form submission
    recaptchaError.style.display = "block"; // Show the error message
  } else {
    recaptchaError.style.display = "none"; // Hide the error message if reCAPTCHA is verified
  }
});

// Load Portfolio Items
async function loadPortfolioItems() {
  const portfolioGrid = document.getElementById("portfolio-grid");

  try {
    const response = await fetch("/content/portfolio");
    const files = await response.json();

    files.forEach((file) => {
      const { title, description, image } = file;

      const portfolioItem = document.createElement("div");
      portfolioItem.className = "portfolio-item";

      portfolioItem.innerHTML = `
        <img src="${image}" alt="${title}" loading="lazy">
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

document.addEventListener("DOMContentLoaded", loadPortfolioItems);

// Load Blogs
document.addEventListener("DOMContentLoaded", () => {
  fetch("/blogs/index.json") // Assuming Netlify CMS creates index.json for blogs
    .then((response) => response.json())
    .then((data) => {
      const blogContainer = document.getElementById("blog-container");
      blogContainer.innerHTML = data
        .map(
          (blog) => `
              <div class="col-md-4">
                  <div class="blog-card">
                      <img src="${blog.image}" alt="${blog.title}" loading="lazy">
                      <div class="card-body">
                          <h5 class="card-title">${blog.title}</h5>
                          <p class="card-text">${blog.excerpt}</p>
                          <a href="/blogs/${blog.slug}.html" class="btn btn-primary">Read More</a>
                      </div>
                  </div>
              </div>
          `
        )
        .join("");
    })
    .catch((err) => console.error("Failed to load blogs:", err));
});

// Back to Top Button Functionality
let backToTopButton = document.getElementById("backToTop");

window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    backToTopButton.style.display = "block";
  } else {
    backToTopButton.style.display = "none";
  }
}

backToTopButton.addEventListener("click", function () {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE, and Opera
});

// Show notice banner if not shown before
window.onload = function () {
  if (!localStorage.getItem('bannerShown')) {
    document.getElementById('noticeBanner').style.display = 'block';
  }
};

// Close notice banner and set flag
function closeBanner() {
  document.getElementById('noticeBanner').style.display = 'none';
  localStorage.setItem('bannerShown', 'true');
}
