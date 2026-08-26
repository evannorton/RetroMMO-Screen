import { state } from "../../state";
import { submitEvent } from "starwatch-sdk";

export interface SubmitStarwatchEventOptions {
  event: string;
  extraDetails: Record<string, unknown> | undefined;
}
export const submitStarwatchEvent = (
  options: SubmitStarwatchEventOptions,
): void => {
  const starwatchUserID: string | null = state.values.starwatchUserID;
  if (starwatchUserID === null) {
    throw new Error("StarWatch user ID is null");
  }
  if (state.values.isStarwatchInitialized) {
    submitEvent({
      event: options.event,
      extraDetails: options.extraDetails,
      userID: starwatchUserID,
    });
  }
};
