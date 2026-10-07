export interface ActionItem {
  label: string;
  moduleId: string;
  accent: string;
  cue: string;
}

export const SCROLLER_CONFIG = {
  ROW_PITCH: 37.6, // px per step
  FAN_ANGLE: 5.5, // subtle elegant fan rotation degrees per step
  MAX_ANGLE: 16, // max clamp degrees
  BLUR_PER: 1.0, // px per step
  BLUR_MAX: 3.2, // px clamp
  SCALE_STEP: 0.02, // subtle optical scale reduction (1.00 -> 0.98 -> 0.96 -> 0.94)

  // Settle transition duration (0.45 - 0.70s range)
  settleDuration: 480, // ms
};

// Modular signed distance wrapped into [-n/2, n/2), i.e. [-3, 3) for n=6
export function wrapDist(diff: number, n: number = 6): number {
  let d = diff % n;
  if (d < -n / 2) d += n;
  if (d >= n / 2) d -= n;
  return d;
}

// Tuned opacity falloff according to specs:
// active: 100%, near: 75% (70-85%), far: 40% (35-60%), very far: 18% (15-30%)
export function getOpacity(ad: number): number {
  if (ad <= 0) return 1.0;
  if (ad <= 1) return 1.0 - ad * 0.25;
  if (ad <= 2) return 0.75 - (ad - 1) * 0.35;
  if (ad <= 3) return 0.40 - (ad - 2) * 0.22;
  if (ad <= 3.5) return 0.18 - (ad - 3) * (0.18 / 0.5);
  return 0;
}

// Continuous depth of field blur calculation
export function getBlur(
  ad: number,
  blurPer: number = SCROLLER_CONFIG.BLUR_PER,
  blurMax: number = SCROLLER_CONFIG.BLUR_MAX
): number {
  if (ad < 0.03) return 0;
  return Math.min(blurMax, ad * blurPer);
}

// Color interpolation from warm cream #E4DDD2 to muted warm grey #777469
export function getTextColor(ad: number): string {
  const t = Math.min(1, Math.max(0, ad / 2));
  const r = Math.round(228 + (119 - 228) * t);
  const g = Math.round(221 + (116 - 221) * t);
  const b = Math.round(210 + (105 - 210) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

// Fast initial response with gentle, silky-smooth deceleration and clean settle (Precision Glass feel)
export const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);
