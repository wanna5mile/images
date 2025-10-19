document.addEventListener("DOMContentLoaded", async () => {
  const SHEET_ID = "1o6nNW7O03Oo41zLVwGMpwGxROl1c8lZVJW0jRnjWte8"; // sheet ID
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

  const gallery = document.getElementById("gallery");
  const searchInput = document.getElementById("search");

  try {
    const res = await fetch(url);
    const text = await res.text();

    // Google wraps the JSON inside "google.visualization.Query.setResponse(...)"
    const json = JSON.parse(text.substring(47, text.length - 2));
    const rows = json.table.rows.map(r => ({
      name: r.c[0]?.v,
      url: r.c[1]?.v,
      tags: r.c[2]?.v || "",
      category: r.c[3]?.v || ""
    }));

    rows.forEach(file => {
      const card = document.createElement("div");
      card.className = "img-card";

      const img = document.createElement("img");
      img.src = file.url;
      img.alt = file.name;

      const label = document.createElement("div");
      label.className = "img-name";
      label.textContent = file.name;

      const copied = document.createElement("div");
      copied.className = "copied";
      copied.textContent = "Copied!";

      card.appendChild(img);
      card.appendChild(label);
      card.appendChild(copied);
      gallery.appendChild(card);

      card.addEventListener("click", async () => {
        await navigator.clipboard.writeText(file.url);
        card.classList.add("copied");
        setTimeout(() => card.classList.remove("copied"), 1000);
      });
    });

    // Simple search
    searchInput.addEventListener("input", e => {
      const term = e.target.value.toLowerCase();
      document.querySelectorAll(".img-card").forEach(card => {
        const visible = card.querySelector(".img-name").textContent.toLowerCase().includes(term);
        card.style.display = visible ? "block" : "none";
      });
    });

  } catch (err) {
    console.error("Failed to load Google Sheet:", err);
    gallery.innerHTML = "<p style='color:red;'>Error loading images</p>";
  }
});
