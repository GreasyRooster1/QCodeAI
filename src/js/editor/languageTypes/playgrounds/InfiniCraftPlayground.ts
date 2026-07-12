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
                    <div class="playground-input">
                        <label for="provider">Provider</label>
                        <select name="provider" id="provider">
                          <option value="groq">Groq</option>
                          <option value="ollama">Ollama</option>
                          <option value="openai">OpenAI</option>
                        </select>
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
                    <label for="sys-prompt">System Prompt</label>
                    <textarea id="sys-prompt" name="sys-prompt" rows="4" cols="50" placeholder="Type your system prompt here..."></textarea>
                </div>
            </div>
            <div class="playground-section" style="flex:1">
                <iframe id="share-board-exec-frame" src="exec.html">
                
                </iframe>
            </div>
            <div class="playground-section">    
                <div class="playground-button playground-run-trigger">Send</div>
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
            user_prompt:this.getInput("text-input"),
            top_p:this.getInput("top_p"),
            frequency_penalty:this.getInput("freq_penalty"),
            system_prompt:SAFETY_SYS_PROMPT,
        }
        let serialData = JSON.stringify(data);

        getIdToken().then((token=>{
            let code = `
            let token = "${token}";
            const AIAPI = "${AIAPI}";
            const aiData = \`${serialData}\`;
            
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

    playgroundSetup(){
        this.frame = (document.querySelector('#share-board-exec-frame') as HTMLIFrameElement);
        this.frame.addEventListener("load", () => {
            this.onLoadedFrame()
        });
        this.onLoadedFrame()
    }

    onRunTrigger() {
        this.showSpinner(".playground-ai-text")
        this.hideError()
        this.makeRequest("/ai/generate","POST",{
            provider:this.getInput("provider"),
            temperature:this.getInput("temp"),
            user_prompt:this.getInput("text-input"),
            top_p:0.95,
            frequency_penalty:0.3,
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
    
    fill(7, 0, 15);
    stroke(106, 0, 227);
    strokeWeight(1);
    rect(this.x,this.y,this.w,this.h,5);
    
    fill(255);
    text(this.type,this.x+7,this.y+6);
    textAlign(LEFT,TOP);
  }
  drawBorder(){
    noFill();
    stroke(106, 0, 227);
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
        getType(this.type,el.type).then((res)=>{
            elements.push(new Element(el.x,el.y,res));
        })
      }
    }
  }
}


const lineCount = 20;
let elements = [];
let discoveredElements = ["Air","Earth","Fire","Water"];
let selectedEl = null;
let mouseClicked = false;
let lastMousePressed = false;
let barOffset = 0;

function setup() {
}

function draw() {
  mouseClicked = mouseIsPressed&&!lastMousePressed;
  
  background(13, 0, 28);
  drawBackground();
  updateElements();
  drawBar();
  elements = elements.filter((e)=>!e.dead);
  
  lastMousePressed = mouseIsPressed;
}

function drawBar(){
  fill(13, 0, 28);
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
  stroke(139, 38, 255);
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
  
  fill(7, 0, 15);
  stroke(106, 0, 227);
  strokeWeight(1);
  rect(x,y,w,30,5);
  
  fill(255);
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
    let data = aidata
    data.user_prompt = a+" + "+b;
    return new Promise((resolve,reject)=>{
        fetch(AIAPI+"/ai/generate",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+token,
            },
            body:JSON.stringify(data)
        }).then(async res=>{
            if(!res.ok){
                console.error("playground request returned not ok",res)
                reject(await res.text())
                return;
            }
            let data = await res.json()
            resolve(data)
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