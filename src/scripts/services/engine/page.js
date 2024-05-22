export const Page = {
  topMenu: {
    list:{
      online: ["market", "cards", "pokedex", "duel", "ranking"],
      offline: ["market", "ranking"]
    },
    profile: {
      online: ["profile", "account", "relatioinship", "settings", "signout"],
      offline: ["signin", "signup", "setting"]
    }
  }
};

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