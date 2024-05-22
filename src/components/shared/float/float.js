import { Fade } from "../fade/fade.js";
import { TopMenu } from "../top_menu/top_menu.js";

export const FloatBox = {
  elements: [],
  load: () => {},
  close: () => {},
};

FloatBox.load = () => {
  FloatBox.elements  = findFloatBoxes();
  attachEventCloseFloatButton()
}

FloatBox.close = () => {
  for (const section of FloatBox.elements) {
    if (section.classList.contains("float")) {
      section.classList.add("hide");
    }
  }
}

function attachEventCloseFloatButton() {
  for (const section of FloatBox.elements) {
    const btnClose = section.querySelector(".close");
    btnClose.addEventListener("click", () => {
      TopMenu.reactivateProfileMenuButtons();
      FloatBox.close();
      Fade.close()
    })
  }
}

function findFloatBoxes() {
  const array = [];
  const sectionList = document.querySelectorAll("section");
  for (const section of sectionList) {
    if (section.classList.contains("float")) {
      array.push(section);
    }
  }
  return array
}
