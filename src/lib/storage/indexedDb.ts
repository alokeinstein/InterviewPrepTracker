/**
 * IndexedDB Local-First Persistence for DSA Arena
 * Stores drafts, notes, named checkpoints, accepted snapshots, solve durations,
 * and user preferences with seamless fallback to localStorage.
 *
 * Implements strict namespace partitioning between Guests ('guest')
 * and Authenticated Users ('u_${userId}').
 */

export interface CodeDraft {
  key: string; // `${namespace}:${problemId}_${language}`
  problemId: string;
  language: string;
  code: string;
  updatedAt: number;
  userScope?: string;
}

export interface QuestionNote {
  problemId: string; // Scoped problemId or key
  content: string;
  updatedAt: number;
  userScope?: string;
}

export interface DraftCheckpoint {
  id: string;
  problemId: string;
  language: string;
  name: string;
  code: string;
  description?: string;
  createdAt: number;
  userScope?: string;
}

export interface AcceptedSnapshot {
  id: string;
  problemId: string;
  language: string;
  code: string;
  runtimeMs: number;
  memoryKb: number;
  optimalityScore: number;
  solveDurationSec: number;
  solvedAt: number;
  userScope?: string;
}

export interface ProblemSolveStatus {
  problemId: string; // Scoped problemId or key
  isSolved: boolean;
  firstSolvedAt?: number;
  lastSolvedAt?: number;
  bestDurationSec?: number;
  lastDurationSec?: number;
  solveCount: number;
  userScope?: string;
}

export interface ActivityEvent {
  id: string;
  problemId: string;
  problemTitle: string;
  difficulty: string;
  level: number;
  eventType: 'SOLVED' | 'SUBMITTED' | 'REVISED' | 'PRACTICED';
  method: 'IDE' | 'HAND' | 'MENTAL';
  rating?: string;
  durationSec: number;
  timestamp: number;
  userScope?: string;
}

const DB_NAME = 'dsa_arena_db';
const DB_VERSION = 1;

class IndexedDbClient {
  private db: IDBDatabase | null = null;
  private initPromise: Promise<IDBDatabase | null> | null = null;
  private lastMonotonicTime = 0;
  private currentUserId: string | null = null;

  private memStore = {
    drafts: new Map<string, CodeDraft>(),
    notes: new Map<string, QuestionNote>(),
    checkpoints: new Map<string, DraftCheckpoint>(),
    acceptedSnapshots: new Map<string, AcceptedSnapshot>(),
    solveStatus: new Map<string, ProblemSolveStatus>(),
    preferences: new Map<string, any>(),
    activityEvents: new Map<string, ActivityEvent>(),
  };

  /**
   * Sets the active user context for storage operations.
   * When null, user namespace becomes 'guest'.
   */
  setCurrentUser(userId: string | null): void {
    this.currentUserId = userId;
  }

  getCurrentUser(): string | null {
    return this.currentUserId;
  }

  getUserNamespace(): string {
    return this.currentUserId ? `u_${this.currentUserId}` : 'guest';
  }

  isGuest(): boolean {
    return !this.currentUserId;
  }

  private getScopedKey(baseKey: string): string {
    return `${this.getUserNamespace()}:${baseKey}`;
  }

  private getMonotonicNow(): number {
    let now = Date.now();
    if (now <= this.lastMonotonicTime) {
      now = this.lastMonotonicTime + 1;
    }
    this.lastMonotonicTime = now;
    return now;
  }

