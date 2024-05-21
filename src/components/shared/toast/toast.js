export const Toast = {
  self: document.querySelector(".toast"),
  title: document.querySelector(".toast h2"),
  message: document.querySelector(".toast span.message"),
  exit: document.querySelector(".toast button.close"),
};

Toast.open = (title, message, type) => {
  if (type) {
    Toast.self.classList.add(type.toLowerCase());
    const images = Toast.self.querySelectorAll("img");
    for (const image of images) {
      image.src = ``
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