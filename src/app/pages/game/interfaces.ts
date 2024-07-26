export interface State {
    players: Record<string, Player>;
    fruits: Record<string, Fruit>;
    screen: {
      width: number;
      height: number;
      pixelsPerFields: number;
    };
    config: {
      maxCollisionDistance: number;
      playerCollisionCost: number;
      wallCollisionCost: number;
      initialScore: number;
      autoDropFruitValue: number;
      showPotsValue: boolean;
    };
  }
  
  export interface Player {
    playerId: string;
    x: number;
    y: number;
    score: number;
    isConnected: boolean;
    disconnectTimeout: any;
    disconnectDuration: any;
    disconnected: boolean;
    disconnectTime: any;
    name: string
  }
  
  export interface Fruit {
    x: number;
    y: number;
    quantity: number;
  }