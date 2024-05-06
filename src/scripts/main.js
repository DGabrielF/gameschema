import { attachEventsOnFooterIcons } from "../components/footer/footer.js";
import { attachEventsOnListMenu, attachEventsOnProfileMenu, attachEventsOnSectionMenuButtons } from "../components/top_menu/top_menu.js"

function init() {
  // Top Menu
  attachEventsOnListMenu();
  attachEventsOnProfileMenu();
  attachEventsOnSectionMenuButtons()

  // Footer
  attachEventsOnFooterIcons()  
}

init()


