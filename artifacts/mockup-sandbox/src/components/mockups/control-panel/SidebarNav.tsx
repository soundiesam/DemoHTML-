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
  { id: 'multiview', label: 'Multiview Layout', color: 'bg-[#a855f7]', text: 'text-[#a855f7]', border: 'border-[#a855f7]', icon: LayoutGrid },
  { id: 'lower-third', label: 'Lower Third', color: 'bg-[#06b6d4]', text: 'text-[#06b6d4]', border: 'border-[#06b6d4]', icon: Type },
  { id: 'rss-ticker', label: 'RSS Ticker', color: 'bg-[#f97316]', text: 'text-[#f97316]', border: 'border-[#f97316]', icon: Rss },
  { id: 'logo-bug', label: 'Logo Bug', color: 'bg-[#a855f7]', text: 'text-[#a855f7]', border: 'border-[#a855f7]', icon: ImageIcon },
  { id: 'title-card', label: 'Title Card', color: 'bg-[#22c55e]', text: 'text-[#22c55e]', border: 'border-[#22c55e]', icon: Presentation },
  { id: 'social-bar', label: 'Social Media Bar', color: 'bg-[#ec4899]', text: 'text-[#ec4899]', border: 'border-[#ec4899]', icon: Share2 },
  { id: 'breaking-news', label: 'Breaking News', color: 'bg-[#ef4444]', text: 'text-[#ef4444]', border: 'border-[#ef4444]', icon: AlertTriangle },
];

export function SidebarNav() {
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);

  const activeData = SECTIONS.find(s => s.id === activeSection) || SECTIONS[0];

  return (
    <div className="flex flex-col h-[100dvh] w-full overflow-hidden text-slate-200" style={{ backgroundImage: 'linear-gradient(to bottom right, #1a1a2e, #16213e)' }}>
      {/* Header */}
      <header className="flex-none flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/20 backdrop-blur-sm z-10">
        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
            <LayoutGrid className="w-4 h-4 text-white" />
          </div>
          Overlay Control Panel
        </h1>
        <Button variant="ghost" size="icon" className="hover:bg-white/10 rounded-full text-slate-300">
          <Settings className="w-5 h-5" />
        </Button>
      </header>

      {/* Main Layout */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* Sidebar */}
        <aside className="w-[280px] flex-none flex flex-col border-r border-white/10 bg-black/10">
          <ScrollArea className="flex-1 py-4">
            <nav className="px-3 space-y-1">
              {SECTIONS.map((section) => {
                const isActive = activeSection === section.id;
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-md transition-all duration-200 text-left ${
                      isActive 
                        ? 'bg-white/10 shadow-sm text-white font-medium' 
                        : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                    }`}
                  >
                    <div className={`relative flex items-center justify-center w-6 h-6`}>
                      <Icon className={`w-4 h-4 ${isActive ? section.text : 'text-slate-500'}`} />
                      {isActive && (
                        <div className={`absolute -left-5 w-1 h-6 rounded-r-md ${section.color}`} />
                      )}
                    </div>
                    <span className="truncate">{section.label}</span>
                    <div className={`ml-auto w-2 h-2 rounded-full ${section.color} ${isActive ? 'opacity-100 shadow-[0_0_8px_currentColor]' : 'opacity-40'}`} />
                  </button>
                );
              })}
            </nav>
          </ScrollArea>
          
          {/* Global Actions for Active Section */}
          <div className="p-4 border-t border-white/10 bg-black/20 space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${activeData.color}`}></span>
              {activeData.label} Actions
            </div>
            <Button className="w-full bg-[#10b981] hover:bg-[#059669] text-white shadow-lg shadow-[#10b981]/20 border-0 h-10">
              <Save className="w-4 h-4 mr-2" />
              Update {activeData.label}
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button className="bg-[#06b6d4] hover:bg-[#0891b2] text-white shadow-lg shadow-[#06b6d4]/20 border-0">
                <Eye className="w-4 h-4 mr-2" />
                Show
              </Button>
              <Button className="bg-[#ef4444] hover:bg-[#dc2626] text-white shadow-lg shadow-[#ef4444]/20 border-0">
                <EyeOff className="w-4 h-4 mr-2" />
                Hide
              </Button>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <section className="flex-1 relative overflow-hidden bg-white/5">
          <ScrollArea className="h-full">
            <div className="p-8 max-w-4xl mx-auto">
              
              <div className="mb-8">
                <h2 className={`text-3xl font-bold flex items-center gap-3 ${activeData.text}`}>
                  <activeData.icon className="w-8 h-8" />
                  {activeData.label}
                </h2>
                <p className="text-slate-400 mt-2">Configure settings and properties for the {activeData.label.toLowerCase()} overlay.</p>
              </div>

              <div className="bg-black/30 border border-white/10 rounded-xl p-6 shadow-2xl backdrop-blur-sm">
                {activeSection === 'multiview' && <MultiviewForm />}
                {activeSection === 'lower-third' && <LowerThirdForm />}
                {activeSection === 'rss-ticker' && <RssTickerForm />}
                {activeSection === 'logo-bug' && <LogoBugForm />}
                {activeSection === 'title-card' && <TitleCardForm />}
                {activeSection === 'social-bar' && <SocialBarForm />}
                {activeSection === 'breaking-news' && <BreakingNewsForm />}
              </div>
              
              {/* Spacer for bottom */}
              <div className="h-12"></div>
            </div>
          </ScrollArea>
        </section>
      </main>
    </div>
  );
}

// Form Components

function FormGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>;
}

