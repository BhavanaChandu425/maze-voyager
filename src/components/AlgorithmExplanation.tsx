
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const AlgorithmExplanation: React.FC = () => {
  return (
    <Card className="bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Algorithm Explanation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Depth-First Search (DFS)</h4>
          <p className="text-sm text-gray-600">
            DFS explores the maze by going as deep as possible into each path before backtracking. 
            It uses a stack-like approach to remember where to return when hitting dead ends.
          </p>
        </div>

        <Separator />

        <div>
          <h4 className="font-semibold text-gray-800 mb-2">How it works:</h4>
          <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
            <li>Start at the entrance (top-left)</li>
            <li>Mark current cell as visited (blue)</li>
            <li>Explore unvisited neighbors</li>
            <li>If dead end, backtrack to previous cell</li>
            <li>Continue until exit is found</li>
            <li>Highlight final path (green)</li>
          </ol>
        </div>

        <Separator />

        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Algorithm Properties:</h4>
          <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
            <li><strong>Time Complexity:</strong> O(V + E)</li>
            <li><strong>Space Complexity:</strong> O(V)</li>
            <li><strong>Completeness:</strong> Yes (finds solution if exists)</li>
            <li><strong>Optimality:</strong> No (may not find shortest path)</li>
          </ul>
        </div>

        <Separator />

        <div>
          <h4 className="font-semibold text-gray-800 mb-2">vs Other Algorithms:</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <div><strong>BFS:</strong> Finds shortest path but uses more memory</div>
            <div><strong>A*:</strong> More efficient with heuristics</div>
            <div><strong>Dijkstra:</strong> Best for weighted graphs</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
