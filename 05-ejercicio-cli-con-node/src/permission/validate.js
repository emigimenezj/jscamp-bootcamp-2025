import { ReadPermissionError } from "../errors/system-error.js";

export function validateReadPermission(path = ".") {
  if (!process.permission?.has("fs.read", path)) {
    throw new ReadPermissionError(path);
  }
}
