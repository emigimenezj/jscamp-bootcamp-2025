/* Aquí va la lógica para dar funcionalidad al botón de "Aplicar" */

let currentToast = null;

function showToast(message) {
  if (currentToast) {
    clearTimeout(currentToast.timeoutId);
    currentToast.element.remove();
    currentToast = null;
  }

  const toast = document.createElement("div");
  toast.classList.add("toast");
  toast.innerHTML = message;
  document.body.appendChild(toast);

  const timeoutId = setTimeout(() => {
    toast.classList.add("is-hiding");
    toast.addEventListener(
      "animationend",
      () => {
        toast.remove();
        currentToast = null;
      },
      { once: true },
    );
  }, 3000);

  currentToast = { element: toast, timeoutId };
}

document.querySelector(".jobs-listings").addEventListener("click", (event) => {
  if (event.target.classList.contains("button-apply-job")) {
    const { target } = event;
    target.classList.toggle("is-applied");
    target.textContent = "¡Aplicado!";

    const title = target
      .closest(".job-listing-card")
      .querySelector("h3").textContent;

    const titleHTML = `<strong class="toast-title">${title}</strong>`;
    showToast(`¡Has aplicado para «${titleHTML}»!`);
  }
});
