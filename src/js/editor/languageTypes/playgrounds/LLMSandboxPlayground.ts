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
                <div class="playground-rows">
                    <div class="playground-input">
                        <label for="provider">Provider</label>
                        <select name="provider" id="provider">
                          <option value="claude">Claude</option>
                          <option value="chatgpt">ChatGPT</option>
                          <option value="deepseek">DeepSeek</option>
                        </select>
                    </div>
                    <div class="playground-input">
                        <label for="temp">Temperature</label>
                        <input type="range" id="temp" name="temp" min="0" max="100" value="50" step="1">
                    </div>
                    <div class="playground-input">
                        <label for="provider">Provider</label>
                        <select name="provider" id="provider">
                          <option value="claude">Claude</option>
                          <option value="chatgpt">ChatGPT</option>
                          <option value="deepseek">DeepSeek</option>
                        </select>
                    </div>
                </div>
            <div>
        `;
    }
}

export {LLMSandboxPlayground};