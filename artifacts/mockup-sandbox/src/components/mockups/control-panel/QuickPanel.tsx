import React, { useState } from "react";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Settings, Eye, EyeOff, LayoutGrid, Type, Rss, Image as ImageIcon, CreditCard, Share2, AlertTriangle } from "lucide-react";

// Color mapping for sections
const sectionColors: Record<string, { bg: string, text: string, border: string }> = {
  "multiview": { bg: "bg-purple-900/40", text: "text-purple-400", border: "border-purple-500/30" },
  "lower-third": { bg: "bg-cyan-900/40", text: "text-cyan-400", border: "border-cyan-500/30" },
  "rss": { bg: "bg-orange-900/40", text: "text-orange-400", border: "border-orange-500/30" },
  "logo": { bg: "bg-purple-900/40", text: "text-purple-400", border: "border-purple-500/30" }, // Reusing purple for logo bug per prompt
  "title": { bg: "bg-green-900/40", text: "text-green-400", border: "border-green-500/30" },
  "social": { bg: "bg-pink-900/40", text: "text-pink-400", border: "border-pink-500/30" },
  "news": { bg: "bg-red-900/40", text: "text-red-400", border: "border-red-500/30" },
};

const SECTIONS = [
  { id: "multiview", label: "Multiview", icon: LayoutGrid, colorKey: "multiview" },
  { id: "lower-third", label: "Lower Third", icon: Type, colorKey: "lower-third" },
  { id: "rss", label: "RSS Ticker", icon: Rss, colorKey: "rss" },
  { id: "logo", label: "Logo Bug", icon: ImageIcon, colorKey: "logo" },
  { id: "title", label: "Title Card", icon: CreditCard, colorKey: "title" },
  { id: "social", label: "Social Bar", icon: Share2, colorKey: "social" },
  { id: "news", label: "Breaking News", icon: AlertTriangle, colorKey: "news" },
];

