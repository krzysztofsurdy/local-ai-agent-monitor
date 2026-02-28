"use client";

import { useEffect, useCallback, useRef } from "react";

type SSEHandler = (event: string, data: unknown) => void;

export function useSSE(handler: SSEHandler) {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  const reconnect = useCallback(() => {
    const es = new EventSource("/api/events");

    es.addEventListener("processes", (e) => {
      handlerRef.current("processes", JSON.parse(e.data));
    });

    es.addEventListener("fileChange", (e) => {
      handlerRef.current("fileChange", JSON.parse(e.data));
    });

    es.onerror = () => {
      es.close();
      // Reconnect after 5s
      setTimeout(reconnect, 5000);
    };

    return es;
  }, []);

  useEffect(() => {
    const es = reconnect();
    return () => es.close();
  }, [reconnect]);
}
