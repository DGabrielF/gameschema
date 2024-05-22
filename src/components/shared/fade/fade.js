import { FloatBox } from "../float/float.js";
import { TopMenu } from "../top_menu/top_menu.js";

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
    TopMenu.closeMenus();
    TopMenu.reactivateProfileMenuButtons()
    FloatBox.close();
    Fade.close();
  });
};