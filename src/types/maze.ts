
export type CellType = 'wall' | 'path' | 'visited' | 'solution' | 'start' | 'end' | 'current';

export interface Position {
  row: number;
  col: number;
}

export interface MazeStats {
  pathLength: number;
  cellsVisited: number;
  backtrackCount: number;
  solutionFound: boolean;
}

export interface DFSResult {
  solution: Position[];
  visitedCells: Position[];
  backtrackCount: number;
  found: boolean;
}
