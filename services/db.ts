import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";

export const supabase = createClient(
  Constants.expoConfig?.extra?.supabaseUrl as string,
  Constants.expoConfig?.extra?.supabaseAnon as string
);
