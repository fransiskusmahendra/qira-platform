import { ImageResponse } from "next/og";

import { QiraFaviconCanvas } from "../_components/QiraFaviconCanvas";

export function GET() {
  return new ImageResponse(<QiraFaviconCanvas size={180} markSize={156} />, {
    width: 180,
    height: 180,
  });
}
