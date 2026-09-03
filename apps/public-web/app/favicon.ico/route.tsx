import { ImageResponse } from "next/og";

import { QiraFaviconCanvas } from "../_components/QiraFaviconCanvas";

export async function GET() {
  const pngResponse = new ImageResponse(<QiraFaviconCanvas size={256} markSize={224} />, {
    width: 256,
    height: 256,
  });

  const png = new Uint8Array(await pngResponse.arrayBuffer());
  const header = new Uint8Array(22);
  const view = new DataView(header.buffer);

  view.setUint16(0, 0, true);
  view.setUint16(2, 1, true);
  view.setUint16(4, 1, true);
  header[6] = 0;
  header[7] = 0;
  header[8] = 0;
  header[9] = 0;
  view.setUint16(10, 1, true);
  view.setUint16(12, 32, true);
  view.setUint32(14, png.byteLength, true);
  view.setUint32(18, 22, true);

  const ico = new Uint8Array(header.byteLength + png.byteLength);
  ico.set(header, 0);
  ico.set(png, header.byteLength);

  return new Response(ico, {
    headers: {
      "Content-Type": "image/x-icon",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
