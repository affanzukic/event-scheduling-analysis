import { Readable } from 'stream';

export const toDataUrl = (buf: Buffer) => `data:image/png;base64,${buf.toString('base64')}`;

export const nodeToWeb = (nodeStream: Readable): ReadableStream =>
  new ReadableStream({
    async pull(controller) {
      for await (const chunk of nodeStream) {
        controller.enqueue(chunk);
      }
      controller.close();
    },
    cancel() {
      nodeStream.destroy();
    },
  });

