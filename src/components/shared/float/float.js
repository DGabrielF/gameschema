import { Page } from "../../../scripts/engine/page.js";

export const FloatBox = {
  elements: [],
  load: () => {},
  open: () => {},
  close: () => {},
};

FloatBox.load = () => {
  FloatBox.elements  = findFloatBoxes();
  attachEventCloseFloatButton();
}

FloatBox.open = (page) => {
  FloatBox.close();
  for (const section of FloatBox.elements) {
    if (section.classList.contains(page)) {
      section.classList.remove("hide");
    }
  }
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
      Page.change("close");
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
