import { ImageResponse } from "next/og";

import { QiraFaviconCanvas } from "../_components/QiraFaviconCanvas";

export function GET() {
  return new ImageResponse(<QiraFaviconCanvas size={192} markSize={168} />, {
    width: 192,
    height: 192,
  });
}
