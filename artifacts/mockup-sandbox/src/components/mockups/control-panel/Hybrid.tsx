import React, { useState } from 'react';
import {
  Settings, LayoutGrid, Type, Rss, Image as ImageIcon,
  Presentation, Share2, AlertTriangle, Eye, EyeOff, Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';

const SECTIONS = [
  { id: 'multiview',     label: 'Multiview',     shortLabel: 'Multiview', icon: LayoutGrid,   solidColor: '#a855f7', textColor: 'text-[#a855f7]', bgAccent: 'bg-[#a855f7]',  showBg: 'bg-purple-700 hover:bg-purple-600',  hideBg: 'bg-purple-900/60 hover:bg-purple-800 border border-purple-600/40' },
  { id: 'lower-third',   label: 'Lower Third',   shortLabel: 'Lower 3rd', icon: Type,         solidColor: '#06b6d4', textColor: 'text-[#06b6d4]', bgAccent: 'bg-[#06b6d4]',  showBg: 'bg-cyan-600 hover:bg-cyan-500',      hideBg: 'bg-cyan-900/60 hover:bg-cyan-800 border border-cyan-600/40' },
  { id: 'rss-ticker',    label: 'RSS Ticker',    shortLabel: 'Ticker',    icon: Rss,          solidColor: '#f97316', textColor: 'text-[#f97316]', bgAccent: 'bg-[#f97316]',  showBg: 'bg-orange-600 hover:bg-orange-500',  hideBg: 'bg-orange-900/60 hover:bg-orange-800 border border-orange-600/40' },
  { id: 'logo-bug',      label: 'Logo Bug',      shortLabel: 'Logo',      icon: ImageIcon,    solidColor: '#a855f7', textColor: 'text-[#a855f7]', bgAccent: 'bg-[#a855f7]',  showBg: 'bg-purple-700 hover:bg-purple-600',  hideBg: 'bg-purple-900/60 hover:bg-purple-800 border border-purple-600/40' },
  { id: 'title-card',    label: 'Title Card',    shortLabel: 'Title',     icon: Presentation, solidColor: '#22c55e', textColor: 'text-[#22c55e]', bgAccent: 'bg-[#22c55e]',  showBg: 'bg-green-600 hover:bg-green-500',    hideBg: 'bg-green-900/60 hover:bg-green-800 border border-green-600/40' },
  { id: 'social-bar',    label: 'Social Media Bar', shortLabel: 'Social', icon: Share2,       solidColor: '#ec4899', textColor: 'text-[#ec4899]', bgAccent: 'bg-[#ec4899]',  showBg: 'bg-pink-600 hover:bg-pink-500',      hideBg: 'bg-pink-900/60 hover:bg-pink-800 border border-pink-600/40' },
  { id: 'breaking-news', label: 'Breaking News', shortLabel: 'Breaking',  icon: AlertTriangle,solidColor: '#ef4444', textColor: 'text-[#ef4444]', bgAccent: 'bg-[#ef4444]',  showBg: 'bg-red-600 hover:bg-red-500',        hideBg: 'bg-red-900/60 hover:bg-red-800 border border-red-600/40' },
];

export function Hybrid() {
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const [visible, setVisible] = useState<Record<string, boolean>>({});

  const activeData = SECTIONS.find(s => s.id === activeSection) || SECTIONS[0];

  return (
    <div className="flex flex-col h-[100dvh] w-full overflow-hidden text-slate-200" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>

      {/* ── Header ── */}
      <header className="flex-none flex items-center justify-between px-5 py-3 border-b border-white/10 bg-black/25 backdrop-blur-sm z-10">
        <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <LayoutGrid className="w-3.5 h-3.5 text-white" />
          </div>
          Overlay Control Panel
        </h1>
        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10 rounded-full text-slate-400">
          <Settings className="w-4 h-4" />
        </Button>
      </header>

      {/* ── Command Strip ── */}
      <div className="flex-none bg-black/30 border-b border-white/8 px-4 py-2.5">
        <div className="flex items-center gap-2">
          {SECTIONS.map((sec) => {
            const isOn = visible[sec.id];
            const Icon = sec.icon;
            return (
              <div key={sec.id} className="flex flex-col items-center gap-1 flex-1 min-w-0">
                <span className={`text-[10px] font-semibold uppercase tracking-wide ${sec.textColor} flex items-center gap-1 whitespace-nowrap`}>
                  <Icon className="w-3 h-3 flex-none" />
                  {sec.shortLabel}
                </span>
                <div className="flex gap-1 w-full">
                  <button
                    onClick={() => setVisible(v => ({ ...v, [sec.id]: true }))}
                    className={`flex-1 flex items-center justify-center gap-0.5 rounded text-[11px] font-medium py-1 transition-all ${isOn ? sec.showBg + ' text-white shadow-sm' : 'bg-white/5 hover:bg-white/10 text-slate-400 border border-white/8'}`}
                  >
                    <Eye className="w-3 h-3 flex-none" />
                    <span>Show</span>
                  </button>
                  <button
                    onClick={() => setVisible(v => ({ ...v, [sec.id]: false }))}
                    className={`flex-1 flex items-center justify-center gap-0.5 rounded text-[11px] font-medium py-1 transition-all ${!isOn && visible[sec.id] !== undefined ? 'bg-red-700 hover:bg-red-600 text-white shadow-sm' : 'bg-white/5 hover:bg-white/10 text-slate-400 border border-white/8'}`}
                  >
                    <EyeOff className="w-3 h-3 flex-none" />
                    <span>Hide</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Main: Sidebar + Content ── */}
      <main className="flex-1 flex overflow-hidden">

        {/* Sidebar */}
        <aside className="w-[210px] flex-none flex flex-col border-r border-white/10 bg-black/10">
          <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-auto">
            {SECTIONS.map((section) => {
              const isActive = activeSection === section.id;
              const isOn = visible[section.id];
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md transition-all duration-150 text-left group ${
                    isActive
                      ? 'bg-white/10 text-white font-medium shadow-sm'
                      : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                  }`}
                >
                  <div className="relative flex items-center justify-center flex-none">
                    <Icon className={`w-4 h-4 ${isActive ? section.textColor : 'text-slate-500 group-hover:text-slate-400'}`} />
                    {isActive && (
                      <div className="absolute -left-5 w-[3px] h-5 rounded-r-full" style={{ backgroundColor: section.solidColor }} />
                    )}
                  </div>
                  <span className="truncate text-sm">{section.label}</span>
                  <div className="ml-auto flex items-center gap-1.5 flex-none">
                    {isOn !== undefined && (
                      <span className={`text-[9px] font-bold uppercase rounded px-1 py-0.5 ${isOn ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                        {isOn ? 'ON' : 'OFF'}
                      </span>
                    )}
                    <div className="w-1.5 h-1.5 rounded-full flex-none" style={{ backgroundColor: section.solidColor, opacity: isActive ? 1 : 0.35 }} />
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Sidebar footer: Update button for active section */}
          <div className="flex-none p-3 border-t border-white/10 bg-black/20">
            <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white border-0 h-9 text-sm shadow-lg shadow-emerald-600/20">
              <Save className="w-3.5 h-3.5 mr-2" />
              Update {activeData.shortLabel ?? activeData.label}
            </Button>
          </div>
        </aside>

        {/* Content Area */}
        <section className="flex-1 overflow-hidden bg-white/[0.02]">
          <ScrollArea className="h-full">
            <div className="p-6 max-w-3xl mx-auto">
              <div className="mb-5">
                <h2 className={`text-2xl font-bold flex items-center gap-2.5 ${activeData.textColor}`}>
                  <activeData.icon className="w-6 h-6" />
                  {activeData.label}
                </h2>
                <p className="text-slate-500 mt-1 text-sm">Configure overlay settings for {activeData.label.toLowerCase()}.</p>
              </div>

              <div className="bg-black/25 border border-white/8 rounded-xl p-5 shadow-xl">
                {activeSection === 'multiview'     && <MultiviewForm />}
                {activeSection === 'lower-third'   && <LowerThirdForm />}
                {activeSection === 'rss-ticker'    && <RssTickerForm />}
                {activeSection === 'logo-bug'      && <LogoBugForm />}
                {activeSection === 'title-card'    && <TitleCardForm />}
                {activeSection === 'social-bar'    && <SocialBarForm />}
                {activeSection === 'breaking-news' && <BreakingNewsForm />}
              </div>
              <div className="h-6" />
            </div>
          </ScrollArea>
        </section>
      </main>
    </div>
  );
}

// ── Shared helpers ────────────────────────────────────────────────
function FormGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-5">{children}</div>;
}
function FormGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-slate-300 font-medium text-xs uppercase tracking-wide">{label}</Label>
      {children}
    </div>
  );
}
function SectionHeader({ title }: { title: string }) {
  return <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider border-b border-white/8 pb-2 mb-4 col-span-full">{title}</h3>;
}
const inp = "bg-black/50 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-cyan-500 h-9 text-sm";
const sel = "bg-black/50 border-white/10 text-white focus:ring-cyan-500 h-9 text-sm";
const scc = "bg-[#0f172a] border-white/10 text-white";

// ── Forms ─────────────────────────────────────────────────────────
function MultiviewForm() {
  const quadrants = ['Q1 — Top Left', 'Q2 — Top Right', 'Q3 — Bottom Left', 'Q4 — Bottom Right'];
  const opts = ['All Elements', 'Lower Third', 'RSS Ticker', 'Logo Bug', 'Title Card', 'Social Bar', 'Breaking News', 'None'];
  return (
    <FormGrid>
      <SectionHeader title="Quadrant Assignments" />
      {quadrants.map((q, i) => (
        <FormGroup key={i} label={q}>
          <Select defaultValue="None">
            <SelectTrigger className={sel}><SelectValue /></SelectTrigger>
            <SelectContent className={scc}>{opts.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
          </Select>
        </FormGroup>
      ))}
    </FormGrid>
  );
}

function LowerThirdForm() {
  const styles = ['Modern', 'Classic', 'Minimal', 'Bold', 'News', 'Elegant', 'Neon', 'Glass'];
  const positions = ['Bottom Left', 'Bottom Center', 'Bottom Right', 'Top Left', 'Top Center', 'Top Right'];
  const fonts = ['Arial', 'Helvetica', 'Georgia', 'Roboto', 'Open Sans', 'Montserrat', 'Playfair Display', 'Lato', 'Oswald', 'Raleway', 'Bebas Neue'];
  return (
    <div className="space-y-6">
      <FormGrid>
        <SectionHeader title="Content" />
        <FormGroup label="Line 1 — Name">
          <Input className={inp} defaultValue="JOHN DOE" />
        </FormGroup>
        <FormGroup label="Line 2 — Title">
          <Input className={inp} defaultValue="Chief Creative Officer" />
        </FormGroup>
        <FormGroup label="Image URL">
          <Input className={inp} placeholder="https://example.com/avatar.png" />
        </FormGroup>
        <FormGroup label="Image Shape">
          <Select defaultValue="circle">
            <SelectTrigger className={sel}><SelectValue /></SelectTrigger>
            <SelectContent className={scc}>
              <SelectItem value="circle">Circle</SelectItem>
              <SelectItem value="square">Square</SelectItem>
              <SelectItem value="rounded">Rounded</SelectItem>
            </SelectContent>
          </Select>
        </FormGroup>
      </FormGrid>
      <FormGrid>
        <SectionHeader title="Layout & Style" />
        <FormGroup label="Style Preset">
          <Select defaultValue="Modern">
            <SelectTrigger className={sel}><SelectValue /></SelectTrigger>
            <SelectContent className={scc}>{styles.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
        </FormGroup>
        <FormGroup label="Position">
          <Select defaultValue="Bottom Left">
            <SelectTrigger className={sel}><SelectValue /></SelectTrigger>
            <SelectContent className={scc}>{positions.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
          </Select>
        </FormGroup>
        <FormGroup label="Width">
          <Select defaultValue="compact">
            <SelectTrigger className={sel}><SelectValue /></SelectTrigger>
            <SelectContent className={scc}>
              <SelectItem value="compact">Compact</SelectItem>
              <SelectItem value="full">Full Width</SelectItem>
            </SelectContent>
          </Select>
        </FormGroup>
        <FormGroup label="Text Size">
          <Select defaultValue="medium">
            <SelectTrigger className={sel}><SelectValue /></SelectTrigger>
            <SelectContent className={scc}>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
              <SelectItem value="xl">Extra Large</SelectItem>
            </SelectContent>
          </Select>
        </FormGroup>
        <FormGroup label="Font">
          <Select defaultValue="Arial">
            <SelectTrigger className={sel}><SelectValue /></SelectTrigger>
            <SelectContent className={scc}>{fonts.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
          </Select>
        </FormGroup>
        <FormGroup label="Custom Font URL">
          <Input className={inp} placeholder="https://fonts.googleapis.com/..." />
        </FormGroup>
      </FormGrid>
      <FormGrid>
        <SectionHeader title="Colors" />
        <FormGroup label="Background Color">
          <div className="flex gap-2">
            <div className="w-9 h-9 rounded border border-white/10 bg-[#1e293b] flex-none" />
            <Input className={inp} defaultValue="#1e293b" />
          </div>
        </FormGroup>
        <FormGroup label="Accent Color">
          <div className="flex gap-2">
            <div className="w-9 h-9 rounded border border-white/10 bg-[#06b6d4] flex-none" />
            <Input className={inp} defaultValue="#06b6d4" />
          </div>
        </FormGroup>
        <FormGroup label="Text Color">
          <div className="flex gap-2">
            <div className="w-9 h-9 rounded border border-white/10 bg-white flex-none" />
            <Input className={inp} defaultValue="#ffffff" />
          </div>
        </FormGroup>
        <FormGroup label="Auto-hide (seconds, 0 = manual)">
          <Input className={inp} type="number" defaultValue="0" min="0" />
        </FormGroup>
      </FormGrid>
    </div>
  );
}

function RssTickerForm() {
  return (
    <FormGrid>
      <SectionHeader title="Feed" />
      <div className="col-span-full">
        <FormGroup label="RSS Feed URL">
          <div className="flex gap-2">
            <Input className={inp} defaultValue="https://feeds.bbci.co.uk/news/rss.xml" />
            <Button variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-0 h-9 text-sm whitespace-nowrap">Load Feed</Button>
          </div>
        </FormGroup>
      </div>
      <div className="col-span-full">
        <Label className="text-slate-400 text-xs uppercase tracking-wide mb-2 block">Feed Preview</Label>
        <div className="bg-black/40 rounded-lg p-3 space-y-1.5 border border-white/5">
          {['Global Markets Rally as Tech Stocks Surge', 'New Climate Accord Signed in Geneva', 'Space Telescope Captures Stunning Galaxy Image'].map((h, i) => (
            <div key={i} className="text-sm text-slate-300 truncate">{i + 1}. {h}</div>
          ))}
        </div>
      </div>
      <SectionHeader title="Display Settings" />
      <FormGroup label="Position">
        <Select defaultValue="bottom">
          <SelectTrigger className={sel}><SelectValue /></SelectTrigger>
          <SelectContent className={scc}>
            <SelectItem value="top">Top</SelectItem>
            <SelectItem value="bottom">Bottom</SelectItem>
          </SelectContent>
        </Select>
      </FormGroup>
      <FormGroup label="Speed">
        <Select defaultValue="medium">
          <SelectTrigger className={sel}><SelectValue /></SelectTrigger>
          <SelectContent className={scc}>
            <SelectItem value="slow">Slow</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="fast">Fast</SelectItem>
          </SelectContent>
        </Select>
      </FormGroup>
      <FormGroup label="Text Size">
        <Select defaultValue="medium">
          <SelectTrigger className={sel}><SelectValue /></SelectTrigger>
          <SelectContent className={scc}>
            <SelectItem value="small">Small</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="large">Large</SelectItem>
          </SelectContent>
        </Select>
      </FormGroup>
    </FormGrid>
  );
}

function LogoBugForm() {
  return (
    <FormGrid>
      <SectionHeader title="Logo Image" />
      <div className="col-span-full">
        <FormGroup label="Image URL (PNG with transparency recommended)">
          <Input className={inp} placeholder="https://example.com/logo.png" />
        </FormGroup>
      </div>
      <SectionHeader title="Position & Size" />
      <FormGroup label="Position">
        <Select defaultValue="top-right">
          <SelectTrigger className={sel}><SelectValue /></SelectTrigger>
          <SelectContent className={scc}>
            <SelectItem value="top-left">Top Left</SelectItem>
            <SelectItem value="top-right">Top Right</SelectItem>
            <SelectItem value="bottom-left">Bottom Left</SelectItem>
            <SelectItem value="bottom-right">Bottom Right</SelectItem>
          </SelectContent>
        </Select>
      </FormGroup>
      <FormGroup label="Size">
        <Select defaultValue="medium">
          <SelectTrigger className={sel}><SelectValue /></SelectTrigger>
          <SelectContent className={scc}>
            <SelectItem value="small">Small</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="large">Large</SelectItem>
          </SelectContent>
        </Select>
      </FormGroup>
      <div className="col-span-full">
        <FormGroup label="Opacity — 80%">
          <div className="pt-3 px-1">
            <Slider defaultValue={[80]} max={100} min={10} step={1} className="[&_[role=slider]]:bg-purple-500 [&_[role=slider]]:border-purple-500" />
          </div>
        </FormGroup>
      </div>
    </FormGrid>
  );
}

function TitleCardForm() {
  return (
    <FormGrid>
      <SectionHeader title="Text" />
      <div className="col-span-full">
        <FormGroup label="Title">
          <Input className={inp} defaultValue="Quarterly Review Q3" />
        </FormGroup>
      </div>
      <div className="col-span-full">
        <FormGroup label="Subtitle">
          <Input className={inp} defaultValue="Financial Results & Product Updates" />
        </FormGroup>
      </div>
      <SectionHeader title="Background" />
      <div className="col-span-full">
        <FormGroup label="Background Image URL (optional)">
          <Input className={inp} placeholder="https://example.com/bg.jpg" />
        </FormGroup>
      </div>
      <FormGroup label="Background Color">
        <div className="flex gap-2">
          <div className="w-9 h-9 rounded border border-white/10 bg-[#0f172a] flex-none" />
          <Input className={inp} defaultValue="#0f172a" />
        </div>
      </FormGroup>
      <FormGroup label="Text Color">
        <div className="flex gap-2">
          <div className="w-9 h-9 rounded border border-white/10 bg-white flex-none" />
          <Input className={inp} defaultValue="#ffffff" />
        </div>
      </FormGroup>
    </FormGrid>
  );
}

function SocialBarForm() {
  return (
    <FormGrid>
      <SectionHeader title="Social Handles (leave blank to hide)" />
      {[['Twitter / X', '@streamerXYZ'], ['YouTube', '/c/StreamerXYZ'], ['Instagram', '@streamerXYZ'], ['TikTok', ''], ['Facebook', ''], ['Website', 'streamerxyz.com']].map(([label, val]) => (
        <FormGroup key={label} label={label}>
          <Input className={inp} placeholder={label} defaultValue={val} />
        </FormGroup>
      ))}
      <SectionHeader title="Display Settings" />
      <FormGroup label="Position">
        <Select defaultValue="top">
          <SelectTrigger className={sel}><SelectValue /></SelectTrigger>
          <SelectContent className={scc}>
            <SelectItem value="top">Top</SelectItem>
            <SelectItem value="bottom">Bottom</SelectItem>
          </SelectContent>
        </Select>
      </FormGroup>
    </FormGrid>
  );
}

function BreakingNewsForm() {
  return (
    <FormGrid>
      <SectionHeader title="Banner Content" />
      <div className="col-span-full">
        <FormGroup label="Headline Text">
          <Input
            className={`${inp} border-red-500/40 focus-visible:ring-red-500`}
            defaultValue="BREAKING: Major announcement expected at 12:00 PM EST today."
          />
        </FormGroup>
      </div>
      <FormGroup label="Font Family">
        <Select defaultValue="impact">
          <SelectTrigger className={`${sel} focus:ring-red-500`}><SelectValue /></SelectTrigger>
          <SelectContent className={scc}>
            <SelectItem value="impact">Impact / Heavy</SelectItem>
            <SelectItem value="sans">Modern Sans</SelectItem>
            <SelectItem value="serif">Classic News Serif</SelectItem>
          </SelectContent>
        </Select>
      </FormGroup>
    </FormGrid>
  );
}
