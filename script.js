// Load wishes from JSON, preload images, then display
async function loadWishes() {
  try {
    const res = await fetch("wishes.json?nocache=" + Date.now());
    const wishes = await res.json();
    const wall = document.getElementById("wish-wall");
    wall.innerHTML = "";

    // 🔥 Step 1: Preload images
    const preloadPromises = wishes.map(wish => {
      return new Promise(resolve => {
        const img = new Image();
        img.src = wish.photo;
        img.onload = () => resolve({ ...wish, valid: true });
        img.onerror = () => resolve({ ...wish, valid: false });
      });
    });

    // Wait until all preloads finish
    const results = await Promise.all(preloadPromises);

    // 🔥 Step 2: Render instantly from cache
    results.forEach(wish => {
      const note = document.createElement("div");
      note.className = "note";

      const photoSrc = wish.valid
        ? wish.photo
        : "https://via.placeholder.com/300x200?text=No+Image";

      note.innerHTML = `
        <img src="${photoSrc}" alt="${wish.name}" loading="lazy">
        <p><strong>${wish.name}:</strong> ${wish.message}</p>
      `;

      wall.appendChild(note);
    });

  } catch (err) {
    console.error("Error loading wishes.json", err);
  }
}

// Confetti animation
function dropConfetti(amount = 25) {
  for (let i = 0; i < amount; i++) {
    const c = document.createElement("div");
    c.className = "confetti";
    c.style.left = Math.random() * 100 + "vw";
    c.style.backgroundColor = [
      "#ff4081", "#ffd740", "#69f0ae", "#40c4ff"
    ][Math.floor(Math.random() * 4)];
    c.style.animationDuration = (2 + Math.random() * 3) + "s";

    document.body.appendChild(c);
    setTimeout(() => c.remove(), 5000);
  }
}

// Overlay → start
window.onload = () => {
  const overlay = document.getElementById("overlay");
  const music = document.getElementById("bg-music");

  overlay.addEventListener("click", () => {
    overlay.style.display = "none";
    music.play().catch(() => console.log("Autoplay blocked"));
    dropConfetti(40);
    loadWishes();
  });
};
