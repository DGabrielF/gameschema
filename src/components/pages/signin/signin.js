import { FireAuth } from "../../../scripts/services/firebase/auth.js";
import { Page } from "../../../scripts/services/system/page.js";
import { Toast } from "../../shared/toast/toast.js";

export const SignIn = {
  self: document.querySelector(".signin .box"),
  userOrEmail: null,
  password: null,
}

SignIn.load = () => {  
  SignIn.userOrEmail = SignIn.self.querySelector(".user_email");
  SignIn.password = SignIn.self.querySelector(".password");

  const btnEnter = SignIn.self.querySelector("button.enter");
  btnEnter.addEventListener("click", () => SignIn.login());
  
  const btnRegister = SignIn.self.querySelector("button.register");
  btnRegister.addEventListener("click", () => Page.change("signup"));
  
  const btnGoogle = SignIn.self.querySelector(".google_signin");
  btnGoogle.addEventListener("click", () => SignIn.googleLogin());
}

SignIn.login = async () => {
  const email = SignIn.userOrEmail.value;
  const password = SignIn.password.value;

  const response = await FireAuth.signIn(email, password);
  if (typeof response === "string") {
    Toast.open("Erro", response, Toast.error);
    user = null;
  } else {
    Toast.open("Sucesso", "Preparando o jogo", Toast.success);
    user = response;
  }
}

SignIn.googleLogin = async (user) => {
  const response = await FireAuth.signInWithGoogle();
  console.log(response)
  if (typeof response === "string") {
    Toast.open("Erro", response, Toast.error);
    user = null;
  } else {
    Toast.open("Sucesso", "Preparando o jogo", Toast.success);
    user = response;
    console.log(user)
    Page.change("home")
  }
}