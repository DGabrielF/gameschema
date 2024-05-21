import { FireAuth } from "../../../scripts/services/firebase/auth.js";
import { Page } from "../../../scripts/services/system/page.js";
import { Toast } from "../../shared/toast/toast.js";

export const SignOut = {
  self: document.querySelector(".signout .box"),
}

SignOut.load = () => {
  const btnExit = SignOut.self.querySelector("button.exit");
  btnExit.addEventListener("click", async () => SignOut.exit())

  const btnCancel = SignOut.self.querySelector("button.cancel");
}

SignOut.exit = async () => {
  const response = await FireAuth.signOut()
  if (typeof response === "string") {
    Toast.open("Erro", response, Toast.error);
    user = null;
  } else {
    Toast.open("Sucesso", "Até mais", Toast.success);
    Page.change("home")
  }
}