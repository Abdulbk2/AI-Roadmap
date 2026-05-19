import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Loader2, Target, Briefcase, Zap } from 'lucide-react';

export default function CareerRoadmap() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any>(null);

  const generateRecommendations = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/recommendations/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentProfile: { major: 'Computer Science', graduationYear: 2026 },
          skills: [{ name: 'JavaScript', proficiency: 'Advanced' }, { name: 'React', proficiency: 'Intermediate' }],
          courses: [{ courseName: 'Data Structures', grade: 'A' }]
        })
      });
      const data = await response.json();
      setRecommendations(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Career Recommendations</h1>
          <p className="text-muted-foreground mt-1">Discover optimal career paths based on your profile.</p>
        </div>
        <Button onClick={generateRecommendations} disabled={loading} className="bg-gradient-to-r from-primary to-cyan-500 hover:opacity-90 text-primary-foreground border-0">
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Zap className="w-4 h-4 mr-2" />}
          Generate Insights
        </Button>
      </div>

      {!recommendations && !loading && (
        <Card className="bg-card/50 border-border text-card-foreground flex flex-col items-center justify-center p-12 mt-8 border-dashed">
          <Target className="w-16 h-16 text-muted-foreground/50 mb-6" />
          <h2 className="text-xl font-semibold mb-2">No Recommendations Yet</h2>
          <p className="text-muted-foreground text-center max-w-md mb-6">Let our AI engine analyze your academic record and skills to propose the best career trajectories for you.</p>
          <Button onClick={generateRecommendations} variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">Analyze Profile</Button>
        </Card>
      )}

      {loading && (
        <div className="py-24 flex flex-col items-center justify-center text-primary">
          <Loader2 className="w-12 h-12 animate-spin mb-4" />
          <p className="text-muted-foreground animate-pulse">Running AI models on your profile...</p>
        </div>
      )}

      {recommendations && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground flex items-center"><Briefcase className="w-5 h-5 mr-2 text-primary" /> Career Paths</h3>
            {recommendations.careerRecommendations?.map((rec: any, idx: number) => (
              <Card key={idx} className="bg-card border-border text-card-foreground overflow-hidden relative">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{rec.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">{rec.reason}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground flex items-center"><Target className="w-5 h-5 mr-2 text-cyan-500" /> Immediate Next Steps</h3>
            {recommendations.nextSteps?.map((step: any, idx: number) => (
              <Card key={idx} className="bg-card border-border text-card-foreground">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{step.title}</CardTitle>
                    <Badge variant="outline" className="text-xs text-cyan-500 border-cyan-500/30 bg-cyan-500/10">{step.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
