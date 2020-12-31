export enum OrderBy {
  none,
  forward,
  backward,
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
}

export interface IGameSettings {
  gameSettings: IGame;
  lastEditQuestion: number;
  createDate: number;
  lastEditDate?: number | null;
}
