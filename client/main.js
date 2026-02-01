import { drawStrokeSegment, replayCanvas } from "./canvas.js";
import { initSocket } from "./websocket.js";

const canvas = document.getElementById("canvas");
const pen = canvas.getContext("2d");
const undoBtn=document.getElementById("undo");
const redoBtn=document.getElementById("redo");

let isDrawing = false;
let currentStroke = null;

const operations = [];
const remoteStrokes = {};

const user = {
  id: null,
  color: randomColor()
};

const socket = initSocket({
  onInit: (ops) => {
    operations.push(...ops);
    replayCanvas(pen, canvas, operations);
  },

  onStrokeStart: (stroke) => {
    remoteStrokes[stroke.id] = stroke;
    operations.push({ type: "stroke", stroke });
  },

  onStrokeUpdate: ({ strokeId, point }) => {
    const stroke = remoteStrokes[strokeId];
    if (!stroke) return;
    stroke.points.push(point);
    drawStrokeSegment(pen, stroke);
  },

  onStrokeEnd: (id) => delete remoteStrokes[id],

  onUndo: () => {
  operations.pop();
  replayCanvas(pen, canvas, operations);
  },


  onRedo: (op) => {
  operations.push(op);
  replayCanvas(pen, canvas, operations);
  },

  
});

socket.on("connect", () => user.id = socket.id);



canvas.addEventListener("mousedown", (e) => {
  isDrawing = true;

  currentStroke = {
    id: crypto.randomUUID(),
    userId: user.id,
    color: user.color,
    width: 3,
    points: [{ x: e.offsetX, y: e.offsetY }]
  };

  operations.push({ type: "stroke", stroke: currentStroke });

  socket.emit("stroke:start", currentStroke);
});

canvas.addEventListener("mousemove", (e) => {
  if (!isDrawing) return;

  const point = { x: e.offsetX, y: e.offsetY };
  currentStroke.points.push(point);
  drawStrokeSegment(pen, currentStroke);

  socket.emit("stroke:update", { strokeId: currentStroke.id, point });
  socket.emit("cursor", point);
});

canvas.addEventListener("mouseup", stop);
canvas.addEventListener("mouseleave", stop);

function stop() {
  if (!isDrawing) {
    return;
  }

  isDrawing = false;
  socket.emit("stroke:end", currentStroke.id);
  currentStroke = null;
}

undoBtn.onclick = () => {
  socket.emit("undo");
}
redoBtn.onclick = () => socket.emit("redo");

function randomColor() {
  return `hsl(${Math.random() * 360}, 80%, 50%)`;
}
