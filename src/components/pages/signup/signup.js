import { FireAuth } from "../../../scripts/services/firebase/auth.js";
import { Page } from "../../../scripts/services/system/page.js";
import { Toast } from "../../shared/toast/toast.js";

export const SignUp = {
  self: document.querySelector(".signup .box"),
  nickname: null,
  email: null,
  password: null,
  confirmPassord: null,
}

SignUp.load = () => {
  SignUp.nickname = SignUp.self.querySelector(".nickname");
  SignUp.email = SignUp.self.querySelector(".email");
  SignUp.password = SignUp.self.querySelector(".password");
  SignUp.confirmPassord = SignUp.self.querySelector(".confirm_pass");

  const btnRegister = SignUp.self.querySelector("button.register");
  btnRegister.addEventListener("click", () => SignUp.register())

  const btnEnter = SignUp.self.querySelector("button.enter");
  btnEnter.addEventListener("click", () => Page.change("signin"));
}

SignUp.register = async () => {
  const email = SignUp.userOrEmail.value;
  const password = SignUp.password.value;

  const response = await FireAuth.signUp(email, password);
  if (typeof response === "string") {
    Toast.open("Erro", response, Toast.error);
    user = null;
  } else {
    Toast.open("Sucesso", "Estamos armazenando suas informações", Toast.success);
    user = response;
    Page.change("home")
  }
}