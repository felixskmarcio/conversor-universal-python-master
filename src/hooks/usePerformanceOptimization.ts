import { useCallback, useMemo, useRef, useEffect } from 'react'

/**
 * Custom hook for performance optimizations
 */

// Debounce hook
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout>()
  
  return useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      
      timeoutRef.current = setTimeout(() => {
        callback(...args)
      }, delay)
    }) as T,
    [callback, delay]
  )
}

// Throttle hook
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastCallRef = useRef<number>(0)
  const timeoutRef = useRef<NodeJS.Timeout>()
  
  return useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now()
      
      if (now - lastCallRef.current >= delay) {
        lastCallRef.current = now
        callback(...args)
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        
        timeoutRef.current = setTimeout(() => {
          lastCallRef.current = Date.now()
          callback(...args)
        }, delay - (now - lastCallRef.current))
      }
    }) as T,
    [callback, delay]
  )
}

// Memoized file validation
export function useFileValidation() {
  return useMemo(() => ({
    validateFileSize: (file: File, maxSize: number): boolean => {
      return file.size <= maxSize
    },
    
    validateFileType: (file: File, allowedTypes: string[]): boolean => {
      return allowedTypes.some(type => {
        if (type.startsWith('.')) {
          return file.name.toLowerCase().endsWith(type.toLowerCase())
        }
        return file.type === type
      })
    },
    
    validateFileName: (fileName: string): boolean => {
      // Check for dangerous characters
      const dangerousChars = /[<>:"/\\|?*\x00-\x1f]/
      return !dangerousChars.test(fileName) && fileName.length > 0 && fileName.length <= 255
    }
  }), [])
}

// Optimized file reader
export function useOptimizedFileReader() {
  const readerRef = useRef<FileReader>()
  
  const readFile = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!readerRef.current) {
        readerRef.current = new FileReader()
      }
      
      const reader = readerRef.current
      
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result)
        } else {
          reject(new Error('Failed to read file as text'))
        }
      }
      
      reader.onerror = () => {
        reject(new Error('File reading failed'))
      }
      
      reader.readAsText(file)
    })
  }, [])
  
  const readFileAsDataURL = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!readerRef.current) {
        readerRef.current = new FileReader()
      }
      
      const reader = readerRef.current
      
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result)
        } else {
          reject(new Error('Failed to read file as data URL'))
        }
      }
      
      reader.onerror = () => {
        reject(new Error('File reading failed'))
      }
      
      reader.readAsDataURL(file)
    })
  }, [])
  
  return { readFile, readFileAsDataURL }
}

// Request optimization
export function useOptimizedFetch() {
  const abortControllerRef = useRef<AbortController>()
  
  const fetchWithTimeout = useCallback(async (
    url: string,
    options: RequestInit & { timeout?: number } = {}
  ): Promise<Response> => {
    const { timeout = 30000, ...fetchOptions } = options
    
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    
    // Create new abort controller
    abortControllerRef.current = new AbortController()
    
    // Set up timeout
    const timeoutId = setTimeout(() => {
      abortControllerRef.current?.abort()
    }, timeout)
    
    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: abortControllerRef.current.signal
      })
      
      clearTimeout(timeoutId)
      return response
    } catch (error) {
      clearTimeout(timeoutId)
      throw error
    }
  }, [])
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])
  
  return { fetchWithTimeout }
}

// Memory usage optimization
export function useMemoryOptimization() {
  const objectUrlsRef = useRef<Set<string>>(new Set())
  
  const createObjectURL = useCallback((file: File): string => {
    const url = URL.createObjectURL(file)
    objectUrlsRef.current.add(url)
    return url
  }, [])
  
  const revokeObjectURL = useCallback((url: string) => {
    URL.revokeObjectURL(url)
    objectUrlsRef.current.delete(url)
  }, [])
  
  const revokeAllObjectURLs = useCallback(() => {
    objectUrlsRef.current.forEach(url => {
      URL.revokeObjectURL(url)
    })
    objectUrlsRef.current.clear()
  }, [])
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      revokeAllObjectURLs()
    }
  }, [revokeAllObjectURLs])
  
  return {
    createObjectURL,
    revokeObjectURL,
    revokeAllObjectURLs
  }
}