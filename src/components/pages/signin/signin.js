import { FireAuth } from "../../../scripts/services/firebase/auth.js";
import { Firestore } from "../../../scripts/services/firebase/firestore.js";
import { Page } from "../../../scripts/services/system/page.js";
import { State } from "../../../scripts/services/system/state.js";
import { Toast } from "../../shared/toast/toast.js";

export const SignIn = {
  self: document.querySelector(".signin .box"),
  userOrEmail: null,
  password: null,
}

SignIn.load = async () => {  
  SignIn.userOrEmail = SignIn.self.querySelector(".user_email");
  SignIn.password = SignIn.self.querySelector(".password");

  const btnEnter = SignIn.self.querySelector("button.enter");
  btnEnter.addEventListener("click", async () => SignIn.login());
  
  const btnRegister = SignIn.self.querySelector("button.register");
  btnRegister.addEventListener("click", () => Page.change("signup"));
  
  const btnGoogle = SignIn.self.querySelector(".google_signin");
  btnGoogle.addEventListener("click", async () => SignIn.googleSignin());
}

SignIn.login = async () => {
  const email = SignIn.userOrEmail.value;
  const password = SignIn.password.value;

  const response = await FireAuth.signIn(email, password);
  if (typeof response === "string") {
    Toast.open("Erro", response, Toast.error);
    await State.userUpdate(null);
  } else {
    Toast.open("Sucesso", "Preparando o jogo", Toast.success);
    const userData = await Firestore.fetchDocById("Users", response.uid);
    await State.userUpdate(userData);
    Page.change("home")
  }
}

SignIn.googleSignin = async () => {
  const response = await FireAuth.signInWithGoogle();
  if (typeof response === "string") {
    Toast.open("Erro", response, Toast.error);
    await State.userUpdate(null);
  } else {
    Toast.open("Sucesso", "Preparando o jogo", Toast.success);
    const userData = await Firestore.fetchDocById("Users", response.uid);
    await State.userUpdate(userData);
    Page.change("home")
  }
}