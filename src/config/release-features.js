export function createReleaseFeatures(environment = {}) {
  return Object.freeze({
    learningAccounts: String(environment.VITE_LEARNING_ACCOUNTS_ENABLED ?? "").trim() === "true",
    nursingAssistant: String(environment.VITE_NURSING_ASSISTANT_ENABLED ?? "").trim() === "true",
  });
}

// Public releases fail closed. A feature is included only when its production
// controls have been completed and the build explicitly enables it.
export const releaseFeatures = createReleaseFeatures(import.meta.env ?? {});
