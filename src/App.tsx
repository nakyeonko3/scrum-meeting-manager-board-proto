import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Timer } from './components/Timer';
import { TimerDisplay } from './components/TimerDisplay';
import { TeamManagement } from './components/TeamManagement';
import { Member, TeamPreset, Recording } from './types';
import { ArrowUpDown, Mic, Square, MoveDown, X } from 'lucide-react';

export default function App() {
  const [members, setMembers] = useState<Member[]>([]);
  const [presets, setPresets] = useState<TeamPreset[]>([]);
  const [scrumOrder, setScrumOrder] = useState<Member[]>([]);
  const [recording, setRecording] = useState(false);
  const [currentSpeaker, setCurrentSpeaker] = useState<Member | null>(null);
  const [timeLeft, setTimeLeft] = useState(120);
  const [totalTime, setTotalTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const totalTimerRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [recordings, setRecordings] = useState<Record<string, Recording>>({});

  const shuffleMembers = () => {
    const shuffled = [...members].sort(() => Math.random() - 0.5);
    setScrumOrder(shuffled);
  };

  const moveToEnd = () => {
    if (scrumOrder.length > 1) {
      setScrumOrder(prev => {
        const [first, ...rest] = prev;
        return [...rest, first];
      });
    }
  };

  const startTimer = (duration: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(duration);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startRecording = async (member: Member) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setRecordings(prev => ({
          ...prev,
          [member.id]: {
            url: URL.createObjectURL(blob),
            timestamp: Date.now(),
            duration: member.timeLimit - timeLeft
          }
        }));
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setRecording(true);
      setCurrentSpeaker(member);
      startTimer(member.timeLimit);

      // Start total time tracking if this is the first speaker
      if (!totalTimerRef.current) {
        totalTimerRef.current = setInterval(() => {
          setTotalTime(prev => prev + 1);
        }, 1000);
      }
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setRecording(false);
      setCurrentSpeaker(null);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const removeMember = (id: string) => {
    setScrumOrder(prev => prev.filter(m => m.id !== id));
  };

  const handleAddMember = (member: Member) => {
    setMembers(prev => [...prev, member]);
  };

  const handleRemoveMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  const handleSavePreset = (name: string) => {
    const newPreset: TeamPreset = {
      id: crypto.randomUUID(),
      name,
      members: [...members]
    };
    setPresets(prev => [...prev, newPreset]);
  };

  const handleLoadPreset = (preset: TeamPreset) => {
    setMembers(preset.members);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (totalTimerRef.current) clearInterval(totalTimerRef.current);
    };
  }, []);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <TimerDisplay
        totalTime={totalTime}
        speakerTime={timeLeft}
        speakerTimeLimit={currentSpeaker?.timeLimit || 120}
        isRecording={recording}
        currentSpeaker={currentSpeaker?.name || null}
      />

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Scrum Meeting Manager</h1>
        <TeamManagement
          members={members}
          presets={presets}
          onAddMember={handleAddMember}
          onRemoveMember={handleRemoveMember}
          onSavePreset={handleSavePreset}
          onLoadPreset={handleLoadPreset}
        />
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <Button onClick={shuffleMembers}>
            <ArrowUpDown className="mr-2 h-4 w-4" />
            Shuffle Order
          </Button>
          <Button
            onClick={moveToEnd}
            variant="outline"
            disabled={scrumOrder.length < 2}
          >
            <MoveDown className="mr-2 h-4 w-4" />
            Move to End
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {scrumOrder.map((member, index) => (
          <Card
            key={member.id}
            className={`${currentSpeaker?.id === member.id ? 'border-blue-500 border-2' : ''} 
                       ${index === 0 ? 'bg-gray-50' : ''}`}
          >
            <CardContent className="p-4 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <span className="font-bold">{index + 1}.</span>
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-gray-500">{member.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {timeLeft > 0 && currentSpeaker?.id === member.id && (
                  <Timer timeLeft={timeLeft} totalTime={member.timeLimit} />
                )}

                {!recording && !recordings[member.id] && (
                  <Button
                    onClick={() => startRecording(member)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Mic size={16} />
                    Start
                  </Button>
                )}

                {recording && currentSpeaker?.id === member.id && (
                  <Button
                    onClick={stopRecording}
                    variant="destructive"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Square size={16} />
                    Stop
                  </Button>
                )}

                {recordings[member.id] && (
                  <Button
                    onClick={() => removeMember(member.id)}
                    variant="ghost"
                    size="sm"
                    className="text-gray-500"
                  >
                    <X size={16} />
                    Remove
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}