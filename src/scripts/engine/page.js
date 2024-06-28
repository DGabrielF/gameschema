import { SearchDuel } from "../../components/pages/duel/search.js";
import { Market } from "../../components/pages/market/market.js";
import { Dialog } from "../../components/shared/dialog/dialog.js";
import { Fade } from "../../components/shared/fade/fade.js";
import { FloatBox } from "../../components/shared/float/float.js";
import { TopMenu } from "../../components/shared/top_menu/top_menu.js";

export const Page = {
  topMenu: {
    items: {
      home: {
        menu: "list",
        online: true,
        offline: true,
        selected: true,
        float: false,
      },
      market: {
        menu: "list",
        online: true,
        offline: true,
        selected: false,
        float: false,
      },
      cards: {
        menu: "list",
        online: true,
        offline: false,
        selected: false,
        float: false,
      },
      pokedex: {
        menu: "list",
        online: true,
        offline: false,
        selected: false,
        float: false,
      },
      search_duel: {
        menu: "list",
        online: true,
        offline: false,
        selected: false,
        float: false,
      },
      ranking: {
        menu: "list",
        online: true,
        offline: true,
        selected: false,
        float: false,
      },
      signin: {
        menu: "profile",
        online: false,
        offline: true,
        selected: false,
        float: true
      },
      signup: {
        menu: "profile",
        online: false,
        offline: true,
        selected: false,
        float: true
      },
      profile: {
        menu: "profile",
        online: true,
        offline: false,
        selected: false,
        float: false,
      },
      account: {
        menu: "profile",
        online: true,
        offline: false,
        selected: false,
        float: false,
      },
      relationship: {
        menu: "profile",
        online: true,
        offline: false,
        selected: false,
        float: false,
      },
      settings: {
        menu: "profile",
        online: true,
        offline: true,
        selected: false,
        float: true
      },
      signout: {
        menu: "profile",
        online: true,
        offline: false,
        selected: false,
        float: true
      },
    },
  },
  content: {
    float: ["signin", "signup", "settings", "signout"],
    fixed: ["market", "cards", "pokedex", "search_duel", "ranking", "profile", "account", "relatioinship"]    
  },
  change: () => {},
  getSelectedMenuItems: () => {},
};

Page.change = (page) => {
  if (page === "close") {
    deselectFloatItems();
    TopMenu.deactivateMenuButton();
    FloatBox.close();
    Fade.close();
    Dialog.close();
    return;
  };

  const itemMenuFound = Page.topMenu.items[page]
  if (!itemMenuFound) return;

  deselectItemsFromMenu(Page.topMenu.items[page].menu);
  Page.topMenu.items[page].selected = true;
  
  if (Page.topMenu.items[page].float) {
    FloatBox.open(page);
    Fade.open();
  } else {
    FloatBox.close();
    Fade.close();
    deselectFloatItems();   
    showSection(page);
  }
  TopMenu.deactivateMenuButton();
  TopMenu.closeMenus();
}

Page.getSelectedMenuItems = () => {
  const array = [];
  for (const item in Page.topMenu.items) {
    if (Page.topMenu.items[item].selected) {
      array.push({id: item, ...Page.topMenu.items[item]})
    }
  }
  return array
}

function deselectItemsFromMenu(menuName) {
  for (const item in Page.topMenu.items) {
    if (Page.topMenu.items[item].menu === menuName) {
      Page.topMenu.items[item].selected = false
    }
  }
}

function deselectFloatItems() {
  for (const item in Page.topMenu.items) {
    if (Page.topMenu.items[item].float) {
      Page.topMenu.items[item].selected = false
    }
  }
}

function showSection(page) {
  const sectionList = document.querySelectorAll("section");
  for (const section of sectionList) {
    if (section.classList.contains(page)) {
      section.classList.remove("hide");
    } else {
      section.classList.add("hide");
    }    
  }
}

Page.showContent = (content, parentSection) => {
  const contentArea = parentSection.querySelector(`[class*='${parentSection.classList[0]}_content']`);

  const subsecions = contentArea.querySelectorAll(":scope > *")
  for (const subsecion of subsecions) {
    if (subsecion.classList.contains(content)) {
      subsecion.classList.remove("hide");
    } else {
      subsecion.classList.add("hide");
    }
  }

  if (parentSection.classList[0] === "market") {
    Market.fetchDataSubsecion(content);
  }
  
  if (parentSection.classList[0] === "search_duel") {
    SearchDuel.fetchDataSubsecion(content);
  }
}