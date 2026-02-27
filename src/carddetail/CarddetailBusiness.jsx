import React, { useState } from 'react';
import ButtonComponent from '../components/button/ButtonComponent';
import { useDarkMode } from '../components/navbar/NavbarComponent';

export default function CardDetailBusiness() {
  const { darkMode } = useDarkMode();
  const [comment, setComment] = useState('');
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const bg = darkMode
    ? 'linear-gradient(160deg, #0d1b2e 0%, #0f2240 50%, #0d1520 100%)'
    : '#f0f4f8';
  const cardBg = darkMode ? '#0f2240' : '#ffffff';
  const cardBorder = darkMode ? '#1e3a5f' : '#e8f0fe';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-slate-400' : 'text-gray-500';
  const divider = darkMode ? '#1e3a5f' : '#e8f0fe';

  const skills = ['Java', 'Python', 'React', 'Node.js', 'MySQL', 'Design', 'Figma', 'Design', 'GitHub'];
  const tools = ['Visual Studio Code', 'Git', 'Local Servers', 'XAMPP', 'Basic Cloud Concepts'];

  const infoRows = [
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1E88E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
        </svg>
      ),
      label: 'Experience',
      value: 'Expert',
    },
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1E88E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
      label: 'Duration',
      value: '1–2 months',
    },
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1E88E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      ),
      label: 'Deadline',
      value: 'Mar 1, 2026',
    },
  ];

  return (
    <div
      className="min-h-screen w-full py-10 px-4 md:px-8 lg:px-16 transition-colors duration-300"
      style={{ fontFamily: "'Poppins', sans-serif", background: bg }}
    >
      <div className="max-w-[1100px] mx-auto flex flex-col lg:flex-row gap-6 items-start">

        {/* ── LEFT COLUMN ── */}
        <div className="w-full lg:w-[60%] flex flex-col gap-5">

          {/* Header card */}
          <div
            className="rounded-2xl p-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
            style={{ background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: '0 8px 32px rgba(30,136,229,0.07)' }}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#1E88E5] flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[11px] font-bold">ABA</span>
              </div>
              <div>
                <p className={`text-[13px] font-semibold ${textPrimary}`}>ABA Bank</p>
                <h1 className="text-[#1E88E5] text-[20px] md:text-[24px] font-bold leading-tight mt-1">
                  Junior Software Developer
                </h1>
                <div className={`flex flex-wrap items-center gap-3 mt-2 text-[12px] ${textSecondary}`}>
                  <span className="flex items-center gap-1">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    Phnom Penh (Khan Sek Sok.)
                  </span>
                  <span className="flex items-center gap-1">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    Posted 2 days ago
                  </span>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
              <ButtonComponent
                text={
                  <span className="flex items-center gap-2">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                    Message
                  </span>
                }
                onClick={() => console.log('Message clicked')}
              />
            </div>
          </div>

          {/* Description */}
          <div
            className="rounded-2xl p-6"
            style={{ background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: '0 8px 32px rgba(30,136,229,0.07)' }}
          >
            <h2 className={`text-[15px] font-bold mb-3 ${textPrimary}`}>Description</h2>
            <div className={`text-[13px] leading-6 ${textSecondary} space-y-3`}>
              <p>I am a motivated and detail-oriented Computer Science graduate with a strong foundation in software development, programming, and problem-solving. I specialize in building efficient, user-friendly applications and enjoy turning ideas into real, working solutions. I am passionate about using modern technologies to develop clean, scalable, and maintainable software that meets client needs.</p>
              <p>I am a fast learner, highly adaptable, and committed to delivering high-quality work on time. I am looking for freelance opportunities where I can contribute my skills, gain real-world experience, and help businesses grow through technology.</p>
            </div>
          </div>

          {/* Availability */}
          <div
            className="rounded-2xl p-6"
            style={{ background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: '0 8px 32px rgba(30,136,229,0.07)' }}
          >
            <h2 className={`text-[15px] font-bold mb-3 ${textPrimary}`}>Availability</h2>
            <p className={`text-[13px] leading-6 ${textSecondary}`}>
              Available for part-time freelance work (20–30 hours per week).<br />
              Ready to start immediately. Flexible with different time zones and able to respond to messages within a few hours.
            </p>
          </div>

          {/* Tools & Skills */}
          <div
            className="rounded-2xl p-6"
            style={{ background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: '0 8px 32px rgba(30,136,229,0.07)' }}
          >
            <div className="flex flex-col sm:flex-row gap-8">
              <div className="flex-1">
                <h2 className={`text-[15px] font-bold mb-3 ${textPrimary}`}>Tools & Technologies</h2>
                <ul className={`text-[13px] leading-7 ${textSecondary} space-y-1`}>
                  {tools.map((t, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#1E88E5] flex-shrink-0" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-1">
                <h2 className={`text-[15px] font-bold mb-3 ${textPrimary}`}>Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((s, i) => (
                    <span
                      key={i}
                      className="text-[12px] px-3 py-1 rounded-full font-medium"
                      style={{
                        background: darkMode ? 'rgba(30,136,229,0.12)' : '#e8f0fe',
                        color: darkMode ? '#90caf9' : '#1E88E5',
                        border: `1px solid ${darkMode ? '#1e3a5f' : '#bfdbfe'}`,
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="w-full lg:w-[40%] flex flex-col gap-5">

          {/* Project cost card */}
          <div
            className="rounded-2xl p-6"
            style={{ background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: '0 8px 32px rgba(30,136,229,0.07)' }}
          >
            {/* Price + bookmark */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-baseline gap-2">
                <span className={`text-[28px] font-extrabold ${textPrimary}`}>$1500</span>
                <span className={`text-[13px] ${textSecondary}`}>Project cost</span>
              </div>
              <button
                onClick={() => setLiked(!liked)}
                className="transition-colors duration-200"
                style={{ color: liked ? '#1E88E5' : darkMode ? '#475569' : '#d1d5db' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24"
                  fill={liked ? '#1E88E5' : 'none'}
                  stroke={liked ? '#1E88E5' : 'currentColor'}
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
            </div>

            {/* Info rows */}
            <div className="flex flex-col gap-3 mb-6">
              {infoRows.map((row, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{
                    background: darkMode ? 'rgba(30,136,229,0.08)' : '#f0f7ff',
                    border: `1px solid ${darkMode ? '#1e3a5f' : '#dbeafe'}`,
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: darkMode ? 'rgba(30,136,229,0.15)' : '#dbeafe' }}
                  >
                    {row.icon}
                  </div>
                  <div>
                    <p className={`text-[11px] ${textSecondary}`}>{row.label}</p>
                    <p className="text-[13px] font-semibold text-[#1E88E5]">{row.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Apply Now button — full width */}
            <button
              className="w-full py-3 rounded-xl text-white text-[14px] font-semibold transition-colors duration-200"
              style={{ background: '#1E88E5' }}
              onMouseEnter={e => e.currentTarget.style.background = '#2563EB'}
              onMouseLeave={e => e.currentTarget.style.background = '#1E88E5'}
            >
              Apply Now
            </button>
          </div>

          {/* Comments card */}
          <div
            className="rounded-2xl p-6"
            style={{ background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: '0 8px 32px rgba(30,136,229,0.07)' }}
          >
            {/* Existing comment */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {/* Avatar initials */}
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-[12px] font-bold text-white"
                    style={{ background: '#1E88E5' }}
                  >
                    EL
                  </div>
                  <span className={`text-[13px] font-semibold ${textPrimary}`}>Eung Lizuia</span>
                </div>
                <span className={`text-[11px] ${textSecondary}`}>2 hours ago</span>
              </div>
              <span
                className="inline-block text-[13px] font-medium px-4 py-1.5 rounded-full"
                style={{
                  background: darkMode ? 'rgba(30,136,229,0.12)' : '#e8f0fe',
                  color: darkMode ? '#90caf9' : '#1E88E5',
                }}
              >
                So amazing
              </span>
            </div>

            {/* Divider */}
            <div className="w-full h-px mb-4" style={{ background: divider }} />

            {/* Write comment */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Write a comment..."
                className={`flex-1 text-[13px] px-4 py-2.5 rounded-xl outline-none ${textPrimary}`}
                style={{
                  background: darkMode ? 'rgba(255,255,255,0.05)' : '#f8fafc',
                  border: `1px solid ${darkMode ? '#1e3a5f' : '#e8f0fe'}`,
                  fontFamily: "'Poppins', sans-serif",
                }}
              />
              <button
                className="px-5 py-2.5 rounded-xl text-white text-[13px] font-semibold transition-colors duration-200"
                style={{ background: '#1E88E5' }}
                onMouseEnter={e => e.currentTarget.style.background = '#2563EB'}
                onMouseLeave={e => e.currentTarget.style.background = '#1E88E5'}
                onClick={() => setComment('')}
              >
                Post
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}