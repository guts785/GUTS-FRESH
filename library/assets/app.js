document.addEventListener("DOMContentLoaded", () => {

  /* ==========================
     MUSIC — playlist from local MP3s
     Main track "LQLAWI" preloaded, starts muted
  ========================== */
  const musicBtn = document.getElementById("musicBtn");
  const nextBtn = document.getElementById("musicNextBtn");
  const chaabi = document.getElementById("chaabiPlayer");
  const playlistDropdown = document.getElementById("playlistDropdown");
  const playlistItems = document.querySelectorAll(".playlist-item");

  chaabi.volume = 0.5;

  const playlist = [
    { file: "assets/audio/pmaoWC_Hxj4.mp3", title: "LQLAWI" },
    { file: "assets/audio/wqh9GKAtZzo.mp3", title: "Go Slowly" },
    { file: "assets/audio/zXhLFb34nz4.mp3", title: "In A Manner Of Speaking" },
    { file: "assets/audio/UwIN9gIFsys.mp3", title: "This Is Who I Am" }
  ];

  let currentTrack = 0;
  let playing = false;
  musicBtn.textContent = "🔇";

  function highlightCurrent() {
    playlistItems.forEach((item, i) => {
      item.classList.toggle("active-track", i === currentTrack);
    });
  }

  function loadTrack(index) {
    if (index < 0 || index >= playlist.length) return;
    currentTrack = index;
    chaabi.src = playlist[currentTrack].file;
    chaabi.load();
    highlightCurrent();
  }

  function playIndex(index) {
    loadTrack(index);
    chaabi.play().then(() => {
      musicBtn.textContent = "🎶";
      playing = true;
    }).catch(() => {});
  }

  function togglePlay() {
    if (!chaabi.src || chaabi.src === window.location.href) {
      playIndex(0);
      return;
    }
    if (playing) {
      chaabi.pause();
      musicBtn.textContent = "🔇";
      playing = false;
    } else {
      chaabi.play().then(() => {
        musicBtn.textContent = "🎶";
        playing = true;
      }).catch(() => {});
    }
  }

  // Auto-advance to next track
  chaabi.addEventListener("ended", () => {
    const next = (currentTrack + 1) % playlist.length;
    playIndex(next);
  });

  // Preload main track (LQLAWI) on page load
  loadTrack(0);

  // Music button: toggle play/pause
  musicBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    togglePlay();
  });

  // Next button: show/hide playlist dropdown
  nextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = playlistDropdown.style.display === "block";
    playlistDropdown.style.display = isOpen ? "none" : "block";
    highlightCurrent();
  });

  // Click playlist items to switch tracks
  playlistDropdown.addEventListener("click", (e) => {
    const item = e.target.closest(".playlist-item");
    if (!item) return;
    const idx = parseInt(item.dataset.track);
    playIndex(idx);
    playlistDropdown.style.display = "none";
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", () => {
    playlistDropdown.style.display = "none";
  });

  /* ==========================
     LOADING SCREEN
  ========================== */
  setTimeout(() => {
    document.getElementById('loadingScreen').style.display = 'none';
  }, 3000);

  /* ==========================
     CURSOR STICKER TRAIL
  ========================== */
  const cursorSticker = document.getElementById('cursorSticker');
  let cx = 0, cy = 0;
  let lx = 0, ly = 0;

  document.addEventListener('mousemove', (e) => {
    cx = e.clientX;
    cy = e.clientY;
  });

  function followLoop() {
    lx += (cx - lx) * 0.15;
    ly += (cy - ly) * 0.15;
    cursorSticker.style.left = lx + 'px';
    cursorSticker.style.top = ly + 'px';
    requestAnimationFrame(followLoop);
  }
  followLoop();

  /* ==========================
     TOXIC POPUPS
  ========================== */
  setInterval(() => {
    const msgs = [
      "طبن", "db hada tajine?", "وا لخدمة هه", "هاني جاي",
      "سير قلب مزيان", "😹🔥💀", "شكون نتا؟ 🤨", "قلبها قلبها 🔥"
    ];
    const div = document.createElement('div');
    div.className = 'popup-msg';
    div.textContent = msgs[Math.floor(Math.random() * msgs.length)];
    document.getElementById('popupContainer').appendChild(div);
    setTimeout(() => div.remove(), 3000);
  }, 5000);

  /* ==========================
     SCROLL TILT
     Disabled to avoid mobile stretch issues
  ========================== */
  // window.addEventListener('scroll', () => {
  //   const tilt = window.scrollY * 0.03;
  //   document.body.style.transform = `rotateX(${tilt}deg)`;
  // });

  /* ==========================
     CATEGORY FILTER
  ========================== */
  document.getElementById('categoryBar').addEventListener('click', (e) => {
    if (!e.target.classList.contains('cat-btn')) return;

    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');

    const cat = e.target.dataset.cat;
    document.querySelectorAll('.book').forEach(b => {
      if (cat === 'all' || b.dataset.cat.includes(cat)) {
        b.style.display = 'flex';
      } else {
        b.style.display = 'none';
      }
    });
  });

  /* ==========================
     PDF MODAL
  ========================== */
  const pdfModal = document.getElementById("pdfModal");
  const pdfViewer = document.getElementById("pdfViewer");
  const closePdf = document.getElementById("closePdf");
  const pdfBackdrop = document.getElementById("pdfBackdrop");

  function openPdf(file) {
    pdfViewer.src = file;
    pdfModal.style.display = "flex";
  }

  function closePdfModal() {
    pdfModal.style.display = "none";
    pdfViewer.src = "";
  }

  /* ==========================
     INCOMING CALL OVERLAY
     When user tries to open a book -> show calling sticker + accept/decline
     ========================== */
  const callOverlay = document.getElementById('callOverlay');
  const callAccept = document.getElementById('callAccept');
  const callDecline = document.getElementById('callDecline');
  let acceptedCall = null;

  document.getElementById('booksContainer').addEventListener('click', e => {
    const readBtn = e.target.closest('.read-btn');
    const coverWrap = e.target.closest('.cover-wrap');

    if (readBtn || coverWrap) {
      let file = null;
      if (readBtn) file = readBtn.dataset.file;
      if (coverWrap) {
        const book = coverWrap.closest('.book');
        const btn = book && book.querySelector('.read-btn');
        if (btn) file = btn.dataset.file;
      }
      if (!file) return;

      acceptedCall = file;
      callOverlay.classList.add('active');
    }
  });

  callAccept.addEventListener('click', () => {
    callOverlay.classList.remove('active');
    if (acceptedCall) openPdf(acceptedCall);
    acceptedCall = null;
  });

  callDecline.addEventListener('click', () => {
    callOverlay.classList.remove('active');
    acceptedCall = null;
  });


  closePdf.addEventListener("click", closePdfModal);
  pdfBackdrop.addEventListener("click", closePdfModal);

  /* ==========================
     SEARCH FILTER
  ========================== */
  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", () => {
    const q = searchInput.value.toLowerCase();
    document.querySelectorAll('.book').forEach(b => {
      const text = b.innerText.toLowerCase();
      b.style.display = text.includes(q) ? 'flex' : 'none';
    });
  });

  /* ==========================
     RANDOM BOOK BUTTON
  ========================== */
  document.getElementById("randomBtn").addEventListener("click", () => {
    const books = document.querySelectorAll('.book');
    if (books.length === 0) return;
    const randomBook = books[Math.floor(Math.random() * books.length)];
    const readBtn = randomBook.querySelector('.read-btn');
    if (readBtn) openPdf(readBtn.dataset.file);
  });

  /* ==========================
     FIRE TRAIL
  ========================== */
  document.addEventListener("mousemove", e => {
    const dot = document.createElement("div");
    dot.className = "fire-dot";
    dot.style.left = e.pageX + "px";
    dot.style.top = e.pageY + "px";
    document.body.appendChild(dot);
    setTimeout(() => dot.remove(), 400);
  });

});

/* ==========================
   MATRIX RAIN BACKGROUND
   Full heavy hacker rain
========================== */
const canvas = document.getElementById("matrixCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const letters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%^&*()ｦｧｨｩｪｫｬｭｮｯ".split("");
const fontSize = 16;
const columns = canvas.width / fontSize;
let drops = [];

for (let i = 0; i < columns; i++) drops[i] = 1;

function drawMatrix() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#00FF41";
  ctx.font = fontSize + "px monospace";

  for (let i = 0; i < drops.length; i++) {
    const text = letters[Math.floor(Math.random() * letters.length)];
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}
setInterval(drawMatrix, 33);

/* Resize handler */
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
