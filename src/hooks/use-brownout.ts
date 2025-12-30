'use client'

import { useState, useEffect, useCallback } from 'react'
import { type BrownoutMode } from '@/lib/brownout'
import { cache } from '@/lib/cache'

interface BrownoutStatus {
  current_mode: BrownoutMode
  thresholds: any
  llm_config: any
  timestamp: string
}

interface MetricsData {
  metrics: Array<{
    timestamp: string
    latency_p95: number
    error_rate: number
    token_cost_per_hour: number
    brownout_mode: BrownoutMode
  }>
  current_mode: BrownoutMode
  thresholds: any
  metadata: {
    range: string
    interval: string
    point_count: number
    generated_at: string
  }
}

export function useBrownout() {
  const [status, setStatus] = useState<BrownoutStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Try to get from cache first
      const cachedStatus = cache.get<BrownoutStatus>('brownout_status')
      if (cachedStatus) {
        setStatus(cachedStatus)
        setLoading(false)
        
        // Still fetch fresh data in background
        fetch('/api/brownout')
          .then(res => res.json())
          .then(data => {
            setStatus(data)
            cache.set('brownout_status', data, 2 * 60 * 1000) // Cache for 2 minutes
          })
          .catch(() => {
            // Keep cached data if background fetch fails
          })
        
        return
      }
      
      const response = await fetch('/api/brownout')
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      setStatus(data)
      
      // Cache the result
      cache.set('brownout_status', data, 2 * 60 * 1000) // Cache for 2 minutes
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch brownout status')
      console.error('Error fetching brownout status:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const setMode = useCallback(async (mode: BrownoutMode, reason?: string) => {
    try {
      setError(null)
      
      const response = await fetch('/api/brownout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mode, reason }),
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      // Refresh status after mode change
      await fetchStatus()
      
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to set brownout mode'
      setError(errorMessage)
      console.error('Error setting brownout mode:', err)
      throw new Error(errorMessage)
    }
  }, [fetchStatus])

  const updateThresholds = useCallback(async (thresholds: any) => {
    try {
      setError(null)
      
      const response = await fetch('/api/brownout', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ thresholds }),
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      // Refresh status after threshold update
      await fetchStatus()
      
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update thresholds'
      setError(errorMessage)
      console.error('Error updating thresholds:', err)
      throw new Error(errorMessage)
    }
  }, [fetchStatus])

  useEffect(() => {
    fetchStatus()
    
    // Set up polling for real-time updates
    const interval = setInterval(fetchStatus, 30000) // Poll every 30 seconds
    
    return () => clearInterval(interval)
  }, [fetchStatus])

  return {
    status,
    loading,
    error,
    refetch: fetchStatus,
    setMode,
    updateThresholds,
  }
}

export function useMetrics(range: string = '1h', interval: string = '1m') {
  const [data, setData] = useState<MetricsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const cacheKey = `metrics_${range}_${interval}`
      
      // Try to get from cache first
      const cachedMetrics = cache.get<MetricsData>(cacheKey)
      if (cachedMetrics) {
        setData(cachedMetrics)
        setLoading(false)
        
        // Still fetch fresh data in background for real-time updates
        const params = new URLSearchParams({ range, interval })
        fetch(`/api/metrics?${params}`)
          .then(res => res.json())
          .then(metricsData => {
            setData(metricsData)
            cache.set(cacheKey, metricsData, 30 * 1000) // Cache for 30 seconds
          })
          .catch(() => {
            // Keep cached data if background fetch fails
          })
        
        return
      }
      
      const params = new URLSearchParams({ range, interval })
      const response = await fetch(`/api/metrics?${params}`)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const metricsData = await response.json()
      setData(metricsData)
      
      // Cache the result
      cache.set(cacheKey, metricsData, 30 * 1000) // Cache for 30 seconds
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch metrics')
      console.error('Error fetching metrics:', err)
    } finally {
      setLoading(false)
    }
  }, [range, interval])

  useEffect(() => {
    fetchMetrics()
    
    // Set up polling for real-time metrics
    const intervalId = setInterval(fetchMetrics, 60000) // Poll every minute
    
    return () => clearInterval(intervalId)
  }, [fetchMetrics])

  return {
    data,
    loading,
    error,
    refetch: fetchMetrics,
  }
}