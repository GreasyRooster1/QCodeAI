import {AIAPI, PlaygroundType, SAFETY_SYS_PROMPT} from "@js/editor/languageTypes/playground";
import {ProjectType, RunErrCallback} from "@js/editor/languageTypes/projectType";
import {Language} from "@js/editor/codeEditor";
import {makeRequest} from "@js/editor/utils/cloudAgentAPI";
import {getIdToken} from "@js/api/auth";

class GameStudioPlayground extends PlaygroundType{
    static identifier = "gamestudio"
    private frame: HTMLIFrameElement | null | undefined;
    private iWindow: WindowProxy | null | undefined;
    constructor() {
        super(true);
        this.iWindow = null;
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
                <div class="spinner-container">
                    
                </div>
            </div>
            <div class="playground-section">    
                <div class="playground-button playground-run-trigger">Send</div>
            </div>
        `;
    }

    playgroundSetup(){
        this.setupFrame();

    }

    onRunTrigger() {
        this.showSpinner(".spinner-container")
        this.hideError()
        this.makeRequest("/ai/generate","POST",{
            provider:this.getInput("provider"),
            temperature:0.2,
            user_prompt:this.getInput("text-input"),
            top_p:1.0,
            frequency_penalty:0.0,
            system_prompt:SAFETY_SYS_PROMPT
            ,
        }).then(data=>{
            console.log(data)
            this.hideSpinner()
            this.startGame(data.output)
        }).catch(e=>{
            this.hideSpinner()
            this.showError(".spinner-container","An error occurred generating your response!")
        })
    }

    startGame(code:string){
        if (this.iWindow === null) {
            return;
        }
        console.log(code);
        this.iWindow?.postMessage(code);
    }

    onLoadedFrame(){
        this.iWindow = this.frame?.contentWindow;
        console.log(this.iWindow);
    }

    setupFrame(){
        this.frame = (document.querySelector('#share-board-exec-frame') as HTMLIFrameElement);
        this.frame.addEventListener("load", () => {
            this.onLoadedFrame()
        });
        window.addEventListener("message", (event) => {
            let log;
            try {
                log = JSON.parse(event.data);
            }catch (error) {
                return
            }
            console.log("received log from frame: "+log.type+" - "+log.message);

            if(log.type=="log") {
                document.querySelector(".combo-list")!.innerHTML += "<br/>"+log.message;
            }
        });
        this.onLoadedFrame()
        document.querySelector(".reset-button")!.remove()
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

export {GameStudioPlayground};