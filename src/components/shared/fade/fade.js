import { Page } from "../../../scripts/engine/page.js";

export const Fade = {
  self: document.querySelector(".fade"),
  load: () => {},
  open: () => {},
  close: () => {},
};

Fade.load = () => {
  attachEvent()
};

Fade.open = () => {
  Fade.self.classList.remove("hide");
};

Fade.close = () => {
  Fade.self.classList.add("hide");
};

function attachEvent() {
  Fade.self.addEventListener("click", () => {
    Page.change("close");
  });
};