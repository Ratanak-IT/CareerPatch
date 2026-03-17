

import { useScrollReveal, SkillBar, SocialLink, CertCard, SectionTitle, ProjectCard, FONTS } from "./PortfolioShared";

const initial = (name) => (name || "?")[0]?.toUpperCase() || "?";

function Avatar({ data, size = 28, ring = true }) {
  if (data.avatar) {
    return (
      <img src={data.avatar} alt={data.name}
        className={`rounded-full object-cover ${ring ? "ring-4" : ""}`}
        style={{ width: size, height: size, ringColor: data.accentColor }}
      />
    );
  }
  return (
    <div className="rounded-full flex items-center justify-center font-black text-white"
         style={{ width: size, height: size, background: data.accentColor, fontSize: size * 0.35 }}>
      {initial(data.name)}
    </div>
  );
}

function wrap(data) {
  return {
    d:    data,
    dark: data.darkMode,
    acc:  data.accentColor || "#1E88E5",
    bg:   data.darkMode ? "#0f172a" : (data.bgColor || "#ffffff"),
    font: FONTS[data.fontStyle] || FONTS.modern,
    anim: data.animations || { hero: "fade", cards: "slide", skills: "grow" },
    skills:  Array.isArray(data.skills)       ? data.skills       : [],
    projs:   Array.isArray(data.projects)     ? data.projects     : [],
    certs:   Array.isArray(data.certificates) ? data.certificates : [],
    exp:     Array.isArray(data.experience)   ? data.experience   : [],
    edu:     Array.isArray(data.education)    ? data.education    : [],
    socials: data.socials || {},
  };
}


  //  1. MINIMAL — Clean white/dark, Swiss typography

