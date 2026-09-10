document.addEventListener("DOMContentLoaded", () => {

  // 1. AUTOMATICALLY BUILD BANNER SLIDESHOW FROM LATEST GALLERY ITEMS
  function initAutoBanner() {
    const banner = document.getElementById("heroBanner");
    const galleryItems = document.querySelectorAll(".gallery-item");
    
    // Take up to 4 latest items from the top of the gallery grid
    const latestItems = Array.from(galleryItems).slice(0, 4);

    latestItems.forEach((item, index) => {
      const slide = document.createElement("div");
      slide.classList.add("slide");
      if (index === 0) slide.classList.add("active");

      const media = item.querySelector("img, video");
      if (media) {
        const clone = media.cloneNode(true);
        if (clone.tagName === "VIDEO") {
          clone.autoplay = true;
          clone.loop = true;
          clone.muted = true;
          clone.playsInline = true;
          clone.play().catch(() => {});
        }
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

  // 3. LIGHTBOX FULL VIEW WITH WATERMARK & RIGHT-CLICK PROTECTION
  const lightbox = document.getElementById("lightbox");
  const lightboxClose = document.getElementById("lightboxClose");
  const mediaContainer = document.getElementById("lightboxMediaContainer");

  galleryItems.forEach(item => {
    item.addEventListener("click", () => {
      const media = item.querySelector("img, video");
      if (!media) return;

      mediaContainer.innerHTML = "";
      const clone = media.cloneNode(true);
      if (clone.tagName === "VIDEO") clone.controls = true;

      // Prevent right-click on full view image/video to safeguard work
      clone.addEventListener("contextmenu", e => e.preventDefault());

      mediaContainer.appendChild(clone);
      lightbox.classList.add("active");
    });
  });

  lightboxClose.addEventListener("click", () => lightbox.classList.remove("active"));
  lightbox.addEventListener("click", e => {
    if (e.target === lightbox) lightbox.classList.remove("active");
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