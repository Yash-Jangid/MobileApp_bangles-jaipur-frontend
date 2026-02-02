/**
 * Performance optimization utilities for React Native apps
 */

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class PerformanceCache {
  private cache: Map<string, CacheItem<any>> = new Map();

  /**
   * Set data in cache with TTL
   */
  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  /**
   * Get data from cache if not expired
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    const now = Date.now();
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  /**
   * Clear expired items from cache
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }
}

// Global cache instance
export const performanceCache = new PerformanceCache();

/**
 * Create a timeout race promise for API calls
 */
export const withTimeout = <T>(
  promise: Promise<T>, 
  timeoutMs: number, 
  errorMessage: string = 'Operation timeout'
): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error(errorMessage)), timeoutMs)
    )
  ]);
};

/**
 * Debounce function for performance optimization
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void => {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Throttle function for performance optimization
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Batch multiple async operations with concurrency control
 */
export const batchAsync = async <T, R>(
  items: T[],
  asyncFn: (item: T) => Promise<R>,
  concurrency: number = 3
): Promise<R[]> => {
  const results: R[] = [];
  
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    const batchResults = await Promise.allSettled(
      batch.map(item => asyncFn(item))
    );
    
    batchResults.forEach(result => {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      }
    });
  }
  
  return results;
};

/**
 * Measure execution time of a function
 */
export const measurePerformance = async <T>(
  name: string,
  fn: () => Promise<T> | T
): Promise<T> => {
  const start = Date.now();
  const result = await fn();
  const end = Date.now();
  
  console.log(`⏱️ ${name} took ${end - start}ms`);
  return result;
};

/**
 * Create optimized image props for React Native Image component
 */
export const getOptimizedImageProps = (uri: string, fallbackHandler?: () => void) => ({
  source: { uri },
  resizeMode: 'cover' as const,
  loadingIndicatorSource: undefined,
  defaultSource: undefined,
  onError: fallbackHandler,
  // Enable native image caching on iOS
  ...(Platform.OS === 'ios' && { cache: 'force-cache' }),
});

// Platform detection
import { Platform } from 'react-native';

/**
 * Cleanup utility for component unmounting
 */
export class CleanupManager {
  private cleanupFunctions: (() => void)[] = [];

  add(cleanupFn: () => void): void {
    this.cleanupFunctions.push(cleanupFn);
  }

  cleanup(): void {
    this.cleanupFunctions.forEach(fn => {
      try {
        fn();
      } catch (error) {
        console.error('Cleanup function failed:', error);
      }
    });
    this.cleanupFunctions = [];
  }
}
