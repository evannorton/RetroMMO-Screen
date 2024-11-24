import { Definable } from "definables";
import { HUDElementReferences, State, removeHUDElements } from "pixel-pigeon";

export interface WorldMenuOptions<OpenOptions, StateSchema> {
  create: (options: OpenOptions) => HUDElementReferences;
  initialStateValues: StateSchema;
  preventsWalking?: boolean;
}
export class WorldMenu<OpenOptions, StateSchema> extends Definable {
  private readonly _create: (options: OpenOptions) => HUDElementReferences;
  private _hudElementReferences: HUDElementReferences | null = null;
  private readonly _initialStateValues: StateSchema;
  private readonly _preventsWalking: boolean;
  private _state: State<StateSchema> | null = null;
  public constructor(options: WorldMenuOptions<OpenOptions, StateSchema>) {
    super();
    this._create = options.create;
    this._initialStateValues = options.initialStateValues;
    this._preventsWalking = options.preventsWalking ?? false;
  }

  public get preventsWalking(): boolean {
    return this._preventsWalking;
  }

  public get state(): State<StateSchema> {
    if (this._state !== null) {
      return this._state;
    }
    throw new Error(this.getAccessorErrorMessage("state"));
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
    this._state = new State<StateSchema>(this._initialStateValues);
  }
}
