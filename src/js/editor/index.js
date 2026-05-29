import {loadProjectFromUrlData} from "./load.js";
import {setupAutoSave} from "./save.js";
import {setupShareEvents} from "./share.js";
import {setupClosePopupEvent, setupScrollEvent} from "./steps.js";
import {initNavbar} from "../api/nav/navbar.js";
import {StepElement} from "../api/customElements.js";
import {ConsoleLogElement} from "../api/customElements.js";
import {loadTheme} from "../api/theme.js";
import {getAuthSessionToken} from "./utils/fileServerAPI.ts";

StepElement.register();
ConsoleLogElement.register();

function init(){
    loadTheme()
    initNavbar({
        collapsed:true,
        showCollapse:true,
    })
    loadProjectFromUrlData()
    setupAutoSave()
    setupShareEvents()
    setupScrollEvent()
    setupClosePopupEvent()
    getAuthSessionToken()
}

window.onload = init;