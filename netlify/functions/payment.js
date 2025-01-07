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
