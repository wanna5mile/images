document.addEventListener("DOMContentLoaded", async () => {
  // Your Google Apps Script Web App URL
  const apiUrl = "https://script.google.com/macros/s/AKfycbzcTQep9aiDC7DieUXuvAo-iK56YdB-yW8L6yadswzBzqgdEdunuJy42Bnfp0rOZYzt/exec";

  const gallery = document.getElementById("gallery");
  const searchInput = document.getElementById("search");

  // 🌀 Add a loading spinner while fetching
  const loader = document.createElement("div");
  loader.className = "loader";
  loader.innerHTML = `<div class="spinner"></div><p>Loading images...</p>`;
  gallery.appendChild(loader);

  try {
    // 🔄 Fetch live JSON data from your Google Sheet (which syncs from GitHub)
    const res = await fetch(apiUrl, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const rows = await res.json();

    loader.remove(); // Remove loader once data is loaded

    // 🧹 Validate and filter only image-type rows
    const validImages = rows.filter(f =>
      f.imgRawLink &&
      f.imgRawLink.match(/\.(png|jpg|jpeg|gif|webp)$/i)
    );

    if (validImages.length === 0) {
      gallery.innerHTML = "<p style='color:gray;'>No valid image files found.</p>";
      return;
    }

    // 🖼️ Create cards for each image
    validImages.forEach(file => {
      const card = document.createElement("div");
      card.className = "img-card";

      const img = document.createElement("img");
      img.src = file.imgPrevLink || file.imgRawLink;
      img.alt = file.title || "Unnamed";
      img.loading = "lazy";
      img.onerror = () => (img.src = "https://via.placeholder.com/200x200?text=Image+Missing");

      const label = document.createElement("div");
      label.className = "img-name";
      label.textContent = file.title || "Untitled";

      const copied = document.createElement("div");
      copied.className = "copied";
      copied.textContent = "Copied!";

      card.append(img, label, copied);
      gallery.appendChild(card);

      // 📋 Copy image raw link on click
      card.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(file.imgRawLink);
          card.classList.add("copied");
          setTimeout(() => card.classList.remove("copied"), 1000);
        } catch {
          alert("Clipboard copy failed.");
        }
      });
    });

    // 🔍 Search/filter functionality
    searchInput?.addEventListener("input", e => {
      const term = e.target.value.toLowerCase();
      document.querySelectorAll(".img-card").forEach(card => {
        const visible = card.querySelector(".img-name").textContent.toLowerCase().includes(term);
        card.style.display = visible ? "block" : "none";
      });
    });

  } catch (err) {
    console.error("❌ Failed to load images:", err);
    gallery.innerHTML = `<p style='color:red;'>Error loading images: ${err.message}</p>`;
  }
});
