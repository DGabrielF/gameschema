import { attachEventsOnFooterIcons } from "../components/footer/footer.js";
import { attachEventsOnListMenu, attachEventsOnProfileMenu, attachEventsOnSectionMenuButtons } from "../components/top_menu/top_menu.js"

function init() {
  attachEventsOnListMenu();
  attachEventsOnProfileMenu();
  attachEventsOnSectionMenuButtons()

  attachEventsOnFooterIcons()  
}

init()


