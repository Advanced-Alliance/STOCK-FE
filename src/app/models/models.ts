export enum OrderBy {
  none,
  forward,
  backward,
}

export enum GameType {
  teamPlay,
  PvP,
}

export interface IAnswer {
  name: string;
  points: number;
}

export interface IQuestion {
  enable: boolean;
  stageName: string;
  questionText?: string | null;
  answers: IAnswer[],
  orderBy: OrderBy,
}

export interface ITeam {
  name?: string | null;
  points: number;
  fails: number;
  players: IPlayer[];
}

export interface IPlayer {
  name?: string | null;
  points: number;
  fails: number;
}

export interface IGame {
  name: string;
  questions: IQuestion[],
  showQuestionsText: boolean;
  maxFails: number;
  teamLeft: ITeam;
  teamRight: ITeam;
  currentStage: number;
  commonPoints: number;
  players: IPlayer[];
  gameType: GameType;
}

export interface IGameSettings {
  gameSettings: IGame;
  lastEditQuestion: number;
  createDate: number;
  lastEditDate?: number | null;
}
