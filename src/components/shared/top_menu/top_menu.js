import { Page } from "../../../scripts/engine/page.js";
import { State } from "../../../scripts/engine/state.js";

export const TopMenu = {
  self: document.querySelector(".top_menu"),
  load: () => {},
  update: () => {},
  closeMenus: () => {},
  deactivateMenuButton: () => {},
};

TopMenu.load = () => {
  attachEventsOnMenus();
  attachEventsOnSectionMenuButtons();

  TopMenu.update()
};

TopMenu.update = () => {
  const name = TopMenu.self.querySelector("span.name");
  name.textContent = State.user.name;
  
  const topMenuSectionButtons = document.querySelectorAll(".top_menu>[class$='_toggle']>[class*='_menu_dropdown']>*");
  for (const button of topMenuSectionButtons) {
    const isOnline = !!State.user.uid
    const isAnOnlineItem = Page.topMenu.items[button.id].online;
    const isAnOfflineItem = Page.topMenu.items[button.id].offline;
    if (isOnline && isAnOnlineItem || !isOnline && isAnOfflineItem) {
      button.classList.remove("hide");
    } else {
      button.classList.add("hide");
    }
  }

}

TopMenu.closeMenus = () => {
  const dropdowns = document.querySelectorAll(".top_menu [class$='_dropdown']");
  for (const dropdown of dropdowns) {
    if (!dropdown.classList.contains("hide")) {
      dropdown.classList.add("hide");
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
  const topMenuSectionButtons = TopMenu.self.querySelectorAll("[class$='_toggle']>[class*='_menu_dropdown']>*");
  for (const button of topMenuSectionButtons) {
    button.addEventListener("click", () => {
      Page.change(button.id);
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

TopMenu.deactivateMenuButton = () => {
  const topMenuSectionButtons = document.querySelectorAll(".top_menu>[class$='_toggle']>[class*='_menu_dropdown']>*");
  for (const button of topMenuSectionButtons) {
    const selectedButtons = Page.getSelectedMenuItems();
    if (selectedButtons.find(item => item.id === button.id)) {
      button.disabled = true;
    } else {
      button.disabled = false;
    }
  }
}

