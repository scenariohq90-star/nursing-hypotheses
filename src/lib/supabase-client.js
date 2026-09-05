import { createClient } from "@supabase/supabase-js";
import { releaseFeatures } from "../config/release-features.js";

const viteEnvironment = import.meta.env ?? {};
const supabaseUrl = String(viteEnvironment.VITE_SUPABASE_URL ?? "").trim();
const supabasePublishableKey = String(
  viteEnvironment.VITE_SUPABASE_PUBLISHABLE_KEY ?? "",
).trim();

export const isSupabaseConfigured = Boolean(
  releaseFeatures.learningAccounts && supabaseUrl && supabasePublishableKey,
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabasePublishableKey, {
      auth: {
        flowType: "pkce",
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
