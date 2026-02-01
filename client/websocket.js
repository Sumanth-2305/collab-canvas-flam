export function initSocket(handlers) {

  const socket = io();

  socket.on("init", handlers.onInit);
  socket.on("stroke:start", handlers.onStrokeStart);
  socket.on("stroke:update", handlers.onStrokeUpdate);
  socket.on("stroke:end", handlers.onStrokeEnd);
  socket.on("undo-applied", handlers.onUndo);
  socket.on("redo-applied", handlers.onRedo);
  

  return socket;

}
