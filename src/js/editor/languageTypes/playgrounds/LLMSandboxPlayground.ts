import {PlaygroundType} from "@js/editor/languageTypes/playground";
import {ProjectType, RunErrCallback} from "@js/editor/languageTypes/projectType";
import {Language} from "@js/editor/codeEditor";
import {makeRequest} from "@js/editor/utils/cloudAgentAPI";

class LLMSandboxPlayground extends PlaygroundType{
    static identifier = "llmsandbox"
    constructor() {
        super();
    }

    getPlaygroundContent():string {
        return `
            <div class="playground-title">LLM Sandbox</div>
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
                    <div class="playground-input playground-slider">
                        <label for="temp">Temperature</label>
                        <div>
                            <input type="range" id="temp" name="temp" min="0.0" max="2.0" value=".7" step=".0Kst1">
                            <span>.7</span>
                        </div>
                    </div>
                </div>
                <div class="playground-sep"></div>
                <div class="playground-input">
                    <textarea id="text-input" name="text-input" rows="4" cols="50" placeholder="Type your message here..."></textarea>
                </div>
            </div>
            <div class="playground-section">
                <div class="playground-ai-text">
                    <div class="playground-placeholder-text">AI response will show up here</div>
                </div>
            </div>
            <div class="playground-section">    
                <div class="playground-button playground-run-trigger">Send</div>
            </div>
        `;
    }

    onRunTrigger() {
        this.makeRequest("/ai/generate","POST",{
            provider:this.getInput("provider"),
            temperature:this.getInput("temp"),
            user_prompt:this.getInput("text-input"),
            system_prompt:"You are a personal ai assistant, you are interacting with children, respond appropriately and accordingly given the users age.",
        }).then(res=>{
            if(res.ok){
                let result = res.json();
            }
        })
    }
}

export {LLMSandboxPlayground};