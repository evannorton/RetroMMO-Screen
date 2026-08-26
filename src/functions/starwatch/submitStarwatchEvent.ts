import { state } from "../../state";
import { submitEvent } from "starwatch-sdk";

export interface SubmitStarwatchEventOptions {
  eventName: string;
  extraDetails: Record<string, unknown> | undefined;
}
export const submitStarwatchEvent = (
  options: SubmitStarwatchEventOptions,
): void => {
  if (state.values.starwatchUserID === null) {
    throw new Error("StarWatch user ID is null");
  }
  submitEvent({
    eventName: options.eventName,
    extraDetails: options.extraDetails,
    userID: state.values.starwatchUserID,
  });
};
