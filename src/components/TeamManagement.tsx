import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Member, TeamPreset } from '@/types';
import { Plus, Save, Trash2 } from 'lucide-react';

interface TeamManagementProps {
  members: Member[];
  presets: TeamPreset[];
  onAddMember: (member: Member) => void;
  onRemoveMember: (id: string) => void;
  onSavePreset: (name: string) => void;
  onLoadPreset: (preset: TeamPreset) => void;
}

export function TeamManagement({
  members,
  presets,
  onAddMember,
  onRemoveMember,
  onSavePreset,
  onLoadPreset,
}: TeamManagementProps) {
  const [newMember, setNewMember] = React.useState({ name: '', role: 'Developer', timeLimit: 120 });
  const [presetName, setPresetName] = React.useState('');

  const handleAddMember = () => {
    if (newMember.name) {
      onAddMember({
        ...newMember,
        id: crypto.randomUUID(),
      });
      setNewMember({ name: '', role: 'Developer', timeLimit: 120 });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Input
          placeholder="Member name"
          value={newMember.name}
          onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
        />
        <Select
          value={newMember.role}
          onValueChange={(value) => setNewMember({ ...newMember, role: value })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Developer">Developer</SelectItem>
            <SelectItem value="Designer">Designer</SelectItem>
            <SelectItem value="Product Manager">Product Manager</SelectItem>
            <SelectItem value="QA">QA</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="number"
          placeholder="Time limit (seconds)"
          value={newMember.timeLimit}
          onChange={(e) => setNewMember({ ...newMember, timeLimit: parseInt(e.target.value) })}
          className="w-[150px]"
        />
        <Button onClick={handleAddMember}>
          <Plus className="w-4 h-4 mr-2" />
          Add Member
        </Button>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Preset name"
          value={presetName}
          onChange={(e) => setPresetName(e.target.value)}
        />
        <Button onClick={() => onSavePreset(presetName)} variant="outline">
          <Save className="w-4 h-4 mr-2" />
          Save Preset
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div>
              <p className="font-medium">{member.name}</p>
              <p className="text-sm text-gray-500">{member.role}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveMember(member.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}