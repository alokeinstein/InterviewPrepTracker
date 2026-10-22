'use client';

import React, { useState, useEffect } from 'react';
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
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

const navItems = [
  { name: 'Command Center', href: '/', icon: LayoutDashboard },
  { name: 'System Design', href: '/system-design', icon: Server, badge: 'DDIA' },
  { name: 'DSA Arena', href: '/dsa', icon: Code2, count: 500 },
  { name: 'Revision Center', href: '/revision', icon: Repeat, badge: 'Due' },
  { name: 'Whiteboard Canvas', href: '/whiteboard', icon: PenTool },
  { name: 'Mock Interviews', href: '/interview', icon: Bot },
  { name: 'Analytics & Readiness', href: '/analytics', icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('dsa_sidebar_collapsed');
      if (saved !== null) {
        setIsCollapsed(JSON.parse(saved));
      }
    } catch {}
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('dsa_sidebar_collapsed', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  return (
    <aside
      className={cn(
        'border-r border-border bg-card/60 backdrop-blur-md flex flex-col h-screen sticky top-0 shrink-0 transition-all duration-200 z-30',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* App Branding & Collapse Toggle */}
      <div className="h-16 flex items-center justify-between px-3.5 border-b border-border">
        <div className={cn('flex items-center gap-3 overflow-hidden', isCollapsed && 'justify-center w-full')}>
          <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
            <Brain className="h-5 w-5" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <h1 className="font-bold text-sm tracking-tight text-foreground leading-none truncate">
                Interview OS
              </h1>
              <p className="text-[11px] text-muted-foreground mt-0.5 truncate">DSA Arena &amp; Prep</p>
            </div>
          )}
        </div>

        {!isCollapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapse}
            className="h-7 w-7 text-muted-foreground hover:text-foreground shrink-0"
            title="Collapse Sidebar"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isCollapsed && (
        <div className="flex justify-center py-2 border-b border-border/40">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapse}
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            title="Expand Sidebar"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Nav Links */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.name : undefined}
              className={cn(
                'flex items-center rounded-lg text-sm font-medium transition-all group',
                isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    'h-4 w-4 shrink-0',
                    isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'
                  )}
                />
                {!isCollapsed && <span className="truncate">{item.name}</span>}
              </div>

              {!isCollapsed && (
                <div className="flex items-center gap-1.5 shrink-0">
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
                    <span
                      className={cn(
                        'text-[11px] font-mono',
                        isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'
                      )}
                    >
                      {item.count}
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom User / Streak Widget */}
      <div className="p-2 border-t border-border bg-card/40">
        <div
          className={cn(
            'rounded-lg border border-border bg-background/50 flex items-center transition-all',
            isCollapsed ? 'justify-center p-2.5' : 'justify-between p-2.5'
          )}
        >
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-amber-500 fill-amber-500 shrink-0" />
            {!isCollapsed && (
              <div>
                <p className="text-xs font-semibold leading-none">4 Day Streak</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Spaced Repetition Active</p>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <Badge variant="success" className="text-[10px] px-1.5 py-0">
              Active
            </Badge>
          )}
        </div>
      </div>
    </aside>
  );
}
