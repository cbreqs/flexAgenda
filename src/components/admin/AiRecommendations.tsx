
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2, CheckCircle, Clock, Users, Timer } from "lucide-react";
import { aiSchedulingRecommendations, AISchedulingRecommendationsOutput } from "@/ai/flows/ai-scheduling-recommendations-flow";
import { useToast } from "@/hooks/use-toast";

interface AiRecommendationsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AiRecommendations({ open, onOpenChange }: AiRecommendationsProps) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AISchedulingRecommendationsOutput | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!input.trim()) {
      toast({ title: "Input Required", description: "Please describe your service first.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const output = await aiSchedulingRecommendations({ serviceDescription: input });
      setResult(output);
    } catch (error) {
      toast({ title: "Error", description: "Failed to generate recommendations.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setInput("");
    setResult(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl overflow-hidden rounded-2xl p-0">
        <DialogHeader className="p-6 bg-primary text-primary-foreground">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6" />
            Scheduling Optimizer
          </DialogTitle>
          <DialogDescription className="text-primary-foreground/80">
            Tell our AI what you're offering, and we'll suggest the best booking parameters.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {!result ? (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="space-y-2">
                <Label htmlFor="desc" className="font-bold">Service Description</Label>
                <Textarea 
                  id="desc"
                  placeholder="e.g., A comprehensive web design workshop for small teams including discovery, wireframing, and feedback sessions..."
                  className="min-h-[150px] rounded-xl"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </div>
              <p className="text-xs text-muted-foreground italic">
                Pro tip: Be specific about tasks, expected group size, and any setup time needed.
              </p>
            </div>
          ) : (
            <div className="space-y-6 animate-in zoom-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border bg-accent/5 flex flex-col items-center text-center">
                  <Clock className="w-8 h-8 text-primary mb-2" />
                  <p className="text-xs font-bold uppercase text-muted-foreground">Duration</p>
                  <p className="text-2xl font-bold">{result.suggestedDurationMinutes}m</p>
                </div>
                <div className="p-4 rounded-xl border bg-accent/5 flex flex-col items-center text-center">
                  <Users className="w-8 h-8 text-primary mb-2" />
                  <p className="text-xs font-bold uppercase text-muted-foreground">Max Capacity</p>
                  <p className="text-2xl font-bold">{result.suggestedCapacity} Pax</p>
                </div>
                <div className="p-4 rounded-xl border bg-accent/5 flex flex-col items-center text-center">
                  <Timer className="w-8 h-8 text-primary mb-2" />
                  <p className="text-xs font-bold uppercase text-muted-foreground">Buffer Time</p>
                  <p className="text-2xl font-bold">{result.suggestedBufferMinutes}m</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-bold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  AI Logic
                </Label>
                <div className="p-4 rounded-xl bg-muted/50 text-sm leading-relaxed">
                  {result.explanation}
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="p-6 pt-0 bg-muted/20">
          {!result ? (
            <Button 
              onClick={handleGenerate} 
              disabled={loading}
              className="w-full h-12 rounded-xl shadow-lg gap-2 text-lg font-bold"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  Generate Optimization
                  <Sparkles className="w-5 h-5" />
                </>
              )}
            </Button>
          ) : (
            <div className="flex w-full gap-4">
              <Button variant="outline" onClick={handleReset} className="flex-1 rounded-xl h-12">
                Try Again
              </Button>
              <Button onClick={() => onOpenChange(false)} className="flex-1 rounded-xl h-12">
                Apply Settings
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
