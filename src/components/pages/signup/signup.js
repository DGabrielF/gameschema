import { FireAuth } from "../../../scripts/services/firebase/auth.js";
import { Page } from "../../../scripts/services/engine/page.js";
import { State } from "../../../scripts/services/engine/state.js";
import { Toast } from "../../shared/toast/toast.js";

export const SignUp = {
  self: document.querySelector(".signup .box"),
  name: null,
  email: null,
  password: null,
  confirmPassord: null,
}

SignUp.load = () => {
  SignUp.name = SignUp.self.querySelector(".nickname");
  SignUp.email = SignUp.self.querySelector(".email");
  SignUp.password = SignUp.self.querySelector(".password");
  SignUp.confirmPassord = SignUp.self.querySelector(".confirm_pass");

  const btnRegister = SignUp.self.querySelector("button.register");
  btnRegister.addEventListener("click", () => SignUp.register())

  const btnEnter = SignUp.self.querySelector("button.enter");
  btnEnter.addEventListener("click", () => Page.change("signin"));
}

SignUp.register = async () => {
  const name = SignUp.name.value;
  const email = SignUp.email.value;
  const password = SignUp.password.value;

  const response = await FireAuth.signUp(email, password, name);
  if (typeof response === "string") {
    Toast.open("Erro", response, Toast.error);
    State.userUpdate(null);
  } else {
    Toast.open("Sucesso", "Estamos armazenando suas informações", Toast.success);
    State.userUpdate(response);
    Page.change("home");
  }
}