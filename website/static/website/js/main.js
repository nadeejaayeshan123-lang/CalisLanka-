const nav = document.getElementById("navLinks");
const menuBtn = document.getElementById("menuBtn");

if (menuBtn && nav) {
  menuBtn.addEventListener("click", () => {
    nav.classList.toggle("open");
  });
}


// Smooth scrolling for internal page links
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", event => {

    const target = document.querySelector(
      link.getAttribute("href")
    );

    if (target) {
      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth"
      });
    }

  });
});


// Reveal animation
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