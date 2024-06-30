export type Player = {
  wallet: string;
  index: number;
  isDrawing: boolean;
}

export type Game = {
  wordHash: string;
  creator: `0x${string}`;
  pot: bigint;
  deadline: bigint;
  winner: `0x${string}`;
}
