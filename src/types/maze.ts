
export type CellType = 'wall' | 'path' | 'visited' | 'solution' | 'start' | 'end' | 'current' | 'stack' | 'decision';

export interface Position {
  row: number;
  col: number;
}

export interface MazeStats {
  pathLength: number;
  cellsVisited: number;
  backtrackCount: number;
  solutionFound: boolean;
  currentStep: number;
  totalSteps: number;
}

export interface DFSResult {
  solution: Position[];
  visitedCells: Position[];
  backtrackCount: number;
  found: boolean;
}

export interface DFSStep {
  position: Position;
  stack: Position[];
  action: 'explore' | 'backtrack' | 'solution' | 'decision';
  availablePaths: Position[];
  maze: CellType[][];
}

export interface AlgorithmState {
  isRunning: boolean;
  isPaused: boolean;
  currentStep: number;
  steps: DFSStep[];
  speed: number;
}

export interface LogEntry {
  message: string;
  position: Position;
  type: 'start' | 'visit' | 'backtrack' | 'end' | 'decision';
}
