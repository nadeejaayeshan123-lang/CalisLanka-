const nav = document.getElementById("navLinks");
    const menuBtn = document.getElementById("menuBtn");

    if (menuBtn && nav) {
      menuBtn.addEventListener("click", () => nav.classList.toggle("open"));
    }

    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener("click", event => {
        const target = document.querySelector(link.getAttribute("href"));
        if (target) {
          event.preventDefault();
          target.scrollIntoView({ behavior: "smooth" });
        }
      });
    });

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .12 });

    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

// Appointment-page temporary frontend success state.
// This will be replaced/extended when the Django + PostgreSQL booking backend is connected.
const appointmentForm = document.getElementById("appointmentForm");
const formContent = document.getElementById("formContent");
const appointmentSuccess = document.getElementById("success");

if (appointmentForm && formContent && appointmentSuccess) {
  appointmentForm.addEventListener("submit", event => {
    event.preventDefault();
    formContent.style.display = "none";
    appointmentSuccess.classList.add("show");
  });
}
