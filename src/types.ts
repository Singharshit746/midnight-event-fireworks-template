/** Scene flow for the midnight surprise experience */
export type Scene =
  | "opening"
  | "pan"
  | "fireworks"
  | "cake"
  | "finale"
  | "epilogue";

export interface AudioState {
  ambienceOn: boolean;
  musicOn: boolean;
  masterOn: boolean;
}
