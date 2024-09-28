import { ErrorUpdate } from "retrommo-types";
import { emitToSocketioServer } from "pixel-pigeon";

export const handleError = (error: Error): void => {
  emitToSocketioServer<ErrorUpdate>({
    data: {
      message: error.message,
      stack: typeof error.stack !== "undefined" ? error.stack : null,
    },
    event: "screen-error",
  });
};