  private async getDb(): Promise<IDBDatabase | null> {
    if (typeof window === 'undefined' || !window.indexedDB) return null;
    if (this.db) return this.db;

    if (!this.initPromise) {
      this.initPromise = new Promise((resolve) => {
        try {
          const req = window.indexedDB.open(DB_NAME, DB_VERSION);

          req.onupgradeneeded = (e: IDBVersionChangeEvent) => {
            const db = (e.target as IDBOpenDBRequest).result;

            if (!db.objectStoreNames.contains('drafts')) {
              db.createObjectStore('drafts', { keyPath: 'key' });
            }
            if (!db.objectStoreNames.contains('notes')) {
              db.createObjectStore('notes', { keyPath: 'problemId' });
            }
            if (!db.objectStoreNames.contains('checkpoints')) {
              const cpStore = db.createObjectStore('checkpoints', { keyPath: 'id' });
              cpStore.createIndex('problemId', 'problemId', { unique: false });
            }
            if (!db.objectStoreNames.contains('acceptedSnapshots')) {
              const snapStore = db.createObjectStore('acceptedSnapshots', { keyPath: 'id' });
              snapStore.createIndex('problemId', 'problemId', { unique: false });
            }
            if (!db.objectStoreNames.contains('solveStatus')) {
              db.createObjectStore('solveStatus', { keyPath: 'problemId' });
            }
            if (!db.objectStoreNames.contains('preferences')) {
              db.createObjectStore('preferences', { keyPath: 'key' });
            }
            if (!db.objectStoreNames.contains('activityEvents')) {
              const actStore = db.createObjectStore('activityEvents', { keyPath: 'id' });
              actStore.createIndex('problemId', 'problemId', { unique: false });
              actStore.createIndex('timestamp', 'timestamp', { unique: false });
            }
          };

          req.onsuccess = () => {
            this.db = req.result;
            resolve(this.db);
          };

          req.onerror = () => {
            resolve(null);
          };
        } catch {
          resolve(null);
        }
      });
    }

    return this.initPromise;
  }

