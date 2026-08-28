/* ==========================================================================
   Photography Portfolio — main.js
   Vanilla JS, no dependencies. Handles:
     1. Random hero image on the homepage
     2. Rendering each portfolio strip from its image list below
     3. Mouse-wheel → horizontal scroll on portfolio strip pages
     4. Centering the first image in the strip on page load
   ========================================================================== */

/* ---------- 1. Image manifest ----------
   This is the single source of truth for both portfolios: it controls the
   order photos appear in on portfolio-a.html / portfolio-b.html, AND which
   photos are eligible for the homepage's random hero image.

   To reorder photos: reorder the lines below.
   To add a photo: drop the file in the matching images/ folder and add a
   line here.
   To remove a photo: delete its line (leave the file in images/ if you
   might want it again). */

const PORTFOLIO_A_IMAGES = [
  "images/portfolio-a/a1.jpg",
  "images/portfolio-a/a2.jpg",
  "images/portfolio-a/a3.jpg",
  "images/portfolio-a/a4.jpg",
  "images/portfolio-a/a5.jpg",
  "images/portfolio-a/a6.jpg",
];

const PORTFOLIO_B_IMAGES = [
  "images/portfolio-b/b1.jpg",
  "images/portfolio-b/b2.jpg",
  "images/portfolio-b/b3.jpg",
];

document.addEventListener("DOMContentLoaded", () => {
  initHeroImage();
  renderStrip();
  initHorizontalScroll();
  initCenterFirstImage();
});

/* ---------- 2. Homepage hero ---------- */

function initHeroImage() {
  const heroImg = document.getElementById("hero-image");
  if (!heroImg) return; // Not on the homepage.

  const allImages = [...PORTFOLIO_A_IMAGES, ...PORTFOLIO_B_IMAGES];
  const randomSrc = allImages[Math.floor(Math.random() * allImages.length)];

  heroImg.addEventListener("load", () => heroImg.classList.add("is-loaded"));
  heroImg.src = randomSrc;
}

/* ---------- 3. Portfolio strip rendering ----------
   Builds the <img> tags for a portfolio page from the manifest above, in
   order. Which list to use comes from the data-portfolio attribute on the
   <div class="strip"> element in the page's HTML. */

function renderStrip() {
  const strip = document.querySelector(".strip[data-portfolio]");
  if (!strip) return; // Not on a portfolio page.

  const portfolio = strip.dataset.portfolio;
  const images = portfolio === "a" ? PORTFOLIO_A_IMAGES : PORTFOLIO_B_IMAGES;

  images.forEach((src, index) => {
    const img = document.createElement("img");
    img.className = "strip-image";
    img.src = src;
    img.alt = `Portfolio ${portfolio.toUpperCase()}, photo ${index + 1}`;
    strip.appendChild(img);
  });
}

/* ---------- 4. Portfolio horizontal scroll ----------
   The strip only overflows horizontally, but a mouse wheel / trackpad
   naturally scrolls vertically. This converts vertical wheel input into
   horizontal scrolling so visitors don't need to hold Shift. */

function initHorizontalScroll() {
  const wrapper = document.querySelector(".strip-wrapper");
  if (!wrapper) return; // Not on a portfolio page.

  wrapper.addEventListener(
    "wheel",
    (event) => {
      if (event.deltaY === 0) return;
      event.preventDefault();
      wrapper.scrollLeft += event.deltaY;
    },
    { passive: false }
  );
}

/* ---------- 5. Center the first image on load ----------
   The strip has generous padding on each side (see .strip in style.css) so
   any image — including the first and last — can be scrolled to the
   center of the screen. On load, jump straight to that centered position
   for the first image instead of resting at the padded, off-center start. */

function initCenterFirstImage() {
  const wrapper = document.querySelector(".strip-wrapper");
  const firstImage = document.querySelector(".strip-image");
  if (!wrapper || !firstImage) return; // Not on a portfolio page.

  const centerFirstImage = () => {
    const viewportCenter = wrapper.clientWidth / 2;
    const imageCenter = firstImage.offsetLeft + firstImage.offsetWidth / 2;
    wrapper.scrollLeft = imageCenter - viewportCenter;
  };

  // The image needs to finish loading before its width is known.
  if (firstImage.complete) {
    centerFirstImage();
  } else {
    firstImage.addEventListener("load", centerFirstImage);
  }
}
