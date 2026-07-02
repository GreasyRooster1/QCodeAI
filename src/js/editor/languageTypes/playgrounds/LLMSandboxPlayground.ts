import {PlaygroundType} from "@js/editor/languageTypes/playground";
import {ProjectType, RunErrCallback} from "@js/editor/languageTypes/projectType";
import {Language} from "@js/editor/codeEditor";

class LLMSandboxPlayground extends PlaygroundType{
    static identifier = "llmsandbox"
    constructor() {
        super();
    }

    getPlaygroundContent():string {
        return `
            <div class="playground-section">
                test
            <div>
        `;
    }
}

export {LLMSandboxPlayground};