function FormGroup({ label, children }: { label: string, children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-slate-300 font-medium text-sm">{label}</Label>
      {children}
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2 mb-4 col-span-full">{title}</h3>;
}

const inputStyles = "bg-black/50 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-cyan-500";
const selectTriggerStyles = "bg-black/50 border-white/10 text-white focus:ring-cyan-500";

function MultiviewForm() {
  const quadrants = ['Quadrant 1 (Top Left)', 'Quadrant 2 (Top Right)', 'Quadrant 3 (Bottom Left)', 'Quadrant 4 (Bottom Right)'];
  const options = ['All', 'Lower Third', 'RSS Ticker', 'Logo Bug', 'Title Card', 'Social Bar', 'Breaking News', 'None'];
  
  return (
    <FormGrid>
      <SectionHeader title="Quadrant Assignments" />
      {quadrants.map((q, i) => (
        <FormGroup key={i} label={q}>
          <Select defaultValue="None">
            <SelectTrigger className={selectTriggerStyles}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a2e] border-white/10 text-white">
              {options.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
            </SelectContent>
          </Select>
        </FormGroup>
      ))}
    </FormGrid>
  );
}

function LowerThirdForm() {
  const styles = ['Modern', 'Classic', 'Minimal', 'Bold', 'News', 'Elegant', 'Neon', 'Glass'];
  const positions = ['Bottom Left', 'Bottom Center', 'Bottom Right', 'Top Left', 'Top Center', 'Top Right'];
  
  return (
    <div className="space-y-8">
      <FormGrid>
        <SectionHeader title="Content" />
        <FormGroup label="Line 1 (Name)">
          <Input className={inputStyles} placeholder="Jane Doe" defaultValue="JOHN DOE" />
        </FormGroup>
        <FormGroup label="Line 2 (Title/Subtitle)">
          <Input className={inputStyles} placeholder="Guest Expert" defaultValue="Chief Creative Officer" />
        </FormGroup>
        <FormGroup label="Image URL (Avatar/Logo)">
          <Input className={inputStyles} placeholder="https://example.com/avatar.png" />
        </FormGroup>
        <FormGroup label="Image Shape">
          <Select defaultValue="circle">
            <SelectTrigger className={selectTriggerStyles}><SelectValue /></SelectTrigger>
            <SelectContent className="bg-[#1a1a2e] border-white/10 text-white">
              <SelectItem value="circle">Circle</SelectItem>
              <SelectItem value="square">Square</SelectItem>
              <SelectItem value="rounded">Rounded</SelectItem>
            </SelectContent>
          </Select>
        </FormGroup>
      </FormGrid>

      <FormGrid>
        <SectionHeader title="Appearance & Position" />
        <FormGroup label="Style Preset">
          <Select defaultValue="Modern">
            <SelectTrigger className={selectTriggerStyles}><SelectValue /></SelectTrigger>
            <SelectContent className="bg-[#1a1a2e] border-white/10 text-white">
              {styles.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </FormGroup>
        <FormGroup label="Position">
          <Select defaultValue="Bottom Left">
            <SelectTrigger className={selectTriggerStyles}><SelectValue /></SelectTrigger>
            <SelectContent className="bg-[#1a1a2e] border-white/10 text-white">
              {positions.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
        </FormGroup>
        <FormGroup label="Width">
          <Select defaultValue="compact">
            <SelectTrigger className={selectTriggerStyles}><SelectValue /></SelectTrigger>
            <SelectContent className="bg-[#1a1a2e] border-white/10 text-white">
              <SelectItem value="compact">Compact (Fit Content)</SelectItem>
              <SelectItem value="full">Full Width</SelectItem>
            </SelectContent>
          </Select>
        </FormGroup>
        <FormGroup label="Text Size">
          <Select defaultValue="medium">
            <SelectTrigger className={selectTriggerStyles}><SelectValue /></SelectTrigger>
            <SelectContent className="bg-[#1a1a2e] border-white/10 text-white">
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
        </FormGroup>
      </FormGrid>
      
      <FormGrid>
        <SectionHeader title="Colors" />
        <FormGroup label="Background Color">
          <div className="flex gap-2">
            <div className="w-10 h-10 rounded border border-white/10 bg-[#1e293b]"></div>
            <Input className={inputStyles} defaultValue="#1e293b" />
          </div>
        </FormGroup>
        <FormGroup label="Accent Color">
          <div className="flex gap-2">
            <div className="w-10 h-10 rounded border border-white/10 bg-[#06b6d4]"></div>
            <Input className={inputStyles} defaultValue="#06b6d4" />
          </div>
        </FormGroup>
      </FormGrid>
    </div>
  );
}

function RssTickerForm() {
  return (
    <FormGrid>
      <SectionHeader title="Feed Data" />
      <div className="col-span-full">
        <FormGroup label="RSS Feed URL">
          <div className="flex gap-2">
            <Input className={inputStyles} placeholder="https://news.ycombinator.com/rss" defaultValue="https://feeds.bbci.co.uk/news/rss.xml" />
            <Button variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-0">Load Feed</Button>
          </div>
        </FormGroup>
      </div>
      
      <div className="col-span-full mt-2">
        <Label className="text-slate-300 font-medium text-sm mb-2 block">Feed Preview (First 3 items)</Label>
        <div className="bg-black/40 rounded-lg p-3 space-y-2 border border-white/5">
          <div className="text-sm text-slate-300 truncate">1. Global Markets Rally as Tech Stocks Surge</div>
          <div className="text-sm text-slate-300 truncate">2. New Climate Accord Signed in Geneva</div>
          <div className="text-sm text-slate-300 truncate">3. Space Telescope Captures Stunning Galaxy Image</div>
        </div>
      </div>

      <SectionHeader title="Settings" />
      <FormGroup label="Position">
        <Select defaultValue="bottom">
          <SelectTrigger className={selectTriggerStyles}><SelectValue /></SelectTrigger>
          <SelectContent className="bg-[#1a1a2e] border-white/10 text-white">
            <SelectItem value="top">Top</SelectItem>
            <SelectItem value="bottom">Bottom</SelectItem>
          </SelectContent>
        </Select>
      </FormGroup>
      <FormGroup label="Speed">
        <Select defaultValue="medium">
          <SelectTrigger className={selectTriggerStyles}><SelectValue /></SelectTrigger>
          <SelectContent className="bg-[#1a1a2e] border-white/10 text-white">
            <SelectItem value="slow">Slow</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="fast">Fast</SelectItem>
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
          <Input className={inputStyles} placeholder="https://example.com/logo.png" defaultValue="https://assets.example.com/brand/logo-white.png" />
        </FormGroup>
      </div>
      
      <SectionHeader title="Position & Size" />
      <FormGroup label="Position">
        <Select defaultValue="top-right">
          <SelectTrigger className={selectTriggerStyles}><SelectValue /></SelectTrigger>
          <SelectContent className="bg-[#1a1a2e] border-white/10 text-white">
            <SelectItem value="top-left">Top Left</SelectItem>
            <SelectItem value="top-right">Top Right</SelectItem>
            <SelectItem value="bottom-left">Bottom Left</SelectItem>
            <SelectItem value="bottom-right">Bottom Right</SelectItem>
          </SelectContent>
        </Select>
      </FormGroup>
      <FormGroup label="Size">
        <Select defaultValue="medium">
          <SelectTrigger className={selectTriggerStyles}><SelectValue /></SelectTrigger>
          <SelectContent className="bg-[#1a1a2e] border-white/10 text-white">
            <SelectItem value="small">Small</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="large">Large</SelectItem>
          </SelectContent>
        </Select>
      </FormGroup>
      <div className="col-span-full">
        <FormGroup label="Opacity (80%)">
          <div className="pt-4 px-2">
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
      <SectionHeader title="Text Content" />
      <div className="col-span-full space-y-4">
        <FormGroup label="Title">
          <Input className={`${inputStyles} text-lg py-6`} placeholder="Main presentation title..." defaultValue="Quarterly Review Q3" />
        </FormGroup>
        <FormGroup label="Subtitle">
          <Input className={inputStyles} placeholder="Optional subtitle..." defaultValue="Financial Results & Product Updates" />
        </FormGroup>
      </div>
      
      <SectionHeader title="Background" />
      <div className="col-span-full">
        <FormGroup label="Background Image URL (Optional)">
          <Input className={inputStyles} placeholder="https://example.com/bg.jpg" />
        </FormGroup>
      </div>
      
      <FormGroup label="Background Color">
        <div className="flex gap-2">
          <div className="w-10 h-10 rounded border border-white/10 bg-[#0f172a]"></div>
          <Input className={inputStyles} defaultValue="#0f172a" />
        </div>
      </FormGroup>
      <FormGroup label="Text Color">
        <div className="flex gap-2">
          <div className="w-10 h-10 rounded border border-white/10 bg-[#ffffff]"></div>
          <Input className={inputStyles} defaultValue="#ffffff" />
        </div>
      </FormGroup>
    </FormGrid>
  );
}

function SocialBarForm() {
  return (
    <FormGrid>
      <SectionHeader title="Social Handles (Leave blank to hide)" />
      <FormGroup label="Twitter / X">
        <Input className={inputStyles} placeholder="@handle" defaultValue="@streamerXYZ" />
      </FormGroup>
      <FormGroup label="YouTube">
        <Input className={inputStyles} placeholder="/c/channel" defaultValue="/c/StreamerXYZ" />
      </FormGroup>
      <FormGroup label="Instagram">
        <Input className={inputStyles} placeholder="@handle" defaultValue="@streamerXYZ" />
      </FormGroup>
      <FormGroup label="TikTok">
        <Input className={inputStyles} placeholder="@handle" />
      </FormGroup>
      <FormGroup label="Facebook">
        <Input className={inputStyles} placeholder="/page" />
      </FormGroup>
      <FormGroup label="Website">
        <Input className={inputStyles} placeholder="domain.com" defaultValue="streamerxyz.com" />
      </FormGroup>
      
      <SectionHeader title="Settings" />
      <FormGroup label="Position">
        <Select defaultValue="top">
          <SelectTrigger className={selectTriggerStyles}><SelectValue /></SelectTrigger>
          <SelectContent className="bg-[#1a1a2e] border-white/10 text-white">
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
          <Input className={`${inputStyles} text-lg py-6 border-red-500/50 focus-visible:ring-red-500`} placeholder="BREAKING: ..." defaultValue="BREAKING: Major announcement expected at 12:00 PM EST today." />
        </FormGroup>
      </div>
      <FormGroup label="Font Family">
        <Select defaultValue="impact">
          <SelectTrigger className={`${selectTriggerStyles} focus:ring-red-500`}><SelectValue /></SelectTrigger>
          <SelectContent className="bg-[#1a1a2e] border-white/10 text-white">
            <SelectItem value="impact">Impact / Heavy</SelectItem>
            <SelectItem value="sans">Modern Sans</SelectItem>
            <SelectItem value="serif">Classic News Serif</SelectItem>
          </SelectContent>
        </Select>
      </FormGroup>
    </FormGrid>
  );
}
