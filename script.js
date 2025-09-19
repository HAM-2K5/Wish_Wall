async function loadWishes() {
  try {
    const res = await fetch("wishes.json?nocache=" + Date.now());
    const wishes = await res.json();
    const wall = document.getElementById("wish-wall");
    wall.innerHTML = "";

    wishes.forEach(wish => {
      const note = document.createElement("div");
      note.className = "note";

      // Photo + message below
      note.innerHTML = `
        <img src="${wish.photo}" alt="${wish.name}" 
             onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
        <p>${wish.message}</p>
      `;

      wall.appendChild(note);
    });
  } catch (err) {
    console.error("Error loading wishes.json", err);
  }
}

// Confetti
function dropConfetti(amount = 25) {
  for (let i = 0; i < amount; i++) {
    const c = document.createElement("div");
    c.className = "confetti";
    c.style.left = Math.random() * 100 + "vw";
    c.style.backgroundColor = ["#ff4081", "#ffd740", "#69f0ae", "#40c4ff"][Math.floor(Math.random() * 4)];
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
