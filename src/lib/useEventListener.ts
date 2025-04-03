import { RefObject, useEffect, useRef } from 'react';

/**
 * Custom hook for safely adding event listeners that automatically clean up
 * to prevent memory leaks when components unmount.
 * 
 * This hook addresses Issue #95 by providing:
 * - Typed event listeners with proper cleanup
 * - Support for window, document, and ref-based element targets
 * - Automatic removal of event listeners when component unmounts
 * - Safe updating when dependencies change
 * 
 * @example
 * // Listen to window resize event
 * useEventListener('resize', handleResize)
 * 
 * @example
 * // Listen to click on a specific element
 * const buttonRef = useRef<HTMLButtonElement>(null)
 * useEventListener('click', handleClick, buttonRef)
 */

// Window event listener
function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  element?: undefined,
  options?: boolean | AddEventListenerOptions
): void;

// Document event listener
function useEventListener<K extends keyof DocumentEventMap>(
  eventName: K,
  handler: (event: DocumentEventMap[K]) => void,
  element: RefObject<Document>,
  options?: boolean | AddEventListenerOptions
): void;

// Element event listener
function useEventListener<
  K extends keyof HTMLElementEventMap,
  T extends HTMLElement = HTMLDivElement
>(
  eventName: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  element: RefObject<T>,
  options?: boolean | AddEventListenerOptions
): void;

// Fallback for custom events
function useEventListener(
  eventName: string,
  handler: EventListener,
  element?: RefObject<Document> | RefObject<HTMLElement> | undefined,
  options?: boolean | AddEventListenerOptions,
) {
  // Create a ref that stores the handler
  const savedHandler = useRef(handler);
  
  useEffect(() => {
    // Update ref.current value if handler changes
    // This allows our effect to always get latest handler
    // without us needing to pass it in effect deps array
    // and potentially cause effect to re-run every render
    savedHandler.current = handler;
  }, [handler]);

  useEffect(
    () => {
      // Define the element that will listen to the event
      const targetElement: Document | HTMLElement | Window = element?.current ?? window;
      
      // Make sure the element supports addEventListener
      if (!(targetElement && targetElement.addEventListener)) return;
      
      // Create event listener that calls handler function stored in ref
      const listener: EventListener = (event: Event) => {
        savedHandler.current(event);
      };
      
      targetElement.addEventListener(eventName, listener, options);
      
      // Remove event listener on cleanup
      return () => {
        targetElement.removeEventListener(eventName, listener, options);
      };
    },
    [eventName, element, options] // Re-run if eventName or element changes
  );
}

export default useEventListener; 