import { useEffect, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Atom,
  BrainCircuit,
  ChevronDown,
  Cpu,
  ExternalLink,
  Instagram,
  Mail,
  Menu,
  Network,
  Phone,
  Play,
  Radio,
  Sparkles,
  Trophy,
  Users,
  X,
  Youtube,
} from "lucide-react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { trpc } from "@/lib/trpc";

const navItems = [
  ["HOME", "home"],
  ["ABOUT US", "about"],
  ["EVENTS", "events"],
  ["TOPPERS", "toppers"],
  ["FACULTY", "teachers"],
  ["ACHIEVEMENTS", "achievements"],
  ["ALUMNI", "alumni"],
  ["CONTACT", "contact"],
] as const;

const upcomingEvents = [
  ["Workshop on Arduino & IoT", "04 Sept 2026"],
  ["Expert Talk on AI & ML", "25 Oct 2026"],
  ["Industrial Visit", "15 Nov 2026"],
];

const pastEvents = [
  ["Tech Talk on Cyber Security", "10 May 2026"],
  ["PCB Designing Workshop", "20 April 2026"],
  ["Intercollegiate Tech Fest", "12 March 2026"],
];

const achievements = [
  "Runner-up in Techfest",
  "Best Project Award",
  "First Prize in Poster Presentation",
  "Winner in Quiz Competition",
];

const toppers = [
  ["1st Year PG", "Jayadev", "9.45", "J"],
  ["1st Year UG", "Arun Roy", "9.27", "A"],
  ["2nd Year UG", "Karthik Sanil", "9.18", "K"],
];

const teachers = [
  ["Dr. Praveen N", "Principal", "PN"],
  ["Mr . Sunil Kumar K V", "Head of Department", "SK"],
  ["Dr.SARITHA.M", "Assistant Professor", "SM"],
  ["Dr.REKHA.T.K", "Assistant Professor", "RT"],
  ["Dr.REJI.A.P", "Assistant Professor", "RA"],
  ["Mr . Ananthasankar U A", "Assistant Professor", "AU"],
  ["Mrs. Sonia Babu", "Assistant Professor", "SB"],
  ["Ms. Aneesha Shaji", "Assistant Professor", "AS"],
];

const alumni = [
  ["Arun Kumar", "2022", "Software Developer"],
  ["Meera S.", "2023", "Electronics Engineer"],
  ["Rahul P.", "2024", "System Engineer"],
];

const gallery = [
  ["event1.jpg", "Department Event", "FIELD NOTES / 01", "gallery-cyan"],
  ["event2.jpg", "Workshop", "WORKSHOP / 02", "gallery-amber"],
  ["event3.jpg", "Students", "STUDENT LIFE / 03", "gallery-violet"],
];

function BrandMark() {
  return (
    <div className="brand-mark" aria-label="NSS College Rajakumari logo">
      <span className="brand-mark-core"><Cpu size={18} strokeWidth={2.4} /></span>
      <span className="brand-mark-orbit brand-mark-orbit-a" />
      <span className="brand-mark-orbit brand-mark-orbit-b" />
    </div>
  );
}

function SectionLabel({ eyebrow, number }: { eyebrow: string; number: string }) {
  return (
    <div className="section-label reveal">
      <span className="section-number">{number}</span>
      <span>{eyebrow}</span>
      <span className="section-label-line" />
    </div>
  );
}

