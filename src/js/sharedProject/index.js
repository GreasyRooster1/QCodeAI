import {initNavbar} from "../api/nav/navbar.js";
import {loadProject, setupFrame} from "./project.js";
import {initTabs} from "./tabs.js";
import {initRemix} from "./remix.js";
import {loadTheme} from "../api/theme.js";

function init(){
    loadTheme()
    initNavbar()
    initTabs();
    setupFrame();
    loadProject();
    initRemix();
}


init();