  // --- Drafts ---
  async saveDraft(problemId: string, language: string, code: string): Promise<void> {
    const key = this.getScopedKey(`${problemId}_${language}`);
    const draft: CodeDraft = {
      key,
      problemId,
      language,
      code,
      updatedAt: Date.now(),
      userScope: this.getUserNamespace(),
    };

    const db = await this.getDb();
    if (db) {
      return new Promise((resolve) => {
        try {
          const tx = db.transaction('drafts', 'readwrite');
          tx.objectStore('drafts').put(draft);
          tx.oncomplete = () => resolve();
          tx.onerror = () => resolve();
        } catch {
          resolve();
        }
      });
    } else if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(`dsa_draft_${key}`, JSON.stringify(draft));
      } catch {}
    } else {
      this.memStore.drafts.set(key, draft);
    }
  }

  async loadDraft(problemId: string, language: string): Promise<string | null> {
    const key = this.getScopedKey(`${problemId}_${language}`);
    const db = await this.getDb();
    if (db) {
      return new Promise((resolve) => {
        try {
          const tx = db.transaction('drafts', 'readonly');
          const req = tx.objectStore('drafts').get(key);
          req.onsuccess = () => resolve(req.result?.code ?? null);
          req.onerror = () => resolve(null);
        } catch {
          resolve(null);
        }
      });
    } else if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const item = localStorage.getItem(`dsa_draft_${key}`);
        return item ? JSON.parse(item).code : null;
      } catch {
        return null;
      }
    } else {
      return this.memStore.drafts.get(key)?.code ?? null;
    }
  }

  // --- Notes ---
  async saveNote(problemId: string, content: string): Promise<void> {
    const scopedId = this.getScopedKey(problemId);
    const note: QuestionNote = {
      problemId: scopedId,
      content,
      updatedAt: Date.now(),
      userScope: this.getUserNamespace(),
    };
    const db = await this.getDb();
    if (db) {
      return new Promise((resolve) => {
        try {
          const tx = db.transaction('notes', 'readwrite');
          tx.objectStore('notes').put(note);
          tx.oncomplete = () => resolve();
          tx.onerror = () => resolve();
        } catch {
          resolve();
        }
      });
    } else if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(`dsa_note_${scopedId}`, JSON.stringify(note));
      } catch {}
    } else {
      this.memStore.notes.set(scopedId, note);
    }
  }

  async loadNote(problemId: string): Promise<string | null> {
    const scopedId = this.getScopedKey(problemId);
    const db = await this.getDb();
    if (db) {
      return new Promise((resolve) => {
        try {
          const tx = db.transaction('notes', 'readonly');
          const req = tx.objectStore('notes').get(scopedId);
          req.onsuccess = () => resolve(req.result?.content ?? null);
          req.onerror = () => resolve(null);
        } catch {
          resolve(null);
        }
      });
    } else if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const item = localStorage.getItem(`dsa_note_${scopedId}`);
        return item ? JSON.parse(item).content : null;
      } catch {
        return null;
      }
    } else {
      return this.memStore.notes.get(scopedId)?.content ?? null;
    }
  }

  // --- Named Draft Checkpoints ---
  async saveCheckpoint(
    problemId: string,
    language: string,
    name: string,
    code: string,
    description?: string
  ): Promise<DraftCheckpoint> {
    const now = this.getMonotonicNow();
    const cp: DraftCheckpoint = {
      id: `cp_${now}_${Math.random().toString(36).slice(2, 6)}`,
      problemId,
      language,
      name,
      code,
      description,
      createdAt: now,
      userScope: this.getUserNamespace(),
    };

    const db = await this.getDb();
    if (db) {
      return new Promise((resolve) => {
        try {
          const tx = db.transaction('checkpoints', 'readwrite');
          tx.objectStore('checkpoints').put(cp);
          tx.oncomplete = () => resolve(cp);
          tx.onerror = () => resolve(cp);
        } catch {
          resolve(cp);
        }
      });
    } else if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const key = `dsa_cp_${this.getScopedKey(problemId)}`;
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        existing.push(cp);
        localStorage.setItem(key, JSON.stringify(existing));
      } catch {}
    } else {
      this.memStore.checkpoints.set(cp.id, cp);
    }
    return cp;
  }

  async listCheckpoints(problemId: string): Promise<DraftCheckpoint[]> {
    const currentScope = this.getUserNamespace();
    const db = await this.getDb();
    if (db) {
      return new Promise((resolve) => {
        try {
          const tx = db.transaction('checkpoints', 'readonly');
          const idx = tx.objectStore('checkpoints').index('problemId');
          const req = idx.getAll(problemId);
          req.onsuccess = () => {
            const list = (req.result || [])
              .filter((c: DraftCheckpoint) => (c.userScope || 'guest') === currentScope)
              .sort((a: DraftCheckpoint, b: DraftCheckpoint) => b.createdAt - a.createdAt);
            resolve(list);
          };
          req.onerror = () => resolve([]);
        } catch {
          resolve([]);
        }
      });
    } else if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const key = `dsa_cp_${this.getScopedKey(problemId)}`;
        const items: DraftCheckpoint[] = JSON.parse(localStorage.getItem(key) || '[]');
        return items.sort((a, b) => b.createdAt - a.createdAt);
      } catch {
        return [];
      }
    } else {
      return Array.from(this.memStore.checkpoints.values())
        .filter((c) => c.problemId === problemId && (c.userScope || 'guest') === currentScope)
        .sort((a, b) => b.createdAt - a.createdAt);
    }
  }

  async deleteCheckpoint(id: string): Promise<void> {
    const db = await this.getDb();
    if (db) {
      return new Promise((resolve) => {
        try {
          const tx = db.transaction('checkpoints', 'readwrite');
          tx.objectStore('checkpoints').delete(id);
          tx.oncomplete = () => resolve();
          tx.onerror = () => resolve();
        } catch {
          resolve();
        }
      });
    } else if (typeof window !== 'undefined' && window.localStorage) {
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('dsa_cp_')) {
            const list = JSON.parse(localStorage.getItem(key) || '[]');
            const filtered = list.filter((c: DraftCheckpoint) => c.id !== id);
            localStorage.setItem(key, JSON.stringify(filtered));
          }
        }
      } catch {}
    } else {
      this.memStore.checkpoints.delete(id);
    }
  }

  // --- Accepted Snapshots ---
  async saveAcceptedSnapshot(
    snapshot: Omit<AcceptedSnapshot, 'id' | 'solvedAt'>
  ): Promise<AcceptedSnapshot> {
    const now = this.getMonotonicNow();
    const fullSnapshot: AcceptedSnapshot = {
      ...snapshot,
      id: `snap_${now}_${Math.random().toString(36).slice(2, 6)}`,
      solvedAt: now,
      userScope: this.getUserNamespace(),
    };

    const db = await this.getDb();
    if (db) {
      await new Promise<void>((resolve) => {
        try {
          const tx = db.transaction('acceptedSnapshots', 'readwrite');
          tx.objectStore('acceptedSnapshots').put(fullSnapshot);
          tx.oncomplete = () => resolve();
          tx.onerror = () => resolve();
        } catch {
          resolve();
        }
      });
    } else if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const key = `dsa_snap_${this.getScopedKey(snapshot.problemId)}`;
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        existing.push(fullSnapshot);
        localStorage.setItem(key, JSON.stringify(existing));
      } catch {}
    } else {
      this.memStore.acceptedSnapshots.set(fullSnapshot.id, fullSnapshot);
    }

    return fullSnapshot;
  }

  async listAcceptedSnapshots(problemId: string): Promise<AcceptedSnapshot[]> {
    const currentScope = this.getUserNamespace();
    const db = await this.getDb();
    if (db) {
      return new Promise((resolve) => {
        try {
          const tx = db.transaction('acceptedSnapshots', 'readonly');
          const idx = tx.objectStore('acceptedSnapshots').index('problemId');
          const req = idx.getAll(problemId);
          req.onsuccess = () => {
            const list = (req.result || [])
              .filter((s: AcceptedSnapshot) => (s.userScope || 'guest') === currentScope)
              .sort((a: AcceptedSnapshot, b: AcceptedSnapshot) => b.solvedAt - a.solvedAt);
            resolve(list);
          };
          req.onerror = () => resolve([]);
        } catch {
          resolve([]);
        }
      });
    } else if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const key = `dsa_snap_${this.getScopedKey(problemId)}`;
        const items: AcceptedSnapshot[] = JSON.parse(localStorage.getItem(key) || '[]');
        return items.sort((a, b) => b.solvedAt - a.solvedAt);
      } catch {
        return [];
      }
    } else {
      return Array.from(this.memStore.acceptedSnapshots.values())
        .filter((s) => s.problemId === problemId && (s.userScope || 'guest') === currentScope)
        .sort((a, b) => b.solvedAt - a.solvedAt);
    }
  }

  // --- Solve Status & Duration Tracking ---
  async recordSolve(
    problemId: string,
    durationSec: number,
    metadata?: {
      problemTitle?: string;
      difficulty?: string;
      level?: number;
      method?: 'IDE' | 'HAND' | 'MENTAL';
    }
  ): Promise<ProblemSolveStatus> {
    const now = Date.now();
    const scopedId = this.getScopedKey(problemId);
    const current = await this.getSolveStatus(problemId);

    const updated: ProblemSolveStatus = {
      problemId: scopedId,
      isSolved: true,
      firstSolvedAt: current?.firstSolvedAt ?? now,
      lastSolvedAt: now,
      bestDurationSec: current?.bestDurationSec
        ? Math.min(current.bestDurationSec, durationSec)
        : durationSec,
      lastDurationSec: durationSec,
      solveCount: (current?.solveCount ?? 0) + 1,
      userScope: this.getUserNamespace(),
    };

    const db = await this.getDb();
    if (db) {
      await new Promise<void>((resolve) => {
        try {
          const tx = db.transaction('solveStatus', 'readwrite');
          tx.objectStore('solveStatus').put(updated);
          tx.oncomplete = () => resolve();
          tx.onerror = () => resolve();
        } catch {
          resolve();
        }
      });
    } else if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(`dsa_status_${scopedId}`, JSON.stringify(updated));
      } catch {}
    } else {
      this.memStore.solveStatus.set(scopedId, updated);
    }

    // Also record activity event
    if (metadata?.problemTitle) {
      await this.recordActivity({
        problemId,
        problemTitle: metadata.problemTitle,
        difficulty: metadata.difficulty || 'MEDIUM',
        level: metadata.level || 1,
        eventType: 'SOLVED',
        method: metadata.method || 'IDE',
        durationSec,
        timestamp: now,
      });
    }

    return updated;
  }

  async getSolveStatus(problemId: string): Promise<ProblemSolveStatus | null> {
    const scopedId = this.getScopedKey(problemId);
    const db = await this.getDb();
    if (db) {
      return new Promise((resolve) => {
        try {
          const tx = db.transaction('solveStatus', 'readonly');
          const req = tx.objectStore('solveStatus').get(scopedId);
          req.onsuccess = () => resolve(req.result ?? null);
          req.onerror = () => resolve(null);
        } catch {
          resolve(null);
        }
      });
    } else if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const item = localStorage.getItem(`dsa_status_${scopedId}`);
        return item ? JSON.parse(item) : null;
      } catch {
        return null;
      }
    } else {
      return this.memStore.solveStatus.get(scopedId) ?? null;
    }
  }

  async getAllSolveStatuses(): Promise<Record<string, ProblemSolveStatus>> {
    const prefix = `${this.getUserNamespace()}:`;
    const db = await this.getDb();
    if (db) {
      return new Promise((resolve) => {
        try {
          const tx = db.transaction('solveStatus', 'readonly');
          const req = tx.objectStore('solveStatus').getAll();
          req.onsuccess = () => {
            const map: Record<string, ProblemSolveStatus> = {};
            (req.result || []).forEach((item: ProblemSolveStatus) => {
              if (item.problemId.startsWith(prefix)) {
                const rawId = item.problemId.substring(prefix.length);
                map[rawId] = item;
              }
            });
            resolve(map);
          };
          req.onerror = () => resolve({});
        } catch {
          resolve({});
        }
      });
    } else if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const map: Record<string, ProblemSolveStatus> = {};
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith(`dsa_status_${prefix}`)) {
            const rawId = key.substring(`dsa_status_${prefix}`.length);
            const item = JSON.parse(localStorage.getItem(key) || '{}');
            if (item.problemId) map[rawId] = item;
          }
        }
        return map;
      } catch {
        return {};
      }
    } else {
      const map: Record<string, ProblemSolveStatus> = {};
      this.memStore.solveStatus.forEach((val, key) => {
        if (key.startsWith(prefix)) {
          const rawId = key.substring(prefix.length);
          map[rawId] = val;
        }
      });
      return map;
    }
  }

  // --- Activity Events ---
  async recordActivity(event: Omit<ActivityEvent, 'id'>): Promise<ActivityEvent> {
    const fullEvent: ActivityEvent = {
      ...event,
      id: `act_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      userScope: this.getUserNamespace(),
    };

    const db = await this.getDb();
    if (db) {
      await new Promise<void>((resolve) => {
        try {
          const tx = db.transaction('activityEvents', 'readwrite');
          tx.objectStore('activityEvents').put(fullEvent);
          tx.oncomplete = () => resolve();
          tx.onerror = () => resolve();
        } catch {
          resolve();
        }
      });
    } else if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const key = `dsa_activities_${this.getUserNamespace()}`;
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        existing.unshift(fullEvent);
        localStorage.setItem(key, JSON.stringify(existing.slice(0, 1000)));
      } catch {}
    } else {
      this.memStore.activityEvents.set(fullEvent.id, fullEvent);
    }

    return fullEvent;
  }

  async listActivities(limit = 100): Promise<ActivityEvent[]> {
    const currentScope = this.getUserNamespace();
    const db = await this.getDb();
    if (db) {
      return new Promise((resolve) => {
        try {
          const tx = db.transaction('activityEvents', 'readonly');
          const req = tx.objectStore('activityEvents').getAll();
          req.onsuccess = () => {
            const items = (req.result || [])
              .filter((a: ActivityEvent) => (a.userScope || 'guest') === currentScope)
              .sort((a: ActivityEvent, b: ActivityEvent) => b.timestamp - a.timestamp);
            resolve(items.slice(0, limit));
          };
          req.onerror = () => resolve([]);
        } catch {
          resolve([]);
        }
      });
    } else if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const key = `dsa_activities_${this.getUserNamespace()}`;
        return JSON.parse(localStorage.getItem(key) || '[]').slice(0, limit);
      } catch {
        return [];
      }
    } else {
      return Array.from(this.memStore.activityEvents.values())
        .filter((a) => (a.userScope || 'guest') === currentScope)
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, limit);
    }
  }

  // --- UI Preferences ---
  async getPreference<T>(key: string, defaultValue: T): Promise<T> {
    const scopedKey = this.getScopedKey(key);
    const db = await this.getDb();
    if (db) {
      return new Promise((resolve) => {
        try {
          const tx = db.transaction('preferences', 'readonly');
          const req = tx.objectStore('preferences').get(scopedKey);
          req.onsuccess = () => resolve(req.result ? req.result.value : defaultValue);
          req.onerror = () => resolve(defaultValue);
        } catch {
          resolve(defaultValue);
        }
      });
    } else if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const item = localStorage.getItem(`dsa_pref_${scopedKey}`);
        return item ? JSON.parse(item) : defaultValue;
      } catch {
        return defaultValue;
      }
    } else {
      return this.memStore.preferences.has(scopedKey)
        ? this.memStore.preferences.get(scopedKey)
        : defaultValue;
    }
  }

  async setPreference<T>(key: string, value: T): Promise<void> {
    const scopedKey = this.getScopedKey(key);
    const db = await this.getDb();
    if (db) {
      return new Promise((resolve) => {
        try {
          const tx = db.transaction('preferences', 'readwrite');
          tx.objectStore('preferences').put({ key: scopedKey, value });
          tx.oncomplete = () => resolve();
          tx.onerror = () => resolve();
        } catch {
          resolve();
        }
      });
    } else if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(`dsa_pref_${scopedKey}`, JSON.stringify(value));
      } catch {}
    } else {
      this.memStore.preferences.set(scopedKey, value);
    }
  }

  /**
   * Clears ALL authenticated user data from IndexedDB, localStorage, and memory upon logout,
   * while STRICTLY PRESERVING legitimate guest progress ('guest:*').
   */
  async clearAuthenticatedData(): Promise<void> {
    // 1. Clear in-memory authenticated entries
    for (const storeName of Object.keys(this.memStore) as (keyof typeof this.memStore)[]) {
      const map = this.memStore[storeName];
      for (const key of Array.from(map.keys())) {
        if (typeof key === 'string' && key.startsWith('u_')) {
          map.delete(key);
        }
      }
    }

    // 2. Clear IndexedDB authenticated entries
    const db = await this.getDb();
    if (db) {
      const stores = [
        'drafts',
        'notes',
        'checkpoints',
        'acceptedSnapshots',
        'solveStatus',
        'preferences',
        'activityEvents',
      ];
      for (const store of stores) {
        await new Promise<void>((resolve) => {
          try {
            const tx = db.transaction(store, 'readwrite');
            const os = tx.objectStore(store);
            const req = os.openCursor();
            req.onsuccess = (e) => {
              const cursor = (e.target as IDBRequest<IDBCursorWithValue>).result;
              if (cursor) {
                const val = cursor.value;
                const key = String(cursor.key);
                const userScope = val?.userScope || '';
                if (key.startsWith('u_') || userScope.startsWith('u_')) {
                  cursor.delete();
                }
                cursor.continue();
              } else {
                resolve();
              }
            };
            req.onerror = () => resolve();
          } catch {
            resolve();
          }
        });
      }
    }

    // 3. Clear localStorage authenticated entries
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.includes('_u_')) {
            keysToRemove.push(k);
          }
        }
        for (const k of keysToRemove) {
          localStorage.removeItem(k);
        }
      } catch {}
    }

    // Reset current user to guest
    this.currentUserId = null;
  }

  /**
   * Retrieves all locally saved guest progress for authorized import upon authentication.
   */
  async getGuestProgress(): Promise<
    Array<{ problemId: string; isSolved: boolean; durationSec?: number }>
  > {
    const list: Array<{ problemId: string; isSolved: boolean; durationSec?: number }> = [];
    const prefix = 'guest:';

    const db = await this.getDb();
    if (db) {
      await new Promise<void>((resolve) => {
        try {
          const tx = db.transaction('solveStatus', 'readonly');
          const req = tx.objectStore('solveStatus').getAll();
          req.onsuccess = () => {
            (req.result || []).forEach((item: ProblemSolveStatus) => {
              if (item.problemId.startsWith(prefix) && item.isSolved) {
                const rawId = item.problemId.substring(prefix.length);
                list.push({
                  problemId: rawId,
                  isSolved: true,
                  durationSec: item.lastDurationSec,
                });
              }
            });
            resolve();
          };
          req.onerror = () => resolve();
        } catch {
          resolve();
        }
      });
    } else if (typeof window !== 'undefined' && window.localStorage) {
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith('dsa_status_guest:')) {
            const rawId = k.substring('dsa_status_guest:'.length);
            const item = JSON.parse(localStorage.getItem(k) || '{}');
            if (item.isSolved) {
              list.push({
                problemId: rawId,
                isSolved: true,
                durationSec: item.lastDurationSec,
              });
            }
          }
        }
      } catch {}
    } else {
      this.memStore.solveStatus.forEach((val, key) => {
        if (key.startsWith(prefix) && val.isSolved) {
          const rawId = key.substring(prefix.length);
          list.push({
            problemId: rawId,
            isSolved: true,
            durationSec: val.lastDurationSec,
          });
        }
      });
    }

    return list;
  }

  // --- Export and Import ---
  async exportBackup(): Promise<string> {
    const db = await this.getDb();
    const data: Record<string, any> = { exportedAt: new Date().toISOString() };
    const stores = ['drafts', 'notes', 'checkpoints', 'acceptedSnapshots', 'solveStatus', 'preferences', 'activityEvents'];

    if (db) {
      for (const store of stores) {
        data[store] = await new Promise((resolve) => {
          try {
            const tx = db.transaction(store, 'readonly');
            const req = tx.objectStore(store).getAll();
            req.onsuccess = () => resolve(req.result || []);
            req.onerror = () => resolve([]);
          } catch {
            resolve([]);
          }
        });
      }
    } else {
      for (const store of stores) {
        const memMap = (this.memStore as any)[store] as Map<string, any> | undefined;
        if (memMap) {
          data[store] = Array.from(memMap.values());
        } else {
          data[store] = [];
        }
      }
    }
    return JSON.stringify(data, null, 2);
  }

  async importBackup(
    jsonString: string
  ): Promise<{ success: boolean; importedCount: number; skippedCount: number; error?: string }> {
    try {
      if (!jsonString || typeof jsonString !== 'string') {
        return { success: false, importedCount: 0, skippedCount: 0, error: 'Invalid JSON input' };
      }

      let parsed: any;
      try {
        parsed = JSON.parse(jsonString);
      } catch (parseErr: any) {
        return { success: false, importedCount: 0, skippedCount: 0, error: parseErr.message || 'JSON parse error' };
      }

      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        return { success: false, importedCount: 0, skippedCount: 0, error: 'Backup root must be an object' };
      }

      const db = await this.getDb();
      let importedCount = 0;
      let skippedCount = 0;
      const validStores = ['drafts', 'notes', 'checkpoints', 'acceptedSnapshots', 'solveStatus', 'preferences', 'activityEvents'];

      if (db) {
        for (const storeName of validStores) {
          const items = parsed[storeName];
          if (Array.isArray(items) && items.length > 0) {
            await new Promise<void>((resolve) => {
              try {
                const tx = db.transaction(storeName, 'readwrite');
                const store = tx.objectStore(storeName);

                let pending = items.length;
                if (pending === 0) return resolve();

                for (const item of items) {
                  if (!item || typeof item !== 'object') {
                    skippedCount++;
                    if (--pending === 0) resolve();
                    continue;
                  }

                  const key = item.key || item.id || item.problemId;
                  if (!key) {
                    skippedCount++;
                    if (--pending === 0) resolve();
                    continue;
                  }

                  const getReq = store.get(key);
                  getReq.onsuccess = () => {
                    const existing = getReq.result;
                    if (!existing) {
                      store.put(item);
                      importedCount++;
                    } else {
                      const existingTime = existing.updatedAt || existing.solvedAt || existing.createdAt || existing.timestamp || 0;
                      const importedTime = item.updatedAt || item.solvedAt || item.createdAt || item.timestamp || 0;

                      if (importedTime > existingTime) {
                        store.put(item);
                        importedCount++;
                      } else if (storeName === 'solveStatus') {
                        const merged: ProblemSolveStatus = {
                          problemId: key,
                          isSolved: existing.isSolved || item.isSolved,
                          firstSolvedAt: Math.min(existing.firstSolvedAt || Infinity, item.firstSolvedAt || Infinity),
                          lastSolvedAt: Math.max(existing.lastSolvedAt || 0, item.lastSolvedAt || 0),
                          bestDurationSec: Math.min(existing.bestDurationSec || Infinity, item.bestDurationSec || Infinity),
                          lastDurationSec: item.lastDurationSec || existing.lastDurationSec,
                          solveCount: Math.max(existing.solveCount || 0, item.solveCount || 0),
                        };
                        store.put(merged);
                        importedCount++;
                      } else {
                        skippedCount++;
                      }
                    }
                    if (--pending === 0) resolve();
                  };

                  getReq.onerror = () => {
                    skippedCount++;
                    if (--pending === 0) resolve();
                  };
                }

                tx.oncomplete = () => resolve();
                tx.onerror = () => resolve();
              } catch {
                resolve();
              }
            });
          }
        }
      } else {
        // Fallback in-memory storage (Node tests / SSR / non-IDB browsers)
        for (const storeName of validStores) {
          const items = parsed[storeName];
          if (Array.isArray(items)) {
            const memMap = (this.memStore as any)[storeName] as Map<string, any> | undefined;
            if (!memMap) continue;

            for (const item of items) {
              if (!item || typeof item !== 'object') {
                skippedCount++;
                continue;
              }
              const key = item.key || item.id || item.problemId;
              if (!key) {
                skippedCount++;
                continue;
              }
              const existing = memMap.get(key);
              if (!existing) {
                memMap.set(key, item);
                importedCount++;
              } else {
                const existingTime = existing.updatedAt || existing.solvedAt || existing.createdAt || existing.timestamp || 0;
                const importedTime = item.updatedAt || item.solvedAt || item.createdAt || item.timestamp || 0;

                if (importedTime > existingTime) {
                  memMap.set(key, item);
                  importedCount++;
                } else if (storeName === 'solveStatus') {
                  const merged: ProblemSolveStatus = {
                    problemId: key,
                    isSolved: existing.isSolved || item.isSolved,
                    firstSolvedAt: Math.min(existing.firstSolvedAt || Infinity, item.firstSolvedAt || Infinity),
                    lastSolvedAt: Math.max(existing.lastSolvedAt || 0, item.lastSolvedAt || 0),
                    bestDurationSec: Math.min(existing.bestDurationSec || Infinity, item.bestDurationSec || Infinity),
                    lastDurationSec: item.lastDurationSec || existing.lastDurationSec,
                    solveCount: Math.max(existing.solveCount || 0, item.solveCount || 0),
                  };
                  memMap.set(key, merged);
                  importedCount++;
                } else {
                  skippedCount++;
                }
              }
            }
          }
        }
      }

      return { success: true, importedCount, skippedCount };
    } catch (e: any) {
      return { success: false, importedCount: 0, skippedCount: 0, error: e.message || 'JSON parse error' };
    }
  }
}

export const localStore = new IndexedDbClient();
