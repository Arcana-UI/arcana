export type MotionPersonality =
  | 'calm'
  | 'default'
  | 'snappy'
  | 'static'
  | 'spring'
  | 'step'
  | 'organic'
  | 'languid';

export interface ArcanaPreset {
  $schema?: string;
  name: string;
  version: string;
  description?: string;
  primitive: Record<string, unknown>;
  semantic: {
    color: Record<string, unknown>;
    typography: Record<string, unknown>;
    spacing: Record<string, unknown>;
    elevation: Record<string, unknown>;
    layout: Record<string, unknown>;
    radius: Record<string, unknown>;
    border?: Record<string, unknown>;
    motion: Record<string, unknown>;
    opacity?: Record<string, unknown>;
    elementSizing?: Record<string, unknown>;
  };
  component?: Record<string, unknown>;
}

export interface PresetToDesignMdOptions {
  /** Override the human-readable name written into the DESIGN.md file. */
  name?: string;
  /** Override the description prose at the top of the file. */
  description?: string;
  /**
   * Override the inferred motion personality. If omitted, the personality is
   * derived from the preset's semantic.motion.duration.normal value.
   */
  motionPersonality?: MotionPersonality;
}

export interface ContrastPair {
  pair: string;
  fg: string;
  bg: string;
  ratio: number;
  aaBody: boolean;
  aaLarge: boolean;
}
