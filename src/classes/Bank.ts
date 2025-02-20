import { BankDefinition } from "retrommo-types";
import { Definable } from "definables";

export interface BankOptions {
  readonly definition: BankDefinition;
  readonly id: string;
}
export interface BankModification {
  readonly isOpen: boolean;
  readonly modifiedAt: number;
}
export class Bank extends Definable {
  private readonly _imagePath: string;
  private _isOpen: boolean = false;
  private _toggledAt: number | null = null;
  public constructor(options: BankOptions) {
    super(options.id);
    this._imagePath = options.definition.imagePath;
  }

  public get imagePath(): string {
    return this._imagePath;
  }

  public get isOpen(): boolean {
    return this._isOpen;
  }

  public get toggledAt(): number {
    if (this._toggledAt !== null) {
      return this._toggledAt;
    }
    throw new Error(this.getAccessorErrorMessage("toggledAt"));
  }

  public set isOpen(isOpen: boolean) {
    this._isOpen = isOpen;
  }

  public set toggledAt(toggledAt: number | null) {
    this._toggledAt = toggledAt;
  }

  public hasToggledAt(): boolean {
    return this._toggledAt !== null;
  }
}
