import React, { useState } from "react";
import { Settings, Eye, EyeOff, Save, Play, Upload, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type SectionId = "multiview" | "lower3rd" | "ticker" | "logo" | "title" | "social" | "breaking";

const SECTIONS: { id: SectionId; name: string; color: string; shortName: string }[] = [
  { id: "lower3rd", name: "Lower Third", shortName: "Lower 3rd", color: "bg-cyan-400" },
  { id: "ticker", name: "RSS Ticker", shortName: "Ticker", color: "bg-orange-400" },
  { id: "logo", name: "Logo Bug", shortName: "Logo", color: "bg-purple-400" },
  { id: "title", name: "Title Card", shortName: "Title", color: "bg-green-400" },
  { id: "social", name: "Social Media Bar", shortName: "Social", color: "bg-pink-400" },
  { id: "breaking", name: "Breaking News", shortName: "Breaking", color: "bg-red-500" },
  { id: "multiview", name: "Multiview Layout", shortName: "Multiview", color: "bg-purple-500" },
];

export function TopTabs() {
  const [activeTab, setActiveTab] = useState<SectionId>("lower3rd");

  const activeSection = SECTIONS.find((s) => s.id === activeTab)!;

  return (
    <div 
      className="flex flex-col w-screen h-screen overflow-hidden text-slate-100 font-sans"
      style={{ background: "linear-gradient(to bottom, #1a1a2e, #16213e)" }}
    >
      {/* Header & Persistent Action Bar */}
      <header className="flex-none p-4 border-b border-white/10 bg-black/20 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight text-white uppercase text-opacity-90 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Overlay Control Panel
          </h1>
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
            <Settings className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex items-center justify-between bg-black/30 p-2 rounded-lg border border-white/5">
          <div className="flex items-center gap-3 px-2">
            <div className={`w-3 h-3 rounded-full ${activeSection.color}`} />
            <span className="font-medium text-slate-200">{activeSection.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button className="bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/20">
              <Save className="w-4 h-4 mr-2" />
              Update {activeSection.shortName}
            </Button>
            <div className="w-px h-6 bg-white/20 mx-2" />
            <Button className="bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-900/20">
              <Eye className="w-4 h-4 mr-2" />
              Show
            </Button>
            <Button className="bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/20">
              <EyeOff className="w-4 h-4 mr-2" />
              Hide
            </Button>
          </div>
        </div>
      </header>

      {/* Tabs Bar */}
      <div className="flex-none px-4 pt-2 border-b border-white/10 bg-black/10 overflow-x-auto no-scrollbar">
        <div className="flex items-end gap-1 min-w-max">
          {SECTIONS.map((section) => {
            const isActive = activeTab === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setActiveTab(section.id)}
                className={`
                  relative px-5 py-2.5 rounded-t-lg text-sm font-medium transition-all flex items-center gap-2 border border-b-0
                  ${isActive 
                    ? 'bg-slate-800/80 text-white border-white/20' 
                    : 'bg-transparent text-slate-400 border-transparent hover:bg-white/5 hover:text-slate-200'
                  }
                `}
              >
                {isActive && (
                  <div className="absolute top-0 left-0 w-full h-0.5 rounded-t-full bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                )}
                <div className={`w-2 h-2 rounded-full ${section.color} ${isActive ? 'shadow-[0_0_8px_rgba(255,255,255,0.4)]' : 'opacity-70'}`} />
                {section.shortName}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 min-h-0 relative bg-slate-900/40">
        <ScrollArea className="h-full">
          <div className="p-6 max-w-4xl mx-auto pb-24">
            {activeTab === "multiview" && <MultiviewPanel />}
            {activeTab === "lower3rd" && <LowerThirdPanel />}
            {activeTab === "ticker" && <TickerPanel />}
            {activeTab === "logo" && <LogoPanel />}
            {activeTab === "title" && <TitleCardPanel />}
            {activeTab === "social" && <SocialPanel />}
            {activeTab === "breaking" && <BreakingPanel />}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

function SectionGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4 mb-8">
      <h3 className="text-sm font-semibold tracking-widest text-slate-400 uppercase border-b border-white/10 pb-2">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {children}
      </div>
    </div>
  );
}

function Field({ label, children, fullWidth = false }: { label: string; children: React.ReactNode; fullWidth?: boolean }) {
  return (
    <div className={`space-y-1.5 ${fullWidth ? 'md:col-span-2' : ''}`}>
      <Label className="text-slate-300 text-xs font-medium">{label}</Label>
      {children}
    </div>
  );
}

const COMMON_FONTS = ["Inter", "Roboto", "Oswald", "Montserrat", "Playfair Display"];
const POSITIONS = ["Top Left", "Top Right", "Bottom Left", "Bottom Right", "Top Center", "Bottom Center"];
const LAYER_OPTIONS = ["All", "Lower Third", "RSS Ticker", "Logo", "Title Card", "Social Bar", "Breaking News", "None"];

function MultiviewPanel() {
  return (
    <div className="space-y-6">
      <div className="bg-black/20 p-4 rounded-xl border border-purple-500/30">
        <p className="text-sm text-purple-200/70 mb-4">Assign overlay components to specific quadrants in the multiview layout.</p>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((q) => (
            <div key={q} className="bg-slate-800/50 p-4 rounded-lg border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-purple-400 font-bold">Q{q}</span>
                <span className="text-xs text-slate-500">Quadrant {q}</span>
              </div>
              <Select defaultValue="None">
                <SelectTrigger className="bg-slate-900 border-white/10 text-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LAYER_OPTIONS.map((o) => (
                    <SelectItem key={o} value={o}>{o}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LowerThirdPanel() {
  return (
    <div className="space-y-8">
      <SectionGroup title="Content">
        <Field label="Line 1 (Name)">
          <Input defaultValue="Jane Doe" className="bg-slate-900 border-white/10 text-white placeholder:text-slate-600" />
        </Field>
        <Field label="Line 2 (Title)">
          <Input defaultValue="Senior Broadcast Engineer" className="bg-slate-900 border-white/10 text-white placeholder:text-slate-600" />
        </Field>
        <Field label="Image URL" fullWidth>
          <div className="flex gap-2">
            <Input placeholder="https://..." className="bg-slate-900 border-white/10 text-white font-mono text-sm" />
            <Button variant="secondary" className="bg-slate-800 text-slate-200 hover:bg-slate-700 border border-white/10">Browse</Button>
          </div>
        </Field>
      </SectionGroup>

      <SectionGroup title="Styling">
        <Field label="Style Preset">
          <Select defaultValue="modern">
            <SelectTrigger className="bg-slate-900 border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["Modern", "Classic", "Minimal", "Bold", "News", "Elegant", "Neon", "Glass"].map((o) => (
                <SelectItem key={o.toLowerCase()} value={o.toLowerCase()}>{o}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Position">
          <Select defaultValue="bottom-left">
            <SelectTrigger className="bg-slate-900 border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {POSITIONS.map((o) => (
                <SelectItem key={o.toLowerCase().replace(' ', '-')} value={o.toLowerCase().replace(' ', '-')}>{o}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Width">
          <Select defaultValue="compact">
            <SelectTrigger className="bg-slate-900 border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="compact">Compact (Fit to text)</SelectItem>
              <SelectItem value="full">Full Width</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Font Family">
          <Select defaultValue="inter">
            <SelectTrigger className="bg-slate-900 border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COMMON_FONTS.map((o) => (
                <SelectItem key={o.toLowerCase()} value={o.toLowerCase()}>{o}</SelectItem>
              ))}
              <SelectItem value="custom">Custom URL...</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </SectionGroup>

      <SectionGroup title="Colors">
        <Field label="Background Color">
          <div className="flex gap-2">
            <Input type="color" defaultValue="#0f172a" className="w-12 p-1 h-10 bg-slate-900 border-white/10 cursor-pointer" />
            <Input defaultValue="#0f172a" className="flex-1 bg-slate-900 border-white/10 text-white font-mono" />
          </div>
        </Field>
        <Field label="Accent Color">
          <div className="flex gap-2">
            <Input type="color" defaultValue="#22d3ee" className="w-12 p-1 h-10 bg-slate-900 border-white/10 cursor-pointer" />
            <Input defaultValue="#22d3ee" className="flex-1 bg-slate-900 border-white/10 text-white font-mono" />
          </div>
        </Field>
        <Field label="Text Color">
          <div className="flex gap-2">
            <Input type="color" defaultValue="#ffffff" className="w-12 p-1 h-10 bg-slate-900 border-white/10 cursor-pointer" />
            <Input defaultValue="#ffffff" className="flex-1 bg-slate-900 border-white/10 text-white font-mono" />
          </div>
        </Field>
      </SectionGroup>
    </div>
  );
}

function TickerPanel() {
  return (
    <div className="space-y-8">
      <SectionGroup title="Data Source">
        <Field label="RSS Feed URL" fullWidth>
          <div className="flex gap-2">
            <Input placeholder="https://news.google.com/rss" defaultValue="https://feeds.bbci.co.uk/news/rss.xml" className="bg-slate-900 border-white/10 text-white font-mono text-sm" />
            <Button className="bg-orange-600 hover:bg-orange-500 text-white">Load Feed</Button>
          </div>
        </Field>
        <Field label="Preview Items" fullWidth>
          <div className="bg-slate-900/50 border border-white/5 rounded-lg p-3 h-32 overflow-y-auto font-mono text-xs text-slate-400 space-y-2">
            <p className="truncate"><span className="text-orange-400 mr-2">1.</span>Global markets rally amid tech sector gains</p>
            <p className="truncate"><span className="text-orange-400 mr-2">2.</span>New climate agreement reached in Geneva</p>
            <p className="truncate"><span className="text-orange-400 mr-2">3.</span>Sports: Championship finals set for this weekend</p>
            <p className="truncate"><span className="text-orange-400 mr-2">4.</span>Space agency announces new lunar mission timeline</p>
          </div>
        </Field>
      </SectionGroup>

      <SectionGroup title="Display Settings">
        <Field label="Position">
          <Select defaultValue="bottom">
            <SelectTrigger className="bg-slate-900 border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="top">Top Edge</SelectItem>
              <SelectItem value="bottom">Bottom Edge</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Scroll Speed">
          <Select defaultValue="medium">
            <SelectTrigger className="bg-slate-900 border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="slow">Slow</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="fast">Fast</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Text Size">
          <Select defaultValue="medium">
            <SelectTrigger className="bg-slate-900 border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Font Family">
          <Select defaultValue="roboto">
            <SelectTrigger className="bg-slate-900 border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COMMON_FONTS.map((o) => (
                <SelectItem key={o.toLowerCase()} value={o.toLowerCase()}>{o}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </SectionGroup>
    </div>
  );
}

function LogoPanel() {
  return (
    <div className="space-y-8">
      <SectionGroup title="Image Source">
        <Field label="Logo URL" fullWidth>
          <div className="flex gap-2">
            <Input placeholder="https://..." defaultValue="/assets/logo.png" className="bg-slate-900 border-white/10 text-white font-mono text-sm" />
            <Button variant="secondary" className="bg-slate-800 text-slate-200 hover:bg-slate-700 border border-white/10">
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
          </div>
        </Field>
        <Field label="Preview" fullWidth>
          <div className="bg-slate-900 border border-dashed border-white/20 rounded-lg h-32 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
            <div className="w-16 h-16 bg-purple-500/20 border border-purple-500/50 rounded flex items-center justify-center shadow-lg shadow-purple-500/20 backdrop-blur-sm relative z-10">
              <span className="text-purple-300 text-xs font-bold">LOGO</span>
            </div>
          </div>
        </Field>
      </SectionGroup>

      <SectionGroup title="Placement & Style">
        <Field label="Corner Position">
          <Select defaultValue="top-right">
            <SelectTrigger className="bg-slate-900 border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="top-left">Top Left</SelectItem>
              <SelectItem value="top-right">Top Right</SelectItem>
              <SelectItem value="bottom-left">Bottom Left</SelectItem>
              <SelectItem value="bottom-right">Bottom Right</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Size Scale">
          <Select defaultValue="medium">
            <SelectTrigger className="bg-slate-900 border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Opacity (80%)" fullWidth>
          <div className="py-4">
            <Slider defaultValue={[80]} max={100} min={10} step={1} className="w-full" />
          </div>
        </Field>
      </SectionGroup>
    </div>
  );
}

function TitleCardPanel() {
  return (
    <div className="space-y-8">
      <SectionGroup title="Content">
        <Field label="Main Title" fullWidth>
          <Input defaultValue="LIVE EVENT STREAM" className="bg-slate-900 border-white/10 text-white text-lg font-bold" />
        </Field>
        <Field label="Subtitle" fullWidth>
          <Input defaultValue="Starting Soon..." className="bg-slate-900 border-white/10 text-white" />
        </Field>
      </SectionGroup>

      <SectionGroup title="Design">
        <Field label="Background Type">
          <Select defaultValue="color">
            <SelectTrigger className="bg-slate-900 border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="color">Solid Color</SelectItem>
              <SelectItem value="image">Image URL</SelectItem>
              <SelectItem value="gradient">Gradient Preset</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Font Family">
          <Select defaultValue="montserrat">
            <SelectTrigger className="bg-slate-900 border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COMMON_FONTS.map((o) => (
                <SelectItem key={o.toLowerCase()} value={o.toLowerCase()}>{o}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Background Color">
          <div className="flex gap-2">
            <Input type="color" defaultValue="#10b981" className="w-12 p-1 h-10 bg-slate-900 border-white/10 cursor-pointer" />
            <Input defaultValue="#10b981" className="flex-1 bg-slate-900 border-white/10 text-white font-mono" />
          </div>
        </Field>
        <Field label="Text Color">
          <div className="flex gap-2">
            <Input type="color" defaultValue="#ffffff" className="w-12 p-1 h-10 bg-slate-900 border-white/10 cursor-pointer" />
            <Input defaultValue="#ffffff" className="flex-1 bg-slate-900 border-white/10 text-white font-mono" />
          </div>
        </Field>
      </SectionGroup>
    </div>
  );
}

function SocialPanel() {
  return (
    <div className="space-y-8">
      <SectionGroup title="Handles">
        <Field label="Twitter / X">
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-slate-500">@</span>
            <Input defaultValue="broadcast_live" className="pl-8 bg-slate-900 border-white/10 text-white" />
          </div>
        </Field>
        <Field label="Instagram">
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-slate-500">@</span>
            <Input defaultValue="broadcast_live" className="pl-8 bg-slate-900 border-white/10 text-white" />
          </div>
        </Field>
        <Field label="YouTube">
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-slate-500">/</span>
            <Input defaultValue="c/broadcastlive" className="pl-8 bg-slate-900 border-white/10 text-white" />
          </div>
        </Field>
        <Field label="TikTok">
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-slate-500">@</span>
            <Input placeholder="username" className="pl-8 bg-slate-900 border-white/10 text-white" />
          </div>
        </Field>
        <Field label="Facebook">
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-slate-500">/</span>
            <Input placeholder="page" className="pl-8 bg-slate-900 border-white/10 text-white" />
          </div>
        </Field>
        <Field label="Website">
          <Input placeholder="www.example.com" defaultValue="broadcast.live" className="bg-slate-900 border-white/10 text-white" />
        </Field>
      </SectionGroup>

      <SectionGroup title="Settings">
        <Field label="Position">
          <Select defaultValue="bottom">
            <SelectTrigger className="bg-slate-900 border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="top-left">Top Left</SelectItem>
              <SelectItem value="top-right">Top Right</SelectItem>
              <SelectItem value="bottom">Bottom Center</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Font Family">
          <Select defaultValue="inter">
            <SelectTrigger className="bg-slate-900 border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COMMON_FONTS.map((o) => (
                <SelectItem key={o.toLowerCase()} value={o.toLowerCase()}>{o}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </SectionGroup>
    </div>
  );
}

function BreakingPanel() {
  return (
    <div className="space-y-8">
      <SectionGroup title="Alert Content">
        <Field label="Banner Text" fullWidth>
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-red-600 rounded-l-md" />
            <Input 
              defaultValue="BREAKING: Major update incoming. Stand by for details." 
              className="pl-6 bg-slate-900 border-red-500/30 focus-visible:ring-red-500 text-white h-14 text-lg" 
            />
          </div>
        </Field>
      </SectionGroup>

      <SectionGroup title="Style">
        <Field label="Font Family">
          <Select defaultValue="oswald">
            <SelectTrigger className="bg-slate-900 border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COMMON_FONTS.map((o) => (
                <SelectItem key={o.toLowerCase()} value={o.toLowerCase()}>{o}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Animation">
          <Select defaultValue="flash">
            <SelectTrigger className="bg-slate-900 border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="flash">Flash & Fade In</SelectItem>
              <SelectItem value="slide">Slide from Left</SelectItem>
              <SelectItem value="drop">Drop Down</SelectItem>
              <SelectItem value="static">Static (No Animation)</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </SectionGroup>
    </div>
  );
}
