import { execSync } from "child_process";

// Helper: Get the last modified date of a file using Git
export function getGitLastModifiedDate(filePath: string): string {
  try {
    const command = `git log -1 --format=%cd -- "${filePath}"`;
    const output = execSync(command, { encoding: "utf8" }).trim();
    return output; // e.g. "Wed May 10 15:20:30 2023 +0200"
  } catch (error) {
    console.error("Error retrieving Git date:", error);
    return new Date().toString();
  }
}
