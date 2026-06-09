import { ChatChannel as ChatChannelEnum } from "retrommo-types";
import { Definable } from "definables";

export interface ChatChannelOptions {
  readonly condition: boolean | (() => boolean);
  readonly id: ChatChannelEnum;
  readonly inputCollectionID: string;
}
export class ChatChannel extends Definable {
  protected readonly _id: ChatChannelEnum;
  private readonly _condition: boolean | (() => boolean);
  private readonly _inputCollectionID: string;

  public constructor(options: ChatChannelOptions) {
    super(options.id);
    this._condition = options.condition;
    this._id = options.id;
    this._inputCollectionID = options.inputCollectionID;
  }

  public get condition(): boolean | (() => boolean) {
    return this._condition;
  }

  public get id(): ChatChannelEnum {
    return this._id;
  }

  public get inputCollectionID(): string {
    return this._inputCollectionID;
  }
}
