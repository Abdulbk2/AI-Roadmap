import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { BookOpen, Trophy, Target, Sparkles } from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back, {user?.displayName?.split(' ')[0] || 'Student'}</h1>
          <p className="text-muted-foreground">Here's an overview of your academic and career progress.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card border-border text-card-foreground shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Degree Progress</CardTitle>
            <BookOpen className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">65%</div>
            <Progress value={65} className="h-2 bg-muted" />
            <p className="text-xs text-muted-foreground mt-2">78 / 120 Credits Completed</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border text-card-foreground shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Career Readiness</CardTitle>
            <Target className="w-4 h-4 text-cyan-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">42%</div>
            <Progress value={42} className="h-2 bg-muted" />
            <p className="text-xs text-muted-foreground mt-2">Missing 3 core industry skills</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border text-card-foreground shadow-sm bg-gradient-to-br from-primary/10 to-purple-500/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-primary">AI Insights</CardTitle>
            <Sparkles className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Based on your recent 'Data Structures' grade, consider the <strong className="text-foreground">Software Engineering track</strong>. You have 2 recommended courses for next semester.</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border text-card-foreground">
          <CardHeader>
            <CardTitle>Recent Milestones</CardTitle>
            <CardDescription className="text-muted-foreground">Your latest achievements and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: 'Completed React Course', date: '2 days ago', type: 'skill' },
                { title: 'Added 3 new skills', date: '1 week ago', type: 'progress' },
                { title: 'Semester 4 Results Published', date: '1 month ago', type: 'academic' },
              ].map((milestone, i) => (
                <div key={i} className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-primary mr-4" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{milestone.title}</p>
                    <p className="text-xs text-muted-foreground">{milestone.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border text-card-foreground">
          <CardHeader>
            <CardTitle>Upcoming Recommendations</CardTitle>
            <CardDescription className="text-muted-foreground">Suggested next steps by AI</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-muted/50 border border-border rounded-lg">
                <p className="text-sm font-medium mb-1 flex items-center"><Trophy className="w-3 h-3 text-amber-500 mr-2" /> Certify in AWS Cloud Practitioner</p>
                <p className="text-xs text-muted-foreground line-clamp-2">This aligns with your Backend Developer career goal and fills a critical skill gap.</p>
              </div>
              <div className="p-3 bg-muted/50 border border-border rounded-lg">
                <p className="text-sm font-medium mb-1">Apply for Summer Internship</p>
                <p className="text-xs text-muted-foreground line-clamp-2">Start preparing your resume. The window for top tech companies opens in 2 weeks.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
