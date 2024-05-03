export function attachEventsOnListMenu() {
  const listMenuToggleSpan = document.querySelector(".list_menu_toggle>span");
  listMenuToggleSpan.addEventListener("click", () => toggleMenu("list_menu_dropdown"));
  const listMenuToggleImg = document.querySelector(".list_menu_toggle>img");
  listMenuToggleImg.addEventListener("click", () => toggleMenu("list_menu_dropdown"));
}

export function attachEventsOnProfileMenu() {
  const listProfileToggleSpan = document.querySelector(".profile_menu_toggle>span");
  listProfileToggleSpan.addEventListener("click", () => toggleMenu("profile_menu_dropdown"));
  const listProfileToggleImg = document.querySelector(".profile_menu_toggle>img");
  listProfileToggleImg.addEventListener("click", () => toggleMenu("profile_menu_dropdown"));
}

function toggleMenu(className) {
  const dropdown = document.querySelector(`.${className}`);
  if (dropdown.classList.contains("hide")) {
    dropdown.classList.remove("hide")
  } else {
    dropdown.classList.add("hide")
  }
}