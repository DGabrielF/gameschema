import { Page } from "../../../scripts/services/system/page.js";

export const TopMenu = {
  self: document.querySelector(".top_menu"),
};

TopMenu.load = () => {
  attachEventsOnMenus();
  attachEventsOnSectionMenuButtons();
};

TopMenu.closeMenus = () => {
  const dropdowns = document.querySelectorAll(".top_menu [class$='_dropdown']");
  for (const dropdown of dropdowns) {
    if (!dropdown.classList.contains("hide")) {
      dropdown.classList.add("hide")
    }
  }
}

function attachEventsOnMenus () {
  const menus = TopMenu.self.querySelectorAll("[class*='menu_toggle']");
  for (const menu of menus) {
    const text = menu.querySelector("span");
    text.addEventListener("click", (event) => toggleMenu(event));
    const icon = menu.querySelector("img");
    icon.addEventListener("click", (event) => toggleMenu(event));
  }
};

function attachEventsOnSectionMenuButtons () {
  const topMenuSectionButtons = document.querySelectorAll(".top_menu>[class$='_toggle']>[class*='_menu_dropdown']>*");
  for (const button of topMenuSectionButtons) {
    button.addEventListener("click", () => {
      Page.change(button.id);
      deactivateMenuButton(button.id);
      TopMenu.closeMenus();
    })
  }
}

function toggleMenu(event) {
  const dropdown = event.target.parentNode.querySelector("nav");
  if (dropdown.classList.contains("hide")) {
    TopMenu.closeMenus();
    dropdown.classList.remove("hide");
  } else {
    TopMenu.closeMenus();
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