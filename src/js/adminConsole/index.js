import {setupButtonEvents} from "./buttons.js";
import {setupBadge} from "./badges.js";
import {setupLessons} from "./lessons.js";
import {lockToAdminAuth} from "./lockToAdminAuth.js";
import {setupUsers} from "./users.js";
import {loadTheme} from "../api/theme.js";


function init(){
    loadTheme()
    setupBadge();
    setupButtonEvents()
    setupLessons();
    lockToAdminAuth()
    setupUsers()
}

window.onload = init;