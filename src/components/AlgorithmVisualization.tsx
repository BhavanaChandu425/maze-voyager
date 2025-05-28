
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Position, AlgorithmState, DFSStep } from '@/types/maze';
import { Play, Pause, Square, SkipForward, SkipBack } from 'lucide-react';

interface AlgorithmVisualizationProps {
  algorithmState: AlgorithmState;
  currentStep: DFSStep | null;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onSpeedChange: (speed: number) => void;
}

export const AlgorithmVisualization: React.FC<AlgorithmVisualizationProps> = ({
  algorithmState,
  currentStep,
  onPlay,
  onPause,
  onStop,
  onStepForward,
  onStepBackward,
  onSpeedChange
}) => {
  const speedOptions = [
    { label: 'Slow', value: 1000 },
    { label: 'Medium', value: 500 },
    { label: 'Fast', value: 200 },
    { label: 'Very Fast', value: 50 }
  ];

  return (
    <Card className="bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Algorithm Execution
          <Badge variant={algorithmState.isRunning ? "default" : "secondary"}>
            {algorithmState.isRunning ? 'Running' : 'Stopped'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Controls */}
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={algorithmState.isRunning ? onPause : onPlay}
            disabled={!algorithmState.steps.length}
            size="sm"
            className="flex items-center gap-1"
          >
            {algorithmState.isRunning ? <Pause size={16} /> : <Play size={16} />}
            {algorithmState.isRunning ? 'Pause' : 'Play'}
          </Button>
          
          <Button onClick={onStop} size="sm" variant="outline">
            <Square size={16} />
            Stop
          </Button>
          
          <Button 
            onClick={onStepBackward}
            disabled={algorithmState.currentStep === 0}
            size="sm"
            variant="outline"
          >
            <SkipBack size={16} />
            Step Back
          </Button>
          
          <Button 
            onClick={onStepForward}
            disabled={algorithmState.currentStep >= algorithmState.steps.length - 1}
            size="sm"
            variant="outline"
          >
            <SkipForward size={16} />
            Step Forward
          </Button>
        </div>

        {/* Speed Control */}
        <div>
          <label className="text-sm font-medium mb-2 block">Speed:</label>
          <div className="flex gap-2">
            {speedOptions.map((option) => (
              <Button
                key={option.value}
                onClick={() => onSpeedChange(option.value)}
                variant={algorithmState.speed === option.value ? "default" : "outline"}
                size="sm"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Current Step Info */}
        {currentStep && (
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-sm mb-2">Current Position:</h4>
              <div className="bg-blue-50 p-2 rounded text-sm">
                Row: {currentStep.position.row}, Col: {currentStep.position.col}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-2">Action:</h4>
              <Badge variant={
                currentStep.action === 'explore' ? 'default' :
                currentStep.action === 'backtrack' ? 'destructive' :
                currentStep.action === 'decision' ? 'secondary' : 'default'
              }>
                {currentStep.action}
              </Badge>
            </div>

            {currentStep.availablePaths.length > 1 && (
              <div>
                <h4 className="font-semibold text-sm mb-2">Decision Point - Available Paths:</h4>
                <div className="space-y-1">
                  {currentStep.availablePaths.map((path, index) => (
                    <div key={index} className="bg-yellow-50 p-1 rounded text-sm">
                      Row: {path.row}, Col: {path.col}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="font-semibold text-sm mb-2">Stack ({currentStep.stack.length} positions):</h4>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {currentStep.stack.slice().reverse().map((pos, index) => (
                  <div 
                    key={index} 
                    className={`p-1 rounded text-sm ${
                      index === 0 ? 'bg-green-100 font-medium' : 'bg-gray-50'
                    }`}
                  >
                    {index === 0 && '→ '}Row: {pos.row}, Col: {pos.col}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Progress */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Progress</span>
            <span>{algorithmState.currentStep + 1} / {algorithmState.steps.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${algorithmState.steps.length > 0 ? 
                  ((algorithmState.currentStep + 1) / algorithmState.steps.length) * 100 : 0}%` 
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
