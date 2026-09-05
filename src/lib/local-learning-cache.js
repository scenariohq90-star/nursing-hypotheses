/**
 * Attempts a device-local sign-out, then clears the named learning-cache keys
 * even when the authentication provider reports an error. This keeps learning
 * data from remaining on a shared device after the learner asks to sign out.
 */
export async function signOutAndClearLocalLearningCache({ signOut, storage, keys }) {
  let authResult;
  try {
    authResult = await signOut();
  } catch (error) {
    authResult = { ok: false, error };
  }

  let cacheError = null;
  try {
    const uniqueKeys = [...new Set(
      (Array.isArray(keys) ? keys : [])
        .filter((key) => typeof key === "string" && key.length > 0),
    )];
    for (const key of uniqueKeys) storage.removeItem(key);
  } catch (error) {
    cacheError = error;
  }

  return {
    ok: authResult?.ok === true && cacheError === null,
    authRequestSucceeded: authResult?.ok === true,
    cacheCleared: cacheError === null,
    error: authResult?.error ?? cacheError,
  };
}
