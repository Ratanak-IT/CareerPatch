
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
  fontStyle:    "modern",       // modern | classic | mono | rounded
  darkMode:     false,
  skills:       [],             // [{ name, percent, color }]
  projects:     [],             // [{ title, desc, url, image, tags, featured }]
  certificates: [],             // [{ title, issuer, date, url, image }]
  experience:   [],             // [{ role, company, from, to, desc }]
  education:    [],             // [{ degree, school, from, to }]
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
          setPortfolio({ ...DEFAULT_PORTFOLIO, ...data.data });
        } else {
          setPortfolio({ ...DEFAULT_PORTFOLIO });
        }
        setLoading(false);
      });
  }, [userId]);

  const save = useCallback(async (newPortfolio, newTemplate) => {
    if (!userId) return false;
    setSaving(true);
    const { error } = await supabase
      .from("portfolios")
      .upsert({
        user_id:    userId,
        template:   newTemplate || template,
        data:       newPortfolio || portfolio,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });
    setSaving(false);
    if (error) { console.error("portfolio save:", error.message); return false; }
    if (newPortfolio) setPortfolio(newPortfolio);
    if (newTemplate)  setTemplate(newTemplate);
    return true;
  }, [userId, template, portfolio]);

  return { portfolio, setPortfolio, template, setTemplate, loading, saving, save };
}