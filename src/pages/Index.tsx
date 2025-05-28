
import React, { useState, useCallback, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MazeGrid } from '@/components/MazeGrid';
import { AlgorithmExplanation } from '@/components/AlgorithmExplanation';
import { MazeStats } from '@/components/MazeStats';
import { AlgorithmVisualization } from '@/components/AlgorithmVisualization';
import { generateMaze, solveMazeWithDFS, generateDFSSteps } from '@/utils/mazeUtils';
import { CellType, Position, MazeStats as MazeStatsType, AlgorithmState, DFSStep } from '@/types/maze';

const Index = () => {
  const [maze, setMaze] = useState<CellType[][]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSolving, setIsSolving] = useState(false);
  const [stats, setStats] = useState<MazeStatsType>({
    pathLength: 0,
    cellsVisited: 0,
    backtrackCount: 0,
    solutionFound: false,
    currentStep: 0,
    totalSteps: 0
  });
  const [mazeSize] = useState({ rows: 15, cols: 15 });
  const [algorithmState, setAlgorithmState] = useState<AlgorithmState>({
    isRunning: false,
    isPaused: false,
    currentStep: 0,
    steps: [],
    speed: 500
  });
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const handleGenerateNewMaze = useCallback(async () => {
    setIsGenerating(true);
    setStats({ pathLength: 0, cellsVisited: 0, backtrackCount: 0, solutionFound: false, currentStep: 0, totalSteps: 0 });
    setAlgorithmState(prev => ({ ...prev, steps: [], currentStep: 0, isRunning: false }));
    
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newMaze = generateMaze(mazeSize.rows, mazeSize.cols);
    setMaze(newMaze);
    setIsGenerating(false);
  }, [mazeSize, intervalId]);

  const handleSolveMaze = useCallback(async () => {
    if (maze.length === 0) return;
    
    setIsSolving(true);
    const result = await solveMazeWithDFS(maze, setMaze, setStats);
    setIsSolving(false);
  }, [maze]);

  const handleStepByStepSolve = useCallback(() => {
    if (maze.length === 0) return;
    
    const steps = generateDFSSteps(maze);
    setAlgorithmState(prev => ({
      ...prev,
      steps,
      currentStep: 0,
      isRunning: true,
      isPaused: false
    }));
    
    setStats(prev => ({ ...prev, totalSteps: steps.length }));
  }, [maze]);

  const playSteps = useCallback(() => {
    if (intervalId) clearInterval(intervalId);
    
    const id = setInterval(() => {
      setAlgorithmState(prev => {
        if (prev.currentStep >= prev.steps.length - 1) {
          clearInterval(id);
          return { ...prev, isRunning: false };
        }
        
        const nextStep = prev.currentStep + 1;
        const currentStepData = prev.steps[nextStep];
        
        if (currentStepData) {
          setMaze(currentStepData.maze);
          setStats(prevStats => ({
            ...prevStats,
            currentStep: nextStep,
            pathLength: currentStepData.stack.length,
            cellsVisited: nextStep + 1,
            backtrackCount: prev.steps.slice(0, nextStep + 1).filter(s => s.action === 'backtrack').length
          }));
        }
        
        return { ...prev, currentStep: nextStep };
      });
    }, algorithmState.speed);
    
    setIntervalId(id);
  }, [algorithmState.speed, intervalId]);

  const pauseSteps = useCallback(() => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setAlgorithmState(prev => ({ ...prev, isRunning: false, isPaused: true }));
  }, [intervalId]);

  const stopSteps = useCallback(() => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setAlgorithmState(prev => ({ ...prev, isRunning: false, isPaused: false, currentStep: 0 }));
    if (maze.length > 0) {
      const newMaze = generateMaze(mazeSize.rows, mazeSize.cols);
      setMaze(newMaze);
    }
    setStats({ pathLength: 0, cellsVisited: 0, backtrackCount: 0, solutionFound: false, currentStep: 0, totalSteps: 0 });
  }, [intervalId, maze.length, mazeSize]);

  const stepForward = useCallback(() => {
    setAlgorithmState(prev => {
      if (prev.currentStep >= prev.steps.length - 1) return prev;
      
      const nextStep = prev.currentStep + 1;
      const currentStepData = prev.steps[nextStep];
      
      if (currentStepData) {
        setMaze(currentStepData.maze);
        setStats(prevStats => ({
          ...prevStats,
          currentStep: nextStep,
          pathLength: currentStepData.stack.length,
          cellsVisited: nextStep + 1,
          backtrackCount: prev.steps.slice(0, nextStep + 1).filter(s => s.action === 'backtrack').length
        }));
      }
      
      return { ...prev, currentStep: nextStep };
    });
  }, []);

  const stepBackward = useCallback(() => {
    setAlgorithmState(prev => {
      if (prev.currentStep <= 0) return prev;
      
      const prevStep = prev.currentStep - 1;
      const currentStepData = prev.steps[prevStep];
      
      if (currentStepData) {
        setMaze(currentStepData.maze);
        setStats(prevStats => ({
          ...prevStats,
          currentStep: prevStep,
          pathLength: currentStepData.stack.length,
          cellsVisited: prevStep + 1,
          backtrackCount: prev.steps.slice(0, prevStep + 1).filter(s => s.action === 'backtrack').length
        }));
      }
      
      return { ...prev, currentStep: prevStep };
    });
  }, []);

  const changeSpeed = useCallback((speed: number) => {
    setAlgorithmState(prev => ({ ...prev, speed }));
  }, []);

  useEffect(() => {
    if (algorithmState.isRunning && !algorithmState.isPaused) {
      playSteps();
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [algorithmState.isRunning, algorithmState.isPaused, playSteps]);

  useEffect(() => {
    handleGenerateNewMaze();
  }, [handleGenerateNewMaze]);

  const currentStep = algorithmState.steps[algorithmState.currentStep] || null;

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
            This application generates a random maze and solves it using Depth-First Search (DFS) with step-by-step visualization.
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
                <div className="w-4 h-4 bg-blue-400 rounded"></div>
                <span className="text-sm">Blue - Visited path by DFS</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm">Green - Final path from start to end</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-pink-400 rounded animate-pulse"></div>
                <span className="text-sm">Pink - Decision points (multiple paths)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-400 rounded"></div>
                <span className="text-sm">Orange - Stack positions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-black rounded"></div>
                <span className="text-sm">Black - Wall</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
                <span className="text-sm">White - Path</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-sm">Red - Start</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-500 rounded"></div>
                <span className="text-sm">Purple - End</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <div className="flex justify-center gap-4 flex-wrap">
          <Button 
            onClick={handleGenerateNewMaze}
            disabled={isGenerating || isSolving || algorithmState.isRunning}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isGenerating ? 'Generating...' : 'Generate New Maze'}
          </Button>
          <Button 
            onClick={handleSolveMaze}
            disabled={isSolving || isGenerating || maze.length === 0 || algorithmState.isRunning}
            variant="outline"
            size="lg"
            className="border-green-600 text-green-600 hover:bg-green-50"
          >
            {isSolving ? 'Solving...' : 'Solve Maze (Fast)'}
          </Button>
          <Button 
            onClick={handleStepByStepSolve}
            disabled={isGenerating || maze.length === 0 || algorithmState.isRunning}
            variant="outline"
            size="lg"
            className="border-purple-600 text-purple-600 hover:bg-purple-50"
          >
            Step-by-Step Solve
          </Button>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Maze Visualization */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Maze Visualization</CardTitle>
                <CardDescription>
                  {maze.length > 0 ? `${mazeSize.rows} × ${mazeSize.cols} maze` : 'Loading maze...'}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <MazeGrid 
                  maze={maze} 
                  isAnimating={isSolving || algorithmState.isRunning}
                />
              </CardContent>
            </Card>

            {algorithmState.steps.length > 0 && (
              <AlgorithmVisualization
                algorithmState={algorithmState}
                currentStep={currentStep}
                onPlay={playSteps}
                onPause={pauseSteps}
                onStop={stopSteps}
                onStepForward={stepForward}
                onStepBackward={stepBackward}
                onSpeedChange={changeSpeed}
              />
            )}
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
