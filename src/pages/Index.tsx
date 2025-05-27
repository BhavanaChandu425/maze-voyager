
import React, { useState, useCallback, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MazeGrid } from '@/components/MazeGrid';
import { AlgorithmExplanation } from '@/components/AlgorithmExplanation';
import { MazeStats } from '@/components/MazeStats';
import { generateMaze, solveMazeWithDFS } from '@/utils/mazeUtils';
import { CellType, MazeStats as MazeStatsType } from '@/types/maze';

const Index = () => {
  const [maze, setMaze] = useState<CellType[][]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSolving, setIsSolving] = useState(false);
  const [stats, setStats] = useState<MazeStatsType>({
    pathLength: 0,
    cellsVisited: 0,
    backtrackCount: 0,
    solutionFound: false
  });
  const [mazeSize] = useState({ rows: 15, cols: 15 });

  const handleGenerateNewMaze = useCallback(async () => {
    setIsGenerating(true);
    setStats({ pathLength: 0, cellsVisited: 0, backtrackCount: 0, solutionFound: false });
    
    try {
      // Simulate generation delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newMaze = generateMaze(mazeSize.rows, mazeSize.cols);
      setMaze(newMaze);
    } catch (error) {
      console.error('Error generating maze:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [mazeSize]);

  const handleSolveMaze = useCallback(async () => {
    if (!maze || maze.length === 0) return;
    
    setIsSolving(true);
    try {
      await solveMazeWithDFS(maze, setMaze, setStats);
    } catch (error) {
      console.error('Error solving maze:', error);
    } finally {
      setIsSolving(false);
    }
  }, [maze]);

  // Generate initial maze on component mount
  useEffect(() => {
    handleGenerateNewMaze();
  }, [handleGenerateNewMaze]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">🧩</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-800">Maze Solver using DFS</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            This application generates a random maze and solves it using Depth-First Search (DFS).
          </p>
        </div>

        {/* Legend */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-sm">Red - Start position</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-500 rounded"></div>
                <span className="text-sm">Purple - End position</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-400 rounded"></div>
                <span className="text-sm">Blue - Visited cells</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm">Green - Solution path</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-black rounded"></div>
                <span className="text-sm">Black - Wall</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
                <span className="text-sm">White - Path</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <div className="text-center">
          <p className="text-gray-600 italic">
            Click "Generate New Maze" to create a new puzzle, then "Solve Maze" to watch DFS in action!
          </p>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <Button 
            onClick={handleGenerateNewMaze}
            disabled={isGenerating || isSolving}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isGenerating ? 'Generating...' : 'Generate New Maze'}
          </Button>
          <Button 
            onClick={handleSolveMaze}
            disabled={isSolving || isGenerating || !maze || maze.length === 0}
            variant="outline"
            size="lg"
            className="border-green-600 text-green-600 hover:bg-green-50"
          >
            {isSolving ? 'Solving...' : 'Solve Maze'}
          </Button>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Maze Visualization */}
          <div className="lg:col-span-2">
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Maze Visualization</CardTitle>
                <CardDescription>
                  {maze && maze.length > 0 ? `${mazeSize.rows} × ${mazeSize.cols} maze` : 'Loading maze...'}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <MazeGrid 
                  maze={maze} 
                  isAnimating={isSolving}
                />
              </CardContent>
            </Card>
          </div>

          {/* Statistics and Info */}
          <div className="space-y-6">
            <MazeStats stats={stats} />
            <AlgorithmExplanation />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
