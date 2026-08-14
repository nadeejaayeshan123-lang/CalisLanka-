const nav = document.getElementById("navLinks");
const menuBtn = document.getElementById("menuBtn");

if (menuBtn && nav) {
  menuBtn.addEventListener("click", () => {
    nav.classList.toggle("open");
  });
}


// ============================================================
// SMOOTH SCROLLING
// ============================================================

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", event => {
    const href = link.getAttribute("href");

    if (!href || href === "#") {
      return;
    }

    const target = document.querySelector(href);

    if (target) {
      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth"
      });
    }
  });
});


// ============================================================
// REVEAL ANIMATION
// ============================================================

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12
  }
);

document.querySelectorAll(".reveal").forEach(element => {
  observer.observe(element);
});


// ============================================================
// HOME STUDIO PHOTO POPUP
// ============================================================

const studioImages = Array.from(
  document.querySelectorAll(
    ".studio-seven-grid .studio-photo img"
  )
);

const studioPopup =
  document.getElementById("studioPopup");

const studioPopupImage =
  document.getElementById("studioPopupImage");

const studioPopupClose =
  document.getElementById("studioPopupClose");

const studioPopupPrev =
  document.getElementById("studioPopupPrev");

const studioPopupNext =
  document.getElementById("studioPopupNext");

const studioPopupCounter =
  document.getElementById("studioPopupCounter");

let studioCurrentIndex = 0;

let studioTouchStartX = 0;
let studioTouchEndX = 0;

let studioCloseTimer = null;


// ============================================================
// UPDATE POPUP IMAGE
// ============================================================

function updateStudioPopup() {

  if (
    !studioPopupImage ||
    studioImages.length === 0
  ) {
    return;
  }

  const image =
    studioImages[studioCurrentIndex];

  studioPopupImage.src =
    image.currentSrc || image.src;

  studioPopupImage.alt =
    image.alt || "CalisLanka studio photo";

  if (studioPopupCounter) {
    studioPopupCounter.textContent =
      `${studioCurrentIndex + 1} / ${studioImages.length}`;
  }
}


// ============================================================
// OPEN POPUP
// ============================================================

function openStudioPopup(index) {

  if (
    !studioPopup ||
    !studioPopupImage ||
    studioImages.length === 0
  ) {
    return;
  }

  if (studioCloseTimer) {
    clearTimeout(studioCloseTimer);
    studioCloseTimer = null;
  }

  studioCurrentIndex = index;

  updateStudioPopup();

  studioPopup.hidden = false;

  studioPopup.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.classList.add(
    "studio-popup-open"
  );

  studioPopup.classList.remove("is-open");

  void studioPopup.offsetWidth;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      studioPopup.classList.add("is-open");
    });
  });
}


// ============================================================
// CLOSE POPUP
// ============================================================

function closeStudioPopup() {

  if (!studioPopup) {
    return;
  }

  studioPopup.classList.remove("is-open");

  document.body.classList.remove(
    "studio-popup-open"
  );

  studioPopup.setAttribute(
    "aria-hidden",
    "true"
  );

  studioCloseTimer = setTimeout(() => {

    studioPopup.hidden = true;

    if (studioPopupImage) {
      studioPopupImage.src = "";
    }

    studioCloseTimer = null;

  }, 520);
}


// ============================================================
// NEXT IMAGE
// ============================================================

function showNextStudioImage() {

  if (studioImages.length === 0) {
    return;
  }

  studioCurrentIndex =
    (studioCurrentIndex + 1) %
    studioImages.length;

  updateStudioPopup();
}


// ============================================================
// PREVIOUS IMAGE
// ============================================================

function showPreviousStudioImage() {

  if (studioImages.length === 0) {
    return;
  }

  studioCurrentIndex =
    (
      studioCurrentIndex -
      1 +
      studioImages.length
    ) %
    studioImages.length;

  updateStudioPopup();
}


// ============================================================
// OPEN CLICKED PHOTO
// ============================================================

studioImages.forEach(
  (image, index) => {

    image.addEventListener(
      "click",
      () => {

        openStudioPopup(index);

      }
    );

  }
);


// ============================================================
// CLOSE BUTTON
// ============================================================

if (studioPopupClose) {

  studioPopupClose.addEventListener(
    "click",
    event => {

      event.stopPropagation();

      closeStudioPopup();

    }
  );

}


// ============================================================
// PREVIOUS BUTTON
// ============================================================

if (studioPopupPrev) {

  studioPopupPrev.addEventListener(
    "click",
    event => {

      event.stopPropagation();

      showPreviousStudioImage();

    }
  );

}


// ============================================================
// NEXT BUTTON
// ============================================================

if (studioPopupNext) {

  studioPopupNext.addEventListener(
    "click",
    event => {

      event.stopPropagation();

      showNextStudioImage();

    }
  );

}


// ============================================================
// CLICK OUTSIDE POPUP
// ============================================================

if (studioPopup) {

  studioPopup.addEventListener(
    "click",
    event => {

      if (event.target === studioPopup) {

        closeStudioPopup();

      }

    }
  );

}


// ============================================================
// KEYBOARD CONTROLS
// ============================================================

document.addEventListener(
  "keydown",
  event => {

    if (
      !studioPopup ||
      studioPopup.hidden
    ) {
      return;
    }

    if (event.key === "Escape") {

      closeStudioPopup();

    }

    if (event.key === "ArrowRight") {

      showNextStudioImage();

    }

    if (event.key === "ArrowLeft") {

      showPreviousStudioImage();

    }

  }
);


// ============================================================
// MOBILE SWIPE
// ============================================================

if (studioPopup) {

  studioPopup.addEventListener(
    "touchstart",
    event => {

      studioTouchStartX =
        event.changedTouches[0].clientX;

    },
    {
      passive: true
    }
  );


  studioPopup.addEventListener(
    "touchend",
    event => {

      studioTouchEndX =
        event.changedTouches[0].clientX;

      const difference =
        studioTouchEndX -
        studioTouchStartX;

      const minimumSwipeDistance = 50;

      if (
        difference <
        -minimumSwipeDistance
      ) {

        showNextStudioImage();

      }

      if (
        difference >
        minimumSwipeDistance
      ) {

        showPreviousStudioImage();

      }

    },
    {
      passive: true
    }
  );

}