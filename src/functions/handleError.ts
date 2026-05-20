import { ErrorRequest } from "retrommo-types";
import { emitToSocketioServer } from "pixel-pigeon";

export const handleError = (error: Error): void => {
  emitToSocketioServer<ErrorRequest>({
    data: {
      message: error.message,
      stack: error.stack,
    },
    event: "screen-error",
  });
};
