import { lstat, readdir } from "node:fs/promises";
import { resolve } from "node:path";

import { SystemError } from "../errors/system-error.js";

export async function readEntries(directory) {
  try {
    const names = await readdir(directory);

    return Promise.all(
      names.map(async (name) => {
        const path = resolve(directory, name);
        const stats = await lstat(path);

        return {
          name,
          path,
          type: extractType(stats), // "file" | "directory" | "symlink" | "other"
          hidden: name.startsWith("."),

          stats: {
            size: stats.size,
            mode: stats.mode,
            uid: stats.uid,

            dates: {
              modified: stats.mtime,
              created: stats.birthtime,
            },
          },
        };
      }),
    );
  } catch (error) {
    throw new SystemError(error, directory);
  }
}

function extractType(stats) {
  if (stats.isFile()) return "file";
  if (stats.isDirectory()) return "directory";
  if (stats.isSymbolicLink()) return "symlink";
  return "other";
}
