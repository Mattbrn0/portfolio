import "./App.css";
import LaserFlow from "./components/LaserFlow";
import Dither from "./components/Dither";
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";
import photoDeProfil from "./assets/photo-de-profil.PNG";
import { useState } from "react";

function App() {
  const [formStatus, setFormStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") || "";
    const email = formData.get("email") || "";
    const message = formData.get("message") || "";

    // UI optimiste : on affiche le succès et on reset directement
    e.currentTarget.reset();
    setFormStatus({
      type: "success",
      message: "Votre message a bien été envoyé.",
    });

    // Envoi en arrière-plan, sans impacter le message affiché
    fetch("https://formsubmit.co/ajax/mbricman3@gmail.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        message,
        _subject: "Nouvelle demande de contact depuis le portfolio",
      }),
    }).catch(() => {
      // On ignore l'erreur côté UI, au pire tu verras dans ta boîte mail
      // que le message n'est pas arrivé.
      // console.error("Erreur lors de l'envoi du formulaire", error);
    }).finally(() => {
      setIsSubmitting(false);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-slate-900 text-slate-50">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-6 md:py-8">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 overflow-hidden rounded-full ring-2 ring-fuchsia-400/80 shadow-[0_0_25px_rgba(236,72,153,0.7)]">
              <img
                src={photoDeProfil}
                alt="Photo de profil de Bricman Mathis"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-100">
                Bricman Mathis
              </p>
              <p className="text-xs text-slate-400">
                Développeur Full Stack
              </p>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-xs font-medium text-slate-300 md:flex">
            <a href="#projets" className="hover:text-fuchsia-300 transition-colors">
              Projets
            </a>
            <a href="#a-propos" className="hover:text-fuchsia-300 transition-colors">
              À propos
            </a>
            <a href="#contact" className="hover:text-fuchsia-300 transition-colors">
              Contact
            </a>
          </nav>

          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full border border-fuchsia-500/70 bg-fuchsia-500/10 px-4 py-2 text-xs font-semibold text-fuchsia-100 shadow-[0_0_24px_rgba(236,72,153,0.55)] transition-colors hover:bg-fuchsia-500/20"
          >
            Me contacter
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </header>

        <main className="mt-10 flex-1 space-y-24 pb-10 md:mt-16">
          {/* Hero */}
          <section
            id="accueil"
            className="grid items-center gap-10 md:gap-14 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]"
          >
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/70 px-3 py-1 text-[11px] text-slate-300 backdrop-blur">
                <span className="relative inline-flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-fuchsia-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-fuchsia-400" />
                </span>
                Disponible pour de nouveaux projets
              </div>

              <h1 className="text-balance text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl md:text-5xl">
                Je conçois des expériences web
                <span className="bg-gradient-to-r from-fuchsia-400 via-sky-300 to-violet-400 bg-clip-text text-transparent">
                  {" "}
                  modernes, fluides
                </span>{" "}
                et immersives.
              </h1>

              <p className="max-w-xl text-sm leading-relaxed text-slate-300 md:text-[15px]">
                Développeur front-end passionné par les interfaces élégantes,
                les animations soignées et les performances. J&apos;aime transformer
                des idées en produits numériques concrets, performants et accessibles.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="#projets"
                  className="inline-flex items-center gap-2 rounded-full bg-fuchsia-500 px-4 py-2 text-xs font-semibold text-fuchsia-50 shadow-[0_20px_40px_rgba(236,72,153,0.45)] transition hover:bg-fuchsia-500/90"
                >
                  Voir mes projets
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>

                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="h-px w-8 bg-slate-700" />
                  <span>React, Tailwind, html, css, javascript, php, mysql</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-4 text-[11px] text-slate-300">
                <span className="rounded-full border border-slate-700/70 bg-slate-900/60 px-3 py-1">
                  +1 ans d&apos;expérience
                </span>
                <span className="rounded-full border border-slate-700/70 bg-slate-900/60 px-3 py-1">
                  Freelance & missions
                </span>
                <span className="rounded-full border border-slate-700/70 bg-slate-900/60 px-3 py-1">
                  UI/UX & prototypage
                </span>
              </div>
            </div>

            <div className="relative h-[320px] md:h-[420px] lg:h-[500px]">
              <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-tr from-fuchsia-500/35 via-sky-500/25 to-violet-500/35 blur-3xl opacity-70" />
              <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-fuchsia-500/30 bg-black/80 shadow-[0_0_80px_rgba(236,72,153,0.45)]">
                <div className="relative flex-1">
                  <Dither
                    waveColor={[0.74, 0.48, 1.0]}
                    disableAnimation={false}
                    enableMouseInteraction
                    mouseRadius={0.3}
                    colorNum={4}
                    waveAmplitude={0.3}
                    waveFrequency={3}
                    waveSpeed={0.05}
                  />
                </div>
                {/* <div className="border-t border-fuchsia-500/20 bg-gradient-to-r from-fuchsia-500/10 via-sky-500/10 to-violet-500/10 px-4 py-3 text-[11px] text-slate-200">
                  <p className="font-medium text-slate-100">
                    Mer de pixels réactive
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-300">
                    Ondes granulaires interactives inspirées du dithering rétro, en
                    harmonie avec l&apos;univers néon du portfolio.
                  </p>
                </div> */}
              </div>
            </div>
          </section>

          {/* Projets */}
          <section id="projets" className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-slate-50 md:text-xl">
                  Projets récents :
                </h2>
                <p className="text-xs text-slate-400 md:text-[13px]">
                  Voici quelques projets récents que j'ai réalisés.
                </p>
              </div>
              <span className="hidden rounded-full border border-slate-700/70 bg-slate-900/60 px-3 py-1 text-[11px] text-slate-300 md:inline-flex">
                Front-end · UI/UX · Interactions
              </span>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <article className="group relative overflow-hidden rounded-2xl border border-slate-800/80 bg-gradient-to-br from-slate-900/90 via-slate-950 to-slate-950/90 p-5 shadow-[0_22px_45px_rgba(15,23,42,0.9)] transition hover:border-fuchsia-500/60 hover:shadow-[0_26px_60px_rgba(236,72,153,0.45)]">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-slate-50 md:text-[15px]">
                      Convertisseur de PDF à Excel
                    </h3>
                    <p className="text-xs leading-relaxed text-slate-300">
                      Outil pour convertir des factures PDF en fichiers Excel :
                      extraction des données et export structuré.
                    </p>
                  </div>
                  <span className="rounded-full bg-fuchsia-500/10 px-2.5 py-1 text-[10px] font-medium text-fuchsia-200 border border-fuchsia-500/40">
                    #1
                  </span>
                </div>

                <a
                  href="http://135.125.102.27:5173/"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-medium text-fuchsia-300 hover:text-fuchsia-200 transition-colors"
                >
                  Accéder au convertisseur
                  <ArrowRight className="h-3 w-3" />
                </a>

                <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-slate-300">
                  <span className="rounded-full bg-slate-900/80 px-2.5 py-1 border border-slate-700/70">
                    React
                  </span>
                  <span className="rounded-full bg-slate-900/80 px-2.5 py-1 border border-slate-700/70">
                    Javascript
                  </span>
                  <span className="rounded-full bg-slate-900/80 px-2.5 py-1 border border-slate-700/70">
                    HTML & CSS
                  </span>
                </div>
              </article>

              {/* <article className="group relative overflow-hidden rounded-2xl border border-slate-800/80 bg-gradient-to-br from-slate-900/90 via-slate-950 to-slate-950/90 p-5 shadow-[0_22px_45px_rgba(15,23,42,0.9)] transition hover:border-sky-400/70 hover:shadow-[0_26px_60px_rgba(56,189,248,0.5)]">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-slate-50 md:text-[15px]">
                      Portfolio immersif 3D
                    </h3>
                    <p className="text-xs leading-relaxed text-slate-300">
                      Expérience portfolio avec éléments 3D légers, survols
                      interactifs et transitions en douceur entre les sections.
                    </p>
                  </div>
                  <span className="rounded-full bg-sky-500/10 px-2.5 py-1 text-[10px] font-medium text-sky-200 border border-sky-400/60">
                    3D & motion
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-slate-300">
                  <span className="rounded-full bg-slate-900/80 px-2.5 py-1 border border-slate-700/70">
                    React Three
                  </span>
                  <span className="rounded-full bg-slate-900/80 px-2.5 py-1 border border-slate-700/70">
                    WebGL
                  </span>
                  <span className="rounded-full bg-slate-900/80 px-2.5 py-1 border border-slate-700/70">
                    Design système
                  </span>
                </div>
              </article> */}
            </div>
          </section>

          {/* À propos & compétences */}
          <section
            id="a-propos"
            className="grid gap-8 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]"
          >
            <div className="space-y-4">
              <h2 className="text-lg font-semibold tracking-tight text-slate-50 md:text-xl">
                À propos
              </h2>
              <p className="text-sm leading-relaxed text-slate-300 md:text-[15px]">
              Développeur web diplômé d’une licence en développement web, je suis passionné par la création d’applications modernes, performantes et bien structurées. J’ai acquis une première expérience professionnelle d’un an en entreprise, durant laquelle j’ai travaillé sur le développement et l’amélioration de projets web concrets.
              </p>
              <p className="text-sm leading-relaxed text-slate-300 md:text-[15px]">
              J’apprécie particulièrement transformer une idée en produit fonctionnel : concevoir des interfaces claires, développer des fonctionnalités utiles et mettre en place des architectures solides côté backend.

              </p>
            </div>

            <div className="space-y-4 rounded-2xl border border-slate-800/80 bg-slate-950/80 p-5 shadow-[0_22px_45px_rgba(15,23,42,0.9)]">
              <h3 className="text-sm font-semibold text-slate-50">
                Compétences clés
              </h3>
              <div className="grid grid-cols-2 gap-3 text-[11px] text-slate-200">
                <div className="space-y-1 rounded-xl bg-slate-900/80 p-3 border border-slate-800">
                  <p className="text-[11px] font-semibold text-slate-100">
                    Front-end
                  </p>
                  <p className="text-[11px] text-slate-400">
                    React, TypeScript, Tailwind, Next.js
                  </p>
                </div>
                <div className="space-y-1 rounded-xl bg-slate-900/80 p-3 border border-slate-800">
                  <p className="text-[11px] font-semibold text-slate-100">
                    Design
                  </p>
                  <p className="text-[11px] text-slate-400">
                    UI/UX, design system, prototypage
                  </p>
                </div>
                <div className="space-y-1 rounded-xl bg-slate-900/80 p-3 border border-slate-800">
                  <p className="text-[11px] font-semibold text-slate-100">
                    Back-end
                  </p>
                  <p className="text-[11px] text-slate-400">
                    PHP, MySQL, JavaScript
                  </p>
                </div>
                <div className="space-y-1 rounded-xl bg-slate-900/80 p-3 border border-slate-800">
                  <p className="text-[11px] font-semibold text-slate-100">
                    Qualité
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Accessibilité, performance, responsive
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section
            id="contact"
            className="grid gap-8 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]"
          >
            <div className="space-y-4">
              <h2 className="text-lg font-semibold tracking-tight text-slate-50 md:text-xl">
                Parlons de ton projet
              </h2>
              <p className="text-sm leading-relaxed text-slate-300 md:text-[15px]">
                Tu as une idée, une refonte en tête ou simplement envie de discuter ?
                Décris ton besoin en quelques phrases et je te répondrai avec des
                premières pistes rapidement.
              </p>

              <form
                className="mt-4 space-y-3 rounded-2xl border border-slate-800/80 bg-slate-950/80 p-5 shadow-[0_22px_45px_rgba(15,23,42,0.9)]"
                onSubmit={handleSubmit}
              >
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-1.5 text-xs">
                    <label className="text-slate-300" htmlFor="name">
                      Nom
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Ton nom complet"
                      className="h-9 w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3 text-xs text-slate-100 outline-none ring-0 placeholder:text-slate-500 focus:border-fuchsia-500/70 focus:ring-1 focus:ring-fuchsia-500/70"
                    />
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <label className="text-slate-300" htmlFor="email">
                      E-mail
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="ton@email.com"
                      className="h-9 w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3 text-xs text-slate-100 outline-none ring-0 placeholder:text-slate-500 focus:border-fuchsia-500/70 focus:ring-1 focus:ring-fuchsia-500/70"
                    />
                  </div>
                </div>
                <div className="space-y-1.5 text-xs">
                  <label className="text-slate-300" htmlFor="message">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="Parle-moi de ton projet, de ton contexte, de tes objectifs..."
                    className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2 text-xs text-slate-100 outline-none ring-0 placeholder:text-slate-500 focus:border-fuchsia-500/70 focus:ring-1 focus:ring-fuchsia-500/70"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-fuchsia-500 px-4 py-2 text-xs font-semibold text-fuchsia-50 shadow-[0_18px_38px_rgba(236,72,153,0.5)] transition hover:bg-fuchsia-500/90 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
                {formStatus && (
                  <p
                    className={`text-[11px] ${
                      formStatus.type === "success"
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >
                    {formStatus.message}
                  </p>
                )}
              </form>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-800/80 bg-slate-950/80 p-5 shadow-[0_22px_45px_rgba(15,23,42,0.9)]">
                <h3 className="text-sm font-semibold text-slate-50">
                  Contact direct
                </h3>
                <p className="mt-2 text-xs text-slate-300">
                  Voici mes moyens de me contacter :
                </p>

                <div className="mt-4 space-y-2 text-xs">
                  <a
                    href="mailto:mbricman3@gmail.com"
                    className="flex items-center gap-2 rounded-lg border border-slate-800/80 bg-slate-900/70 px-3 py-2 text-slate-200 transition hover:border-fuchsia-500/60 hover:bg-slate-900/90"
                  >
                    <Mail className="h-3.5 w-3.5 text-fuchsia-300" />
                    <span>mbricman3@gmail.com</span>
                  </a>
                  <a
                    href="https://github.com/Mattbrn0"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-lg border border-slate-800/80 bg-slate-900/70 px-3 py-2 text-slate-200 transition hover:border-slate-500/80 hover:bg-slate-900/90"
                  >
                    <Github className="h-3.5 w-3.5 text-slate-200" />
                    <span>@Mattbrn0</span>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/mathis-bricman-860a4a250/"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-lg border border-slate-800/80 bg-slate-900/70 px-3 py-2 text-slate-200 transition hover:border-sky-400/70 hover:bg-slate-900/90"
                  >
                    <Linkedin className="h-3.5 w-3.5 text-sky-300" />
                    <span>Bricman Mathis</span>
                  </a>
                </div>

                <div className="mt-5 border-t border-slate-800/80 pt-4">
                  <p className="text-[11px] font-medium text-slate-400 mb-3">
                    Langages & outils
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href="https://react.dev"
                      target="_blank"
                      rel="noreferrer"
                      className="flex flex-col items-center gap-1 rounded-lg border border-slate-800/80 bg-slate-900/60 p-2 transition hover:border-sky-400/50 hover:bg-slate-900/80"
                      title="React"
                    >
                      <img
                        src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
                        alt="React"
                        className="h-6 w-6"
                      />
                      <span className="text-[10px] text-slate-400">React</span>
                    </a>
                    <a
                      href="https://tailwindcss.com"
                      target="_blank"
                      rel="noreferrer"
                      className="flex flex-col items-center gap-1 rounded-lg border border-slate-800/80 bg-slate-900/60 p-2 transition hover:border-sky-400/50 hover:bg-slate-900/80"
                      title="Tailwind"
                    >
                      <img
                        src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg"
                        alt="Tailwind CSS"
                        className="h-6 w-6"
                      />
                      <span className="text-[10px] text-slate-400">Tailwind</span>
                    </a>
                    <a
                      href="https://developer.mozilla.org/docs/Web/HTML"
                      target="_blank"
                      rel="noreferrer"
                      className="flex flex-col items-center gap-1 rounded-lg border border-slate-800/80 bg-slate-900/60 p-2 transition hover:border-orange-400/50 hover:bg-slate-900/80"
                      title="HTML"
                    >
                      <img
                        src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg"
                        alt="HTML5"
                        className="h-6 w-6"
                      />
                      <span className="text-[10px] text-slate-400">HTML</span>
                    </a>
                    <a
                      href="https://developer.mozilla.org/docs/Web/CSS"
                      target="_blank"
                      rel="noreferrer"
                      className="flex flex-col items-center gap-1 rounded-lg border border-slate-800/80 bg-slate-900/60 p-2 transition hover:border-blue-400/50 hover:bg-slate-900/80"
                      title="CSS"
                    >
                      <img
                        src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg"
                        alt="CSS3"
                        className="h-6 w-6"
                      />
                      <span className="text-[10px] text-slate-400">CSS</span>
                    </a>
                    <a
                      href="https://developer.mozilla.org/docs/Web/JavaScript"
                      target="_blank"
                      rel="noreferrer"
                      className="flex flex-col items-center gap-1 rounded-lg border border-slate-800/80 bg-slate-900/60 p-2 transition hover:border-yellow-400/50 hover:bg-slate-900/80"
                      title="JavaScript"
                    >
                      <img
                        src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg"
                        alt="JavaScript"
                        className="h-6 w-6"
                      />
                      <span className="text-[10px] text-slate-400">JavaScript</span>
                    </a>
                    <a
                      href="https://www.php.net"
                      target="_blank"
                      rel="noreferrer"
                      className="flex flex-col items-center gap-1 rounded-lg border border-slate-800/80 bg-slate-900/60 p-2 transition hover:border-indigo-400/50 hover:bg-slate-900/80"
                      title="PHP"
                    >
                      <img
                        src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg"
                        alt="PHP"
                        className="h-6 w-6"
                      />
                      <span className="text-[10px] text-slate-400">PHP</span>
                    </a>
                    <a
                      href="https://www.mysql.com"
                      target="_blank"
                      rel="noreferrer"
                      className="flex flex-col items-center gap-1 rounded-lg border border-slate-800/80 bg-slate-900/60 p-2 transition hover:border-blue-400/50 hover:bg-slate-900/80"
                      title="MySQL"
                    >
                      <img
                        src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg"
                        alt="MySQL"
                        className="h-6 w-6"
                      />
                      <span className="text-[10px] text-slate-400">MySQL</span>
                    </a>
                   
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="mt-8 border-t border-slate-800/70 pt-4 text-[11px] text-slate-500 md:mt-10 md:pt-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p>
              © {new Date().getFullYear()} Bricman Mathis. Portfolio
            </p>
            <div className="flex items-center gap-3">
              <span className="h-px w-6 bg-slate-700" />
              <p>Construit avec React, Tailwind & Three.js.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
