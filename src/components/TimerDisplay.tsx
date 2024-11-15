import React from 'react';
import { Timer as TimerIcon, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface TimerDisplayProps {
  totalTime: number;
  speakerTime: number;
  speakerTimeLimit: number;
  isRecording: boolean;
  currentSpeaker: string | null;
}

export function TimerDisplay({
  totalTime,
  speakerTime,
  speakerTimeLimit,
  isRecording,
  currentSpeaker,
}: TimerDisplayProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const speakerProgress = (speakerTime / speakerTimeLimit) * 100;
  const isWarning = speakerTime < speakerTimeLimit * 0.3;

  return (
    <div className="fixed top-4 right-4 space-y-4 w-64">
      {/* Total Meeting Timer */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-500">Total Time</span>
              </div>
              <span className="font-mono text-xl">{formatTime(totalTime)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Speaker Timer */}
      <Card className={cn(
        'transition-colors duration-300',
        isRecording && isWarning ? 'border-red-500' : 'border-gray-200'
      )}>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TimerIcon className={cn(
                  'w-4 h-4',
                  isRecording && isWarning ? 'text-red-500' : 'text-gray-500'
                )} />
                <span className="text-sm font-medium text-gray-500">Speaker Time</span>
              </div>
              <span className={cn(
                'font-mono text-xl',
                isRecording && isWarning ? 'text-red-500' : ''
              )}>
                {formatTime(speakerTime)}
              </span>
            </div>
            
            {isRecording && (
              <>
                <Progress 
                  value={speakerProgress} 
                  className={cn(
                    'h-2',
                    isWarning ? 'bg-red-100 [&>div]:bg-red-500' : ''
                  )}
                />
                <div className="text-sm text-gray-500 truncate">
                  {currentSpeaker ? `Speaking: ${currentSpeaker}` : 'No speaker'}
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}