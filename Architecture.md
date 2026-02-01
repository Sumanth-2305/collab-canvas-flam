1. Overview

This project implements a "real-time collaborative drawing canvas" where multiple users can draw simultaneously and see each other’s drawings in real time.

The core architectural principle is:

The canvas is a rendering layer, not the source of truth.
All persistent state is represented as drawing operations managed by the server.

The system uses **WebSockets (Socket.io)** to stream drawing events between clients and a **server-authoritative operation log** to ensure consistency across users.

----------------------------------

2. High-Level Architecture


+------------+        WebSocket        +------------+
|  Client A  |  <-------------------> |            |
| (Canvas)   |                         |            |
+------------+                         |            |
                                       |   Server   |
+------------+        WebSocket        | (Authority)|
|  Client B  |  <-------------------> |            |
| (Canvas)   |                         |            |
+------------+                         +------------+


* Clients handle **input and rendering**
* The server manages **drawing state and history**
* All clients remain synchronized through server broadcasts

---------------------------------------

3. Data Flow Diagram

User draws on canvas
        ↓
Client captures mouse events
        ↓
Client sends stroke events via WebSocket
        ↓
Server receives and records operation
        ↓
Server broadcasts stroke event to all clients
        ↓
Clients render the stroke incrementally


--------------------------------------------

4. WebSocket Protocol

The application uses an event-based WebSocket protocol.

Events Sent from Client to Server

"stroke:start"

Sent when a user begins drawing a new stroke.

json
{
  "id": "stroke-uuid",
  "userId": "socket-id",
  "color": "#ff0000",
  "width": 3,
  "points": [{ "x": 120, "y": 340 }]
}

stroke:update

Sent continuously while drawing.

json
{
  "strokeId": "stroke-uuid",
  "point": { "x": 125, "y": 345 }
}

stroke:end

Sent when the user finishes a stroke.

json
"stroke-uuid"


undo

Requests a global undo operation.

```json
{}
```

---

Events Sent from Server to Clients

`init`

Sent to newly connected clients containing full drawing history.

```json
[
  {
    "type": "stroke",
    "stroke": { "...": "stroke data" }
  }
]
```

`stroke:start`

Broadcast to all clients when a stroke begins.

`stroke:update`

Broadcast incremental stroke updates.

`stroke:end`

Broadcast when a stroke is completed.

`undo-applied`

Broadcast when an undo operation is applied globally.

```json
{
  "type": "stroke",
  "stroke": { "...": "stroke data" }
}
```

---

5. Undo Strategy (Global Undo)


* Undo is **global**, not per-user
* Undo operates on **drawing operations**, not pixels
* The server is the **single source of truth**

How Global Undo Works

1. Any user triggers an undo action
2. The server removes the **last operation** from the operation log
3. The removed operation is stored internally for potential future redo
4. The server broadcasts the undone operation to all clients
5. Each client:

   * Removes the operation from local history
   * Clears the canvas
   * Replays remaining operations


---------------------------------------------

6. Redo Strategy (##Working stage: working on the redo functionlity)

Redo functionality is **not yet enabled** in the current implementation.

Planned Approach

* Maintain a server-side redo stack
* On redo:

  * Restore the most recently undone operation
  * Broadcast the restored operation to all clients
  * Clients replay the canvas state

-------------------------------------------------------


 8. Conflict Handling


* Each stroke is treated as an independent operation
* Operations are applied in the order received by the server
* Overlapping strokes are rendered sequentially
*One key architectural decision was to implement the frontend using  Vanilla JavaScript instead of a framework like React.
This choice was intentional and driven by the nature of the problem.
-Canvas Is an Imperative API
-Unnecessary re-renders
-Performance overhead
-Increased complexity
Using Vanilla JavaScript allows direct, fine-grained control over canvas rendering without interference from a virtual DOM.


