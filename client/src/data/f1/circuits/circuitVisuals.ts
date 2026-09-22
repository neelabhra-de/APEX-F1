export type CircuitVisualDefinition = {
  name: string
  distance: string
  coordinates: [string, string]
  trackPath: string
  startPath: string
  marker: [number, number]
}

// OpenF1 circuit_key values are the stable identity used by the visual layer.
// The paths are intentionally normalized to THE GRID's shared 760 × 500 canvas.
const singapore: CircuitVisualDefinition = {
  name: 'Marina Bay Street Circuit',
  distance: '4.940 km',
  coordinates: ["01°17' N", "103°51' E"],
  trackPath: 'M143 297c-25-37-18-99 27-122l78-39 24-55 87-7 52 39 85-2 58 37 69-3 48 49-25 48 23 59-36 62-65 1-48 48-93-9-43 50-96-10-45-43-74 15-56-43-11-68z',
  startPath: 'M148 290l29 17',
  marker: [148, 290],
}

const baku: CircuitVisualDefinition = {
  name: 'Baku City Circuit',
  distance: '6.003 km',
  coordinates: ["40°22' N", "49°51' E"],
  // Normalized from the current Baku City Circuit outline: the open
  // waterfront run, narrow old-city switchbacks, and return sweep are kept
  // as one continuous anti-clockwise street-circuit silhouette.
  trackPath: 'M589.3 176.6L638.9 158.9 660 145.5 647.3 118 630.9 86.6 612 80.9 575.3 92.6 530.2 107.4 468.7 130 413.8 150.8 410.3 163.7 423.1 190.3 423.6 206.4 396.8 216 358.6 233.4 351.8 250.4 341.8 261.2 311.3 280.8 274.5 304.8 262.5 302.6 251.1 270.9 227.4 259.7 214.5 246.4 187.2 252.3 144.8 270 109.5 302.9 101.2 355.2 101.7 384.2 127 396 171.2 416.5 192.5 416.3 213.2 383.1 250.1 351.3 272.1 311.6 315.6 280.7 364.1 254.6 419.3 235.4 469.7 217.3 526.7 197.7 577.8 180.7 583.6 178.6Z',
  startPath: 'M589.3 176.6l-20-14',
  marker: [589.3, 176.6],
}

export const circuitVisuals: Record<number, CircuitVisualDefinition> = {
  61: singapore,
  144: baku,
}
