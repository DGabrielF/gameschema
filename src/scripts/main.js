import { attachEventsOnFooterIcons } from "../components/shared/footer/footer.js";
import { TopMenu } from "../components/shared/top_menu/top_menu.js"
import { PasswordInput } from "../components/shared/inputs/password_input.js";
import { Toast } from "../components/shared/toast/toast.js";
import { SignIn } from "../components/pages/signin/signin.js";

export const state = {
  user: {
    uid: null,
    name: "Anônimo",
  }
};


function init() {
  TopMenu.load();
  SignIn.load()

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
        placeholderText = input.placeholder;
        input.placeholder = ""
      });
      input.addEventListener('blur', function() {
        placeholderSpan.classList.add('hide');
        input.placeholder = placeholderText;
      });
    }
  }
}

init()
