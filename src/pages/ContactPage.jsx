
import { useMemo, useState } from "react";
import emailjs from "@emailjs/browser";

const faqItems = [
  { question: "How do I submit a proposal?",  answer: 'Open the job details page and click "Submit Proposal".' },
  { question: "Why is my account restricted?", answer: "Check your email or contact support for verification issues." },
  { question: "How do I report a scam job?",  answer: 'Click "Report Job" on the job detail page.' },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", company: "", message: "" });
  const [status,   setStatus]   = useState({ state: "idle", msg: "" });

  const canSend = useMemo(() =>
    formData.name.trim().length > 0 &&
    formData.email.trim().length > 0 &&
    formData.message.trim().length > 0 &&
    status.state !== "sending",
  [formData, status.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSend) return;
    try {
      setStatus({ state: "sending", msg: "" });
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE,
        import.meta.env.VITE_EMAILJS_TEMPLATE,
        { name: formData.name, from_email: formData.email, company: formData.company, message: formData.message, reply_to: formData.email },
        import.meta.env.VITE_EMAILJS_PUBLIC
      );
      setStatus({ state: "success", msg: "Message sent successfully!" });
      setFormData({ name: "", email: "", company: "", message: "" });
      setTimeout(() => setStatus({ state: "idle", msg: "" }), 3000);
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus({ state: "error", msg: "Failed to send. Please try again." });
    }
  };

  /* ── Input shared classes ─────────────────────────────────────────────── */
  const inputCls = `
    w-full px-3 py-2.5 rounded-xl text-sm outline-none transition
    border border-slate-200 dark:border-slate-700
    bg-white/80 dark:bg-[#0f172a]
    text-slate-800 dark:text-white
    placeholder:text-slate-400 dark:placeholder:text-slate-600
    focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600
    backdrop-blur-sm
  `;

  /* ── Card shared classes — matches About page GlassCard ──────────────── */
  const cardCls = `
    rounded-2xl border shadow-sm transition-colors
    bg-white/80 dark:bg-[#1e293b]/80
    backdrop-blur-md
    border-slate-200 dark:border-slate-700/60
  `;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f172a] px-4 py-12 transition-colors duration-300">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto text-center mb-10">
        <span className="inline-flex items-center gap-2 rounded-full
                         bg-blue-50 dark:bg-blue-900/30
                         border border-blue-200 dark:border-blue-700
                         px-4 py-1.5 text-xs font-semibold
                         text-[#1A73E8] dark:text-blue-400 mb-4">
          <span className="w-2 h-2 rounded-full bg-[#1A73E8] dark:bg-blue-400 animate-pulse" />
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Contact us
        </h1>
        <p className="mt-3 text-slate-500 dark:text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Have questions? Send us a message and we'll respond as soon as possible.
        </p>
      </div>

      {/* ── Layout ────────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

        {/* ── LEFT — Contact Form ────────────────────────────────────────── */}
        <div className={`${cardCls} p-6 sm:p-8`}>

          {/* Card header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 dark:bg-blue-500 flex items-center justify-center shrink-0 shadow-sm">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3v-3z" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-slate-900 dark:text-white text-sm">Send us a Message</p>
              <p className="text-slate-400 dark:text-slate-500 text-xs">We'll get back to you soon</p>
            </div>
          </div>

          {/* Alerts */}
          {status.state === "success" && (
            <div className="mb-4 rounded-xl border border-emerald-200 dark:border-emerald-800/60
                            bg-emerald-50 dark:bg-emerald-900/20
                            text-emerald-700 dark:text-emerald-400 px-4 py-3 text-sm">
              {status.msg}
            </div>
          )}
          {status.state === "error" && (
            <div className="mb-4 rounded-xl border border-red-200 dark:border-red-800/60
                            bg-red-50 dark:bg-red-900/20
                            text-red-700 dark:text-red-400 px-4 py-3 text-sm">
              {status.msg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Name">
                <input type="text" name="name" value={formData.name} onChange={handleChange}
                  placeholder="John Smith" required className={inputCls} />
              </Field>
              <Field label="Email">
                <input type="email" name="email" value={formData.email} onChange={handleChange}
                  placeholder="johnsmith@gmail.com" required className={inputCls} />
              </Field>
            </div>

            <Field label="Company (optional)">
              <input type="text" name="company" value={formData.company} onChange={handleChange}
                placeholder="Your company name" className={inputCls} />
            </Field>

            <Field label="Message">
              <textarea name="message" value={formData.message} onChange={handleChange}
                placeholder="Write your message..." rows={5} required
                className={`${inputCls} resize-none`} />
            </Field>

            <button type="submit" disabled={!canSend}
              className="w-full flex items-center justify-center gap-2
                         bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600
                         text-white font-semibold text-sm py-3 rounded-xl transition-all
                         shadow-sm hover:shadow-md
                         disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed">
              {status.state === "sending" ? (
                <><Spinner /> Sending...</>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Send Message
                </>
              )}
            </button>

            <p className="text-xs text-slate-400 dark:text-slate-600 text-center">
              We'll reply to your email as soon as possible.
            </p>
          </form>
        </div>

        {/* ── RIGHT — Map + FAQ + Info ───────────────────────────────────── */}
        <div className="flex flex-col gap-6">

          {/* Map */}
          <div className={`${cardCls} overflow-hidden`}>
            <div className="h-[220px] sm:h-[260px]">
              <iframe
                title="Office Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3908.539033768917!2d104.90362862970343!3d11.58486710878801!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310951e96d257a6f%3A0x6b66703c5fc0c7cc!2sScience%20and%20Technology%20Advanced%20Development%20Co.%2C%20Ltd.!5e0!3m2!1sen!2skh!4v1772535647140!5m2!1sen!2skh"
                width="100%" height="100%"
                style={{ border: 0 }}
                allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* FAQ */}
          <div className={`${cardCls} p-6 sm:p-7`}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-2xl bg-emerald-500 dark:bg-emerald-600 flex items-center justify-center shrink-0 shadow-sm">
                <span className="text-white font-extrabold text-sm">?</span>
              </div>
              <p className="font-semibold text-slate-900 dark:text-white">Quick Answer</p>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {faqItems.map((item, idx) => (
                <div key={idx} className="py-4 first:pt-0 last:pb-0">
                  <p className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
                    {item.question}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Info */}
          <div className={`${cardCls} p-6`}>
            <p className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Contact</p>
            <div className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400 shrink-0" />
                Email: ratanakcoding.it@gmail.com
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 shrink-0" />
                Response time: 24–48 hours
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}

function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}