import {JavascriptType} from "./languageTypes/javascript";
import {WebType} from "./languageTypes/web/web";
import {ArduinoType} from "./languageTypes/arduino/arduino";
import {ScratchType} from "./languageTypes/scratch";
import {PythonType} from "./languageTypes/python/python";
import {PlaygroundType} from "@js/editor/languageTypes/playground";

const languageTypes = {
    "javascript": JavascriptType,
    "web": WebType,
    "arduino": ArduinoType,
    "scratch": ScratchType,
    "python": PythonType,
    "playground": PlaygroundType,
}

export {languageTypes};