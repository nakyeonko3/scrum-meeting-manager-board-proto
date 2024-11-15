import React from 'react';
import { Timer as TimerIcon } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface TimerProps {
  timeLeft: number;
  totalTime: number;
}

export function Timer({ timeLeft, totalTime }: TimerProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (timeLeft / totalTime) * 100;
  const isWarning = timeLeft < totalTime * 0.3;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <TimerIcon className={`w-4 h-4 ${isWarning ? 'text-red-500' : ''}`} />
        <span className={`font-mono ${isWarning ? 'text-red-500' : ''}`}>
          {formatTime(timeLeft)}
        </span>
      </div>
      <Progress value={progress} className="w-[100px]" />
    </div>
  );
}