export const PasswordInput = {};

PasswordInput.attachToggleEventAtIcons = () => {
  const icons = document.querySelectorAll(".password_input img");
  for (const icon of icons) {
    icon.addEventListener("click", (event) => {
      PasswordInput.toggleType(event)
    })
  }
};

PasswordInput.toggleType = (event) => {
  const image = event.target;
  const inputDiv = image.parentNode;
  const input = inputDiv.querySelector("input");
  if (input.type === "password") {
    input.type = "text";
    image.src = "./src/assets/icons/general/eye-closed.svg";
  } else if (input.type === "text") {
    input.type = "password";
    image.src = "./src/assets/icons/general/eye-opened.svg";
  }
};