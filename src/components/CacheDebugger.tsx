'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useState, useCallback, useMemo } from 'react';

export default function CacheDebugger() {
  const queryClient = useQueryClient();
  const [isVisible, setIsVisible] = useState(false);
  const [cacheData, setCacheData] = useState<any>({});

  const refreshCacheData = useCallback(() => {
    const data: any = {};
    
    // Get all queries
    const queries = queryClient.getQueryCache().getAll();
    
    queries.forEach(query => {
      const key = query.queryKey.join(' > ');
      data[key] = {
        data: query.state.data,
        status: query.state.status,
        dataUpdatedAt: query.state.dataUpdatedAt,
        error: query.state.error
      };
    });
    
    setCacheData(data);
  }, [queryClient]);

  const clearAllCache = useCallback(() => {
    queryClient.clear();
    refreshCacheData();
  }, [queryClient, refreshCacheData]);

  const toggleVisibility = useCallback(() => {
    setIsVisible(prev => !prev);
  }, []);

  const closeDebugger = useCallback(() => {
    setIsVisible(false);
  }, []);

  // Memoize the cache data to prevent unnecessary re-renders
  const memoizedCacheData = useMemo(() => cacheData, [cacheData]);

  if (!isVisible) {
    return (
      <button
        onClick={toggleVisibility}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-2 rounded-full shadow-lg z-50"
        title="Show Cache Debugger"
      >
        🐛
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-xl p-4 max-w-md max-h-96 overflow-auto z-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Cache Debugger</h3>
        <button
          onClick={closeDebugger}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-2 mb-4">
        <button
          onClick={refreshCacheData}
          className="w-full bg-blue-600 text-white px-3 py-2 rounded text-sm"
        >
          Refresh Cache Data
        </button>
        <button
          onClick={clearAllCache}
          className="w-full bg-red-600 text-white px-3 py-2 rounded text-sm"
        >
          Clear All Cache
        </button>
      </div>
      
      <div className="space-y-2 text-xs">
        {Object.entries(memoizedCacheData).map(([key, value]: [string, any]) => (
          <div key={key} className="border border-gray-200 rounded p-2">
            <div className="font-mono text-xs break-all mb-1">{key}</div>
            <div className="text-gray-600">
              Status: {value.status}
            </div>
            <div className="text-gray-600">
              Data: {Array.isArray(value.data) ? `${value.data.length} items` : typeof value.data}
            </div>
            {value.error && (
              <div className="text-red-600">
                Error: {value.error.message}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
