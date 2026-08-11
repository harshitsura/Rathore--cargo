function toggleMenu() {
    document.getElementById("nav").classList.toggle("open");
}

// Tracking Form Handler
document.getElementById("trackingForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const id = document.getElementById("trackingNumber").value.trim();
    document.getElementById("trackingMessage").textContent = "Tracking enquiry received for " + id + ". Please contact Rathore Cargo for live shipment status.";
});

// Quote Form Handler
document.getElementById("quoteForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const f = new FormData(this);
    const msg = "Hello Rathore Cargo,%0A%0AI want to request a cargo quote.%0A%0AName: " + encodeURIComponent(f.get("name")) + "%0APhone: " + encodeURIComponent(f.get("phone")) + "%0AFrom: " + encodeURIComponent(f.get("from")) + "%0ATo: " + encodeURIComponent(f.get("to")) + "%0AService: " + encodeURIComponent(f.get("service")) + "%0ADetails: " + encodeURIComponent(f.get("message") || "Not provided");
    document.getElementById("quoteMessage").textContent = "Opening WhatsApp...";
    window.open("https://wa.me/918764673455?text=" + msg, "_blank");
});