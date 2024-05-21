export const Page = {};

Page.change = (page) => {
  const sectionList = document.querySelectorAll("section");
  for (const section of sectionList) {
    if (section.classList.contains(page)) {
      if (section.classList.contains("hide")) {
        section.classList.remove("hide");
      };
    } else {
      section.classList.add("hide");
    };
  };
}