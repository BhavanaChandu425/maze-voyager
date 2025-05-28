import { CellType, Position, DFSResult, MazeStats, DFSStep } from '@/types/maze';

export const generateMaze = (rows: number, cols: number): CellType[][] => {
  // Create initial maze filled with walls
  const maze: CellType[][] = Array(rows).fill(null).map(() => 
    Array(cols).fill('wall' as CellType)
  );
  
  // Recursive backtracking maze generation
  const carve = (row: number, col: number) => {
    maze[row][col] = 'path';
    
    // Directions: up, right, down, left
    const directions = [
      [-2, 0], [0, 2], [2, 0], [0, -2]
    ];
    
    // Shuffle directions for randomness
    for (let i = directions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [directions[i], directions[j]] = [directions[j], directions[i]];
    }
    
    for (const [dRow, dCol] of directions) {
      const newRow = row + dRow;
      const newCol = col + dCol;
      
      if (newRow >= 0 && newRow < rows && 
          newCol >= 0 && newCol < cols && 
          maze[newRow][newCol] === 'wall') {
        
        // Carve path between current and new cell
        maze[row + dRow / 2][col + dCol / 2] = 'path';
        carve(newRow, newCol);
      }
    }
  };
  
  // Start carving from (1,1) to ensure odd coordinates
  carve(1, 1);
  
  // Ensure start and end are accessible
  maze[0][0] = 'path'; // Start
  maze[rows - 1][cols - 1] = 'path'; // End
  
  // Clear path to start and end if needed
  maze[0][1] = 'path';
  maze[1][0] = 'path';
  maze[rows - 2][cols - 1] = 'path';
  maze[rows - 1][cols - 2] = 'path';
  
  return maze;
};

export const generateDFSSteps = (initialMaze: CellType[][]): DFSStep[] => {
  const rows = initialMaze.length;
  const cols = initialMaze[0].length;
  const maze = initialMaze.map(row => [...row]);
  
  const visited = Array(rows).fill(null).map(() => Array(cols).fill(false));
  const stack: Position[] = [];
  const steps: DFSStep[] = [];
  let found = false;
  
  const isValid = (row: number, col: number): boolean => {
    return row >= 0 && row < rows && 
           col >= 0 && col < cols && 
           (maze[row][col] === 'path') && 
           !visited[row][col];
  };
  
  const getAvailablePaths = (row: number, col: number): Position[] => {
    const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];
    const available: Position[] = [];
    
    for (const [dRow, dCol] of directions) {
      const newRow = row + dRow;
      const newCol = col + dCol;
      
      if (isValid(newRow, newCol)) {
        available.push({ row: newRow, col: newCol });
      }
    }
    
    return available;
  };
  
  const dfs = (row: number, col: number): boolean => {
    visited[row][col] = true;
    stack.push({ row, col });
    
    if (!(row === 0 && col === 0) && !(row === rows - 1 && col === cols - 1)) {
      maze[row][col] = 'visited';
    }
    
    const availablePaths = getAvailablePaths(row, col);
    const isDecisionPoint = availablePaths.length > 1;
    
    // Mark decision points
    if (isDecisionPoint && !(row === 0 && col === 0) && !(row === rows - 1 && col === cols - 1)) {
      maze[row][col] = 'decision';
    }
    
    // Record step
    steps.push({
      position: { row, col },
      stack: [...stack],
      action: isDecisionPoint ? 'decision' : 'explore',
      availablePaths,
      maze: maze.map(row => [...row])
    });
    
    if (row === rows - 1 && col === cols - 1) {
      found = true;
      steps.push({
        position: { row, col },
        stack: [...stack],
        action: 'solution',
        availablePaths: [],
        maze: maze.map(row => [...row])
      });
      return true;
    }
    
    const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];
    
    for (const [dRow, dCol] of directions) {
      const newRow = row + dRow;
      const newCol = col + dCol;
      
      if (isValid(newRow, newCol)) {
        if (dfs(newRow, newCol)) {
          return true;
        }
      }
    }
    
    // Backtrack
    stack.pop();
    steps.push({
      position: { row, col },
      stack: [...stack],
      action: 'backtrack',
      availablePaths: [],
      maze: maze.map(row => [...row])
    });
    
    return false;
  };
  
  dfs(0, 0);
  
  return steps;
};

export const solveMazeWithDFS = async (
  initialMaze: CellType[][],
  setMaze: (maze: CellType[][]) => void,
  setStats: (stats: MazeStats) => void
): Promise<DFSResult> => {
  const rows = initialMaze.length;
  const cols = initialMaze[0].length;
  const maze = initialMaze.map(row => [...row]);
  
  const visited = Array(rows).fill(null).map(() => Array(cols).fill(false));
  const path: Position[] = [];
  const allVisited: Position[] = [];
  let backtrackCount = 0;
  let found = false;
  
  const isValid = (row: number, col: number): boolean => {
    return row >= 0 && row < rows && 
           col >= 0 && col < cols && 
           (maze[row][col] === 'path' || maze[row][col] === 'visited') && 
           !visited[row][col];
  };
  
  const dfs = async (row: number, col: number): Promise<boolean> => {
    visited[row][col] = true;
    path.push({ row, col });
    allVisited.push({ row, col });
    
    if (!(row === 0 && col === 0) && !(row === rows - 1 && col === cols - 1)) {
      maze[row][col] = 'visited';
    }
    
    setMaze([...maze]);
    setStats({
      pathLength: path.length,
      cellsVisited: allVisited.length,
      backtrackCount,
      solutionFound: false,
      currentStep: 0,
      totalSteps: 0
    });
    
    await new Promise(resolve => setTimeout(resolve, 50));
    
    if (row === rows - 1 && col === cols - 1) {
      found = true;
      return true;
    }
    
    const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];
    
    for (const [dRow, dCol] of directions) {
      const newRow = row + dRow;
      const newCol = col + dCol;
      
      if (isValid(newRow, newCol)) {
        if (await dfs(newRow, newCol)) {
          return true;
        }
      }
    }
    
    path.pop();
    backtrackCount++;
    
    setStats({
      pathLength: path.length,
      cellsVisited: allVisited.length,
      backtrackCount,
      solutionFound: false,
      currentStep: 0,
      totalSteps: 0
    });
    
    await new Promise(resolve => setTimeout(resolve, 30));
    
    return false;
  };
  
  await dfs(0, 0);
  
  if (found) {
    for (const pos of path) {
      if (!(pos.row === 0 && pos.col === 0) && !(pos.row === rows - 1 && pos.col === cols - 1)) {
        maze[pos.row][pos.col] = 'solution';
      }
    }
    
    maze[0][0] = 'start';
    maze[rows - 1][cols - 1] = 'end';
    
    setMaze([...maze]);
  }
  
  setStats({
    pathLength: path.length,
    cellsVisited: allVisited.length,
    backtrackCount,
    solutionFound: found,
    currentStep: 0,
    totalSteps: 0
  });
  
  return {
    solution: path,
    visitedCells: allVisited,
    backtrackCount,
    found
  };
};
