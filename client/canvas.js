export function drawStrokeSegment(pen, stroke) {
  const pts = stroke.points;
  if (pts.length < 2) return;

  const a = pts[pts.length - 2];
  const b = pts[pts.length - 1];

  pen.strokeStyle = stroke.color;
  pen.lineWidth = stroke.width;
  pen.lineCap = "round";

  pen.beginPath();
  pen.moveTo(a.x, a.y);
  pen.lineTo(b.x, b.y);
  pen.stroke();
}

export function drawFullStroke(pen, stroke) {
  pen.strokeStyle = stroke.color;
  pen.lineWidth = stroke.width;
  pen.lineCap = "round";

  pen.beginPath();
  stroke.points.forEach((p, i) => {
    if (i === 0){
      pen.moveTo(p.x, p.y);
    } 
    else{
      pen.lineTo(p.x, p.y);
    } 
  });
  pen.stroke();
}

export function replayCanvas(pen, canvas, operations) {
  pen.clearRect(0, 0, canvas.width, canvas.height);

  operations.forEach(op => {
    if (op.type === "stroke") {
      drawFullStroke(pen, op.stroke);
    }
  });
}
