import Peer from 'peerjs';

export type GameState = {
  currentDrawer: string;
  word: string;
  scores: Record<string, number>;
};

export type GameMessage = 
  | { type: 'drawing', data: any }
  | { type: 'guess', text: string }
  | { type: 'stateUpdate', state: GameState };

class GamePeer {
  private peer: Peer;
  private connections: Record<string, Peer.DataConnection> = {};
  private gameState: GameState = { currentDrawer: '', word: '', scores: {} };

  constructor(private userId: string, private onStateUpdate: (state: GameState) => void) {
    this.peer = new Peer(userId, {
      host: "0.peerjs.com",
      port: 443,
      path: "/",
      pingInterval: 5000,
    });
    this.peer.on('connection', this.handleConnection);
  }

  private onDrawingUpdateCallback: ((lines: any[]) => void) | null = null;

  public onDrawingUpdate(callback: (lines: any[]) => void) {
    this.onDrawingUpdateCallback = callback;
  }

  private handleConnection = (conn: Peer.DataConnection) => {
    conn.on('data', (data: GameMessage) => this.handleMessage(data, conn.peer));
    this.connections[conn.peer] = conn;
  }

  private handleMessage = (message: GameMessage, fromPeerId: string) => {
    switch (message.type) {
      case 'drawing':
        if (this.onDrawingUpdateCallback) {
          this.onDrawingUpdateCallback(message.data);
        }
        break;
      case 'guess':
        // Handle receiving a guess
        break;
      case 'stateUpdate':
        this.gameState = message.state;
        this.onStateUpdate(this.gameState);
        break;
    }
  }

  public joinRoom(roomId: string) {
    const conn = this.peer.connect(roomId);
    conn.on('open', () => {
      console.log('Connected to room:', roomId);
      this.connections[roomId] = conn;
    });
  }

  public sendDrawing(drawingData: any[]) {
    this.broadcast({ type: 'drawing', data: drawingData });
  }

  public sendGuess(guess: string) {
    this.broadcast({ type: 'guess', text: guess });
  }

  private broadcast(message: GameMessage) {
    Object.values(this.connections).forEach(conn => conn.send(message));
  }

  public updateGameState(newState: Partial<GameState>) {
    this.gameState = { ...this.gameState, ...newState };
    this.broadcast({ type: 'stateUpdate', state: this.gameState });
  }

  public getUserId() {
    return this.userId;
  }

  public disconnect() {
    this.peer.disconnect();
  }
}

export default GamePeer;
