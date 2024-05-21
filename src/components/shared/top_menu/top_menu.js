export const TopMenu = {};

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

export function attachEventsOnSectionMenuButtons() {
  const topMenuSectionButtons = document.querySelectorAll(".top_menu>[class$='_toggle']>[class*='_menu_dropdown']>*");
  for (const button of topMenuSectionButtons) {
    button.addEventListener("click", () => {
      switchPage(button.id);
      deactivateMenuButton(button.id);
      TopMenu.closeMenus();
    })
  }
}

function toggleMenu(className) {
  const dropdown = document.querySelector(`.${className}`);
  if (dropdown.classList.contains("hide")) {
    dropdown.classList.remove("hide")
  } else {
    dropdown.classList.add("hide")
  }
}

TopMenu.closeMenus = () => {
  const dropdowns = document.querySelectorAll(".top_menu [class$='_dropdown']");
  for (const dropdown of dropdowns) {
    if (!dropdown.classList.contains("hide")) {
      dropdown.classList.add("hide")
    }
  }
}

function switchPage(page) {
  const sectionList = document.querySelectorAll("section");
  for (const section of sectionList) {
    if (section.classList.contains(page)) {
      if (section.classList.contains("hide")) {
        section.classList.remove("hide");
      };
    } else {
      section.classList.add("hide");
    };
  };
}

function deactivateMenuButton(clickedButton) {
  const topMenuSectionButtons = document.querySelectorAll(".top_menu>[class$='_toggle']>[class*='_menu_dropdown']>*");
  for (const button of topMenuSectionButtons) {
    if (clickedButton === button.id) {
      button.disabled = true;
    } else {
      button.disabled = false;
    }
  }
}