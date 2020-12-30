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
  stageName: string;
  questionText?: string;
  answers: IAnswer[],
  orderBy: OrderBy,
}

export interface ITeam {
  name?: string;
  points: number;
}

export interface IGame {
  questions: IQuestion[],
  showQuestionsText: boolean;
  teamLeft: ITeam;
  teamRight: ITeam;
  currentStage: number;
  commonPoints: number;
}

export interface IEditor {
  gameSettings: IGame;
  lastEditQuestion: number;
  createDate: number;
  lastEditDate?: number;
}
