document.addEventListener("DOMContentLoaded", () => {

  // 1. AUTOMATICALLY BUILD BANNER SLIDESHOW FROM LATEST GALLERY ITEMS
  function initAutoBanner() {
    const banner = document.getElementById("heroBanner");
    const galleryItems = document.querySelectorAll(".gallery-item");
    
    // Exclude YouTube/video links so only images populate the banner
    const latestItems = Array.from(galleryItems)
      .filter(item => !item.hasAttribute('data-youtube'))
      .slice(0, 4);

    latestItems.forEach((item, index) => {
      const slide = document.createElement("div");
      slide.classList.add("slide");
      if (index === 0) slide.classList.add("active");

      const media = item.querySelector("img");
      if (media) {
        const clone = media.cloneNode(true);
        slide.appendChild(clone);
        banner.appendChild(slide);
      }
    });

    // Slideshow crossfade rotation loop (every 6 seconds)
    const slides = banner.querySelectorAll(".slide");
    if (slides.length > 1) {
      let current = 0;
      setInterval(() => {
        slides[current].classList.remove("active");
        current = (current + 1) % slides.length;
        slides[current].classList.add("active");
      }, 6000);
    }
  }

  // 2. FILTERING LOGIC
  const filterBtns = document.querySelectorAll(".tab-btn");
  const galleryItems = document.querySelectorAll(".gallery-item");

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const category = btn.getAttribute("data-filter");

      galleryItems.forEach(item => {
        if (category === "all" || item.classList.contains(category)) {
          item.style.display = "block";
        } else {
          item.style.display = "none";
        }
      });
    });
  });

  // 3. LIGHTBOX FULL VIEW, YOUTUBE & NAVIGATION LOGIC
  const lightbox = document.getElementById("lightbox");
  const lightboxClose = document.getElementById("lightboxClose");
  const mediaContainer = document.getElementById("lightboxMediaContainer");
  const prevBtn = document.querySelector(".lightbox-prev");
  const nextBtn = document.querySelector(".lightbox-next");
  
  let currentIndex = 0;
  let visibleItems = [];

  function openLightbox(index) {
    if (visibleItems.length === 0) return;
    currentIndex = index;
    const item = visibleItems[currentIndex];
    
    mediaContainer.innerHTML = ""; // Clears existing content
    
    // Check if it's a YouTube link
    if (item.hasAttribute("data-youtube")) {
      let ytId = item.getAttribute("data-youtube");
      
      // Auto-extract ID if user pastes a full URL (including Shorts)
      const match = ytId.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
      if (match && match[1]) {
        ytId = match[1];
      }

      mediaContainer.innerHTML = `<iframe src="https://www.youtube.com/embed/${ytId}?autoplay=1" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe>`;
    } else {
      const media = item.querySelector("img");
      if (media) {
        const clone = media.cloneNode(true);
        clone.addEventListener("contextmenu", e => e.preventDefault());
        mediaContainer.appendChild(clone);
      }
    }
    lightbox.classList.add("active");
  }

  galleryItems.forEach(item => {
    item.addEventListener("click", () => {
      // Build a navigation array excluding filtered-out items
      visibleItems = Array.from(galleryItems).filter(i => i.style.display !== "none");
      const index = visibleItems.indexOf(item);
      openLightbox(index);
    });
  });

  prevBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (currentIndex > 0) openLightbox(currentIndex - 1);
    else openLightbox(visibleItems.length - 1); // Loop to end
  });

  nextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (currentIndex < visibleItems.length - 1) openLightbox(currentIndex + 1);
    else openLightbox(0); // Loop to start
  });

  lightboxClose.addEventListener("click", () => {
    lightbox.classList.remove("active");
    mediaContainer.innerHTML = ""; // Drops the iframe so background audio stops
  });
  
  lightbox.addEventListener("click", e => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-content-wrapper')) {
      lightbox.classList.remove("active");
      mediaContainer.innerHTML = "";
    }
  });

  // 4. DUPLICATE MARQUEE REVIEWS FOR INFINITE HORIZONTAL LOOP
  const marqueeTrack = document.querySelector(".marquee-track");
  if (marqueeTrack) {
    const clone = marqueeTrack.innerHTML;
    marqueeTrack.innerHTML += clone; // Duplicates items for smooth looping
  }

  // Initialize Hero Banner
  initAutoBanner();
});