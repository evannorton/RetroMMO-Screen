import { Definable } from "definables";
import { HUDElementReferences, State, removeHUDElements } from "pixel-pigeon";

export interface WorldMenuOptions<OpenOptions, StateSchema> {
  readonly create: (options: OpenOptions) => HUDElementReferences;
  readonly initialStateValues: StateSchema;
  readonly onClose?: () => void;
  readonly preventsWalking?: boolean;
}
export class WorldMenu<OpenOptions, StateSchema> extends Definable {
  private readonly _create: (options: OpenOptions) => HUDElementReferences;
  private _hudElementReferences: HUDElementReferences | null = null;
  private readonly _initialStateValues: StateSchema;
  private readonly _onClose?: () => void;
  private _openOptions: OpenOptions | null = null;
  private readonly _preventsWalking: boolean;
  private _state: State<StateSchema> | null = null;
  public constructor(options: WorldMenuOptions<OpenOptions, StateSchema>) {
    super();
    this._create = options.create;
    this._initialStateValues = options.initialStateValues;
    this._onClose = options.onClose;
    this._preventsWalking = options.preventsWalking ?? false;
  }

  public get openOptions(): OpenOptions {
    if (this._openOptions !== null) {
      return this._openOptions;
    }
    throw new Error(this.getAccessorErrorMessage("openOptions"));
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
    if (typeof this._onClose !== "undefined") {
      this._onClose();
    }
    removeHUDElements(this._hudElementReferences);
    this._hudElementReferences = null;
    this._state = null;
    this._openOptions = null;
  }

  public isOpen(): boolean {
    return this._hudElementReferences !== null;
  }

  public open(options: OpenOptions): void {
    if (this.isOpen()) {
      throw new Error("Attempted to open a world menu that is already open.");
    }
    this._hudElementReferences = this._create(options);
    this._openOptions = options;
    this._state = new State<StateSchema>(this._initialStateValues);
  }
}
