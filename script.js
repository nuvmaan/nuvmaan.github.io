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
document.getElementById("gig-form").addEventListener("submit", function(event) {
  event.preventDefault();

  // Collect user request and budget
  const request = document.getElementById("request").value;
  const budget = document.getElementById("budget").value;

  // Store the request data (you can also send it to your server here)
  console.log("Request Submitted:", request, "Budget:", budget);

  // Show the payment section after the request is submitted
  document.querySelector(".gig-request").style.display = "none";
  document.getElementById("payment-section").classList.remove("hidden");
});

// Razorpay Payment Integration
function startPayment() {
  const options = {
      key: 'YOUR_RAZORPAY_KEY_ID', // Enter your Razorpay Key ID here
      amount: 50000, // Amount in paise (50000 = 500 INR)
      currency: "INR",
      name: "Nuvmaan Gig Service",
      description: "Gig Payment",
      image: "https://your-logo-url.png", // Optional, you can replace with your logo
      handler: function (response) {
          // Payment success handler
          alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
          // You can send the payment details to your server here
      },
      prefill: {
          name: "John Doe", // Pre-fill the user's name
          email: "johndoe@example.com", // Pre-fill the user's email
          contact: "9876543210" // Pre-fill the user's contact number
      },
      theme: {
          color: "#F37254"
      }
  };

  const rzp1 = new Razorpay(options);
  rzp1.open();
}
