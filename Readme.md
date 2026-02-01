
# Real-Time Collaborative Drawing Canvas

## 📌 Project Overview

This project is a **real-time collaborative drawing application** where multiple users can draw simultaneously on a shared canvas and see each other’s drawings instantly.

The application focuses on **Canvas API mastery**, **WebSocket-based real-time synchronization**, and **server-authoritative state management**, rather than UI frameworks or third-party drawing libraries.

---

## ✨ Features Implemented

* Real-time collaborative drawing using HTML Canvas
* Multi-user synchronization via WebSockets (Socket.io)
* Stroke-based drawing model
* Global undo functionality (affects all users)
* Server-authoritative operation history
* Clean separation of concerns (canvas, networking, state)

---

## 🛠️ Tech Stack

* **Frontend**: HTML, CSS, Vanilla JavaScript
* **Backend**: Node.js, Express
* **Real-Time Communication**: Socket.io (WebSockets)
* **Rendering**: Native HTML Canvas API

> No external canvas or drawing libraries were used.

---

## 📂 Project Structure

```
collaborative-canvas/
├── client/
│   ├── index.html        # UI layout
│   ├── style.css         # Styling
│   ├── canvas.js         # Canvas rendering & replay logic
│   ├── websocket.js     # WebSocket client abstraction
│   └── main.js           # Application glue logic
├── server/
│   ├── server.js         # Express + Socket.io server
│   └── state-manager.js # Server-side drawing state & undo logic
├── package.json
├── README.md
└── ARCHITECTURE.md
```

---

## ⚙️ Setup Instructions

### Prerequisites

* Node.js (v16 or above)
* npm

### Installation

```bash
npm install
```

### Run the Application

```bash
npm start
```

The server will start at:

```
http://localhost:3000
```

---

## 🧪 How to Test with Multiple Users

1. Start the server using `npm start`
2. Open `http://localhost:3000` in a browser
3. Open the same URL in **multiple tabs or browsers**
4. Draw in one tab — drawings appear live in all others
5. Try the **Undo** button — the last stroke is removed globally

---

## 🧠 Design Decisions (High-Level)

* **Canvas as a projection layer**:
  The canvas does not store state. It only renders operations.

* **Server-authoritative state**:
  All drawing operations are stored on the server to ensure consistency.

* **Operation-based model**:
  Each stroke is treated as an immutable operation, enabling deterministic replay.

* **Vanilla JavaScript over React**:
  Chosen for better control over high-frequency canvas updates and to avoid unnecessary re-renders.

Detailed reasoning is documented in `ARCHITECTURE.md`.

---

## ⏪ Undo Functionality

* Undo is **global**, not per-user
* Any user can trigger undo
* Undo removes the most recent drawing operation across all users
* Canvas is reconstructed by replaying remaining operations

---

## 🔜 Redo Functionality (Planned)

Redo functionality is currently **under development**.

Planned approach:

* Maintain a redo stack on the server
* Restore undone operations in correct order
* Broadcast redo events to all connected clients

---

## ⚠️ Known Limitations

* Redo functionality is not fully enabled yet working on it.....
* Additional drawing tools (shapes, text)
* Cursor points implementation
* Mobile touch support is not implemented


---

