export const operations = [];
export const undoStack = [];

export function addOperation(op) {
  operations.push(op);
  undoStack.length = 0;
}

export function undo() {
  if (operations.length===0){
     return null;
  } 
  const op = operations.pop();
  undoStack.push(op);
  return op;
}

export function redo() {
  if (!undoStack.length) return null;
  const op = undoStack.pop();
  operations.push(op);
  return op;
}
