import {AIAPI, PlaygroundType, SAFETY_SYS_PROMPT} from "@js/editor/languageTypes/playground";
import {ProjectType, RunErrCallback} from "@js/editor/languageTypes/projectType";
import {Language} from "@js/editor/codeEditor";
import {makeRequest} from "@js/editor/utils/cloudAgentAPI";
import {getIdToken} from "@js/api/auth";


const GAME_STUDIO_SYS_PROMPT = `
You are a developer writing a simple game for the user. Respond only with pure javascript, no markdown blocks,
html, or css. Your code will go directly into a script tag, so anything other than pure javascript will fail.
You have access to the p5js library, already imported and setup for you. you must write out the setup and draw functions
for the program to run.
some common p5js functions include:
- rect(x,y,width,height) -> draws a rectangle
- ellipse(x,y,width,height) -> draws an ellipse
- square(x,y,size) -> draws a square
- fill(red,green,blue) -> sets the fill color
- stroke(red,green,blue) -> sets the outline color
- background(red,green,blue) -> clears the screen with a color

`;

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
                    <div>
                        <div class="playground-button reload-button">Reload</div>
                        <iframe id="share-board-exec-frame" src="exec.html">
                          
                        </iframe>
                    </div>
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
            system_prompt:GAME_STUDIO_SYS_PROMPT+"\n\n\n"+SAFETY_SYS_PROMPT,
            max_tokens:500,
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
        this.onLoadedFrame()
        document.querySelector(".reload-button")!.addEventListener("click", () => {
            this.frame?.contentWindow?.location.reload()
        })
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