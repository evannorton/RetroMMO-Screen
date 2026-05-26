import { Color, ReadableDefinition } from "retrommo-types";
import { Definable } from "definables";

export interface ReadableOptions {
  readonly definition: ReadableDefinition;
  readonly id: string;
}
export class Readable extends Definable {
  private readonly _color: Color;
  private readonly _contents: string;
  private readonly _height: number;
  private readonly _horizontalAlignment: "center" | "left" | "right";
  private readonly _imagePath: string;
  private readonly _interactText: string;

  public constructor(options: ReadableOptions) {
    super(options.id);
    this._color = options.definition.color;
    this._contents = options.definition.contents;
    this._height = options.definition.height;
    this._horizontalAlignment = options.definition.horizontalAlignment;
    this._imagePath = options.definition.imagePath;
    this._interactText = options.definition.interactText;
  }

  public get color(): Color {
    return this._color;
  }

  public get contents(): string {
    return this._contents;
  }

  public get height(): number {
    return this._height;
  }

  public get horizontalAlignment(): "center" | "left" | "right" {
    return this._horizontalAlignment;
  }

  public get imagePath(): string {
    return this._imagePath;
  }

  public get interactText(): string {
    return this._interactText;
  }
}
