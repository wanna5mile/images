document.addEventListener("DOMContentLoaded", async () => {
  // Google Apps Script Web App URL
  const apiUrl = "https://script.google.com/macros/s/AKfycbyKCuTDoxk5MBATbZ5wIj4VTRI2v8uMsj2M68e0khzAKOHrdSjeye_u6-dqtFguVyRS/exec";

  const gallery = document.getElementById("gallery");
  const searchInput = document.getElementById("search");

  // Loading indicator
  const loader = document.createElement("div");
  loader.className = "loader";
  loader.innerHTML = `<div class="spinner"></div><p>Loading images...</p>`;
  gallery.appendChild(loader);

  try {
    // Fetch live data
    const res = await fetch(apiUrl, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const rows = await res.json();

    loader.remove();

    // Filter valid images
    const validImages = rows.filter(f =>
      f.imgRawLink &&
      /\.(png|jpe?g|gif|webp)$/i.test(f.imgRawLink)
    );

    if (validImages.length === 0) {
      gallery.innerHTML = "<p style='color:gray;'>No images found.</p>";
      return;
    }

    // Render image cards
    validImages.forEach(file => {
      const card = document.createElement("div");
      card.className = "img-card";

      const img = document.createElement("img");
      // Uses file.imgRawLink as the primary image source for the preview.
      img.src = file.imgRawLink; 
      img.alt = file.title || "Untitled";
      img.loading = "lazy";
      img.onerror = () => {
        img.src = "https://via.placeholder.com/200x200?text=Image+Missing";
      };

      const label = document.createElement("div");
      label.className = "img-name";
      label.textContent = file.title || "Untitled";

      const copied = document.createElement("div");
      copied.className = "copied";
      copied.textContent = "Copied!";

      card.append(img, label, copied);
      gallery.appendChild(card);

      // Copy image link on click
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

    // Live search
    searchInput?.addEventListener("input", e => {
      const term = e.target.value.toLowerCase();
      document.querySelectorAll(".img-card").forEach(card => {
        const name = card.querySelector(".img-name").textContent.toLowerCase();
        card.style.display = name.includes(term) ? "block" : "none";
      });
    });

  } catch (err) {
    console.error("Failed to load images:", err);
    gallery.innerHTML = `<p style='color:red;'>Error loading images: ${err.message}</p>`;
  }
});
