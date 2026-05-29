import {initNavbar} from "../api/nav/navbar.js";
import {initBulk} from "./bulk.js";
import {initFeaturedBar} from "./featured.js";
import {loadTheme} from "../api/theme.js";

let projectDataHeap = [];

function init(){
    loadTheme()
    initNavbar()
    initFeaturedBar();
    initBulk();
}

window.onload = init;

export {projectDataHeap};