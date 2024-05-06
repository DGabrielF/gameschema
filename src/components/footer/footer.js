export function attachEventsOnFooterIcons() {
  const footerLinks = document.querySelectorAll("footer img");
  for (const link of footerLinks) {
    link.addEventListener("click", () => externalLinks(link.id));
  }
}

function externalLinks(nameLink) {
  switch (nameLink) {
    case "portfolio":
      window.open("https://dgabrielf.github.io/danilo-ferreira/", "_blank")
      break;
    case "github":
      window.open("http://github.com/DGabrielF", "_blank")
      break;
    case "linkedin":
      window.open("https://www.linkedin.com/in/danilo-gabriel-ferreira-092457127/", "_blank")
      break;
    case "itchio":
      window.open("https://dgabrielf.itch.io/", "_blank")
      break;
  }
}