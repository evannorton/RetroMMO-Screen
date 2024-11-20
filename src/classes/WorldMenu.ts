import { Definable } from "definables";
import { HUDElementReferences, removeHUDElements } from "pixel-pigeon";

export interface WorldMenuOptions<OpenOptions> {
  create: (options: OpenOptions) => HUDElementReferences;
  preventsWalking?: boolean;
}
export class WorldMenu<OpenOptions> extends Definable {
  private readonly _create: (options: OpenOptions) => HUDElementReferences;
  private _hudElementReferences: HUDElementReferences | null = null;
  private readonly _preventsWalking: boolean;
  public constructor(options: WorldMenuOptions<OpenOptions>) {
    super();
    this._create = options.create;
    this._preventsWalking = options.preventsWalking ?? false;
  }

  public get preventsWalking(): boolean {
    return this._preventsWalking;
  }

  public close(): void {
    if (this.isOpen() === false) {
      throw new Error(
        "Attempted to close a world menu that is already closed.",
      );
    }
    if (this._hudElementReferences === null) {
      throw new Error("HUDElementReferences is null.");
    }
    removeHUDElements(this._hudElementReferences);
    this._hudElementReferences = null;
  }

  public isOpen(): boolean {
    return this._hudElementReferences !== null;
  }

  public open(options: OpenOptions): void {
    if (this.isOpen()) {
      throw new Error("Attempted to open a world menu that is already open.");
    }
    this._hudElementReferences = this._create(options);
  }
}
