import { ImageResponse } from "next/og";

import { QiraFaviconCanvas } from "../_components/QiraFaviconCanvas";

export const runtime = "edge";

export function GET() {
  return new ImageResponse(<QiraFaviconCanvas size={512} markSize={448} />, {
    width: 512,
    height: 512,
  });
}