export function QuickPanel() {
  const [activeSections, setActiveSections] = useState<string[]>([]);
  const [visibleElements, setVisibleElements] = useState<Record<string, boolean>>({});

  const toggleVisibility = (id: string, show: boolean) => {
    setVisibleElements(prev => ({ ...prev, [id]: show }));
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gradient-to-b from-[#1a1a2e] to-[#16213e] text-slate-200 overflow-hidden font-sans">
      
      {/* Header */}
      <header className="flex-none flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <LayoutGrid className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">Overlay Control</h1>
        </div>
        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-white/10">
          <Settings className="w-5 h-5" />
        </Button>
      </header>

      {/* Command Strip - No Scroll, always visible */}
      <div className="flex-none bg-black/40 border-b border-white/5 p-4">
        <div className="flex items-center justify-between gap-2 max-w-full overflow-x-auto pb-2 scrollbar-hide">
          {SECTIONS.map((sec) => (
            <div key={`cmd-${sec.id}`} className={`flex flex-col items-center gap-1.5 p-2 rounded-lg border ${sectionColors[sec.colorKey].border} ${sectionColors[sec.colorKey].bg} min-w-[120px]`}>
              <div className={`text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 ${sectionColors[sec.colorKey].text}`}>
                <sec.icon className="w-3.5 h-3.5" />
                {sec.label}
              </div>
              <div className="flex items-center gap-1 w-full">
                <Button 
                  size="sm" 
                  variant="outline"
                  className={`flex-1 h-7 text-xs bg-black/40 border-cyan-500/30 hover:bg-cyan-900/60 hover:text-cyan-300 text-cyan-400 ${visibleElements[sec.id] ? 'bg-cyan-600 hover:bg-cyan-500 text-white border-transparent' : ''}`}
                  onClick={() => toggleVisibility(sec.id, true)}
                >
                  Show
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  className={`flex-1 h-7 text-xs bg-black/40 border-red-500/30 hover:bg-red-900/60 hover:text-red-300 text-red-400 ${visibleElements[sec.id] === false ? 'bg-red-600 hover:bg-red-500 text-white border-transparent' : ''}`}
                  onClick={() => toggleVisibility(sec.id, false)}
                >
                  Hide
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Settings Accordion - Scrollable */}
      <ScrollArea className="flex-1 px-4 py-2">
        <div className="max-w-5xl mx-auto pb-12">
          <Accordion 
            type="multiple" 
            value={activeSections} 
            onValueChange={setActiveSections}
            className="space-y-3"
          >
            
            {/* 1. Multiview */}
            <AccordionItem value="multiview" className="border border-white/10 rounded-lg bg-black/20 overflow-hidden data-[state=open]:border-purple-500/50 transition-colors">
              <AccordionTrigger className="px-4 py-3 hover:bg-white/5 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-md bg-purple-500/20 text-purple-400">
                    <LayoutGrid className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-purple-100">Multiview Layout</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-2">
                <div className="grid grid-cols-2 gap-4 bg-black/30 p-4 rounded-lg border border-white/5">
                  {[1, 2, 3, 4].map(q => (
                    <div key={`q${q}`} className="space-y-1.5">
                      <Label className="text-xs text-purple-300/70 uppercase">Quadrant {q}</Label>
                      <Select defaultValue="none">
                        <SelectTrigger className="bg-[#1a1a2e] border-white/10 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="lower-third">Lower Third</SelectItem>
                          <SelectItem value="rss">RSS Ticker</SelectItem>
                          <SelectItem value="logo">Logo Bug</SelectItem>
                          <SelectItem value="title">Title Card</SelectItem>
                          <SelectItem value="social">Social Bar</SelectItem>
                          <SelectItem value="news">Breaking News</SelectItem>
                          <SelectItem value="none">None</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-end">
                  <Button className="bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/20">Update Settings</Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 2. Lower Third */}
            <AccordionItem value="lower-third" className="border border-white/10 rounded-lg bg-black/20 overflow-hidden data-[state=open]:border-cyan-500/50 transition-colors">
              <AccordionTrigger className="px-4 py-3 hover:bg-white/5 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-md bg-cyan-500/20 text-cyan-400">
                    <Type className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-cyan-100">Lower Third</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-2 space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-slate-400">Line 1 (Name)</Label>
                      <Input defaultValue="Jane Doe" className="bg-[#1a1a2e] border-white/10" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-slate-400">Line 2 (Title)</Label>
                      <Input defaultValue="Senior Correspondent" className="bg-[#1a1a2e] border-white/10" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-slate-400">Image URL</Label>
                      <Input placeholder="https://..." className="bg-[#1a1a2e] border-white/10" />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-slate-400">Position</Label>
                        <Select defaultValue="bottom-left">
                          <SelectTrigger className="bg-[#1a1a2e] border-white/10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bottom-left">Bottom Left</SelectItem>
                            <SelectItem value="bottom-center">Bottom Center</SelectItem>
                            <SelectItem value="bottom-right">Bottom Right</SelectItem>
                            <SelectItem value="top-left">Top Left</SelectItem>
                            <SelectItem value="top-center">Top Center</SelectItem>
                            <SelectItem value="top-right">Top Right</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-slate-400">Style</Label>
                        <Select defaultValue="modern">
                          <SelectTrigger className="bg-[#1a1a2e] border-white/10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="modern">Modern</SelectItem>
                            <SelectItem value="classic">Classic</SelectItem>
                            <SelectItem value="minimal">Minimal</SelectItem>
                            <SelectItem value="bold">Bold</SelectItem>
                            <SelectItem value="news">News</SelectItem>
                            <SelectItem value="elegant">Elegant</SelectItem>
                            <SelectItem value="neon">Neon</SelectItem>
                            <SelectItem value="glass">Glass</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-3 pt-2">
                      <Label className="text-slate-400">Colors</Label>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-600 border border-white/20"></div>
                          <span className="text-xs text-slate-400">Bg</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-cyan-400 border border-white/20"></div>
                          <span className="text-xs text-slate-400">Accent</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-white border border-white/20"></div>
                          <span className="text-xs text-slate-400">Text</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button className="bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/20">Update Settings</Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 3. RSS Ticker */}
            <AccordionItem value="rss" className="border border-white/10 rounded-lg bg-black/20 overflow-hidden data-[state=open]:border-orange-500/50 transition-colors">
              <AccordionTrigger className="px-4 py-3 hover:bg-white/5 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-md bg-orange-500/20 text-orange-400">
                    <Rss className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-orange-100">RSS Ticker</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-2">
                <div className="space-y-4">
                  <div className="flex gap-2 items-end">
                    <div className="flex-1 space-y-1.5">
                      <Label className="text-slate-400">Feed URL</Label>
                      <Input defaultValue="https://news.ycombinator.com/rss" className="bg-[#1a1a2e] border-white/10" />
                    </div>
                    <Button variant="secondary" className="bg-white/10 hover:bg-white/20 text-white">Load</Button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-slate-400">Position</Label>
                      <Select defaultValue="bottom">
                        <SelectTrigger className="bg-[#1a1a2e] border-white/10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="top">Top</SelectItem>
                          <SelectItem value="bottom">Bottom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-slate-400">Speed</Label>
                      <Select defaultValue="medium">
                        <SelectTrigger className="bg-[#1a1a2e] border-white/10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="slow">Slow</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="fast">Fast</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-slate-400">Text Size</Label>
                      <Select defaultValue="medium">
                        <SelectTrigger className="bg-[#1a1a2e] border-white/10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button className="bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/20">Update Ticker</Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 4. Logo Bug */}
            <AccordionItem value="logo" className="border border-white/10 rounded-lg bg-black/20 overflow-hidden data-[state=open]:border-purple-500/50 transition-colors">
              <AccordionTrigger className="px-4 py-3 hover:bg-white/5 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-md bg-purple-500/20 text-purple-400">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-purple-100">Logo Bug</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-2">
                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <Label className="text-slate-400">Image URL</Label>
                    <Input placeholder="https://..." defaultValue="/brand/logo.png" className="bg-[#1a1a2e] border-white/10" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <Label className="text-slate-400">Position</Label>
                      <Select defaultValue="top-right">
                        <SelectTrigger className="bg-[#1a1a2e] border-white/10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="top-left">Top Left</SelectItem>
                          <SelectItem value="top-right">Top Right</SelectItem>
                          <SelectItem value="bottom-left">Bottom Left</SelectItem>
                          <SelectItem value="bottom-right">Bottom Right</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <Label className="text-slate-400">Opacity (80%)</Label>
                        <Slider defaultValue={[80]} max={100} step={1} className="py-2" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button className="bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/20">Update Logo</Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 5. Title Card */}
            <AccordionItem value="title" className="border border-white/10 rounded-lg bg-black/20 overflow-hidden data-[state=open]:border-green-500/50 transition-colors">
              <AccordionTrigger className="px-4 py-3 hover:bg-white/5 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-md bg-green-500/20 text-green-400">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-green-100">Title Card</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-2">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-slate-400">Title Text</Label>
                    <Input defaultValue="Starting Soon..." className="bg-[#1a1a2e] border-white/10 font-bold text-lg" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-slate-400">Subtitle</Label>
                    <Input defaultValue="Grab a drink, we'll be right back" className="bg-[#1a1a2e] border-white/10" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-slate-400">Background Image</Label>
                    <Input placeholder="https://..." className="bg-[#1a1a2e] border-white/10" />
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button className="bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/20">Update Title Card</Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 6. Social Bar */}
            <AccordionItem value="social" className="border border-white/10 rounded-lg bg-black/20 overflow-hidden data-[state=open]:border-pink-500/50 transition-colors">
              <AccordionTrigger className="px-4 py-3 hover:bg-white/5 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-md bg-pink-500/20 text-pink-400">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-pink-100">Social Media Bar</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-slate-400">Twitter</Label>
                    <Input placeholder="@handle" className="bg-[#1a1a2e] border-white/10" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-slate-400">YouTube</Label>
                    <Input placeholder="/channel" className="bg-[#1a1a2e] border-white/10" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-slate-400">Instagram</Label>
                    <Input placeholder="@handle" className="bg-[#1a1a2e] border-white/10" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-slate-400">Website</Label>
                    <Input placeholder="domain.com" className="bg-[#1a1a2e] border-white/10" />
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button className="bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/20">Update Social Bar</Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 7. Breaking News */}
            <AccordionItem value="news" className="border border-white/10 rounded-lg bg-black/20 overflow-hidden data-[state=open]:border-red-500/50 transition-colors">
              <AccordionTrigger className="px-4 py-3 hover:bg-white/5 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-md bg-red-500/20 text-red-400">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-red-100">Breaking News</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-2">
                <div className="space-y-1.5">
                  <Label className="text-slate-400">Banner Text</Label>
                  <Input defaultValue="BREAKING: Major update released for streaming tools" className="bg-[#1a1a2e] border-white/10 border-red-500/30 focus-visible:ring-red-500/50" />
                </div>
                <div className="mt-6 flex justify-end">
                  <Button className="bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/20">Update Banner</Button>
                </div>
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </div>
      </ScrollArea>
    </div>
  );
}
