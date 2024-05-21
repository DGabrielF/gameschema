import { attachEventsOnFooterIcons } from "../components/footer/footer.js";
import { attachEventsOnListMenu, attachEventsOnProfileMenu, attachEventsOnSectionMenuButtons } from "../components/top_menu/top_menu.js"
import { PasswordInput } from "./components/password_input.js";

function init() {
  // Top Menu
  attachEventsOnListMenu();
  attachEventsOnProfileMenu();
  attachEventsOnSectionMenuButtons();

  // Footer
  attachEventsOnFooterIcons();

  PasswordInput.attachToggleEventAtIcons()

  const inputs = document.querySelectorAll('input');

  for (const input of inputs) {
    const placeholderSpan = input.parentElement.querySelector("[class*='placeholder']")
    if (placeholderSpan) {
      let placeholderText;
      input.addEventListener('focus', () => {
        placeholderSpan.classList.remove('hide');
        placeholderText = input.placeholder
        input.placeholder = ""
      });
      input.addEventListener('blur', function() {
        placeholderSpan.classList.add('hide');
        input.placeholder = placeholderText
      });
    }
  }
}

init()
