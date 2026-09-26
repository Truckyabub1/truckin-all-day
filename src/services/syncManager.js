export class SyncManager {
  static getBackendConfig() {
    // Allows user to swap backend later easily
    return {
      provider: 'vercel-kv', // 'firebase' | 'supabase' | 'vercel-kv'
      endpoint: '/api/sync'
    };
  }

  static async pushScore(gameKey, score) {
    try {
      if (!navigator.onLine) {
        this.queueForSync(gameKey, score);
        return false;
      }
      
      const config = this.getBackendConfig();
      // Mock global sync dispatch for Phase 5 architecture
      console.log(`[SyncManager] Pushed ${score} to ${gameKey} on ${config.provider}`);
      
      // In production, this would `fetch(config.endpoint, { method: 'POST', body: ... })`
      return true;
    } catch (error) {
      this.queueForSync(gameKey, score);
      return false;
    }
  }

  static queueForSync(gameKey, score) {
    try {
      const queue = JSON.parse(localStorage.getItem('truckin_sync_queue') || '[]');
      queue.push({ gameKey, score, timestamp: Date.now() });
      localStorage.setItem('truckin_sync_queue', JSON.stringify(queue));
      console.log(`[SyncManager] Queued ${score} for ${gameKey} (Offline)`);
    } catch (e) {}
  }

  static async flushQueue() {
    if (!navigator.onLine) return;
    
    try {
      const queue = JSON.parse(localStorage.getItem('truckin_sync_queue') || '[]');
      if (queue.length === 0) return;
      
      console.log(`[SyncManager] Flushing ${queue.length} scores to cloud...`);
      // Process queue here
      localStorage.removeItem('truckin_sync_queue');
    } catch (e) {}
  }
}

// Auto-flush when coming back online
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => SyncManager.flushQueue());
}
