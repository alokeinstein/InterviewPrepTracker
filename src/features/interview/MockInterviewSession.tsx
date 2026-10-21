'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Bot, User as UserIcon, Send, Clock, Award, CheckCircle2, AlertCircle } from 'lucide-react';

interface MockInterviewSessionProps {
  interview: {
    id: string;
    interviewType: string;
    title: string;
    durationMinutes: number;
    status: string;
    messages: { id: string; sender: string; content: string; timestamp: Date | string }[];
    evaluation?: any;
  };
}

const PHASES = [
  'Clarifications',
  'Approach',
  'Implementation',
  'Complexity',
  'Follow-up',
];

export function MockInterviewSession({ interview }: MockInterviewSessionProps) {
  const [messages, setMessages] = useState(
    interview.messages.length > 0
      ? interview.messages
      : [
          {
            id: 'init-1',
            sender: 'INTERVIEWER',
            content: `Welcome to your ${interview.title} interview. I will be your interviewer today. Let's start: Can you state your understanding of the problem and ask any clarifying questions about constraints or scale?`,
            timestamp: new Date(),
          },
        ]
  );
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<any>(interview.evaluation || null);
  const [elapsedSec, setElapsedSec] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setElapsedSec((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isSending) return;
    const userMsg = inputText.trim();
    setInputText('');

    const newMessages = [
      ...messages,
      {
        id: `usr-${Date.now()}`,
        sender: 'USER',
        content: userMsg,
        timestamp: new Date(),
      },
    ];
    setMessages(newMessages);
    setIsSending(true);

    try {
      const res = await fetch('/api/ai/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'chat',
          interviewId: interview.id,
          message: userMsg,
        }),
      });
      const data = await res.json();
      setMessages([
        ...newMessages,
        {
          id: `bot-${Date.now()}`,
          sender: 'INTERVIEWER',
          content: data.reply,
          timestamp: new Date(),
        },
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSending(false);
    }
  };

  const handleEndInterview = async () => {
    setIsEvaluating(true);
    try {
      const allUserText = messages
        .filter((m) => m.sender === 'USER')
        .map((m) => m.content)
        .join('\n');

      const res = await fetch('/api/ai/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'evaluate',
          interviewId: interview.id,
          prompt: interview.title,
          userResponse: allUserText || 'Candidate discussed requirements and time bounds.',
        }),
      });
      const data = await res.json();
      setEvaluation(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsEvaluating(false);
    }
  };

  const mins = Math.floor(elapsedSec / 60);
  const secs = elapsedSec % 60;
  const timeFormatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Session Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border border-border bg-card/60 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="default" className="text-xs font-mono">
              {interview.interviewType.replace(/_/g, ' ')}
            </Badge>
            <Badge variant="outline" className="text-xs font-mono">
              {interview.durationMinutes} min Target
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{interview.title}</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted border border-border font-mono text-sm font-semibold">
            <Clock className="h-4 w-4 text-primary" />
            <span>{timeFormatted}</span>
          </div>
          {!evaluation && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleEndInterview}
              isLoading={isEvaluating}
              className="text-xs h-9"
            >
              End & Grade Interview
            </Button>
          )}
        </div>
      </div>

      {/* Phase Track */}
      <div className="grid grid-cols-5 gap-2">
        {PHASES.map((phase, idx) => (
          <div
            key={phase}
            className={`p-2 rounded-lg border text-center text-xs font-mono font-medium transition-colors ${
              idx === 1
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border bg-card/40 text-muted-foreground'
            }`}
          >
            {idx + 1}. {phase}
          </div>
        ))}
      </div>

      {/* Evaluation Results Banner (when completed) */}
      {evaluation && (
        <Card className="border-emerald-500/30 bg-emerald-500/5 animate-in zoom-in-95">
          <CardHeader className="pb-3 border-b border-border">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Award className="h-5 w-5 text-emerald-500" />
                <span>Interview Performance Evaluation</span>
              </CardTitle>
              <Badge variant="success" className="font-mono text-sm">
                Score: {evaluation.overallScore} / 10
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
              <div className="p-2.5 rounded-lg bg-background border border-border">
                <p className="text-[10px] text-muted-foreground font-mono">Problem Solving</p>
                <p className="font-bold text-base mt-0.5">{evaluation.problemSolvingScore}/10</p>
              </div>
              <div className="p-2.5 rounded-lg bg-background border border-border">
                <p className="text-[10px] text-muted-foreground font-mono">Communication</p>
                <p className="font-bold text-base mt-0.5">{evaluation.communicationScore}/10</p>
              </div>
              <div className="p-2.5 rounded-lg bg-background border border-border">
                <p className="text-[10px] text-muted-foreground font-mono">Complexity</p>
                <p className="font-bold text-base mt-0.5">{evaluation.complexityScore}/10</p>
              </div>
              <div className="p-2.5 rounded-lg bg-background border border-border">
                <p className="text-[10px] text-muted-foreground font-mono">Edge Cases</p>
                <p className="font-bold text-base mt-0.5">{evaluation.edgeCaseScore}/10</p>
              </div>
              <div className="p-2.5 rounded-lg bg-background border border-border col-span-2 sm:col-span-1">
                <p className="text-[10px] text-muted-foreground font-mono">Implementation</p>
                <p className="font-bold text-base mt-0.5">{evaluation.implementationScore}/10</p>
              </div>
            </div>

            <p className="text-sm text-foreground/90 leading-relaxed">{evaluation.critique}</p>

            <div className="p-3.5 rounded-lg bg-background border border-border space-y-1.5">
              <span className="text-xs font-semibold text-primary font-mono uppercase block">
                Actionable Recommendations:
              </span>
              <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground">
                {evaluation.actionableFixes?.map((fix: string, i: number) => (
                  <li key={i}>{fix}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chat Messages Log */}
      <Card className="flex flex-col h-[520px]">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 text-sm ${msg.sender === 'USER' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender !== 'USER' && (
                <div className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-xl p-3.5 leading-relaxed ${
                  msg.sender === 'USER'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/60 border border-border text-foreground'
                }`}
              >
                <p className="whitespace-pre-line">{msg.content}</p>
              </div>
              {msg.sender === 'USER' && (
                <div className="h-8 w-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center shrink-0 font-bold text-xs">
                  <UserIcon className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}
        </CardContent>

        {/* Input Bar */}
        <CardFooter className="p-3 border-t border-border bg-card">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 w-full"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="State approach, ask clarifying questions, or discuss trade-offs..."
              disabled={isSending || !!evaluation}
              className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <Button
              type="submit"
              size="sm"
              isLoading={isSending}
              disabled={!inputText.trim() || isSending || !!evaluation}
              className="gap-1.5 h-9"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