export function MinimalTemplate({ data }) {
  const { d, dark, acc, bg, font, anim, skills, projs, certs, exp, socials } = wrap(data);
  const hero = useScrollReveal(anim.hero);

  return (
    <div style={{ background: bg, fontFamily: font, color: dark ? "#e2e8f0" : "#1e293b", minHeight: "100vh" }}>
      <div className="max-w-3xl mx-auto px-6 py-16">

        {/* Hero */}
        <div ref={hero.ref} style={hero.style} className="flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-16">
          <Avatar data={d} size={100} />
          <div>
            <h1 className="text-4xl font-bold">{d.name || "Your Name"}</h1>
            <p className="text-lg mt-1 font-medium" style={{ color: acc }}>{d.title || "Your Title"}</p>
            <p className="mt-3 text-sm leading-relaxed opacity-70 max-w-md">{d.bio}</p>
            <div className="mt-4 flex gap-2 flex-wrap">
              {d.location && <span className="text-xs opacity-60">📍 {d.location}</span>}
              {d.email    && <span className="text-xs opacity-60">✉ {d.email}</span>}
              {d.website  && <a href={d.website} target="_blank" rel="noopener noreferrer" className="text-xs" style={{ color: acc }}>🌐 {d.website}</a>}
            </div>
            <div className="mt-4 flex gap-2">
              {Object.entries(socials).filter(([,v])=>v).map(([k,v]) => <SocialLink key={k} type={k} url={v} accent={acc} />)}
            </div>
          </div>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <section className="mb-14">
            <SectionTitle accent={acc} dark={dark}>Skills</SectionTitle>
            {skills.map((s,i) => <SkillBar key={i} skill={s} animType={anim.skills} dark={dark} />)}
          </section>
        )}

        {/* Projects */}
        {projs.length > 0 && (
          <section className="mb-14">
            <SectionTitle accent={acc} dark={dark}>Projects</SectionTitle>
            <div className="grid gap-5 sm:grid-cols-2">
              {projs.map((p,i) => <ProjectCard key={i} project={p} accent={acc} dark={dark} animType={anim.cards} />)}
            </div>
          </section>
        )}

        {/* Experience */}
        {exp.length > 0 && (
          <section className="mb-14">
            <SectionTitle accent={acc} dark={dark}>Experience</SectionTitle>
            <div className="border-l-2 pl-5 space-y-6" style={{ borderColor: acc }}>
              {exp.map((e,i) => (
                <div key={i}>
                  <p className="font-bold">{e.role}</p>
                  <p className="text-sm" style={{ color: acc }}>{e.company}</p>
                  <p className="text-xs opacity-60">{e.from} – {e.to || "Present"}</p>
                  <p className="text-sm mt-1 opacity-75">{e.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certificates */}
        {certs.length > 0 && (
          <section className="mb-14">
            <SectionTitle accent={acc} dark={dark}>Certificates</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              {certs.map((c,i) => <CertCard key={i} cert={c} accent={acc} dark={dark} />)}
            </div>
          </section>
        )}

        <p className="text-center text-xs opacity-30">Made with CareerPatch</p>
      </div>
    </div>
  );
}


  //  2. CREATIVE — Bold gradient hero, vibrant

export function CreativeTemplate({ data }) {
  const { d, dark, acc, bg, font, anim, skills, projs, certs, exp, socials } = wrap(data);
  return (
    <div style={{ background: bg, fontFamily: font, minHeight: "100vh" }}>
      {/* Hero */}
      <div className="relative py-24 px-6 text-white text-center overflow-hidden"
           style={{ background: `linear-gradient(135deg, ${acc} 0%, ${acc}99 60%, #1e1b4b 100%)` }}>
        {[0,1,2,3].map(i => (
          <div key={i} className="absolute rounded-full opacity-10 animate-pulse pointer-events-none"
               style={{ width: 80+i*70, height: 80+i*70, background:"white", top:`${-10+i*20}%`, left:`${i%2===0?-5+i*5:55+i*4}%`, animationDelay:`${i*0.5}s`, animationDuration:`${3+i}s` }} />
        ))}
        <div className="relative z-10 flex flex-col items-center">
          <Avatar data={d} size={110} />
          <h1 className="text-5xl font-black mt-5">{d.name || "Your Name"}</h1>
          <div className="mt-3 px-5 py-1.5 rounded-full text-sm font-semibold" style={{ background:"rgba(255,255,255,0.2)" }}>{d.title}</div>
          <p className="mt-4 max-w-lg text-white/80 text-sm leading-relaxed">{d.bio}</p>
          <div className="mt-5 flex gap-3 justify-center">
            {Object.entries(socials).filter(([,v])=>v).map(([k,v]) => (
              <a key={k} href={v} target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white hover:text-purple-600 transition-all"
                style={{ background:"rgba(255,255,255,0.2)" }}>
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white"><path d={({"github":"M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57v-2.235c-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22v3.3c0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z","linkedin":"M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z","telegram":"M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z","facebook":"M24 12.073C24 5.373 18.627 0 12 0S0 5.373 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"})[k] || ""} /></svg>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-14 space-y-14">
        {skills.length > 0 && (
          <section>
            <SectionTitle accent={acc} dark={dark}>What I Do</SectionTitle>
            <div className="grid gap-3 sm:grid-cols-2">
              {skills.map((s,i) => <SkillBar key={i} skill={s} animType={anim.skills} dark={dark} />)}
            </div>
          </section>
        )}
        {projs.length > 0 && (
          <section>
            <SectionTitle accent={acc} dark={dark}>My Work</SectionTitle>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projs.map((p,i) => <ProjectCard key={i} project={p} accent={acc} dark={dark} animType={anim.cards} />)}
            </div>
          </section>
        )}
        {exp.length > 0 && (
          <section>
            <SectionTitle accent={acc} dark={dark}>Experience</SectionTitle>
            <div className="space-y-5">
              {exp.map((e,i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-2 h-2 rounded-full mt-2 shrink-0" style={{ background: acc }} />
                  <div>
                    <p className="font-bold" style={{ color: dark?"#f1f5f9":"#0f172a" }}>{e.role} @ {e.company}</p>
                    <p className="text-xs opacity-60">{e.from} – {e.to||"Present"}</p>
                    <p className="text-sm mt-1 opacity-75">{e.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        {certs.length > 0 && (
          <section>
            <SectionTitle accent={acc} dark={dark}>Certificates</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {certs.map((c,i) => <CertCard key={i} cert={c} accent={acc} dark={dark} />)}
            </div>
          </section>
        )}
      </div>
      <p className="text-center pb-8 text-xs opacity-30" style={{ color: dark?"#e2e8f0":"#1e293b" }}>Made with CareerPatch</p>
    </div>
  );
}


  //  3. DEVELOPER — Dark terminal aesthetic

export function DeveloperTemplate({ data }) {
  const { d, acc, font, anim, skills, projs, certs, exp, socials } = wrap(data);
  const dark = true; // always dark
  const bg = "#0d1117";

  return (
    <div style={{ background: bg, fontFamily: FONTS.mono, color: "#e6edf3", minHeight: "100vh" }}>
      {/* Terminal titlebar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800">
        {["#ef4444","#f59e0b","#22c55e"].map((c,i) => <span key={i} className="w-3 h-3 rounded-full" style={{ background: c }} />)}
        <span className="ml-4 text-xs text-gray-500">~/portfolio/{d.name?.toLowerCase().replace(/\s+/g,"-") || "user"}</span>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-14">
        <p className="text-gray-500 text-sm mb-3">$ whoami</p>
        <div className="flex flex-col sm:flex-row gap-6 items-start mb-12">
          <Avatar data={{ ...d, darkMode: true }} size={90} />
          <div>
            <h1 className="text-4xl font-bold" style={{ color: acc }}>{d.name || "Your Name"}</h1>
            <p className="text-gray-400 text-xl mt-1">// {d.title}</p>
            <div className="mt-3 border-l-2 pl-3 text-gray-300 text-sm leading-relaxed max-w-lg" style={{ borderColor: acc }}>{d.bio}</div>
            <div className="mt-4 flex flex-wrap gap-2">
              {Object.entries(socials).filter(([,v])=>v).map(([k,v]) => (
                <a key={k} href={v} target="_blank" rel="noopener noreferrer"
                  className="px-3 py-1 rounded-lg text-xs font-bold border transition-all hover:scale-105"
                  style={{ borderColor: acc, color: acc }}
                  onMouseEnter={e => e.currentTarget.style.background=`${acc}22`}
                  onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                  {k}
                </a>
              ))}
            </div>
          </div>
        </div>

        {skills.length > 0 && (
          <div className="mb-12">
            <p className="text-gray-500 text-sm mb-4">$ ls skills/</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {skills.map((s,i) => <SkillBar key={i} skill={s} animType={anim.skills} dark={true} />)}
            </div>
          </div>
        )}

        {projs.length > 0 && (
          <div className="mb-12">
            <p className="text-gray-500 text-sm mb-4">$ git log --oneline</p>
            <div className="space-y-3">
              {projs.map((p,i) => (
                <a key={i} href={p.url||"#"} target={p.url?"_blank":"_self"} rel="noopener noreferrer"
                  className="block rounded-xl p-4 border transition-all hover:-translate-y-0.5 hover:shadow-lg"
                  style={{ background:"#161b22", borderColor:"#21262d" }}
                  onMouseEnter={e=>e.currentTarget.style.borderColor=acc}
                  onMouseLeave={e=>e.currentTarget.style.borderColor="#21262d"}>
                  <div className="flex items-start gap-3">
                    <span style={{ color: acc }} className="text-lg mt-0.5">◆</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white">{p.title}</p>
                      <p className="text-sm text-gray-400 mt-0.5 line-clamp-2">{p.desc}</p>
                      {p.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {p.tags.map((t,j) => (
                            <span key={j} className="text-[10px] px-1.5 py-0.5 rounded" style={{ background:`${acc}20`, color:acc }}>{t}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    {p.image && <img src={p.image} alt="" className="w-16 h-12 rounded-lg object-cover shrink-0 border border-gray-700" />}
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {exp.length > 0 && (
          <div className="mb-12">
            <p className="text-gray-500 text-sm mb-4">$ cat experience.log</p>
            <div className="space-y-4">
              {exp.map((e,i) => (
                <div key={i} className="p-4 rounded-xl" style={{ background:"#161b22", border:"1px solid #21262d" }}>
                  <p className="font-bold" style={{ color: acc }}>{e.role}</p>
                  <p className="text-gray-400 text-sm">{e.company} · {e.from}–{e.to||"Now"}</p>
                  <p className="text-gray-300 text-sm mt-1">{e.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {certs.length > 0 && (
          <div className="mb-12">
            <p className="text-gray-500 text-sm mb-4">$ ls certificates/</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {certs.map((c,i) => <CertCard key={i} cert={c} accent={acc} dark={true} />)}
            </div>
          </div>
        )}

        <p className="text-gray-600 text-sm">$ echo "Made with CareerPatch" <span style={{ color: acc }}>✓</span></p>
      </div>
    </div>
  );
}


  //  4. GLASS — Glassmorphism, frosted panels

export function GlassTemplate({ data }) {
  const { d, dark, acc, font, anim, skills, projs, certs, exp, socials } = wrap(data);
  const bg = dark ? "#0a0f1e" : "#dbeafe";

  return (
    <div style={{ background: `linear-gradient(135deg, ${bg}, ${acc}22)`, fontFamily: font, minHeight: "100vh" }}>
      {/* Decorative blobs */}
      {[0,1,2].map(i => (
        <div key={i} className="fixed rounded-full pointer-events-none blur-3xl opacity-20 animate-pulse"
             style={{ width:300+i*100, height:300+i*100, background: acc, top:`${10+i*30}%`, left:`${i%2===0?-5:60}%`, animationDuration:`${5+i*2}s` }} />
      ))}

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 space-y-10">
        {/* Hero card */}
        <div className="rounded-3xl p-8 flex flex-col sm:flex-row items-center gap-8 backdrop-blur-xl border"
             style={{ background: dark?"rgba(255,255,255,0.05)":"rgba(255,255,255,0.6)", borderColor: dark?"rgba(255,255,255,0.1)":"rgba(255,255,255,0.8)" }}>
          <Avatar data={d} size={110} />
          <div>
            <h1 className="text-4xl font-bold" style={{ color: dark?"#f1f5f9":"#0f172a" }}>{d.name}</h1>
            <p className="text-lg mt-1 font-semibold" style={{ color: acc }}>{d.title}</p>
            <p className="mt-3 text-sm leading-relaxed opacity-75" style={{ color: dark?"#e2e8f0":"#334155" }}>{d.bio}</p>
            <div className="mt-4 flex gap-2 flex-wrap">
              {Object.entries(socials).filter(([,v])=>v).map(([k,v]) => <SocialLink key={k} type={k} url={v} accent={acc} />)}
            </div>
          </div>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="rounded-3xl p-8 backdrop-blur-xl border"
               style={{ background: dark?"rgba(255,255,255,0.05)":"rgba(255,255,255,0.6)", borderColor: dark?"rgba(255,255,255,0.1)":"rgba(255,255,255,0.8)" }}>
            <SectionTitle accent={acc} dark={dark}>Skills</SectionTitle>
            <div className="grid sm:grid-cols-2 gap-3">
              {skills.map((s,i) => <SkillBar key={i} skill={s} animType={anim.skills} dark={dark} />)}
            </div>
          </div>
        )}

        {/* Projects */}
        {projs.length > 0 && (
          <div>
            <SectionTitle accent={acc} dark={dark}>Projects</SectionTitle>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {projs.map((p,i) => <ProjectCard key={i} project={p} accent={acc} dark={dark} animType={anim.cards} />)}
            </div>
          </div>
        )}

        {/* Experience */}
        {exp.length > 0 && (
          <div className="rounded-3xl p-8 backdrop-blur-xl border"
               style={{ background: dark?"rgba(255,255,255,0.05)":"rgba(255,255,255,0.6)", borderColor: dark?"rgba(255,255,255,0.1)":"rgba(255,255,255,0.8)" }}>
            <SectionTitle accent={acc} dark={dark}>Experience</SectionTitle>
            <div className="space-y-5">
              {exp.map((e,i) => (
                <div key={i} className="border-l-2 pl-4" style={{ borderColor: acc }}>
                  <p className="font-bold" style={{ color: dark?"#f1f5f9":"#0f172a" }}>{e.role}</p>
                  <p className="text-sm" style={{ color: acc }}>{e.company}</p>
                  <p className="text-xs opacity-60" style={{ color: dark?"#e2e8f0":"#334155" }}>{e.from} – {e.to||"Present"}</p>
                  <p className="text-sm mt-1 opacity-75" style={{ color: dark?"#e2e8f0":"#334155" }}>{e.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {certs.length > 0 && (
          <div>
            <SectionTitle accent={acc} dark={dark}>Certificates</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              {certs.map((c,i) => <CertCard key={i} cert={c} accent={acc} dark={dark} />)}
            </div>
          </div>
        )}

        <p className="text-center text-xs opacity-30" style={{ color: dark?"#e2e8f0":"#334155" }}>Made with CareerPatch</p>
      </div>
    </div>
  );
}

  //  5. SIDEBAR — Two-column with fixed sidebar

export function SidebarTemplate({ data }) {
  const { d, dark, acc, bg, font, anim, skills, projs, certs, exp, edu, socials } = wrap(data);
  const sidebarBg = dark ? "#1e293b" : acc;
  const mainBg    = dark ? "#0f172a" : "#f8faff";

  return (
    <div style={{ background: mainBg, fontFamily: font, minHeight: "100vh" }}>
      <div className="flex flex-col lg:flex-row">

        {/* Sidebar */}
        <div className="lg:w-72 lg:min-h-screen p-8 text-white flex flex-col gap-6" style={{ background: sidebarBg }}>
          <div className="flex flex-col items-center text-center">
            <Avatar data={d} size={100} />
            <h1 className="text-2xl font-bold mt-4">{d.name}</h1>
            <p className="text-sm mt-1 opacity-80">{d.title}</p>
            {d.location && <p className="text-xs mt-2 opacity-60">📍 {d.location}</p>}
            {d.email    && <p className="text-xs mt-1 opacity-60">✉ {d.email}</p>}
          </div>

          {/* Socials */}
          {Object.entries(socials).some(([,v])=>v) && (
            <div className="flex flex-wrap justify-center gap-2">
              {Object.entries(socials).filter(([,v])=>v).map(([k,v]) => (
                <a key={k} href={v} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-white/20 hover:bg-white hover:text-purple-600 transition-all">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d={({"github":"M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57v-2.235c-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22v3.3c0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z","linkedin":"M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z","telegram":"M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z","facebook":"M24 12.073C24 5.373 18.627 0 12 0S0 5.373 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"})[k]||""} /></svg>
                </a>
              ))}
            </div>
          )}

          {/* Skills in sidebar */}
          {skills.length > 0 && (
            <div>
              <p className="text-sm font-bold mb-3 opacity-80 uppercase tracking-wide">Skills</p>
              {skills.map((s,i) => <SkillBar key={i} skill={s} animType={anim.skills} dark={true} />)}
            </div>
          )}

          {/* Education */}
          {edu.length > 0 && (
            <div>
              <p className="text-sm font-bold mb-3 opacity-80 uppercase tracking-wide">Education</p>
              {edu.map((e,i) => (
                <div key={i} className="mb-3">
                  <p className="text-sm font-semibold">{e.degree}</p>
                  <p className="text-xs opacity-70">{e.school}</p>
                  <p className="text-xs opacity-50">{e.from}–{e.to||"Present"}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main */}
        <div className="flex-1 p-8 space-y-12" style={{ color: dark?"#e2e8f0":"#1e293b" }}>
          <div>
            <SectionTitle accent={acc} dark={dark}>About Me</SectionTitle>
            <p className="leading-relaxed opacity-80">{d.bio}</p>
          </div>

          {exp.length > 0 && (
            <div>
              <SectionTitle accent={acc} dark={dark}>Experience</SectionTitle>
              <div className="space-y-6">
                {exp.map((e,i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-3 h-3 rounded-full mt-1.5 shrink-0" style={{ background: acc }} />
                    <div>
                      <p className="font-bold">{e.role}</p>
                      <p className="text-sm" style={{ color: acc }}>{e.company} · {e.from}–{e.to||"Now"}</p>
                      <p className="text-sm mt-1 opacity-75">{e.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {projs.length > 0 && (
            <div>
              <SectionTitle accent={acc} dark={dark}>Projects</SectionTitle>
              <div className="grid gap-5 sm:grid-cols-2">
                {projs.map((p,i) => <ProjectCard key={i} project={p} accent={acc} dark={dark} animType={anim.cards} />)}
              </div>
            </div>
          )}

          {certs.length > 0 && (
            <div>
              <SectionTitle accent={acc} dark={dark}>Certificates</SectionTitle>
              <div className="grid gap-4 sm:grid-cols-2">
                {certs.map((c,i) => <CertCard key={i} cert={c} accent={acc} dark={dark} />)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


  //  6. NEON — Cyberpunk dark neon

export function NeonTemplate({ data }) {
  const { d, acc, font, anim, skills, projs, certs, exp, socials } = wrap(data);
  const neon = acc;

  return (
    <div style={{ background: "#050811", fontFamily: font, minHeight: "100vh", color: "#e2e8f0" }}>
      {/* Grid bg */}
      <div className="fixed inset-0 pointer-events-none opacity-5"
           style={{ backgroundImage: `linear-gradient(${neon}33 1px, transparent 1px), linear-gradient(90deg, ${neon}33 1px, transparent 1px)`, backgroundSize: "40px 40px" }} />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="text-center mb-14">
          <div className="inline-block mb-6 p-1 rounded-full" style={{ background: `linear-gradient(135deg, ${neon}, ${neon}44)` }}>
            <Avatar data={{ ...d, darkMode: true }} size={100} />
          </div>
          <h1 className="text-5xl font-black" style={{ color: neon, textShadow: `0 0 20px ${neon}66` }}>{d.name}</h1>
          <p className="mt-3 text-lg opacity-70">{d.title}</p>
          <p className="mt-4 max-w-lg mx-auto text-sm opacity-60 leading-relaxed">{d.bio}</p>
          <div className="mt-5 flex justify-center gap-3">
            {Object.entries(socials).filter(([,v])=>v).map(([k,v]) => (
              <a key={k} href={v} target="_blank" rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg text-xs font-bold border transition-all hover:scale-105"
                style={{ borderColor: neon, color: neon, boxShadow: `0 0 8px ${neon}44` }}>
                {k}
              </a>
            ))}
          </div>
        </div>

        {skills.length > 0 && (
          <div className="mb-14">
            <h2 className="text-xl font-bold mb-6" style={{ color: neon }}>// SKILLS</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {skills.map((s,i) => <SkillBar key={i} skill={s} animType={anim.skills} dark={true} />)}
            </div>
          </div>
        )}

        {projs.length > 0 && (
          <div className="mb-14">
            <h2 className="text-xl font-bold mb-6" style={{ color: neon }}>// PROJECTS</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {projs.map((p,i) => (
                <a key={i} href={p.url||"#"} target={p.url?"_blank":"_self"} rel="noopener noreferrer"
                  className="group block rounded-xl p-5 border transition-all hover:-translate-y-1"
                  style={{ background:"#0d1117", borderColor:`${neon}44`, boxShadow:`0 0 0 1px ${neon}11` }}
                  onMouseEnter={e=>e.currentTarget.style.boxShadow=`0 0 20px ${neon}44`}
                  onMouseLeave={e=>e.currentTarget.style.boxShadow=`0 0 0 1px ${neon}11`}>
                  {p.image && <img src={p.image} alt="" className="w-full h-36 object-cover rounded-lg mb-3" />}
                  <p className="font-bold" style={{ color: neon }}>{p.title}</p>
                  <p className="text-sm text-gray-400 mt-1 line-clamp-2">{p.desc}</p>
                  {p.tags?.length>0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {p.tags.map((t,j) => <span key={j} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background:`${neon}15`, color: neon }}>{t}</span>)}
                    </div>
                  )}
                </a>
              ))}
            </div>
          </div>
        )}

        {exp.length > 0 && (
          <div className="mb-14">
            <h2 className="text-xl font-bold mb-6" style={{ color: neon }}>// EXPERIENCE</h2>
            <div className="space-y-4">
              {exp.map((e,i) => (
                <div key={i} className="p-4 rounded-xl border" style={{ background:"#0d1117", borderColor:`${neon}33` }}>
                  <p className="font-bold" style={{ color: neon }}>{e.role} @ {e.company}</p>
                  <p className="text-xs text-gray-500">{e.from}–{e.to||"Present"}</p>
                  <p className="text-sm text-gray-400 mt-1">{e.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {certs.length > 0 && (
          <div className="mb-14">
            <h2 className="text-xl font-bold mb-6" style={{ color: neon }}>// CERTIFICATES</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {certs.map((c,i) => <CertCard key={i} cert={c} accent={neon} dark={true} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


  //  7. MAGAZINE — Editorial newspaper style

export function MagazineTemplate({ data }) {
  const { d, dark, acc, bg, font, anim, skills, projs, certs, exp, socials } = wrap(data);
  return (
    <div style={{ background: dark?"#0f172a":"#fafaf9", fontFamily: FONTS.classic, color: dark?"#e2e8f0":"#1c1917", minHeight:"100vh" }}>
      {/* Masthead */}
      <div className="border-b-4 px-8 py-6 flex items-end justify-between" style={{ borderColor: acc }}>
        <div>
          <p className="text-xs uppercase tracking-widest opacity-50 mb-1">Portfolio</p>
          <h1 className="text-5xl font-black leading-none">{d.name || "Your Name"}</h1>
          <p className="text-xl mt-1 font-semibold" style={{ color: acc }}>{d.title}</p>
        </div>
        <Avatar data={d} size={90} />
      </div>

      <div className="max-w-5xl mx-auto px-8 py-10">
        {/* Intro */}
        <div className="grid md:grid-cols-3 gap-8 mb-12 pb-12" style={{ borderBottom:`2px solid ${dark?"#334155":"#e7e5e4"}` }}>
          <div className="md:col-span-2">
            <p className="text-lg leading-relaxed opacity-80 italic">{d.bio}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {d.location && <span className="text-sm opacity-60">📍 {d.location}</span>}
              {d.email    && <span className="text-sm opacity-60">✉ {d.email}</span>}
              {d.website  && <a href={d.website} target="_blank" rel="noopener noreferrer" className="text-sm" style={{ color: acc }}>🌐 Website</a>}
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest opacity-50 mb-3">Connect</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(socials).filter(([,v])=>v).map(([k,v]) => <SocialLink key={k} type={k} url={v} accent={acc} />)}
            </div>
          </div>
        </div>

        {/* Two col layout */}
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-12">
            {skills.length > 0 && (
              <div>
                <SectionTitle accent={acc} dark={dark}>Skills</SectionTitle>
                {skills.map((s,i) => <SkillBar key={i} skill={s} animType={anim.skills} dark={dark} />)}
              </div>
            )}
            {exp.length > 0 && (
              <div>
                <SectionTitle accent={acc} dark={dark}>Experience</SectionTitle>
                <div className="space-y-5">
                  {exp.map((e,i) => (
                    <div key={i} className="border-l-2 pl-4" style={{ borderColor: acc }}>
                      <p className="font-bold">{e.role}</p>
                      <p className="text-sm italic" style={{ color: acc }}>{e.company}</p>
                      <p className="text-xs opacity-60">{e.from}–{e.to||"Present"}</p>
                      <p className="text-sm mt-1 opacity-75">{e.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="space-y-12">
            {projs.length > 0 && (
              <div>
                <SectionTitle accent={acc} dark={dark}>Projects</SectionTitle>
                <div className="space-y-5">
                  {projs.map((p,i) => <ProjectCard key={i} project={p} accent={acc} dark={dark} animType={anim.cards} />)}
                </div>
              </div>
            )}
            {certs.length > 0 && (
              <div>
                <SectionTitle accent={acc} dark={dark}>Certificates</SectionTitle>
                <div className="space-y-3">
                  {certs.map((c,i) => <CertCard key={i} cert={c} accent={acc} dark={dark} />)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <p className="text-center pb-8 text-xs opacity-30">Made with CareerPatch</p>
    </div>
  );
}

  //  8. CARD — Card-based bento grid

export function CardTemplate({ data }) {
  const { d, dark, acc, bg, font, anim, skills, projs, certs, exp, socials } = wrap(data);
  const cardBg    = dark ? "#1e293b" : "#fff";
  const cardBorder = dark ? "#334155" : "#e2e8f0";

  return (
    <div style={{ background: dark?"#0f172a":"#f1f5f9", fontFamily: font, minHeight:"100vh", color: dark?"#e2e8f0":"#1e293b" }}>
      <div className="max-w-5xl mx-auto px-6 py-14">

        {/* Bento hero */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="col-span-2 rounded-3xl p-8 flex flex-col justify-between"
               style={{ background: acc, color:"#fff", minHeight:200 }}>
            <Avatar data={d} size={70} />
            <div>
              <h1 className="text-3xl font-black mt-4">{d.name}</h1>
              <p className="text-sm opacity-80">{d.title}</p>
            </div>
          </div>
          <div className="rounded-3xl p-6 flex flex-col justify-between border"
               style={{ background: cardBg, borderColor: cardBorder }}>
            <p className="text-xs uppercase tracking-wider opacity-50">About</p>
            <p className="text-sm mt-2 leading-relaxed opacity-75 line-clamp-6">{d.bio}</p>
          </div>
          <div className="rounded-3xl p-6 border flex flex-col gap-3" style={{ background: cardBg, borderColor: cardBorder }}>
            <p className="text-xs uppercase tracking-wider opacity-50">Connect</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(socials).filter(([,v])=>v).map(([k,v]) => <SocialLink key={k} type={k} url={v} accent={acc} />)}
            </div>
            {d.location && <p className="text-xs opacity-60 mt-auto">📍 {d.location}</p>}
          </div>
        </div>

        {/* Skills card */}
        {skills.length > 0 && (
          <div className="rounded-3xl p-8 border mb-6" style={{ background: cardBg, borderColor: cardBorder }}>
            <SectionTitle accent={acc} dark={dark}>Skills</SectionTitle>
            <div className="grid sm:grid-cols-2 gap-3">
              {skills.map((s,i) => <SkillBar key={i} skill={s} animType={anim.skills} dark={dark} />)}
            </div>
          </div>
        )}

        {/* Projects grid */}
        {projs.length > 0 && (
          <div className="mb-6">
            <SectionTitle accent={acc} dark={dark}>Projects</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projs.map((p,i) => <ProjectCard key={i} project={p} accent={acc} dark={dark} animType={anim.cards} />)}
            </div>
          </div>
        )}

        {/* Experience + Certs */}
        <div className="grid md:grid-cols-2 gap-6">
          {exp.length > 0 && (
            <div className="rounded-3xl p-8 border" style={{ background: cardBg, borderColor: cardBorder }}>
              <SectionTitle accent={acc} dark={dark}>Experience</SectionTitle>
              <div className="space-y-4">
                {exp.map((e,i) => (
                  <div key={i} className="border-l-2 pl-3" style={{ borderColor: acc }}>
                    <p className="font-bold text-sm">{e.role}</p>
                    <p className="text-xs" style={{ color: acc }}>{e.company}</p>
                    <p className="text-xs opacity-50">{e.from}–{e.to||"Now"}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {certs.length > 0 && (
            <div className="rounded-3xl p-8 border" style={{ background: cardBg, borderColor: cardBorder }}>
              <SectionTitle accent={acc} dark={dark}>Certificates</SectionTitle>
              <div className="space-y-3">
                {certs.map((c,i) => <CertCard key={i} cert={c} accent={acc} dark={dark} />)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


  //  9. GRADIENT — Full gradient immersive

export function GradientTemplate({ data }) {
  const { d, acc, font, anim, skills, projs, certs, exp, socials } = wrap(data);
  return (
    <div style={{ fontFamily: font, minHeight:"100vh", background:`linear-gradient(160deg, #0d1b2e 0%, ${acc}44 50%, #0d1520 100%)`, color:"#e2e8f0" }}>
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-14">
        <div className="text-center">
          <div className="inline-block p-1 rounded-full mb-5" style={{ background:`linear-gradient(135deg,${acc},${acc}55)` }}>
            <Avatar data={{ ...d, darkMode: true }} size={100} />
          </div>
          <h1 className="text-5xl font-black">{d.name}</h1>
          <p className="mt-2 text-xl opacity-70">{d.title}</p>
          <p className="mt-4 max-w-lg mx-auto text-sm opacity-60 leading-relaxed">{d.bio}</p>
          <div className="mt-5 flex justify-center gap-3">
            {Object.entries(socials).filter(([,v])=>v).map(([k,v]) => <SocialLink key={k} type={k} url={v} accent={acc} />)}
          </div>
        </div>

        {skills.length > 0 && (
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
            <SectionTitle accent={acc} dark={true}>Skills</SectionTitle>
            <div className="grid sm:grid-cols-2 gap-3">
              {skills.map((s,i) => <SkillBar key={i} skill={s} animType={anim.skills} dark={true} />)}
            </div>
          </div>
        )}

        {projs.length > 0 && (
          <div>
            <SectionTitle accent={acc} dark={true}>Projects</SectionTitle>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {projs.map((p,i) => <ProjectCard key={i} project={p} accent={acc} dark={true} animType={anim.cards} />)}
            </div>
          </div>
        )}

        {exp.length > 0 && (
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
            <SectionTitle accent={acc} dark={true}>Experience</SectionTitle>
            <div className="space-y-5">
              {exp.map((e,i) => (
                <div key={i} className="border-l-2 pl-4" style={{ borderColor: acc }}>
                  <p className="font-bold">{e.role} @ {e.company}</p>
                  <p className="text-xs opacity-50">{e.from}–{e.to||"Now"}</p>
                  <p className="text-sm opacity-70 mt-1">{e.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {certs.length > 0 && (
          <div>
            <SectionTitle accent={acc} dark={true}>Certificates</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              {certs.map((c,i) => <CertCard key={i} cert={c} accent={acc} dark={true} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


  //  10. RESUME — Traditional clean resume

export function ResumeTemplate({ data }) {
  const { d, dark, acc, font, anim, skills, projs, certs, exp, edu, socials } = wrap(data);
  return (
    <div style={{ background: dark?"#1e293b":"#fff", fontFamily: font, color: dark?"#e2e8f0":"#1e293b", minHeight:"100vh" }}>
      <div className="max-w-3xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="flex items-start gap-6 pb-8 mb-8" style={{ borderBottom: `3px solid ${acc}` }}>
          <Avatar data={d} size={80} />
          <div className="flex-1">
            <h1 className="text-4xl font-black">{d.name}</h1>
            <p className="text-lg mt-1 font-medium" style={{ color: acc }}>{d.title}</p>
            <div className="mt-2 flex flex-wrap gap-4 text-xs opacity-60">
              {d.email    && <span>✉ {d.email}</span>}
              {d.location && <span>📍 {d.location}</span>}
              {d.website  && <a href={d.website} target="_blank" rel="noopener noreferrer" style={{ color: acc }}>🌐 {d.website}</a>}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            {Object.entries(socials).filter(([,v])=>v).map(([k,v]) => <SocialLink key={k} type={k} url={v} accent={acc} />)}
          </div>
        </div>

        {d.bio && (
          <div className="mb-8">
            <h2 className="text-sm font-black uppercase tracking-widest mb-2" style={{ color: acc }}>Summary</h2>
            <p className="text-sm leading-relaxed opacity-80">{d.bio}</p>
          </div>
        )}

        {exp.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-black uppercase tracking-widest mb-4" style={{ color: acc }}>Experience</h2>
            <div className="space-y-5">
              {exp.map((e,i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline">
                    <p className="font-bold">{e.role}</p>
                    <p className="text-xs opacity-50">{e.from}–{e.to||"Present"}</p>
                  </div>
                  <p className="text-sm" style={{ color: acc }}>{e.company}</p>
                  <p className="text-sm mt-1 opacity-75">{e.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {edu.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-black uppercase tracking-widest mb-4" style={{ color: acc }}>Education</h2>
            <div className="space-y-3">
              {edu.map((e,i) => (
                <div key={i} className="flex justify-between">
                  <div>
                    <p className="font-bold">{e.degree}</p>
                    <p className="text-sm opacity-60">{e.school}</p>
                  </div>
                  <p className="text-xs opacity-50">{e.from}–{e.to||"Now"}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {skills.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-black uppercase tracking-widest mb-4" style={{ color: acc }}>Skills</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {skills.map((s,i) => <SkillBar key={i} skill={s} animType={anim.skills} dark={dark} />)}
            </div>
          </div>
        )}

        {projs.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-black uppercase tracking-widest mb-4" style={{ color: acc }}>Projects</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {projs.map((p,i) => <ProjectCard key={i} project={p} accent={acc} dark={dark} animType={anim.cards} />)}
            </div>
          </div>
        )}

        {certs.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-black uppercase tracking-widest mb-4" style={{ color: acc }}>Certificates</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {certs.map((c,i) => <CertCard key={i} cert={c} accent={acc} dark={dark} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


  //  11. BOLD — Large typography statement

export function BoldTemplate({ data }) {
  const { d, dark, acc, font, anim, skills, projs, certs, exp, socials } = wrap(data);
  return (
    <div style={{ background: dark?"#09090b":"#fafafa", fontFamily: font, color: dark?"#fafafa":"#09090b", minHeight:"100vh" }}>
      {/* Giant hero */}
      <div className="px-8 pt-20 pb-16 border-b-4" style={{ borderColor: acc }}>
        <p className="text-xs uppercase tracking-[0.3em] opacity-40 mb-4">Portfolio</p>
        <h1 className="text-6xl sm:text-8xl font-black leading-none tracking-tight">
          {d.name?.split(" ").map((w,i) => (
            <span key={i} style={{ color: i % 2 === 0 ? (dark?"#fafafa":"#09090b") : acc }}>{w} </span>
          ))}
        </h1>
        <p className="text-2xl mt-4 opacity-60 font-medium">{d.title}</p>
        <p className="mt-5 max-w-xl text-sm leading-relaxed opacity-60">{d.bio}</p>
        <div className="mt-6 flex gap-3 flex-wrap">
          {Object.entries(socials).filter(([,v])=>v).map(([k,v]) => <SocialLink key={k} type={k} url={v} accent={acc} />)}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-14 space-y-16">
        {skills.length > 0 && (
          <div>
            <SectionTitle accent={acc} dark={dark}>Skills</SectionTitle>
            <div className="grid sm:grid-cols-2 gap-3">
              {skills.map((s,i) => <SkillBar key={i} skill={s} animType={anim.skills} dark={dark} />)}
            </div>
          </div>
        )}
        {projs.length > 0 && (
          <div>
            <SectionTitle accent={acc} dark={dark}>Projects</SectionTitle>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projs.map((p,i) => <ProjectCard key={i} project={p} accent={acc} dark={dark} animType={anim.cards} />)}
            </div>
          </div>
        )}
        {exp.length > 0 && (
          <div>
            <SectionTitle accent={acc} dark={dark}>Experience</SectionTitle>
            <div className="grid sm:grid-cols-2 gap-5">
              {exp.map((e,i) => (
                <div key={i} className="p-6 rounded-2xl border" style={{ borderColor: dark?"#27272a":"#e4e4e7" }}>
                  <p className="text-2xl font-black" style={{ color: acc }}>{e.role}</p>
                  <p className="font-bold mt-1">{e.company}</p>
                  <p className="text-xs opacity-50 mt-1">{e.from}–{e.to||"Now"}</p>
                  <p className="text-sm mt-3 opacity-70">{e.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {certs.length > 0 && (
          <div>
            <SectionTitle accent={acc} dark={dark}>Certificates</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {certs.map((c,i) => <CertCard key={i} cert={c} accent={acc} dark={dark} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


  //  12. PASTEL — Soft pastel aesthetic

export function PastelTemplate({ data }) {
  const { d, dark, acc, font, anim, skills, projs, certs, exp, socials } = wrap(data);
  return (
    <div style={{ background: dark?"#1e1e2e":acc+"11", fontFamily: FONTS.rounded, color: dark?"#e2e8f0":"#1e293b", minHeight:"100vh" }}>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-center mb-14">
          <div className="w-32 h-32 rounded-3xl mx-auto mb-6 overflow-hidden shadow-lg" style={{ border:`4px solid ${acc}` }}>
            {d.avatar ? <img src={d.avatar} alt="" className="w-full h-full object-cover" /> : (
              <div className="w-full h-full flex items-center justify-center text-4xl font-black" style={{ background:`${acc}22`, color: acc }}>{initial(d.name)}</div>
            )}
          </div>
          <h1 className="text-4xl font-black">{d.name}</h1>
          <div className="inline-block mt-2 px-4 py-1 rounded-full text-sm font-bold" style={{ background:`${acc}22`, color: acc }}>{d.title}</div>
          <p className="mt-4 text-sm leading-relaxed opacity-70 max-w-md mx-auto">{d.bio}</p>
          <div className="mt-5 flex justify-center gap-2">
            {Object.entries(socials).filter(([,v])=>v).map(([k,v]) => <SocialLink key={k} type={k} url={v} accent={acc} />)}
          </div>
        </div>

        {skills.length > 0 && (
          <div className="rounded-3xl p-8 mb-8" style={{ background: dark?"#2a2a3e":`${acc}0d` }}>
            <SectionTitle accent={acc} dark={dark} align="center">Skills</SectionTitle>
            <div className="grid sm:grid-cols-2 gap-3">
              {skills.map((s,i) => <SkillBar key={i} skill={s} animType={anim.skills} dark={dark} />)}
            </div>
          </div>
        )}

        {projs.length > 0 && (
          <div className="mb-8">
            <SectionTitle accent={acc} dark={dark} align="center">Projects</SectionTitle>
            <div className="grid gap-5 sm:grid-cols-2">
              {projs.map((p,i) => <ProjectCard key={i} project={p} accent={acc} dark={dark} animType={anim.cards} />)}
            </div>
          </div>
        )}

        {exp.length > 0 && (
          <div className="rounded-3xl p-8 mb-8" style={{ background: dark?"#2a2a3e":`${acc}0d` }}>
            <SectionTitle accent={acc} dark={dark}>Experience</SectionTitle>
            {exp.map((e,i) => (
              <div key={i} className="mb-4 last:mb-0">
                <p className="font-bold">{e.role} <span style={{ color: acc }}>@ {e.company}</span></p>
                <p className="text-xs opacity-50">{e.from}–{e.to||"Present"}</p>
                <p className="text-sm mt-1 opacity-75">{e.desc}</p>
              </div>
            ))}
          </div>
        )}

        {certs.length > 0 && (
          <div className="mb-8">
            <SectionTitle accent={acc} dark={dark} align="center">Certificates</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              {certs.map((c,i) => <CertCard key={i} cert={c} accent={acc} dark={dark} />)}
            </div>
          </div>
        )}
        <p className="text-center text-xs opacity-30">Made with CareerPatch</p>
      </div>
    </div>
  );
}


  //  13. SPOTLIGHT — Dark with spotlight hero

export function SpotlightTemplate({ data }) {
  const { d, acc, font, anim, skills, projs, certs, exp, socials } = wrap(data);
  return (
    <div style={{ background:"#030712", fontFamily: font, color:"#f9fafb", minHeight:"100vh" }}>
      {/* Spotlight effect */}
      <div className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[120px] opacity-30 pointer-events-none"
             style={{ background: acc }} />
        <div className="relative z-10 text-center px-6 py-24">
          <Avatar data={{ ...d, darkMode: true }} size={110} />
          <h1 className="text-6xl font-black mt-6 tracking-tight">{d.name}</h1>
          <p className="text-xl mt-2 font-medium" style={{ color: acc }}>{d.title}</p>
          <p className="mt-5 max-w-lg mx-auto text-sm text-gray-400 leading-relaxed">{d.bio}</p>
          <div className="mt-6 flex justify-center gap-2 flex-wrap">
            {d.location && <span className="px-3 py-1 rounded-full text-xs bg-gray-800 text-gray-400">📍 {d.location}</span>}
            {d.email    && <span className="px-3 py-1 rounded-full text-xs bg-gray-800 text-gray-400">✉ {d.email}</span>}
          </div>
          <div className="mt-4 flex justify-center gap-3">
            {Object.entries(socials).filter(([,v])=>v).map(([k,v]) => <SocialLink key={k} type={k} url={v} accent={acc} />)}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-16 space-y-14">
        {skills.length > 0 && (
          <div className="rounded-3xl p-8 bg-gray-900/60 border border-gray-800">
            <SectionTitle accent={acc} dark={true}>Skills</SectionTitle>
            <div className="grid sm:grid-cols-2 gap-3">
              {skills.map((s,i) => <SkillBar key={i} skill={s} animType={anim.skills} dark={true} />)}
            </div>
          </div>
        )}
        {projs.length > 0 && (
          <div>
            <SectionTitle accent={acc} dark={true}>Projects</SectionTitle>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {projs.map((p,i) => <ProjectCard key={i} project={p} accent={acc} dark={true} animType={anim.cards} />)}
            </div>
          </div>
        )}
        {exp.length > 0 && (
          <div className="rounded-3xl p-8 bg-gray-900/60 border border-gray-800">
            <SectionTitle accent={acc} dark={true}>Experience</SectionTitle>
            <div className="space-y-5">
              {exp.map((e,i) => (
                <div key={i} className="border-l-2 pl-4" style={{ borderColor: acc }}>
                  <p className="font-bold text-white">{e.role} <span style={{ color: acc }}>@ {e.company}</span></p>
                  <p className="text-xs text-gray-500">{e.from}–{e.to||"Now"}</p>
                  <p className="text-sm text-gray-400 mt-1">{e.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {certs.length > 0 && (
          <div>
            <SectionTitle accent={acc} dark={true}>Certificates</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              {certs.map((c,i) => <CertCard key={i} cert={c} accent={acc} dark={true} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export const TEMPLATE_MAP = {
  minimal:   MinimalTemplate,
  creative:  CreativeTemplate,
  developer: DeveloperTemplate,
  glass:     GlassTemplate,
  sidebar:   SidebarTemplate,
  neon:      NeonTemplate,
  magazine:  MagazineTemplate,
  card:      CardTemplate,
  gradient:  GradientTemplate,
  resume:    ResumeTemplate,
  bold:      BoldTemplate,
  pastel:    PastelTemplate,
  spotlight: SpotlightTemplate,
};

export default function PortfolioRenderer({ data, template }) {
  if (!data) return null;
  const Component = TEMPLATE_MAP[template] || MinimalTemplate;
  return <Component data={data} />;
}