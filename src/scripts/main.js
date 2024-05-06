import { externalLinks } from "../components/footer/footer.js";
import { attachEventsOnListMenu, attachEventsOnProfileMenu, attachEventsOnSectionMenuButtons } from "../components/top_menu/top_menu.js"

function init() {
  attachEventsOnListMenu();
  attachEventsOnProfileMenu();
  attachEventsOnSectionMenuButtons()

  const footerLinks = document.querySelectorAll("footer img");
  for (const link of footerLinks) {
    link.addEventListener("click", () => externalLinks(link.id));
  }

  

  
}

init()


