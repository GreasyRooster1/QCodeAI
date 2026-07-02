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

class PlaygroundType extends ProjectType {
    static identifier = "playground"
    constructor() {
        super(true);
    }

    onLoad(): void {
        //document.querySelector(".code-pane")!.remove();
    }

    setupEditor(){
        //document.querySelector(".output-pane")!.remove();
        //document.querySelector(".pane-container")!.classList.add("scratch-style-override")
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

    getLanguage():Language {
        return "javascript";
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
}

export {PlaygroundType};