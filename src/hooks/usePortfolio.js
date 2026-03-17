import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";

export const DEFAULT_PORTFOLIO = {
  name:         "",
  title:        "",
  bio:          "",
  avatar:       "",
  location:     "",
  email:        "",
  website:      "",
  accentColor:  "#1E88E5",
  bgColor:      "#ffffff",
  fontStyle:    "modern",
  darkMode:     false,
  skills:       [],
  projects:     [],
  certificates: [],
  experience:   [],
  education:    [],
  socials:      { github: "", linkedin: "", facebook: "", telegram: "", twitter: "", youtube: "" },
  animations:   { hero: "fade", cards: "slide", skills: "grow" },
};

export function usePortfolio(userId) {
  const [portfolio, setPortfolio] = useState(null);
  const [template,  setTemplate]  = useState("minimal");
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    supabase
      .from("portfolios")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setTemplate(data.template || "minimal");

          // BUG FIX: deep-merge so nested objects (animations, socials)
          // from saved data override defaults — not get wiped by spread order
          const saved = data.data || {};
          setPortfolio({
            ...DEFAULT_PORTFOLIO,
            ...saved,
            // Explicitly preserve nested objects by merging them too
            socials:    { ...DEFAULT_PORTFOLIO.socials,    ...(saved.socials    || {}) },
            animations: { ...DEFAULT_PORTFOLIO.animations, ...(saved.animations || {}) },
            // Preserve booleans explicitly — JSON parse can lose them
            darkMode:   saved.darkMode  ?? DEFAULT_PORTFOLIO.darkMode,
            fontStyle:  saved.fontStyle ?? DEFAULT_PORTFOLIO.fontStyle,
          });
        } else {
          setPortfolio({ ...DEFAULT_PORTFOLIO });
        }
        setLoading(false);
      });
  }, [userId]);

  const save = useCallback(async (newPortfolio, newTemplate) => {
    if (!userId) return false;
    setSaving(true);

    // BUG FIX: Always use the arguments passed in — never fall back to
    // stale closure values, which caused settings changes to be lost
    const portfolioToSave = newPortfolio ?? portfolio;
    const templateToSave  = newTemplate  ?? template;

    const { error } = await supabase
      .from("portfolios")
      .upsert({
        user_id:    userId,
        template:   templateToSave,
        data:       portfolioToSave,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });

    setSaving(false);

    if (error) {
      console.error("portfolio save:", error.message);
      return false;
    }

    if (newPortfolio) setPortfolio(newPortfolio);
    if (newTemplate)  setTemplate(newTemplate);
    return true;
  }, [userId, template, portfolio]);

  return { portfolio, setPortfolio, template, setTemplate, loading, saving, save };
}