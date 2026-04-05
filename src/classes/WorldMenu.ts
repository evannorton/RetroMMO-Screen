import { Definable } from "definables";
import { HUDElementReferences, State, removeHUDElements } from "pixel-pigeon";

export interface WorldMenuOptions<OpenOptions, StateSchema> {
  readonly create: (options: OpenOptions) => HUDElementReferences;
  readonly initialStateValues:
    | StateSchema
    | ((openOptions: OpenOptions) => StateSchema);
  readonly onClose?: () => boolean;
  readonly preventsWalking?: boolean;
}
export class WorldMenu<
  OpenOptions,
  StateSchema extends object,
> extends Definable {
  private readonly _create: (options: OpenOptions) => HUDElementReferences;
  private _hudElementReferences: HUDElementReferences | null = null;
  private readonly _initialStateValues:
    | StateSchema
    | ((openOptions: OpenOptions) => StateSchema);

  private readonly _onClose?: (openOptions: OpenOptions) => boolean;
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
    let shouldClose: boolean = true;
    if (typeof this._onClose !== "undefined") {
      if (this._openOptions === null) {
        throw new Error("Open options is null.");
      }
      shouldClose = this._onClose(this._openOptions);
    }
    if (shouldClose) {
      removeHUDElements(this._hudElementReferences);
      this._hudElementReferences = null;
      this._state = null;
      this._openOptions = null;
    }
  }

  public isOpen(): boolean {
    return this._hudElementReferences !== null;
  }

  public open(options: OpenOptions): void {
    if (this.isOpen()) {
      throw new Error("Attempted to open a world menu that is already open.");
    }
    this._state = new State<StateSchema>(
      typeof this._initialStateValues === "function"
        ? this._initialStateValues(options)
        : this._initialStateValues,
    );
    this._hudElementReferences = this._create(options);
    this._openOptions = options;
  }
}
