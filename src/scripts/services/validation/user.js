import { Dialog } from "../../../components/shared/dialog/dialog.js";
import { Toast } from "../../../components/shared/toast/toast.js";
import { Page } from "../../engine/page.js";
import { validationErrorMessage } from "./errors.js";

export const UserValidation = {
  unauthenticated: () => {},
  insufficientMoney: () => {},
  noCardWithToast: () => {},
  noCard: () => {},
};

UserValidation.unauthenticated = (uid) => {
  if (!uid) {
    Toast.open("Erro", validationErrorMessage["unauthenticated"], Toast.error);
    Dialog.close();
    Page.change("signin");
  }
  return uid;
}

UserValidation.insufficientMoney = (coins, neededCoins) => {
  const enoughCoins = (coins >= neededCoins);
  if (!enoughCoins) {
    Toast.open("Erro", validationErrorMessage["insufficientMoney"] + `Faltam P$ ${neededCoins - coins}`, Toast.error);
  }
  return enoughCoins;
}

UserValidation.noCardWithToast = (card, array) => {
  const foundCard = UserValidation.noCard(card, array);
  if (!foundCard) {
    Toast.open("Erro", validationErrorMessage["noCard"], Toast.error);
  }
  return foundCard 
}

UserValidation.noCard = (card, array) => {
  return array.find(item => item.id === card.id);
}