function ScrollReveal() {
  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 },
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);
  return null;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smoothScroll = useSpring(scrollYProgress, { stiffness: 80, damping: 22, mass: 0.7 });
  const orbitRotation = useTransform(smoothScroll, [0, 0.55], [0, 135]);
  const orbitDrift = useTransform(smoothScroll, [0, 1], [0, 120]);
  const { data: liveContent } = trpc.content.list.useQuery();

  const hasLiveContent = Boolean(liveContent?.length);
  const liveEvents = liveContent?.filter(item => item.type === "event") ?? [];
  const liveAchievements = liveContent?.filter(item => item.type === "achievement") ?? [];
  const liveToppers = liveContent?.filter(item => item.type === "topper") ?? [];
  const liveTeachers = liveContent?.filter(item => item.type === "faculty") ?? [];
  const liveAlumni = liveContent?.filter(item => item.type === "alumni") ?? [];
  const liveGallery = liveContent?.filter(item => item.type === "gallery") ?? [];
  const upcomingEventItems = hasLiveContent ? liveEvents.filter(item => item.sectionGroup !== "past").map(item => [item.title, item.dateLabel ?? ""]) : upcomingEvents;
  const pastEventItems = hasLiveContent ? liveEvents.filter(item => item.sectionGroup === "past").map(item => [item.title, item.dateLabel ?? ""]) : pastEvents;
  const achievementItems = hasLiveContent ? liveAchievements.map(item => item.title) : achievements;
  const topperItems = hasLiveContent ? liveToppers.map(item => [item.title, item.subtitle ?? "", item.detail ?? "", item.color || item.subtitle?.charAt(0) || "E"]) : toppers;
  const teacherItems = hasLiveContent ? liveTeachers.map(item => [item.title, item.subtitle ?? "", item.detail || item.title.slice(0, 2).toUpperCase()]) : teachers;
  const alumniItems = hasLiveContent ? liveAlumni.map(item => [item.title, item.detail ?? "", item.subtitle ?? ""]) : alumni;
  const galleryItems = hasLiveContent ? liveGallery.map(item => [item.imageUrl || item.title, item.title, item.subtitle || "FIELD NOTES", item.color || "gallery-cyan"]) : gallery;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="site-shell" id="home">
      <ScrollReveal />
      <div className="noise" />
      <motion.header className={`site-header ${scrolled ? "site-header-scrolled" : ""}`} initial={reducedMotion ? false : { y: -76, opacity: 0 }} animate={reducedMotion ? undefined : { y: 0, opacity: 1 }} transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}>
        <a className="header-brand" href="#home" onClick={closeMenu}>
          <BrandMark />
          <span className="header-brand-copy">
            <strong>NSS / ECT</strong>
            <small>RAJAKUMARI</small>
          </span>
        </a>
        <div className="header-utility">
          <span>Email: ect@nssraj.ac.in</span><span>Phone: +91 4868 273203</span><span>Follow Us: Facebook | Instagram | YouTube</span>
        </div>
        <nav className={`main-nav ${menuOpen ? "main-nav-open" : ""}`} aria-label="Primary navigation">
          {navItems.map(([label, id]) => (
            <a href={`#${id}`} key={id} onClick={closeMenu}>
              {label}
            </a>
          ))}
        </nav>
        <a className="header-admin-link" href="/admin" onClick={closeMenu} aria-label="Sign in to the admin content studio">SIGN IN / ADMIN</a>
        <a className="header-contact" href="#contact">CONNECT <ArrowUpRight size={15} /></a>
        <button className="menu-trigger" aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </motion.header>

      <main>
        <section className="hero-section">
          <div className="hero-grid" />
          <motion.div className="hero-orbit hero-orbit-one" style={reducedMotion ? undefined : { rotate: orbitRotation }} />
          <motion.div className="hero-orbit hero-orbit-two" style={reducedMotion ? undefined : { y: orbitDrift }} />
          <div className="hero-beam hero-beam-one" />
          <div className="hero-beam hero-beam-two" />
          <div className="hero-content container">
            <div className="hero-side-note reveal">Department of Electronics with Computer Technology<br />NSS College Rajakumari<br />Affiliated to Mahatma Gandhi University, Kottayam</div>
            <motion.div className="hero-main-copy" initial={reducedMotion ? false : { opacity: 0, x: -42 }} animate={reducedMotion ? undefined : { opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.22, ease: [0.23, 1, 0.32, 1] }}>
              <div className="hero-kicker reveal"><span className="live-dot" /> EST. 2026 / RAJAKUMARI, KERALA</div>
              <h1 className="hero-title reveal">Shaping Minds,<br /><em>Building the Future</em></h1>
              <p className="hero-description reveal">Empowering students through quality education<br className="desktop-break" /> in Electronics and Computer Technology.</p>
              <div className="hero-actions reveal">
                <a className="button button-primary" href="#about">EXPLORE MORE <ArrowUpRight size={18} /></a>
                <a className="button button-quiet" href="#events"><span className="play-icon"><Play size={11} fill="currentColor" /></span> VIEW DEPARTMENT ACTIVITIES</a>
              </div>
            </motion.div>
            <motion.div className="hero-stat reveal" initial={reducedMotion ? false : { opacity: 0, scale: 0.86 }} animate={reducedMotion ? undefined : { opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.55, ease: [0.23, 1, 0.32, 1] }}><strong>01</strong><span>CURIOUS<br />MINDS</span></motion.div>
          </div>
          <a className="scroll-cue" href="#about"><span>SCROLL TO EXPLORE</span><ChevronDown size={17} /></a>
          <div className="hero-code" aria-hidden="true">&lt;ect /&gt;<br /><span>build(impact)</span></div>
        </section>

        <div className="ticker-wrap">
          <div className="ticker-label"><Radio size={15} /> LATEST NEWS</div>
          <div className="ticker-track">
            <span>Congratulations to our students for winning Runner-up in Techfest</span><i />
            <span>Workshop on IoT and Applications</span><i />
            <span>Expert Talk on Artificial Intelligence</span><i />
            <span>Congratulations to our students for winning Runner-up in Techfest</span>
          </div>
        </div>

        <section id="about" className="about-section section-pad">
          <div className="container about-layout">
            <div className="about-intro">
              <SectionLabel eyebrow="THE DEPARTMENT" number="01" />
              <h2 className="section-heading reveal">Where technology<br /><span>meets purpose.</span></h2>
              <div className="about-visual reveal">
                <div className="about-visual-ring ring-a" /><div className="about-visual-ring ring-b" />
                <div className="about-visual-core"><Atom size={76} strokeWidth={1} /><span>ECT<br /><b>LAB / 01</b></span></div>
                <span className="visual-caption">SIGNAL / 09.31.26</span>
              </div>
            </div>
            <div className="about-copy">
              <div className="about-copy-index reveal">01 <span>/</span> 02</div>
              <p className="lead-copy reveal">The Department of Electronics with Computer Technology provides quality education in Electronics, Computer Technology, Programming and modern technologies.</p>
              <p className="body-copy reveal">Our department encourages students to participate in academic, technical, cultural and extracurricular activities.</p>
              <div className="about-metrics reveal">
                <div><strong>∞</strong><span>IDEAS IN<br />MOTION</span></div>
                <div><strong>03</strong><span>CORE<br />DOMAINS</span></div>
                <div><strong>24/7</strong><span>LEARNING<br />MINDSET</span></div>
              </div>
              <a className="text-link reveal" href="#teachers">MEET OUR FACULTY <ArrowUpRight size={17} /></a>
            </div>
          </div>
        </section>

        <section id="events" className="activities-section section-pad dark-section">
          <div className="container">
            <div className="section-topline reveal"><SectionLabel eyebrow="ALWAYS IN MOTION" number="02" /><span className="section-aside">CALENDAR / 2026</span></div>
            <div className="section-heading-row">
              <h2 className="section-heading reveal">Department<br /><span>Activities</span></h2>
              <p className="section-support reveal">Explore the moments, challenges and conversations that keep our learning community moving forward.</p>
            </div>
            <div className="activity-grid">
              <article className="activity-card activity-card-feature reveal">
                <div className="card-icon"><Sparkles size={23} /></div><span className="card-tag">NEXT UP</span>
                <h3>Upcoming Events</h3>
                <ul>{upcomingEventItems.map(([title, date]) => <li key={title}><span><strong>{title}</strong><small>{date}</small></span><ArrowUpRight size={17} /></li>)}</ul>
              </article>
              <article className="activity-card reveal">
                <div className="card-icon card-icon-muted"><Network size={23} /></div><span className="card-tag">ARCHIVE</span>
                <h3>Events Gone By</h3>
                <ul>{pastEventItems.map(([title, date]) => <li key={title}><span><strong>{title}</strong><small>{date}</small></span><ArrowUpRight size={17} /></li>)}</ul>
              </article>
              <article id="achievements" className="activity-card achievement-card reveal">
                <div className="card-icon card-icon-amber"><Trophy size={23} /></div><span className="card-tag">PROUD MOMENTS</span>
                <h3>Student Achievements</h3>
                <ol>{achievementItems.map((achievement, index) => <li key={achievement}><span>0{index + 1}</span>{achievement}</li>)}</ol>
              </article>
            </div>
          </div>
        </section>

        <section id="toppers" className="toppers-section section-pad">
          <div className="container">
            <SectionLabel eyebrow="THE HIGH BAR" number="03" />
            <div className="section-heading-row toppers-heading-row"><h2 className="section-heading reveal">Our <span>Toppers</span></h2><p className="section-support reveal">Celebrating focused effort, curious minds and the discipline to go further.</p></div>
            <div className="topper-grid">{topperItems.map(([year, name, score, initial], index) => <article className="topper-card reveal" key={name} style={{ "--delay": `${index * 80}ms` } as React.CSSProperties}><div className="portrait portrait-topper"><span>{initial}</span><div className="portrait-grid" /></div><div className="topper-meta"><span>{year}</span><strong>{name}</strong><em>SGPA: {score}</em></div><span className="topper-index">0{index + 1}</span></article>)}</div>
          </div>
        </section>

        <section id="teachers" className="teachers-section section-pad pale-section">
          <div className="container"><SectionLabel eyebrow="THE PEOPLE BEHIND THE SIGNAL" number="04" /><div className="section-heading-row"><h2 className="section-heading reveal">Our <span>Teachers</span></h2><span className="faculty-count reveal">{String(teacherItems.length).padStart(2, "0")} / FACULTY MEMBERS</span></div><div className="teacher-grid">{teacherItems.map(([name, role, initials], index) => <article className="teacher-card reveal" key={name} style={{ "--delay": `${index * 45}ms` } as React.CSSProperties}><div className={`portrait portrait-teacher portrait-${index % 4}`}><span>{initials}</span><div className="portrait-grid" /></div><div><h3>{name}</h3><p>{role}</p></div><ExternalLink className="teacher-arrow" size={16} /></article>)}</div></div>
        </section>

        <section id="alumni" className="alumni-section section-pad dark-section">
          <div className="container alumni-layout"><div><SectionLabel eyebrow="THE NETWORK" number="05" /><h2 className="section-heading reveal">Alumni<br /><span>Corner</span></h2><p className="section-support alumni-support reveal">Our alumni are working in various organizations and making the department proud.</p><div className="alumni-stamp reveal"><Users size={18} /> ECT COMMUNITY / CONNECTED</div></div><div className="table-wrap reveal"><table><thead><tr><th>Name</th><th>Batch</th><th>Current Position</th><th /></tr></thead><tbody>{alumniItems.map(([name, batch, position]) => <tr key={name}><td>{name}</td><td>{batch}</td><td>{position}</td><td><ArrowUpRight size={16} /></td></tr>)}</tbody></table><div className="table-note">A growing network of makers, builders and thoughtful technologists.</div></div></div>
        </section>

        <section className="gallery-section section-pad"><div className="container"><SectionLabel eyebrow="IN THE FIELD" number="06" /><div className="section-heading-row gallery-heading-row"><h2 className="section-heading reveal">Photo <span>Gallery</span></h2><span className="gallery-count reveal">SELECTED MOMENTS / {String(galleryItems.length).padStart(2, "0")}</span></div><div className="gallery-grid">{galleryItems.map(([image, alt, label, color], index) => <article className={`gallery-card ${color} reveal`} key={image} style={{ "--delay": `${index * 90}ms` } as React.CSSProperties}><div className="gallery-visual">{image.startsWith("http") ? <img src={image} alt={alt} className="gallery-photo" /> : null}<div className="gallery-lines" /><div className="gallery-orb"><span>ECT</span></div><span className="gallery-image-name">{image}</span></div><div className="gallery-caption"><span>{label}</span><strong>{alt}</strong><ArrowUpRight size={18} /></div></article>)}</div></div></section>

        <section id="contact" className="contact-section"><div className="contact-glow" /><div className="container contact-layout"><div><SectionLabel eyebrow="COME SAY HELLO" number="07" /><h2 className="contact-heading reveal">Let’s make<br /><em>something real.</em></h2></div><div className="contact-details reveal"><p>Department of Electronics with Computer Technology</p><p>NSS College Rajakumari</p><a href="mailto:ect@nssraj.ac.in"><Mail size={17} /> ect@nssraj.ac.in</a><a href="tel:+914868273203"><Phone size={17} /> +91 4868 273203</a><div className="social-row"><a href="#contact" aria-label="Facebook">f</a><a href="#contact" aria-label="Instagram"><Instagram size={16} /></a><a href="#contact" aria-label="YouTube"><Youtube size={17} /></a></div></div></div></section>
      </main>

      <footer className="site-footer"><div className="container footer-inner"><span>© 2026 Department of Electronics with Computer Technology, NSS College Rajakumari. All Rights Reserved.</span><span className="footer-legal">BUILT WITH CURIOSITY <span>✦</span></span></div></footer>
    </div>
  );
}
