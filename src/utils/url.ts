export const toDataUrl = (buf: Buffer) => `data:image/png;base64,${buf.toString('base64')}`;
