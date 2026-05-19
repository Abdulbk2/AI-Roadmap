import React, { useState, useRef, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Send, Bot, User, Loader2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIChatAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hi there! I am your AI Academic and Career Advisor. How can I help you plan your journey today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      // In a real app, send chat history. Here we just send the latest message for simplicity.
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });

      if (!response.ok) throw new Error('API request failed');
      
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          setMessages(prev => {
            const newMessages = [...prev];
            const lastIndex = newMessages.length - 1;
            newMessages[lastIndex].content += chunk;
            return newMessages;
          });
        }
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-8rem)] animate-in fade-in duration-500">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">AI Assistant</h1>
        <p className="text-muted-foreground mt-1">Ask questions about your courses, career paths, or get interview advice.</p>
      </div>

      <Card className="flex-1 bg-card border-border flex flex-col overflow-hidden shadow-lg">
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'user' ? 'bg-primary ml-3' : 'bg-cyan-500/20 text-cyan-500 mr-3'
                }`}>
                  {msg.role === 'user' ? <User className="w-5 h-5 text-primary-foreground" /> : <Bot className="w-5 h-5" />}
                </div>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user' 
                    ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                    : 'bg-muted text-foreground rounded-tl-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="flex max-w-[80%] flex-row">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-500 mr-3 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="bg-muted p-4 rounded-2xl rounded-tl-sm text-sm flex items-center">
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-background border-t border-border">
          <form onSubmit={handleSend} className="flex gap-2">
            <Input 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask me anything..." 
              className="bg-card border-border text-card-foreground h-12 rounded-xl focus-visible:ring-primary"
              disabled={loading}
            />
            <Button 
              type="submit" 
              disabled={!input.trim() || loading} 
              className="h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
