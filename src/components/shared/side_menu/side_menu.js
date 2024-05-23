import { Page } from "../../../scripts/engine/page.js";

export const SideMenu = {
  optionButtons: document.querySelectorAll(".side_menu .side_menu_options button"),
  load: () => {},
};

SideMenu.load = () => {
  loadToggleButton();
  findOptionButtons();
}

function loadToggleButton() {
  const toggleSideMenuButtons = document.querySelectorAll(".side_menu .toggle_side_menu");

  for (const button of toggleSideMenuButtons) {
    button.addEventListener("click", (event) => {
      toggleImageButton(event);
      toggleMenuContent(event);
    })
  }
};

function toggleMenuContent(event) {
  const parentMenu = event.target.closest(".side_menu");
  const matchingContent = parentMenu.querySelector(".side_menu_content");
  if (matchingContent.classList.contains("hide")) {
    matchingContent.classList.remove("hide");
  } else {
    matchingContent.classList.add("hide");
  }
}

function toggleImageButton(event) {
  let buttonImage = event.target
  if (buttonImage.tagName.toLowerCase() === "button") {
    buttonImage = buttonImage.querySelector("img");
  }
  if (buttonImage.classList.contains("left")) {
    buttonImage.classList.remove("left");
    buttonImage.classList.add("right");
  } else {
    buttonImage.classList.add("left");
    buttonImage.classList.remove("right");
  }
  buttonImage.classList.add("rotate");
  buttonImage.addEventListener("animationend", () => {
    buttonImage.classList.remove("rotate");
  })
}

function findOptionButtons() {
  for (const button of SideMenu.optionButtons) {
    button.addEventListener("click", () => {
      Page.showContent(button.id, button.closest("section"))
      ableAllOptionButtons()
      button.disabled = true;
    })
  }
}

function ableAllOptionButtons() {
  for (const button of SideMenu.optionButtons) {
    button.disabled = false;
  }
}