import {AIAPI, PlaygroundType, SAFETY_SYS_PROMPT} from "@js/editor/languageTypes/playground";
import {ProjectType, RunErrCallback} from "@js/editor/languageTypes/projectType";
import {Language} from "@js/editor/codeEditor";
import {makeRequest} from "@js/editor/utils/cloudAgentAPI";
import {getIdToken} from "@js/api/auth";

class InfiniCraftPlayground extends PlaygroundType{
    static identifier = "infinicraft"

    private frame: HTMLIFrameElement | null | undefined;
    private iWindow: WindowProxy | null | undefined;

    constructor() {
        super(true);
        this.iWindow = null;
    }

    getPlaygroundContent():string {

        return `
            <div class="playground-title">Infini Craft Sandbox</div>
            <div class="playground-section">
                <div class="playground-rows">
                    <div class="playground-input playground-providers">
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
                    <label for="system_prompt">System Prompt</label>
                    <textarea id="system_prompt" name="system_prompt" rows="4" cols="50" placeholder="Type your system prompt here..."></textarea>
                </div>
            </div>
            <div class="playground-section playground-rows" style="flex:1">
                <iframe id="share-board-exec-frame" src="exec.html">
                
                </iframe>
                <div class="playground-section" style="flex-shrink: 0; width:50%">
                    <div class="playground-rows">
                        <div>
                            <label for="background_color">Background color</label>
                            <input type="color" id="background_color" name="background_color" value="#202020" />
                        </div>
                        <div>
                            <label for="line_color">Line color</label>
                            <input type="color" id="line_color" name="line_color" value="#4d4d4d" />
                        </div>
                        <div>
                            <label for="element_color">Element color</label>
                            <input type="color" id="element_color" name="element_color" value="#303030" />
                        </div>
                        <div>
                            <label for="border_color">Border color</label>
                            <input type="color" id="border_color" name="border_color" value="#6f0ed1" />
                        </div>
                        <div>
                            <label for="text_color">Text color</label>
                            <input type="color" id="text_color" name="text_color" value="#ffffff" />
                        </div>
                    </div>
                    <div class="playground-section combo-list" style="height:40vh; overflow-y:scroll; margin-bottom:8px">
                    
                    </div>
                    <div class="playground-rows">
                        <label for="element_1">Starting Elements:</label>
                        <input type="text" id="element_1" name="element_1" placeholder="Air" value="Air">
                        <input type="text" id="element_2" name="element_2" placeholder="Earth" value="Earth">
                        <input type="text" id="element_3" name="element_3" placeholder="Fire" value="Fire">
                        <input type="text" id="element_4" name="element_4" placeholder="Water" value="Water">
                    </div>
                    <div class="playground-button reload-button">Reload</div>
                </div>
            </div>
        `;


    }

    startGame(){
        if (this.iWindow === null) {
            return;
        }

        let data = {
            provider:this.getInput("provider"),
            temperature:this.getInput("temp"),
            top_p:this.getInput("top_p"),
            frequency_penalty:this.getInput("freq_penalty"),
            system_prompt:this.getInput("system_prompt"),
            max_tokens:10,
        }
        let serialData = JSON.stringify(data);
        console.log(this.getInput("background_color"))
        getIdToken().then((token=>{
            let code = `
            let token = "${token}";
            const AIAPI = "${AIAPI}";
            const aiData = \`${serialData}\`;
            let backgroundCol = "${this.getInput("background_color")}"
            let lineCol = "${this.getInput("line_color")}";
            let elementCol = "${this.getInput("element_color")}"
            let borderCol = "${this.getInput("border_color")}";
            let textCol = "${this.getInput("text_color")}";
            let discoveredElements = [
            "${this.getInput("element_1")}",
            "${this.getInput("element_2")}",
            "${this.getInput("element_3")}",
            "${this.getInput("element_4")}"];
            
            ${INFINI_RUNTIME_CODE}
            `
            console.log(code);
            this.iWindow?.postMessage(code);
        }));
    }

    onLoadedFrame(){
        this.iWindow = this.frame?.contentWindow;
        console.log(this.iWindow);
        this.startGame()
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
        document.querySelector(".reload-button")!.addEventListener("click", () => {
            this.reloadGame()
        })
        document.querySelector(".reset-button")!.remove()
    }

    reloadGame(){
        this.frame?.contentWindow?.location.reload()
        document.querySelector(".combo-list")!.innerHTML ="";
    }

    playgroundSetup(){
        this.setupFrame();

    }

    serialize(): any {
        return {
            provider:this.getInput("provider"),
            temperature:this.getInput("temp"),
            top_p:this.getInput("top_p"),
            frequency_penalty:this.getInput("freq_penalty"),
            system_prompt:this.getInput("system_prompt"),

            background_color:this.getInput("background_color"),
            line_color:this.getInput("line_color"),
            element_color:this.getInput("element_color"),
            border_color:this.getInput("border_color"),
            text_color:this.getInput("text_color"),

            element_1:this.getInput("element_1"),
            element_2:this.getInput("element_2"),
            element_3:this.getInput("element_3"),
            element_4:this.getInput("element_4"),
        }
    }

    deserialize(data: any) {
        this.setInput("provider", data.provider);
        this.setInput("temp", data.temperature);
        this.setInput("top_p", data.top_p);
        this.setInput("freq_penalty", data.frequency_penalty);
        this.setInput("system_prompt", data.system_prompt);

        this.setInput("background_color", data.background_color);
        this.setInput("line_color", data.line_color);
        this.setInput("element_color", data.element_color);
        this.setInput("border_color", data.border_color);
        this.setInput("text_color", data.text_color);

        this.setInput("element_1", data.element_1);
        this.setInput("element_2", data.element_2);
        this.setInput("element_3", data.element_3);
        this.setInput("element_4", data.element_4);

        this.reloadGame();
    }
}







