
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MazeStats as MazeStatsType } from '@/types/maze';

interface MazeStatsProps {
  stats: MazeStatsType;
}

export const MazeStats: React.FC<MazeStatsProps> = ({ stats }) => {
  return (
    <Card className="bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Statistics
          <Badge variant={stats.solutionFound ? "default" : "secondary"}>
            {stats.solutionFound ? 'Solved' : 'Unsolved'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.cellsVisited}</div>
            <div className="text-sm text-gray-600">Cells Visited</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.pathLength}</div>
            <div className="text-sm text-gray-600">Path Length</div>
          </div>
        </div>
        
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">{stats.backtrackCount}</div>
          <div className="text-sm text-gray-600">Backtrack Count</div>
        </div>

        {stats.solutionFound && (
          <div className="text-center p-3 bg-purple-50 rounded-lg border-2 border-purple-200">
            <div className="text-lg font-semibold text-purple-700">Solution Found!</div>
            <div className="text-sm text-gray-600 mt-1">
              DFS successfully navigated the maze
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
