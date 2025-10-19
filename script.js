document.addEventListener("DOMContentLoaded", async () => {
  const apiUrl = "https://script.google.com/macros/s/AKfycbzT10lEqumg7rBhEMUT1P_rXfBKRFOvRk80nDeUvlFxnXZKUwI9_0_3PVJ-CNfneref/exec";

  const gallery = document.getElementById("gallery");
  const searchInput = document.getElementById("search");

  try {
    const res = await fetch(apiUrl);
    const rows = await res.json();

    rows.forEach(file => {
      const card = document.createElement("div");
      card.className = "img-card";

      const img = document.createElement("img");
      img.src = file.imgRawLink;
      img.alt = file.title;

      const label = document.createElement("div");
      label.className = "img-name";
      label.textContent = file.title;

      const copied = document.createElement("div");
      copied.className = "copied";
      copied.textContent = "Copied!";

      card.appendChild(img);
      card.appendChild(label);
      card.appendChild(copied);
      gallery.appendChild(card);

      card.addEventListener("click", async () => {
        await navigator.clipboard.writeText(file.imgRawLink);
        card.classList.add("copied");
        setTimeout(() => card.classList.remove("copied"), 1000);
      });
    });

    searchInput.addEventListener("input", e => {
      const term = e.target.value.toLowerCase();
      document.querySelectorAll(".img-card").forEach(card => {
        const visible = card.querySelector(".img-name").textContent.toLowerCase().includes(term);
        card.style.display = visible ? "block" : "none";
      });
    });

  } catch (err) {
    console.error("Failed to load images:", err);
    gallery.innerHTML = "<p style='color:red;'>Error loading images</p>";
  }
});
