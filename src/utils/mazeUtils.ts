
import { CellType, Position, DFSResult, MazeStats } from '@/types/maze';

export const generateMaze = (rows: number, cols: number): CellType[][] => {
  // Ensure odd dimensions for proper maze generation
  const mazeRows = rows % 2 === 0 ? rows + 1 : rows;
  const mazeCols = cols % 2 === 0 ? cols + 1 : cols;
  
  // Create initial maze filled with walls
  const maze: CellType[][] = Array(mazeRows).fill(null).map(() => 
    Array(mazeCols).fill('wall' as CellType)
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
      
      if (newRow >= 0 && newRow < mazeRows && 
          newCol >= 0 && newCol < mazeCols && 
          maze[newRow][newCol] === 'wall') {
        
        // Carve path between current and new cell
        maze[row + dRow / 2][col + dCol / 2] = 'path';
        carve(newRow, newCol);
      }
    }
  };
  
  // Start carving from (1,1) to ensure odd coordinates
  if (mazeRows > 1 && mazeCols > 1) {
    carve(1, 1);
  }
  
  // Ensure start and end are accessible
  maze[0][0] = 'path'; // Start
  maze[mazeRows - 1][mazeCols - 1] = 'path'; // End
  
  // Clear path to start and end if needed
  if (mazeRows > 1) maze[1][0] = 'path';
  if (mazeCols > 1) maze[0][1] = 'path';
  if (mazeRows > 2) maze[mazeRows - 2][mazeCols - 1] = 'path';
  if (mazeCols > 2) maze[mazeRows - 1][mazeCols - 2] = 'path';
  
  return maze;
};

export const solveMazeWithDFS = async (
  initialMaze: CellType[][],
  setMaze: (maze: CellType[][]) => void,
  setStats: (stats: MazeStats) => void
): Promise<DFSResult> => {
  const rows = initialMaze.length;
  const cols = initialMaze[0].length;
  
  // Create a copy of the maze for visualization
  const maze = initialMaze.map(row => [...row]);
  
  // Reset any previous visualization
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (maze[i][j] === 'visited' || maze[i][j] === 'solution' || maze[i][j] === 'current') {
        maze[i][j] = 'path';
      }
    }
  }
  
  const visited = Array(rows).fill(null).map(() => Array(cols).fill(false));
  const path: Position[] = [];
  const allVisited: Position[] = [];
  let backtrackCount = 0;
  let found = false;
  
  const isValid = (row: number, col: number): boolean => {
    return row >= 0 && row < rows && 
           col >= 0 && col < cols && 
           maze[row][col] === 'path' && 
           !visited[row][col];
  };
  
  const dfs = async (row: number, col: number): Promise<boolean> => {
    // Mark as visited
    visited[row][col] = true;
    path.push({ row, col });
    allVisited.push({ row, col });
    
    // Update visualization
    if (!(row === 0 && col === 0) && !(row === rows - 1 && col === cols - 1)) {
      maze[row][col] = 'visited';
    }
    
    // Update maze and stats
    setMaze(maze.map(row => [...row]));
    setStats({
      pathLength: path.length,
      cellsVisited: allVisited.length,
      backtrackCount,
      solutionFound: false
    });
    
    // Add delay for visualization
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Check if we reached the end
    if (row === rows - 1 && col === cols - 1) {
      found = true;
      return true;
    }
    
    // Explore neighbors (up, right, down, left)
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
    
    // Backtrack
    path.pop();
    backtrackCount++;
    
    // Update stats during backtracking
    setStats({
      pathLength: path.length,
      cellsVisited: allVisited.length,
      backtrackCount,
      solutionFound: false
    });
    
    await new Promise(resolve => setTimeout(resolve, 50));
    
    return false;
  };
  
  // Start DFS from (0, 0)
  await dfs(0, 0);
  
  // Highlight the solution path
  if (found) {
    for (const pos of path) {
      if (!(pos.row === 0 && pos.col === 0) && !(pos.row === rows - 1 && pos.col === cols - 1)) {
        maze[pos.row][pos.col] = 'solution';
      }
    }
    
    // Mark start and end
    maze[0][0] = 'start';
    maze[rows - 1][cols - 1] = 'end';
    
    setMaze(maze.map(row => [...row]));
  }
  
  // Final stats update
  setStats({
    pathLength: path.length,
    cellsVisited: allVisited.length,
    backtrackCount,
    solutionFound: found
  });
  
  return {
    solution: path,
    visitedCells: allVisited,
    backtrackCount,
    found
  };
};
