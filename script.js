document.addEventListener("DOMContentLoaded", async () => {
  const username = "wanna5mile";
  const repo = "wanna5mile.github.io";
  const path = "system/images";
  const branch = "main";
  const apiUrl = `https://api.github.com/repos/${username}/${repo}/contents/${path}?ref=${branch}`;
  const rawBase = `https://raw.githubusercontent.com/${username}/${repo}/${branch}/${path}/`;

  const gallery = document.getElementById("gallery");
  const searchInput = document.getElementById("search");

  try {
    const res = await fetch(apiUrl);
    const files = await res.json();

    const imageFiles = files.filter(f => f.type === "file" && /\.(png|jpg|jpeg|gif|webp)$/i.test(f.name));

    // Create image cards
    imageFiles.forEach(file => {
      const imgCard = document.createElement("div");
      imgCard.className = "img-card";

      const img = document.createElement("img");
      img.src = rawBase + file.name;
      img.alt = file.name;

      const name = document.createElement("div");
      name.className = "img-name";
      name.textContent = file.name;

      const copied = document.createElement("div");
      copied.className = "copied";
      copied.textContent = "Copied!";

      imgCard.appendChild(img);
      imgCard.appendChild(name);
      imgCard.appendChild(copied);
      gallery.appendChild(imgCard);

      imgCard.addEventListener("click", async () => {
        await navigator.clipboard.writeText(img.src);
        imgCard.classList.add("copied");
        setTimeout(() => imgCard.classList.remove("copied"), 1000);
      });
    });

    // 🔍 Search Filter
    searchInput.addEventListener("input", e => {
      const term = e.target.value.toLowerCase();
      document.querySelectorAll(".img-card").forEach(card => {
        const visible = card.querySelector(".img-name").textContent.toLowerCase().includes(term);
        card.style.display = visible ? "block" : "none";
      });
    });
  } catch (err) {
    console.error("Failed to fetch images:", err);
    gallery.innerHTML = "<p style='color:red;'>Error loading images</p>";
  }
});
