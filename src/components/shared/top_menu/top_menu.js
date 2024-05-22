import { Page } from "../../../scripts/engine/page.js";
import { State } from "../../../scripts/engine/state.js";

export const TopMenu = {
  self: document.querySelector(".top_menu"),
  load: () => {},
  update: () => {},
  closeMenus: () => {},
  reactivateProfileMenuButtons: () => {},
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
    const isOnline = State.user.uid ? "online" : "offline"
    const isAnListItem = Page.topMenu.list[isOnline].includes(button.id);
    const isAnProfilteItem = Page.topMenu.profile[isOnline].includes(button.id);
    if (isAnListItem || isAnProfilteItem) {
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

TopMenu.reactivateProfileMenuButtons = () => {
  const topMenuSectionButtons = document.querySelectorAll(".top_menu>.profile_menu_toggle>[class*='_menu_dropdown']>*");
  for (const button of topMenuSectionButtons) {
    button.disabled = false;    
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

