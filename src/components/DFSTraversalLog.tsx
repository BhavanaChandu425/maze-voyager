
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
    
    for (let i = 0; i < stepsToProcess.length; i++) {
      const step = stepsToProcess[i];
      
      if (step.action === 'explore' || step.action === 'decision') {
        if (i > 0) { // Don't add visited for the start position
          log.push({
            message: `Visited: (${step.position.row}, ${step.position.col})`,
            position: step.position,
            type: step.action === 'decision' ? 'decision' : 'visit'
          });
        }
      } else if (step.action === 'backtrack') {
        log.push({
          message: `Backtracking from: (${step.position.row}, ${step.position.col})`,
          position: step.position,
          type: 'backtrack'
        });
      } else if (step.action === 'solution') {
        log.push({
          message: `Reached end at (${step.position.row}, ${step.position.col})`,
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

  const traversalLog = generateTraversalLog();

  return (
    <div className="space-y-4">
      {/* Current Position Stack */}
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg">Current Position Stack</CardTitle>
        </CardHeader>
        <CardContent>
          {currentStep ? (
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700">
                Current: {formatPosition(currentStep.position)}
              </div>
              
              {currentStep.availablePaths.length > 0 && (
                <div className="space-y-1">
                  <div className="text-sm font-medium text-gray-700">Available paths:</div>
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
                  Stack ({currentStep.stack.length} positions):
                </div>
                <div className="ml-4 space-y-1 max-h-32 overflow-y-auto">
                  {currentStep.stack.slice().reverse().map((pos, index) => (
                    <div 
                      key={index} 
                      className={`text-sm ${
                        index === 0 ? 'text-green-600 font-medium' : 'text-gray-600'
                      }`}
                    >
                      {index === 0 ? '→ ' : '  '}{formatPosition(pos)}
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
                <div key={index} className="flex items-center gap-2 text-sm">
                  <Badge 
                    variant={
                      entry.type === 'start' ? 'default' :
                      entry.type === 'visit' ? 'secondary' :
                      entry.type === 'decision' ? 'outline' :
                      entry.type === 'backtrack' ? 'destructive' :
                      'default'
                    }
                    className="text-xs"
                  >
                    {entry.type === 'start' ? 'START' :
                     entry.type === 'visit' ? 'VISIT' :
                     entry.type === 'decision' ? 'DECISION' :
                     entry.type === 'backtrack' ? 'BACK' :
                     'END'}
                  </Badge>
                  <span className="text-gray-700">{entry.message}</span>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-sm">Start the algorithm to see traversal log</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
