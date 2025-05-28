
import React from 'react';
import { CellType } from '@/types/maze';
import { cn } from '@/lib/utils';

interface MazeGridProps {
  maze: CellType[][];
  isAnimating?: boolean;
}

export const MazeGrid: React.FC<MazeGridProps> = ({ maze, isAnimating = false }) => {
  if (!maze.length) {
    return (
      <div className="flex items-center justify-center h-96 w-96 bg-gray-100 rounded-lg">
        <div className="text-gray-500">Loading maze...</div>
      </div>
    );
  }

  const getCellStyle = (cellType: CellType) => {
    switch (cellType) {
      case 'wall':
        return 'bg-black';
      case 'path':
        return 'bg-white border border-gray-200';
      case 'visited':
        return 'bg-blue-400 border border-blue-300';
      case 'solution':
        return 'bg-green-500 border border-green-400';
      case 'start':
        return 'bg-red-500 border border-red-400';
      case 'end':
        return 'bg-purple-500 border border-purple-400';
      case 'current':
        return 'bg-yellow-400 border border-yellow-300 animate-pulse';
      default:
        return 'bg-white border border-gray-200';
    }
  };

  const cellSize = Math.min(400 / maze.length, 400 / maze[0].length);

  return (
    <div 
      className={cn(
        "grid gap-0 border-2 border-gray-400 rounded-lg overflow-hidden shadow-lg",
        isAnimating && "animate-pulse"
      )}
      style={{
        gridTemplateColumns: `repeat(${maze[0].length}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${maze.length}, ${cellSize}px)`,
      }}
    >
      {maze.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={cn(
              "transition-all duration-200",
              getCellStyle(cell)
            )}
            style={{
              width: `${cellSize}px`,
              height: `${cellSize}px`,
            }}
            title={`Row: ${rowIndex}, Col: ${colIndex}, Type: ${cell}`}
          />
        ))
      )}
    </div>
  );
};
