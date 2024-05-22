import { attachEventsOnFooterIcons } from "../components/shared/footer/footer.js";
import { TopMenu } from "../components/shared/top_menu/top_menu.js"
import { PasswordInput } from "../components/shared/inputs/password_input.js";
import { Toast } from "../components/shared/toast/toast.js";
import { SignIn } from "../components/pages/signin/signin.js";
import { SignUp } from "../components/pages/signup/signup.js";
import { SignOut } from "../components/pages/signout/signout.js";
import { State } from "./services/engine/state.js";

async function init() {
  State.userUpdate();
  TopMenu.load();
  await SignIn.load();
  await SignUp.load();
  await SignOut.load();

  // Footer
  attachEventsOnFooterIcons();

  PasswordInput.attachToggleEventAtIcons()

  const testButton = document.querySelector("#teste");
  testButton.addEventListener("click", () => {
    console.log(State.user)
  })

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
