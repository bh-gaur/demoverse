"use client";

import { useState, useEffect, useRef } from "react";
import { Sparkles, X, Send, ArrowRight, ShieldAlert } from "lucide-react";
import { Platform } from "@prisma/client";

interface Message {
  role: "user" | "assistant";
  content: string;
  recommendations?: {
    slug: string;
    name: string;
    fitScore: number;
    reason: string;
    matchingFeatures: string[];
  }[];
  isFallback?: boolean;
}

interface ChatBotProps {
  platforms: Platform[];
}

export default function ChatBot({ platforms }: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Questionnaire state
  const [surveyStep, setSurveyStep] = useState(1);
  const [answers, setAnswers] = useState({
    category: "",
    teamSize: "",
    budget: "",
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const handleSurveySelect = (field: string, val: string) => {
    const updated = { ...answers, [field]: val };
    setAnswers(updated);
    if (field === "category") setSurveyStep(2);
    if (field === "teamSize") setSurveyStep(3);
  };

  const startMatchmaker = async () => {
    setSurveyStep(0); // Exit survey, enter chat
    setLoading(true);

    const initialUserMsg = `Hello! I am looking for a B2B SaaS platform in the ${answers.category} category. My team size is ${answers.teamSize} members, and my budget preference is ${answers.budget}. Recommend some matching platforms!`;

    const userMessage: Message = { role: "user", content: initialUserMsg };
    setMessages([userMessage]);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: initialUserMsg }],
          platformCatalog: platforms,
          userAnswers: answers,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "AI query failed");

      const botMessage: Message = {
        role: "assistant",
        content: data.followUpAnswer || "Here are the top matches I found in our marketplace:",
        recommendations: data.recommendations,
        isFallback: data.isFallback,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: unknown) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I ran into a connection issue. Here are some of our top rated platforms to get you started:",
          recommendations: platforms
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 3)
            .map((p) => ({
              slug: p.slug,
              name: p.name,
              fitScore: 9,
              reason: "A popular, high-rated service on DemoVerse.",
              matchingFeatures: ["Premium Support", "Easy Setup"],
            })),
          isFallback: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput("");

    const newMessages = [...messages, { role: "user", content: userText } as Message];
    setMessages(newMessages);
    setLoading(true);

    try {
      // Forward full history to route
      const payloadMessages = newMessages.map((m) => {
        let content = m.content;
        if (m.role === "assistant" && m.recommendations && m.recommendations.length > 0) {
          const recsText = m.recommendations
            .map((r) => `- ${r.name} (Score: ${r.fitScore}/10): ${r.reason}`)
            .join("\n");
          content = `${content}\n\nRecommendations made:\n${recsText}`;
        }
        return {
          role: m.role,
          content: content,
        };
      });

      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: payloadMessages,
          platformCatalog: platforms,
          userAnswers: answers,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "AI query failed");

      const botMessage: Message = {
        role: "assistant",
        content: data.followUpAnswer || "I've reviewed your request:",
        recommendations: data.recommendations && data.recommendations.length > 0 ? data.recommendations : undefined,
        isFallback: data.isFallback,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I had trouble processing that request. Try again!" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const resetChat = () => {
    setMessages([]);
    setAnswers({ category: "", teamSize: "", budget: "" });
    setSurveyStep(1);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Sparkle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-primary hover:bg-primary/95 text-primary-foreground flex items-center justify-center shadow-lg hover:shadow-primary/20 hover:scale-105 transition-all duration-200"
        title="Open AI Matchmaker Chat"
      >
        {isOpen ? <X size={24} /> : <Sparkles size={24} className="animate-pulse" />}
      </button>

      {/* Slide-over Chat Box */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-[350px] md:w-[400px] h-[550px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-primary px-4 py-3 text-primary-foreground flex items-center justify-between shadow-sm">
            <div className="flex items-center space-x-2">
              <Sparkles size={18} className="fill-primary-foreground animate-pulse" />
              <div>
                <h3 className="font-bold text-sm">DemoVerse Matchmaker</h3>
                <span className="text-[10px] text-primary-foreground/70">Powered by Gemini 2.5 AI</span>
              </div>
            </div>
            <button
              onClick={resetChat}
              className="text-[10px] bg-primary-foreground/15 hover:bg-primary-foreground/25 px-2 py-0.5 rounded transition-all font-semibold"
            >
              Reset
            </button>
          </div>

          {/* Body Section */}
          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {/* SURVEY SCENARIO */}
            {surveyStep === 1 && (
              <div className="space-y-4 py-4 text-center">
                <Sparkles size={36} className="text-primary mx-auto animate-bounce" />
                <h4 className="font-bold text-base text-foreground">Find Your Perfect SaaS Match</h4>
                <p className="text-xs text-muted-foreground max-w-[280px] mx-auto leading-relaxed">
                  Let&apos;s answer 3 quick questions to help Gemini pinpoint the best products for your workflows.
                </p>
                <div className="space-y-2 border-t border-border pt-4 text-left">
                  <span className="block text-xs font-bold text-muted-foreground uppercase tracking-wide">
                    1. Select Core Category Needed
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {["CRM", "Analytics", "Dev Tools", "HR", "Marketing", "Finance"].map((c) => (
                      <button
                        key={c}
                        onClick={() => handleSurveySelect("category", c)}
                        className="py-2 text-xs font-semibold rounded-lg border border-border hover:border-primary hover:bg-primary/5 text-foreground transition-all"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {surveyStep === 2 && (
              <div className="space-y-4 py-4 text-left">
                <span className="block text-xs font-bold text-muted-foreground uppercase tracking-wide">
                  2. What is your team size?
                </span>
                <div className="space-y-2">
                  {["1-10", "11-50", "51-200", "200+"].map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSurveySelect("teamSize", s)}
                      className="w-full py-2.5 text-xs font-semibold rounded-lg border border-border hover:border-primary hover:bg-primary/5 text-foreground text-left px-4 transition-all"
                    >
                      {s} team members
                    </button>
                  ))}
                </div>
              </div>
            )}

            {surveyStep === 3 && (
              <div className="space-y-4 py-4 text-left">
                <span className="block text-xs font-bold text-muted-foreground uppercase tracking-wide">
                  3. Select Budget Strategy
                </span>
                <div className="space-y-2">
                  {[
                    { label: "Free / Freemium preferred", val: "freemium" },
                    { label: "Paid / Professional plans acceptable", val: "paid" },
                    { label: "Custom / Enterprise deals only", val: "custom" },
                  ].map((item) => (
                    <button
                      key={item.val}
                      onClick={() => {
                        setAnswers({ ...answers, budget: item.val });
                        // Complete survey and start matchmaker
                        setTimeout(() => {
                          const updated = { ...answers, budget: item.val };
                          setAnswers(updated);
                          startMatchmaker();
                        }, 100);
                      }}
                      className="w-full py-2.5 text-xs font-semibold rounded-lg border border-border hover:border-primary hover:bg-primary/5 text-foreground text-left px-4 transition-all"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* CHAT LOG SCREEN */}
            {surveyStep === 0 && (
              <div className="space-y-4">
                {messages.map((msg, idx) => (
                  <div key={idx} className="space-y-2">
                    {/* Message Bubble */}
                    <div
                      className={`flex ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground rounded-tr-none"
                            : "bg-secondary text-foreground rounded-tl-none border border-border"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>

                    {/* Fallback alert warning */}
                    {msg.role === "assistant" && msg.isFallback && (
                      <div className="p-2 border border-amber-200 dark:border-amber-950 bg-amber-50/50 dark:bg-amber-950/20 text-[10px] text-amber-600 dark:text-amber-400 rounded-lg flex items-center space-x-1.5 max-w-[85%]">
                        <ShieldAlert size={12} className="flex-shrink-0" />
                        <span>Fallback mode enabled (No Anthropic API key found)</span>
                      </div>
                    )}

                    {/* Recommendations Render */}
                    {msg.recommendations && msg.recommendations.length > 0 && (
                      <div className="space-y-3 pl-2 pr-6">
                        <span className="block text-[10px] uppercase font-bold text-muted-foreground tracking-wide">
                          Top Recommendations:
                        </span>
                        {msg.recommendations.map((rec, i) => (
                          <div
                            key={i}
                            className="p-3 border border-border bg-card rounded-xl shadow-sm space-y-2 hover:border-primary/40 transition-colors"
                          >
                            <div className="flex justify-between items-center">
                              <h5 className="font-bold text-xs text-foreground">{rec.name}</h5>
                              <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                Match Score: {rec.fitScore}/10
                              </span>
                            </div>
                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                              {rec.reason}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {rec.matchingFeatures.map((f, k) => (
                                <span
                                  key={k}
                                  className="text-[9px] px-2 py-0.5 bg-secondary rounded-full font-medium"
                                >
                                  {f}
                                </span>
                              ))}
                            </div>
                            <a
                              href={`/platform/${rec.slug}`}
                              className="text-[10px] font-bold text-primary flex items-center space-x-0.5 hover:underline pt-1"
                            >
                              <span>Explore sandbox</span>
                              <ArrowRight size={10} />
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Loading Bubble */}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-secondary text-muted-foreground rounded-2xl rounded-tl-none p-3 text-xs flex items-center space-x-1">
                      <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce delay-100" />
                      <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            )}
          </div>

          {/* Footer Input form */}
          {surveyStep === 0 && (
            <form
              onSubmit={handleSendMessage}
              className="bg-card border-t border-border p-3 flex items-center space-x-2"
            >
              <input
                type="text"
                placeholder="Ask follow-up questions..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                className="flex-grow pl-3 pr-2 py-2 border border-border bg-background rounded-xl text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 disabled:opacity-50 transition-colors flex-shrink-0"
              >
                <Send size={14} />
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
