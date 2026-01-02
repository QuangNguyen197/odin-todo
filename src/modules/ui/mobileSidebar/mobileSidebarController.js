const burgerButton = document.querySelector(".dropdown-btn-container");
const sideBar = document.querySelector(".side-bar");

export function initializeMobileMenuListeners() {
  burgerButton.addEventListener("click", () => {
    changeSidebarVisibility();
  });

  sideBar.addEventListener("click", (event) => {
    const closeBtn = event.target.closest("button");

    if (!closeBtn) {
      return;
    }

    if (closeBtn.classList.contains("close-btn")) {
      sideBar.classList.remove("open");
    }
  });
}

function changeSidebarVisibility() {
  sideBar.classList.contains("open")
    ? sideBar.classList.remove("open")
    : sideBar.classList.add("open");
}
