import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";

const DEFAULT_SOCIALS = { github: "", facebook: "", telegram: "", linkedin: "", website: "" };

function slug(value = "") {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "accent";
}

function normalizeSkills(skills = []) {
  return (Array.isArray(skills) ? skills : [])
    .map((skill, index) => {
      if (typeof skill === "string") {
        return {
          id: `skill-${index}-${slug(skill)}`,
          name: skill,
          level: 80,
          color: "#2563EB",
        };
      }

      return {
        id: skill?.id || `skill-${index}-${slug(skill?.name)}`,
        name: skill?.name || "",
        level: Number.isFinite(Number(skill?.level)) ? Math.max(0, Math.min(100, Number(skill.level))) : 80,
        color: skill?.color || "#2563EB",
      };
    })
    .filter((skill) => skill.name);
}

function normalizeProjects(projects = []) {
  return (Array.isArray(projects) ? projects : []).map((project, index) => ({
    id: project?.id || `project-${index}-${slug(project?.title)}`,
    title: project?.title || "",
    desc: project?.desc || "",
    url: project?.url || "",
    image: project?.image || "",
    stack: project?.stack || "",
    role: project?.role || "",
    year: project?.year || "",
  }));
}

function normalizeCertifications(certifications = []) {
  return (Array.isArray(certifications) ? certifications : []).map((item, index) => ({
    id: item?.id || `cert-${index}-${slug(item?.title)}`,
    title: item?.title || "",
    issuer: item?.issuer || "",
    year: item?.year || "",
    image: item?.image || "",
  }));
}

export const DEFAULT_PORTFOLIO = {
  name: "",
  title: "",
  tagline: "",
  bio: "",
  email: "",
  phone: "",
  location: "",
  avatar: "",
  accentColor: "#2563EB",
  accentName: "Ocean Blue",
  themeMode: "auto",
  animationStyle: "float",
  skills: [],
  projects: [],
  certifications: [],
  socials: DEFAULT_SOCIALS,
};

export function normalizePortfolio(data = {}) {
  return {
    ...DEFAULT_PORTFOLIO,
    ...data,
    socials: { ...DEFAULT_SOCIALS, ...(data?.socials || {}) },
    skills: normalizeSkills(data?.skills),
    projects: normalizeProjects(data?.projects),
    certifications: normalizeCertifications(data?.certifications),
  };
}

export function usePortfolio(userId) {
  const [portfolio, setPortfolio] = useState(null);
  const [template, setTemplate] = useState("minimal");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    supabase
      .from("portfolios")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setTemplate(data.template || "minimal");
          setPortfolio(normalizePortfolio(data.data));
        } else {
          setPortfolio(normalizePortfolio());
        }
        setLoading(false);
      });
  }, [userId]);

  const save = useCallback(async (newPortfolio, newTemplate) => {
    if (!userId) return false;
    setSaving(true);

    const payload = normalizePortfolio(newPortfolio || portfolio);
    const selectedTemplate = newTemplate || template;

    const { error } = await supabase
      .from("portfolios")
      .upsert(
        {
          user_id: userId,
          template: selectedTemplate,
          data: payload,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

    setSaving(false);

    if (error) {
      console.error("portfolio save error:", error.message);
      return false;
    }

    setPortfolio(payload);
    setTemplate(selectedTemplate);
    return true;
  }, [portfolio, template, userId]);

  return { portfolio, setPortfolio, template, setTemplate, loading, saving, save };
}