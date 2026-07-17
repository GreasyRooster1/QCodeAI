import {PlaygroundType, SAFETY_SYS_PROMPT} from "@js/editor/languageTypes/playground";
import {ProjectType, RunErrCallback} from "@js/editor/languageTypes/projectType";
import {Language} from "@js/editor/codeEditor";
import {makeRequest} from "@js/editor/utils/cloudAgentAPI";

class LLMSimplePlayground extends PlaygroundType{
    static identifier = "llmsimple"
    constructor() {
        super(false);
    }

    getPlaygroundContent():string {
        return `
            <div class="playground-title">LLM Sandbox</div>
            <div class="playground-section">
                <div class="playground-rows">
                    <div class="playground-input playground-providers">
                        
                    </div>
                </div>
                <div class="playground-sep"></div>
                <div class="playground-input">
                    <textarea id="text-input" name="text-input" rows="4" cols="50" placeholder="Type your message here..."></textarea>
                </div>
            </div>
            <div class="playground-section" style="flex:1">
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
        this.showSpinner(".playground-ai-text")
        this.hideError()
        this.makeRequest("/ai/generate","POST",{
            provider:this.getInput("provider"),
            user_prompt:this.getInput("text-input"),
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
            user_prompt:this.getInput("text-input"),
        }
    }

    deserialize(data:any) {
        console.log(data)
        this.setInput("provider", data.provider);
        this.setInput("text-input", data.user_prompt);
    }

    reset(){
        this.setInput("provider", "groq");
        this.setInput("text-input", "");
    }
}

export {LLMSimplePlayground};