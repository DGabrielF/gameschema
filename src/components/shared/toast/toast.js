export const Toast = {
  self: document.querySelector(".toast"),
  title: document.querySelector(".toast h2"),
  message: document.querySelector(".toast span.message"),
  exit: document.querySelector(".toast button.close"),
  error: "error",
  success: "success",
};

Toast.open = (title, message, type) => {
  if (Toast.self.classList.contains("rise_animation")) {
    Toast.close();
  }
  if (type) {
    Toast.self.classList.add(type.toLowerCase());
    const images = Toast.self.querySelectorAll(".title img");
    for (const image of images) {
      image.src = `./src/assets/icons/general/${type}.svg`
    }
  }
  Toast.title.textContent = title.toUpperCase();
  Toast.message.textContent = message;
  Toast.self.classList.add("rise_animation");
  Toast.self.classList.remove("hide");
  Toast.self.addEventListener("animationend", () => {
    Toast.close();
    Toast.self.classList.remove(type.toLowerCase());
  }, {
    once: true
  });
};

Toast.close = () => {
  Toast.self.classList.remove("rise_animation");
  Toast.self.classList.add("hide");
};