import {JavascriptType} from "./languageTypes/javascript";
import {WebType} from "./languageTypes/web/web";
import {ArduinoType} from "./languageTypes/arduino/arduino";
import {ScratchType} from "./languageTypes/scratch";
import {PythonType} from "./languageTypes/python/python";
import {PlaygroundType} from "@js/editor/languageTypes/playground";
import {LLMSandboxPlayground} from "@js/editor/languageTypes/playgrounds/LLMSandboxPlayground";
import {InfiniCraftPlayground} from "@js/editor/languageTypes/playgrounds/InfiniCraftPlayground";

const languageTypes = {
    "javascript": JavascriptType,
    "web": WebType,
    "arduino": ArduinoType,
    "scratch": ScratchType,
    "python": PythonType,

    "playground": PlaygroundType,
    "llmsandbox": LLMSandboxPlayground,
    "infinicraft": InfiniCraftPlayground,
}

export {languageTypes};