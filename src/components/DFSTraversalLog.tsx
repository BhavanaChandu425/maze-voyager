
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Position, DFSStep, LogEntry } from '@/types/maze';

interface DFSTraversalLogProps {
  currentStep: DFSStep | null;
  allSteps: DFSStep[];
  currentStepIndex: number;
}

export const DFSTraversalLog: React.FC<DFSTraversalLogProps> = ({
  currentStep,
  allSteps,
  currentStepIndex
}) => {
  // Add debugging
  console.log('DFSTraversalLog - currentStepIndex:', currentStepIndex);
  console.log('DFSTraversalLog - allSteps length:', allSteps.length);
  console.log('DFSTraversalLog - currentStep:', currentStep);

  const generateTraversalLog = (): LogEntry[] => {
    const log: LogEntry[] = [];
    
    if (allSteps.length === 0) return log;
    
    // Add start message
    log.push({
      message: `DFS started at (${allSteps[0].position.row}, ${allSteps[0].position.col})`,
      position: allSteps[0].position,
      type: 'start'
    });
    
    // Process steps up to current step
    const stepsToProcess = allSteps.slice(0, currentStepIndex + 1);
    
    for (let i = 1; i < stepsToProcess.length; i++) {
      const step = stepsToProcess[i];
      const prevStep = stepsToProcess[i - 1];
      
      if (step.action === 'explore' || step.action === 'decision') {
        // Show the path taken to reach this position
        const pathToHere = step.stack.map(pos => `(${pos.row}, ${pos.col})`).join(' → ');
        log.push({
          message: `Visited: (${step.position.row}, ${step.position.col}) | Path: ${pathToHere}`,
          position: step.position,
          type: step.action === 'decision' ? 'decision' : 'visit'
        });
        
        if (step.availablePaths.length > 1) {
          const pathsText = step.availablePaths.map(p => `(${p.row}, ${p.col})`).join(', ');
          log.push({
            message: `Decision point at (${step.position.row}, ${step.position.col}) - Available paths: ${pathsText}`,
            position: step.position,
            type: 'decision'
          });
        }
      } else if (step.action === 'backtrack') {
        const backtrackToPos = step.stack.length > 0 ? step.stack[step.stack.length - 1] : null;
        const backtrackMsg = backtrackToPos 
          ? `Backtracking from (${step.position.row}, ${step.position.col}) to (${backtrackToPos.row}, ${backtrackToPos.col})`
          : `Backtracking from (${step.position.row}, ${step.position.col})`;
        
        log.push({
          message: backtrackMsg,
          position: step.position,
          type: 'backtrack'
        });
      } else if (step.action === 'solution') {
        const finalPath = step.stack.map(pos => `(${pos.row}, ${pos.col})`).join(' → ');
        log.push({
          message: `Reached end at (${step.position.row}, ${step.position.col}) | Final path: ${finalPath}`,
          position: step.position,
          type: 'end'
        });
      }
    }
    
    return log;
  };

  const formatPosition = (pos: Position): string => {
    return `(${pos.row}, ${pos.col})`;
  };

  const formatStackPositions = (stack: Position[]): string => {
    return stack.map(pos => formatPosition(pos)).join(' → ');
  };

  const traversalLog = generateTraversalLog();

  return (
    <div className="space-y-4">
      {/* Current Position Stack */}
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg">Current Position & Stack</CardTitle>
        </CardHeader>
        <CardContent>
          {currentStep ? (
            <div className="space-y-3">
              <div className="text-sm">
                <div className="font-medium text-gray-700 mb-1">
                  Current Position: {formatPosition(currentStep.position)}
                </div>
                <div className="text-gray-600">
                  <strong>Stack Path:</strong> {formatStackPositions(currentStep.stack)}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Step {currentStepIndex + 1} of {allSteps.length} | Action: {currentStep.action}
                </div>
              </div>
              
              {currentStep.availablePaths.length > 0 && (
                <div className="space-y-1">
                  <div className="text-sm font-medium text-gray-700">Available paths from {formatPosition(currentStep.position)}:</div>
                  <div className="ml-4 space-y-1">
                    {currentStep.availablePaths.map((path, index) => (
                      <div key={index} className="text-sm text-blue-600">
                        → {formatPosition(path)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="space-y-1">
                <div className="text-sm font-medium text-gray-700">
                  Stack Details ({currentStep.stack.length} positions):
                </div>
                <div className="ml-4 space-y-1 max-h-32 overflow-y-auto">
                  {currentStep.stack.slice().reverse().map((pos, index) => (
                    <div 
                      key={index} 
                      className={`text-sm ${
                        index === 0 ? 'text-green-600 font-medium' : 'text-gray-600'
                      }`}
                    >
                      {index === 0 ? '→ ' : '  '}{formatPosition(pos)} {index === 0 ? '(current)' : `(depth ${currentStep.stack.length - index - 1})`}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-500 text-sm">No active traversal</div>
          )}
        </CardContent>
      </Card>

      {/* Traversal Log */}
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg">DFS Traversal Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {traversalLog.length > 0 ? (
              traversalLog.map((entry, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <Badge 
                    variant={
                      entry.type === 'start' ? 'default' :
                      entry.type === 'visit' ? 'secondary' :
                      entry.type === 'decision' ? 'outline' :
                      entry.type === 'backtrack' ? 'destructive' :
                      'default'
                    }
                    className="text-xs min-w-20 flex-shrink-0"
                  >
                    {entry.type === 'start' ? 'START' :
                     entry.type === 'visit' ? 'VISIT' :
                     entry.type === 'decision' ? 'DECISION' :
                     entry.type === 'backtrack' ? 'BACKTRACK' :
                     'END'}
                  </Badge>
                  <span className="text-gray-700 leading-relaxed">{entry.message}</span>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-sm">Start the step-by-step algorithm to see traversal log</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
