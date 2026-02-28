import { startWatcher, onFileChange } from "@/lib/file-watcher";
import { aggregateProcesses } from "@/lib/providers";

export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
        );
      };

      startWatcher();

      const unsubscribe = onFileChange((event) => {
        send("fileChange", event);
      });

      const processInterval = setInterval(() => {
        try {
          send("processes", aggregateProcesses());
        } catch {
          // ignore polling errors
        }
      }, 3000);

      // Send initial data
      try {
        send("processes", aggregateProcesses());
      } catch {
        // ignore
      }

      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": heartbeat\n\n"));
        } catch {
          // connection closed
        }
      }, 30000);

      (controller as unknown as Record<string, unknown>)._cleanup = () => {
        unsubscribe();
        clearInterval(processInterval);
        clearInterval(heartbeat);
      };
    },
    cancel(controller) {
      const cleanup = (controller as unknown as Record<string, unknown>)
        ?._cleanup as (() => void) | undefined;
      cleanup?.();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
