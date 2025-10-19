document.addEventListener("DOMContentLoaded", async () => {
  const apiUrl = "https://script.google.com/macros/s/AKfycbzcTQep9aiDC7DieUXuvAo-iK56YdB-yW8L6yadswzBzqgdEdunuJy42Bnfp0rOZYzt/exec";

  const gallery = document.getElementById("gallery");
  const searchInput = document.getElementById("search");

  // Add simple loader
  const loader = document.createElement("div");
  loader.className = "loader";
  loader.innerHTML = `<div class="spinner"></div><p>Loading images...</p>`;
  gallery.appendChild(loader);

  try {
    const res = await fetch(apiUrl, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const rows = await res.json();

    loader.remove(); // remove loader when data arrives

    if (!Array.isArray(rows) || rows.length === 0) {
      gallery.innerHTML = "<p style='color:gray;'>No images found.</p>";
      return;
    }

    rows.forEach(file => {
      const card = document.createElement("div");
      card.className = "img-card";

      const img = document.createElement("img");
      img.src = file.imgRawLink;
      img.alt = file.title;
      img.loading = "lazy";

      const label = document.createElement("div");
      label.className = "img-name";
      label.textContent = file.title;

      const copied = document.createElement("div");
      copied.className = "copied";
      copied.textContent = "Copied!";

      card.append(img, label, copied);
      gallery.appendChild(card);

      card.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(file.imgRawLink);
          card.classList.add("copied");
          setTimeout(() => card.classList.remove("copied"), 1000);
        } catch {
          alert("Copy failed — clipboard not available.");
        }
      });
    });

    searchInput?.addEventListener("input", e => {
      const term = e.target.value.toLowerCase();
      document.querySelectorAll(".img-card").forEach(card => {
        const visible = card.querySelector(".img-name").textContent.toLowerCase().includes(term);
        card.style.display = visible ? "block" : "none";
      });
    });

  } catch (err) {
    console.error("Failed to load images:", err);
    gallery.innerHTML = `<p style='color:red;'>Error loading images: ${err.message}</p>`;
  }
});
