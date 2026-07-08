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

const AIAPI = "http://127.0.0.1:8000/api"

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
        this.setupInputs();
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

    setupInputs(){
        let main = document.querySelector(".playground-main")!;
        let styles = getComputedStyle(main);
        const fill = styles.getPropertyValue('--c-purple-bright').trim();
        const track = styles.getPropertyValue('--c-gray-300').trim();
        let sliders = document.querySelectorAll(".playground-slider");
        for(let container of sliders){
            let slider = container.querySelector("input") as HTMLInputElement;
            let handler = ()=>{
                // @ts-ignore
                const p = (slider.value - slider.min) / (slider.max - slider.min) * 100;

                let span = container.querySelector("span")!
                let value = Number((slider as HTMLInputElement).value);
                span.textContent = value.toFixed(2);
                slider.style.background =
                    `linear-gradient(90deg, ${fill} 0%, ${fill} ${p}%, ${track} ${p}%, ${track} 100%)`;
            }
            slider.addEventListener('input',handler);
            handler();
        }
    }

    makeRequest(url:string,method:string,data:any){
        return new Promise((resolve,reject)=>{
            fetch(AIAPI+url,{
                method:method,
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(data)
            }).then(async res=>{
                if(!res.ok){
                    console.error("playground request returned not ok",res)
                    reject(await res.text())
                }
                let data = await res.json()
                resolve(data)
            }).catch((e)=>{
                console.error("playground request failed with",e)
                reject(e)
            })
        })
    }

    showSpinner(sel:string){
        let content = "<div class=\"playground-spinner\"></div>"
        document.querySelector(sel)!.innerHTML = content;
    }

    hideSpinner(){
        document.querySelector("playground-spinner")?.remove()
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