const INFINI_RUNTIME_CODE = `

class Element{
  constructor(x,y,type){
    this.x=x;
    this.y=y;
    this.type=type;
    textSize(20);
    this.w = textWidth(this.type)+14;;
    this.h = 30;
    this.id=random(-99999999,9999999);
    this.dead = false;
  }

  update(){
    this.checkDrag();
    this.draw();
  }

  draw(){
    textSize(20);
    
    fill(elementCol);
    stroke(borderCol);
    strokeWeight(1);
    rect(this.x,this.y,this.w,this.h,5);
    
    fill(textCol);
    text(this.type,this.x+7,this.y+6);
    textAlign(LEFT,TOP);
  }
  drawBorder(){
    noFill();
    stroke(borderCol);
    strokeWeight(sin(frameCount/25)*2+3);
    rect(this.x,this.y,this.w,this.h,5);
  }

  checkDrag(){
    if(!selectedEl) return;
    
    if(selectedEl.id==this.id){
      this.x=mouseX-this.w/2;
      this.y=mouseY-this.h/2;

      for(let el of elements){
        if(el.id==this.id)continue;
        if(collision(el.x,el.y,el.w,el.h,this.x,this.y,this.w,this.h)){
          this.drawBorder();
          el.drawBorder();
        }
      }
    }
  }

  combine(){
    if(this.dead||this.id!=selectedEl.id)return;
    let snap = [...elements];
    for(let el of snap){
      if(el.id==this.id) continue;
      if(collision(el.x,el.y,el.w,el.h,this.x,this.y,this.w,this.h)){
        this.dead=true;
        el.dead=true;
        if(comboCache[this.type+"|"+el.type]){
            elements.push(new Element(el.x,el.y,comboCache[this.type+"|"+el.type]));
        }else{
            getType(this.type,el.type).then((res)=>{
                if(!discoveredElements.includes(res)){
                    discoveredElements.push(res);
                }
                comboCache[this.type+"|"+el.type] = res;
                console.log(this.type+" + "+el.type+" = "+res);
                elements.push(new Element(el.x,el.y,res));
            })
        }
      }
    }
  }
}


const lineCount = 20;
let elements = [];
let selectedEl = null;
let mouseClicked = false;
let lastMousePressed = false;
let barOffset = 0;
let comboCache = {}

function setup() {
}

function draw() {
  mouseClicked = mouseIsPressed&&!lastMousePressed;
  
  background(backgroundCol);
  drawBackground();
  updateElements();
  drawBar();
  elements = elements.filter((e)=>!e.dead);
  
  lastMousePressed = mouseIsPressed;
}

function drawBar(){
  fill(backgroundCol);
  rect(0,350,500,200);
  let cols = segmentDiscovered();
  drawDiscovered(cols);
}

function segmentDiscovered(){
  let cols = [];
  let cCol = -1;
  for(let i=0;i<discoveredElements.length;i++){
    if(i%4==0){
      cCol++;
      cols.push([]);
    }
    cols[cCol].push(discoveredElements[i]);
  }
  return cols;
}

function drawDiscovered(cols){
  let runningW = 10;
  let maxColW = 0;
  for(let i=0;i<cols.length;i++){
    for(let j=0;j<cols[i].length;j++){
      let y = 358+j*35;
      let w = drawEl(runningW+barOffset,y,cols[i][j]);
      if(collision(runningW+barOffset,y,w,30,mouseX,mouseY,1,1)&&mouseClicked){
        elements.push(new Element(250+random(-50,50),150+random(-50,50),cols[i][j]));
      }
      if(w>maxColW){
        maxColW=w;
      }
    }
    runningW+=maxColW+5;
    maxColW=0;
  }
}

function drawBackground(){
  let ratio = width/lineCount;
  stroke(lineCol);
  strokeWeight(.2);
  for(let i=0;i<lineCount;i++){
    line(i*ratio,0,i*ratio,width);
  }
  for(let i=0;i<lineCount;i++){
    line(0,i*ratio,width,i*ratio);
  }
}

function drawEl(x,y,type){
  textSize(20);
  let w = textWidth(type)+14;
  
  fill(elementCol);
  stroke(borderCol);
  strokeWeight(1);
  rect(x,y,w,30,5);
  
  fill(textCol);
  text(type,x+7,y+6);
  textAlign(LEFT,TOP);

  return w;
}

function updateElements(){
  for(let el of elements){
    el.update();
  }
}

function mousePressed(){
  for(let el of elements){
    if(collision(el.x,el.y,el.w,el.h,mouseX,mouseY,1,1)){
      selectedEl = el;
    }
  }
}

function mouseReleased(){
  selectedEl.combine();
  selectedEl = null;
}

function getType(a,b){
    let d = JSON.parse(aiData)
    let prompt = a+" + "+b;
    d.user_prompt = prompt;
    
    return new Promise((resolve,reject)=>{
        fetch(AIAPI+"/ai/generate",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+token,
            },
            body:JSON.stringify(d)
        }).then(async res=>{
            if(!res.ok){
                console.error("playground request returned not ok",res)
                reject(await res.text())
                return;
            }
            let data = await res.json()
            resolve(data.output)
        }).catch((e)=>{
            console.error("playground request failed with",e)
            reject(e)
        })
    });
}
function mouseWheel(event){
  barOffset+=event.delta/10;
  barOffset = min(barOffset,0);
}

function collision(x1, y1, w1, h1, x2, y2, w2, h2) {
  return (
    x1 < x2 + w2 &&
    x1 + w1 > x2 &&
    y1 < y2 + h2 &&
    y1 + h1 > y2
  );
}
`

export {InfiniCraftPlayground};