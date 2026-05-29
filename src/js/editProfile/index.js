import {loadTheme} from "../api/theme.js";
import {lockPageToAuth} from "../api/util/lockPageToAuth.js";
import {initNavbar} from "../api/nav/navbar.js";
import {loadUserData} from "./load.js";

function init() {
    loadTheme()
    lockPageToAuth()

    initNavbar({
        showCollapse:false
    })

    loadUserData()
}

window.onload=init