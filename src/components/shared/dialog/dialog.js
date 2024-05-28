import { Fade } from "../fade/fade.js";

export const Dialog = {
  self: document.querySelector(".dialog"),
  open: () => {},
  close: () => {},
  update: () => {},
};
Dialog.load = () => {
  const closeElements = Dialog.self.querySelectorAll(".deny");
  for (const closeElement of closeElements) {
    closeElement.addEventListener("click", () => {
      Dialog.close();
    })
  }
}

Dialog.open = () => {
  Fade.open()
  Dialog.self.classList.remove("hide");
};

Dialog.close = () => {
  Fade.close()
  Dialog.self.classList.add("hide");
};

Dialog.handle = (identifier) => {
  const childrens = Dialog.self.querySelectorAll(':scope > *');
  for (const child of childrens) {
    if (child.classList.contains(identifier)) {
      child.classList.remove("hide");
    } else {
      if (!child.classList.contains("hide")) {
        child.classList.add("hide")
      }
    }
  }
};