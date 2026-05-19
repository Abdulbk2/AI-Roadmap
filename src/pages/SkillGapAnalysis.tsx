import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { collection, query, getDocs, setDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestore-error';
import { Cpu, AlertCircle, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';

const PROFICIENCY_MAP: Record<string, number> = {
  Beginner: 25,
  Intermediate: 50,
  Advanced: 75,
  Expert: 100
};

export default function SkillGapAnalysis() {
  const { user } = useAuth();
  const [skills, setSkills] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', proficiency: 'Intermediate' });

  useEffect(() => {
    if (user) {
      loadSkills();
    }
  }, [user]);

  const loadSkills = async () => {
    try {
      const q = query(collection(db, `students/${user!.uid}/skills`));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => {
        const d = doc.data();
        const current = PROFICIENCY_MAP[d.proficiency as string] || 25;
        const target = 85; 
        let status = 'gap';
        if (current >= target) status = 'good';
        else if (current >= target - 20) status = 'warning';
        return { id: doc.id, ...d, current, target, status };
      });
      setSkills(data);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `students/${user!.uid}/skills`);
    }
  };

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      const skillId = Date.now().toString();
      await setDoc(doc(db, `students/${user.uid}/skills`, skillId), {
        studentId: user.uid,
        name: formData.name,
        proficiency: formData.proficiency,
        createdAt: Date.now()
      });
      loadSkills();
      setIsDialogOpen(false);
      setFormData({ name: '', proficiency: 'Intermediate' });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `students/${user.uid}/skills/new`);
    }
  };

  const handleDelete = async (skillId: string) => {
    try {
      await deleteDoc(doc(db, `students/${user!.uid}/skills`, skillId));
      loadSkills();
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `students/${user!.uid}/skills/${skillId}`);
    }
  };

  const chartData = skills.map(s => ({
    subject: s.name,
    A: s.current,
    B: s.target,
    fullMark: 100,
  }));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Skill Gap Analysis</h1>
          <p className="text-muted-foreground mt-1">Compare your current proficiency with target industry requirements.</p>
        </div>
        
        <Button onClick={() => setIsDialogOpen(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" />
          Add Skill
        </Button>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-card text-card-foreground border-border">
            <DialogHeader>
              <DialogTitle>Add New Skill</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveSkill} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Skill Name</Label>
                <Input 
                  required 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Node.js" 
                />
              </div>
              <div className="space-y-2">
                <Label>Proficiency</Label>
                <select 
                  className="w-full bg-background border border-border rounded-md h-10 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  value={formData.proficiency}
                  onChange={e => setFormData({...formData, proficiency: e.target.value})}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Save Skill</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {skills.length === 0 ? (
             <div className="py-12 text-center bg-card/50 border border-border rounded-xl border-dashed">
                <Cpu className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground">No skills yet</h3>
                <p className="text-muted-foreground text-sm mt-1">Add skills to analyze your proficiency gaps.</p>
             </div>
          ) : (
            skills.map(skill => (
              <Card key={skill.id} className="bg-card border-border text-card-foreground group relative overflow-hidden">
                 <Button 
                    onClick={() => handleDelete(skill.id)}
                    variant="ghost" 
                    size="icon" 
                    className="absolute z-20 top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:bg-destructive/10 hover:text-destructive h-8 w-8"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4 relative z-10">
                    <h3 className="font-semibold text-lg flex items-center pr-10">
                      {skill.name}
                      {skill.status === 'gap' && <AlertCircle className="w-4 h-4 ml-2 text-destructive" />}
                      {skill.status === 'good' && <CheckCircle2 className="w-4 h-4 ml-2 text-primary" />}
                    </h3>
                    <div className="flex gap-4 text-sm font-mono opacity-80 backdrop-blur-sm bg-background/50 px-2 rounded-md py-1">
                      <span className="text-muted-foreground hidden sm:inline">Target: {skill.target}%</span>
                      <span className="text-foreground font-bold">Current: {skill.current}%</span>
                    </div>
                  </div>
                  <div className="relative h-3 w-full bg-muted rounded-full overflow-hidden shadow-inner">
                    {/* Target line indicator */}
                    <div className="absolute top-0 bottom-0 border-l-2 border-foreground/30 z-10" style={{ left: `${skill.target}%` }} />
                    {/* Current progress */}
                    <div 
                      className={`h-full transition-all duration-1000 ${
                        skill.status === 'gap' ? 'bg-gradient-to-r from-destructive/80 to-destructive' : 
                        skill.status === 'warning' ? 'bg-gradient-to-r from-amber-600 to-amber-500' : 'bg-gradient-to-r from-primary/80 to-primary'
                      }`} 
                      style={{ width: `${skill.current}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="space-y-6">
          <Card className="bg-card border-border text-card-foreground px-2 py-4">
            <h3 className="text-center font-medium text-muted-foreground text-sm mb-4">Skill Proficiency Map</h3>
            <div className="h-64 w-full">
              {skills.length > 2 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                    <PolarGrid stroke="var(--color-border)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                      name="Current"
                      dataKey="A"
                      stroke="var(--color-primary)"
                      fill="var(--color-primary)"
                      fillOpacity={0.5}
                    />
                    <Radar
                      name="Target"
                      dataKey="B"
                      stroke="var(--color-cyan-500)"
                      fill="var(--color-cyan-500)"
                      fillOpacity={0.1}
                      strokeDasharray="3 3"
                    />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground text-sm text-center px-4 leading-relaxed">
                  Add at least 3 skills to see your proficiency radar chart.
                </div>
              )}
            </div>
            {skills.length > 2 && (
              <div className="flex justify-center gap-4 text-xs mt-4">
                <span className="flex items-center text-muted-foreground"><div className="w-3 h-3 bg-primary/50 mr-2 rounded-sm border border-primary"/> Current</span>
                <span className="flex items-center text-muted-foreground"><div className="w-3 h-3 bg-cyan-500/10 mr-2 border border-cyan-500 border-dashed rounded-sm"/> Target</span>
              </div>
            )}
          </Card>

          <Card className="bg-gradient-to-br from-card to-primary/10 border-primary/20 text-card-foreground shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center"><Cpu className="w-5 h-5 mr-2 text-primary" /> AI Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>Keep adding your skills to generate AI-driven action plans.</p>
              <p>Green indicates you're matching target proficiency for your current level. Red highlights critical gaps that need attention.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
