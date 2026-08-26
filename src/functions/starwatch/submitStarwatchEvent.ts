import { getEnvironmentVariable } from "pixel-pigeon";
import { state } from "../../state";
import { submitEvent } from "starwatch-sdk";

export interface SubmitStarwatchEventOptions {
  eventName: string;
  extraDetails: Record<string, unknown> | undefined;
}
export const submitStarwatchEvent = (
  options: SubmitStarwatchEventOptions,
): void => {
  const starwatchUserID: string | null = state.values.starwatchUserID;
  if (starwatchUserID === null) {
    throw new Error("StarWatch user ID is null");
  }
  const starwatchAppKey: unknown = getEnvironmentVariable("STARWATCH_APP_KEY");
  const starwatchServerURL: unknown = getEnvironmentVariable(
    "STARWATCH_SERVER_URL",
  );
  const starwatchLogs: unknown = getEnvironmentVariable("STARWATCH_LOGS");
  if (
    typeof starwatchAppKey === "string" &&
    typeof starwatchServerURL === "string" &&
    typeof starwatchLogs === "string" &&
    starwatchAppKey.length > 0 &&
    starwatchServerURL.length > 0 &&
    starwatchLogs.length > 0
  ) {
    submitEvent({
      eventName: options.eventName,
      extraDetails: options.extraDetails,
      userID: starwatchUserID,
    });
  }
};
