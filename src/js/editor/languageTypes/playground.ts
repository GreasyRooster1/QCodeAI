import {ProjectType,RunErrCallback} from "./projectType";
import {getCode,setupEvents as setupExecEvents,logNames,runCode,frameContent,frame,stopFrame} from "../executionHelper"
import {Language} from "../codeEditor";
import {getStoredUser} from "../../api/auth";
import {get, ref, set} from "firebase/database";
import {db} from "../../api/firebase";
import {writeToEditor} from "../utils/loadUtils";
import {clearConsole} from "../codeExecution";
import {createGutterBlocks, setupDefaultPanes} from "../panes";
import Split from "split.js";

const AIAPI = "localhost:5173"

class PlaygroundType extends ProjectType {
    static identifier = "playground"
    constructor() {
        super(true);
    }

    onLoad(): void {

    }

    setupEditor(){
        let content = this.getPlaygroundContent()
        document.querySelector(".code-pane")!.innerHTML = `
            <div class="playground-main">
                ${content}
            </div>
        `;

        document.querySelector(".output-pane")!.remove();
        document.querySelector(".pane-container")!.classList.add("playground-style-override")

        document.querySelector(".playground-run-trigger")!.addEventListener("click",(e)=>{
            this.onRunTrigger()
        })
    }

    createPanes(hasLesson:boolean){
        Split(['.steps-pane', '.code-pane'], {
            sizes: [30, 70],
        });

        createGutterBlocks()
    }

    getLanguage():Language {
        return "javascript";
    }

    getInput(key:string):any{
        let el = document.querySelector(`.playground-input #${key}`)
        let type = el?.tagName.toLowerCase();
        if(type=="input"){
            return (el as HTMLInputElement).value;
        }else if(type=="select"){
            return (el as HTMLSelectElement).value;
        }else if(type=="textarea"){
            return (el as HTMLTextAreaElement).value;
        }else {
            return null;
        }
    }

    static getProjectDBData(projectName: string, lessonId: string):Promise<Object> {
        let cleanLessonId = lessonId ?? "none"
        return new Promise((resolve, reject) => {
            let data = {
                language: this.identifier,
                name: projectName,
                lessonId: lessonId ?? "none",
                currentChapter: 0,
                currentStep: 0,
                timestamp: Date.now() / 1000,
            }
            resolve(data);
        });
    }

    /* abstracts */
    getPlaygroundContent():string {
        return "overload the getPlaygroundContent function in playground.ts to add your own content!";
    }

    onRunTrigger(){

    }

    /* unused overrides */
    setupEditorLanguage(){
        //dont setup any language
    }

    onSave(){
    }

    onRun(errorCallback:RunErrCallback) {
    }

    onStop(){
    }

    runErrorCallback(content: string, type: string): void {
        super.appendLog(content,type);
    }
}

export {PlaygroundType, AIAPI};