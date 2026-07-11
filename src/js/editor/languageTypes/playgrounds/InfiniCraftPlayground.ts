import {PlaygroundType, SAFETY_SYS_PROMPT} from "@js/editor/languageTypes/playground";
import {ProjectType, RunErrCallback} from "@js/editor/languageTypes/projectType";
import {Language} from "@js/editor/codeEditor";
import {makeRequest} from "@js/editor/utils/cloudAgentAPI";

class InfiniCraftPlayground extends PlaygroundType{
    static identifier = "infinicraft"
    constructor() {
        super(true);
    }

    getPlaygroundContent():string {
        return `
            <div class="playground-title">Infini Craft Sandbox</div>
            <div class="playground-section">
                <div class="playground-rows">
                    <div class="playground-input">
                        <label for="provider">Provider</label>
                        <select name="provider" id="provider">
                          <option value="groq">Groq</option>
                          <option value="ollama">Ollama</option>
                          <option value="openai">OpenAI</option>
                        </select>
                    </div>
                    <div class="playground-input playground-slider">
                        <label for="temp">Temperature</label>
                        <div>
                            <input type="range" id="temp" name="temp" min="0.0" max="2.0" value=".7" step=".01">
                            <span>.7</span>
                        </div>
                    </div>
                    <div class="playground-input playground-slider">
                        <label for="top_p">Top P</label>
                        <div>
                            <input type="range" id="top_p" name="temp" min="0.0" max="1.0" value=".95" step=".01">
                            <span>.95</span>
                        </div>
                    </div>
                    <div class="playground-input playground-slider">
                        <label for="freq_penalty">Frequency Penalty</label>
                        <div>
                            <input type="range" id="freq_penalty" name="temp" min="-2.0" max="2.0" value=".3" step=".01">
                            <span>.3</span>
                        </div>
                    </div>
                </div>
                <div class="playground-sep"></div>
                <div class="playground-input">
                    <label for="sys-prompt">System Prompt</label>
                    <textarea id="sys-prompt" name="sys-prompt" rows="4" cols="50" placeholder="Type your system prompt here..."></textarea>
                </div>
            </div>
            <div class="playground-section" style="flex:1">
                <div class="playground-canvas-parent">
                
                </div>
            </div>
            <div class="playground-section">    
                <div class="playground-button playground-run-trigger">Send</div>
            </div>
        `;
    }

    onRunTrigger() {
        this.showSpinner(".playground-ai-text")
        this.hideError()
        this.makeRequest("/ai/generate","POST",{
            provider:this.getInput("provider"),
            temperature:this.getInput("temp"),
            user_prompt:this.getInput("text-input"),
            top_p:0.95,
            frequency_penalty:0.3,
            system_prompt:SAFETY_SYS_PROMPT
            ,
        }).then(data=>{
            console.log(data)
            this.hideSpinner()
            document.querySelector(".playground-ai-text")!.innerHTML = data.output;
        }).catch(e=>{
            this.hideSpinner()
            this.showError(".playground-ai-text","An error occurred generating your response!")
        })
    }
}

export {InfiniCraftPlayground};