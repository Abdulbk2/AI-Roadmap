import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Map, Zap, Target, BookOpen, Cpu } from 'lucide-react';

export default function LandingPage() {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = async () => {
    if (user) {
      navigate('/dashboard');
    } else {
      await signIn();
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-border/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Map className="w-6 h-6 text-primary" />
          <span className="font-bold text-xl tracking-tight">AI Roadmap</span>
        </div>
        <div className="flex gap-4">
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground hidden sm:flex">Features</Button>
          <Button onClick={handleGetStarted} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6">
            {user ? 'Go to Dashboard' : 'Sign In'}
          </Button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-20 pb-24 text-center">
        <div className="inline-flex items-center px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-8">
          <Zap className="w-4 h-4 mr-2" />
          Powered by Google Gemini
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
          Your Autonomous <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">
            Academic & Career Advisor
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
          Plan your university journey intelligently. Let AI analyze your skills, recommend courses,
          and build a personalized roadmap to your dream career.
        </p>
        
        <Button onClick={handleGetStarted} size="lg" className="h-14 px-8 text-lg bg-foreground text-background hover:bg-foreground/90 rounded-full font-semibold">
          Design Your Roadmap Now
        </Button>

        <div className="mt-32 grid md:grid-cols-3 gap-8 text-left">
          <div className="bg-card/50 border border-border p-8 rounded-3xl">
            <div className="w-12 h-12 bg-primary/20 text-primary rounded-2xl flex items-center justify-center mb-6">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3">AI Career Engine</h3>
            <p className="text-muted-foreground leading-relaxed">
              Discover careers tailored to your unique interests, strengths, and academic history.
            </p>
          </div>
          
          <div className="bg-card/50 border border-border p-8 rounded-3xl">
            <div className="w-12 h-12 bg-cyan-500/20 text-cyan-500 rounded-2xl flex items-center justify-center mb-6">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Skill Gap Analysis</h3>
            <p className="text-muted-foreground leading-relaxed">
              Compare your current abilities with industry demands and get targeted learning suggestions.
            </p>
          </div>

          <div className="bg-card/50 border border-border p-8 rounded-3xl">
            <div className="w-12 h-12 bg-purple-500/20 text-purple-500 rounded-2xl flex items-center justify-center mb-6">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Academic Planner</h3>
            <p className="text-muted-foreground leading-relaxed">
              Automatically track your progress, plan your semesters, and discover relevant electives.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
