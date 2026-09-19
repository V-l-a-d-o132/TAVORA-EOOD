import { useState, useCallback, useEffect, useRef } from 'react';

interface UseFullscreenOptions {
  onEnter?: () => void;
  onExit?: () => void;
}

interface UseFullscreenReturn {
  isFullscreen: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
  enterFullscreen: () => Promise<void>;
  exitFullscreen: () => Promise<void>;
  showControls: boolean;
  resetControlsTimer: () => void;
}

export function useFullscreen({ onEnter, onExit }: UseFullscreenOptions = {}): UseFullscreenReturn {
  const [isImmersiveFS, setIsImmersiveFS] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const controlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const persistRef = useRef(false);

  const isFullscreen = isImmersiveFS || !!document.fullscreenElement;

  const enterFullscreen = useCallback(async () => {
    persistRef.current = true;
    try {
      if (containerRef.current && document.fullscreenEnabled) {
        await containerRef.current.requestFullscreen();
      } else {
        setIsImmersiveFS(true);
      }
    } catch {
      setIsImmersiveFS(true);
    }
    onEnter?.();
  }, [onEnter]);

  const exitFullscreen = useCallback(async () => {
    persistRef.current = false;
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch { /* ignore */ }
    setIsImmersiveFS(false);
    setShowControls(true);
    onExit?.();
  }, [onExit]);

  const resetControlsTimer = useCallback(() => {
    if (!isImmersiveFS && !document.fullscreenElement) return;
    setShowControls(true);
    if (controlsTimer.current) clearTimeout(controlsTimer.current);
    controlsTimer.current = setTimeout(() => {
      setShowControls(false);
    }, 3500);
  }, [isImmersiveFS]);

  // Listen for native fullscreen change events
  useEffect(() => {
    const handler = () => {
      if (!document.fullscreenElement && isImmersiveFS) {
        setIsImmersiveFS(false);
        setShowControls(true);
        persistRef.current = false;
        onExit?.();
      }
      if (document.fullscreenElement) {
        setIsImmersiveFS(true);
        persistRef.current = true;
        onEnter?.();
      }
    };
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, [isImmersiveFS, onEnter, onExit]);

  // Auto-hide controls during fullscreen
  useEffect(() => {
    if (isImmersiveFS || document.fullscreenElement) {
      resetControlsTimer();
    } else {
      setShowControls(true);
      if (controlsTimer.current) clearTimeout(controlsTimer.current);
    }
    return () => {
      if (controlsTimer.current) clearTimeout(controlsTimer.current);
    };
  }, [isImmersiveFS, resetControlsTimer]);

  return {
    isFullscreen,
    containerRef,
    enterFullscreen,
    exitFullscreen,
    showControls,
    resetControlsTimer,
  };
}