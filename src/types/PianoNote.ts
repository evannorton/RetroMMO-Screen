import { PianoKeyType } from "retrommo-types";

export interface PianoNote {
  readonly index: number;
  readonly playAt: number;
  readonly type: PianoKeyType;
}
