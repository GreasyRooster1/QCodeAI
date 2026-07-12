import {PlaygroundType, SAFETY_SYS_PROMPT} from "@js/editor/languageTypes/playground";
import {ProjectType, RunErrCallback} from "@js/editor/languageTypes/projectType";
import {Language} from "@js/editor/codeEditor";
import {makeRequest} from "@js/editor/utils/cloudAgentAPI";

class GameStudioPlayground extends PlaygroundType{
    static identifier = "gamestudio"
    constructor() {
        super(false);
    }

    getPlaygroundContent():string {
        return `
            <div class="playground-title">Game Studio</div>
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
                </div>
            </div>
            <div class="playground-section" style="flex:1">
                <div class="playground-rows" style="flex:1">
                    <div class="playground-input">
                        <textarea id="text-input" name="text-input" rows="4" cols="50" placeholder="Type your message here..."></textarea>
                    </div>
                    <iframe id="share-board-exec-frame" src="exec.html">
                
                    </iframe>
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
            top_p:this.getInput("top_p"),
            frequency_penalty:this.getInput("freq_penalty"),
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

    serialize(): any {
        return {
            provider:this.getInput("provider"),
            temperature:this.getInput("temp"),
            top_p:this.getInput("top_p"),
            frequency_penalty:this.getInput("freq_penalty"),
            user_prompt:this.getInput("text-input"),
        }
    }

    deserialize(data:any) {
        console.log(data)
        this.setInput("provider", data.provider);
        this.setInput("temp", data.temperature);
        this.setInput("top_p", data.top_p);
        this.setInput("freq_penalty", data.freq_penalty);
        this.setInput("text-input", data.user_prompt);
    }

    reset(){
        this.setInput("provider", "groq");
        this.setInput("temp", 0.7);
        this.setInput("top_p", 0.95);
        this.setInput("freq_penalty", .3);
        this.setInput("text-input", "");
    }
}

export {GameStudioPlayground};