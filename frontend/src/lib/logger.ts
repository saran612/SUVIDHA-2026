'use client';

/**
 * Logger Service for SUVIDHA Kiosk.
 * Simulates a daily folder-based logging system using localStorage.
 * Handles both "all-time" daily logs and "single-session" activity logs.
 */

type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'ACTIVITY';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  sessionId?: string;
}

export const logger = {
  /**
   * Logs a generic event to the daily log "folder".
   */
  log: (message: string, level: LogLevel = 'INFO', data?: any) => {
    const sessionId = sessionStorage.getItem('suvidha_session_id') || 'unauthenticated';
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      sessionId,
    };

    // 1. Store in Daily Log (Simulated Folder: logs/YYYY-MM-DD/all.log)
    const dateKey = new Date().toISOString().split('T')[0];
    const dailyKey = `suvidha_logs_daily_${dateKey}`;
    const dailyLogs = JSON.parse(localStorage.getItem(dailyKey) || '[]');
    dailyLogs.push(entry);
    localStorage.setItem(dailyKey, JSON.stringify(dailyLogs));

    // 2. Store in Session Specific Log (Simulated File: session-[id].log)
    if (sessionId !== 'unauthenticated') {
      const sessionKey = `suvidha_logs_session_${sessionId}`;
      const sessionLogs = JSON.parse(localStorage.getItem(sessionKey) || '[]');
      sessionLogs.push(entry);
      localStorage.setItem(sessionKey, JSON.stringify(sessionLogs));
    }

    // 3. Add to Offline Queue for later server sync
    offlinePersistence.queue(entry);

    // Also output to console for development visibility
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[${level}] ${message}`, data || '');
    }
  },

  /**
   * Retrieves all logs for a specific date.
   */
  getDailyLogs: (date?: string) => {
    const key = `suvidha_logs_daily_${date || new Date().toISOString().split('T')[0]}`;
    return JSON.parse(localStorage.getItem(key) || '[]');
  },

  /**
   * Retrieves logs for a specific session.
   */
  getSessionLogs: (sessionId: string) => {
    return JSON.parse(localStorage.getItem(`suvidha_logs_session_${sessionId}`) || '[]');
  }
};

/**
 * Offline Persistence Manager.
 * Stores logs and transactions in a queue when the internet is down.
 */
export const offlinePersistence = {
  queue: (data: any) => {
    const queue = JSON.parse(localStorage.getItem('suvidha_offline_sync_queue') || '[]');
    queue.push({
      ...data,
      queuedAt: new Date().toISOString(),
    });
    localStorage.setItem('suvidha_offline_sync_queue', JSON.stringify(queue));
  },

  getQueue: () => {
    return JSON.parse(localStorage.getItem('suvidha_offline_sync_queue') || '[]');
  },

  clearQueue: () => {
    localStorage.removeItem('suvidha_offline_sync_queue');
  }
};
