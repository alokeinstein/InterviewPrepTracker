'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Server,
  Code2,
  Repeat,
  PenTool,
  Bot,
  BarChart3,
  Flame,
  Brain,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

const navItems = [
  { name: 'Command Center', href: '/', icon: LayoutDashboard },
  { name: 'System Design', href: '/system-design', icon: Server, badge: 'DDIA' },
  { name: 'DSA Arena', href: '/dsa', icon: Code2, count: 498 },
  { name: 'Revision Engine', href: '/revision', icon: Repeat, badge: 'Due' },
  { name: 'Whiteboard Canvas', href: '/whiteboard', icon: PenTool },
  { name: 'Mock Interviews', href: '/interview', icon: Bot },
  { name: 'Analytics & Readiness', href: '/analytics', icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-border bg-card/60 backdrop-blur-md flex flex-col h-screen sticky top-0 shrink-0">
      {/* App Branding */}
      <div className="h-16 flex items-center px-6 border-b border-border gap-3">
        <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
          <Brain className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-bold text-sm tracking-tight text-foreground leading-none">Interview OS</h1>
          <p className="text-[11px] text-muted-foreground mt-0.5">Staff-Level Prep Engine</p>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all group',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className={cn('h-4 w-4', isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground')} />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <Badge
                  variant={isActive ? 'secondary' : 'outline'}
                  className={cn(
                    'text-[10px] px-1.5 py-0 h-4 font-mono',
                    isActive ? 'bg-primary-foreground/20 text-primary-foreground border-transparent' : ''
                  )}
                >
                  {item.badge}
                </Badge>
              )}
              {item.count && (
                <span className={cn('text-[11px] font-mono', isActive ? 'text-primary-foreground/80' : 'text-muted-foreground')}>
                  {item.count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom User / Streak Widget */}
      <div className="p-4 border-t border-border bg-card/40">
        <div className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-background/50">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-amber-500 fill-amber-500" />
            <div>
              <p className="text-xs font-semibold leading-none">4 Day Streak</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">3 revisions due</p>
            </div>
          </div>
          <Badge variant="success" className="text-[10px] px-1.5 py-0">
            Active
          </Badge>
        </div>
      </div>
    </aside>
  );
}
