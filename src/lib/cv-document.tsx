import path from "node:path";
import {
  Document,
  Font,
  Link,
  Page,
  Polygon,
  StyleSheet,
  Svg,
  Text,
  View,
} from "@react-pdf/renderer";
import { profile } from "@content/projects";
import type { Dictionary } from "@content/types";
import { publicPath, type Locale } from "@/lib/locale";
import { logoBlades } from "@/lib/logo";

/*
  Le CV imprimé reprend le site : noir, blanc, gris, aucune couleur d'accent.
  Bricolage Grotesque (instance figée opsz 96, wdth 92, 600) pour les titres, Geist pour le texte.
  Les polices sont embarquées depuis src/assets/fonts (incluses dans la trace du route handler).
*/
const fonts = path.join(process.cwd(), "src/assets/fonts");

Font.register({
  family: "Bricolage",
  src: path.join(fonts, "BricolageGrotesque-Display.ttf"),
});

Font.register({
  family: "Geist",
  fonts: [
    { src: path.join(fonts, "Geist-Regular.ttf"), fontWeight: 400 },
    { src: path.join(fonts, "Geist-Medium.ttf"), fontWeight: 500 },
    { src: path.join(fonts, "Geist-SemiBold.ttf"), fontWeight: 600 },
  ],
});

// Pas de césure : la règle anglaise par défaut coupe mal le français.
Font.registerHyphenationCallback((word) => [word]);

const ink = "#0a0a0a";
const muted = "#6b6b6b";
const faint = "#a3a3a3";
const line = "#e3e3e3";
const panel = "#f3f3f3";

const blades = logoBlades();

const styles = StyleSheet.create({
  page: {
    fontFamily: "Geist",
    fontSize: 9,
    color: ink,
    paddingTop: 38,
    paddingBottom: 40,
    paddingHorizontal: 40,
    lineHeight: 1.4,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  role: {
    fontSize: 9,
    fontWeight: 500,
    color: muted,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  name: {
    marginTop: 8,
    fontFamily: "Bricolage",
    fontSize: 38,
    lineHeight: 0.95,
    letterSpacing: -1.1,
  },
  intro: {
    marginTop: 12,
    maxWidth: 380,
    fontSize: 10,
    lineHeight: 1.5,
    color: "#2b2b2b",
  },

  contacts: {
    marginTop: 15,
    paddingVertical: 7,
    borderTopWidth: 0.75,
    borderBottomWidth: 0.75,
    borderColor: ink,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  contact: {
    fontSize: 8.5,
    color: ink,
    textDecoration: "none",
  },

  columns: {
    marginTop: 22,
    flexDirection: "row",
    gap: 18,
  },
  main: {
    width: 361,
  },
  side: {
    width: 144,
    flexShrink: 0,
    backgroundColor: panel,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 14,
  },

  sectionHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 9,
  },
  sectionIndex: {
    fontSize: 7.5,
    fontWeight: 500,
    color: faint,
  },
  sectionTitle: {
    fontFamily: "Bricolage",
    fontSize: 15,
    letterSpacing: -0.3,
  },
  sectionRule: {
    flexGrow: 1,
    height: 0.75,
    backgroundColor: line,
  },
  section: {
    marginBottom: 17,
  },
  sectionLast: {
    marginBottom: 0,
  },

  timeline: {
    position: "relative",
    paddingLeft: 16,
  },
  timelineLine: {
    position: "absolute",
    left: 3,
    top: 5,
    bottom: 6,
    width: 0.75,
    backgroundColor: line,
  },
  job: {
    position: "relative",
    marginBottom: 9,
  },
  jobDot: {
    position: "absolute",
    left: -16,
    top: 3.5,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    borderWidth: 1.25,
    borderColor: ink,
    backgroundColor: "#ffffff",
  },
  jobDotFirst: {
    backgroundColor: ink,
  },
  jobRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  jobTitle: {
    flex: 1,
    paddingRight: 10,
    fontSize: 10,
    fontWeight: 600,
  },
  period: {
    flexShrink: 0,
    fontSize: 8,
    color: muted,
    marginTop: 1.5,
  },
  org: {
    marginTop: 1,
    fontSize: 9,
    color: muted,
  },
  bullets: {
    marginTop: 3,
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 1,
  },
  bulletMark: {
    width: 10,
    color: faint,
  },
  bulletText: {
    flex: 1,
  },

  projects: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 8,
  },
  project: {
    width: "47.5%",
    paddingTop: 6,
    borderTopWidth: 0.75,
    borderColor: ink,
  },
  projectHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 6,
  },
  projectName: {
    fontSize: 10,
    fontWeight: 600,
    color: ink,
    textDecoration: "none",
  },
  projectDomain: {
    marginTop: 2,
    fontSize: 7,
    color: faint,
  },
  projectText: {
    marginTop: 3,
    fontSize: 8.5,
    lineHeight: 1.35,
    color: muted,
  },

  sideBlock: {
    marginBottom: 14,
  },
  sideBlockLast: {
    marginBottom: 0,
  },
  sideTitle: {
    marginBottom: 6,
    fontSize: 7,
    fontWeight: 500,
    color: muted,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  sideText: {
    fontSize: 8.5,
    lineHeight: 1.4,
  },
  pills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 3.5,
  },
  pill: {
    paddingTop: 3,
    paddingBottom: 2.5,
    paddingHorizontal: 6.5,
    lineHeight: 1,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    borderWidth: 0.5,
    borderColor: "#d6d6d6",
    fontSize: 7.5,
  },
  school: {
    flexDirection: "row",
    paddingVertical: 5,
    borderTopWidth: 0.75,
    borderColor: line,
  },
  schoolPeriod: {
    width: 70,
    flexShrink: 0,
    paddingTop: 1,
    fontSize: 8,
    color: muted,
  },
  schoolBody: {
    flex: 1,
  },
  schoolTitle: {
    fontSize: 9.5,
    fontWeight: 600,
  },
  schoolName: {
    marginTop: 0.5,
    fontSize: 8.5,
    color: muted,
  },
  language: {
    fontSize: 8.5,
    marginBottom: 2,
  },

  footer: {
    position: "absolute",
    left: 40,
    right: 40,
    bottom: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 7.5,
    color: faint,
  },
  footerLink: {
    color: faint,
    textDecoration: "none",
  },
});

function telHref(phone: string) {
  return `tel:+33${phone.replace(/\s/g, "").slice(1)}`;
}

function bare(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

function Mark({ size, color = ink }: { size: number; color?: string }) {
  return (
    <Svg viewBox="-1.2 -1.2 2.4 2.4" style={{ width: size, height: size }}>
      {blades.map((points) => (
        <Polygon
          key={points}
          points={points}
          fill={color}
          stroke={color}
          strokeWidth={0.028}
          strokeLinejoin="round"
        />
      ))}
    </Svg>
  );
}

function SectionHead({ index, title }: { index: number; title: string }) {
  return (
    <View style={styles.sectionHead}>
      <Text style={styles.sectionIndex}>{String(index).padStart(2, "0")}</Text>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionRule} />
    </View>
  );
}

export function CvDocument({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const cv = dict.cv;
  const site = bare(profile.siteUrl);
  const online = profile.siteUrl + publicPath(locale, "/cv");

  const contacts = [
    { href: telHref(cv.phone), label: cv.phone },
    { href: `mailto:${cv.email}`, label: cv.email },
    { href: profile.siteUrl, label: site },
    { href: profile.github, label: profile.githubLabel },
    { href: profile.linkedin, label: profile.linkedinLabel },
  ];

  return (
    <Document
      title={`${cv.metaTitle} — ${profile.name}`}
      author={profile.name}
      subject={cv.role}
      creator={profile.name}
      producer={site}
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.role}>{cv.role}</Text>
            <Text style={styles.name}>{profile.name}</Text>
          </View>
          <Mark size={52} />
        </View>
        <Text style={styles.intro}>{cv.profile}</Text>

        <View style={styles.contacts}>
          {contacts.map((item) => (
            <Link key={item.href} src={item.href} style={styles.contact}>
              {item.label}
            </Link>
          ))}
        </View>

        <View style={styles.columns}>
          <View style={styles.main}>
            <View style={styles.section}>
              <SectionHead index={1} title={cv.experienceTitle} />
              <View style={styles.timeline}>
                <View style={styles.timelineLine} />
                {cv.experience.map((job, index) => (
                  <View key={`${job.title}-${job.period}`} style={styles.job} wrap={false}>
                    <View style={[styles.jobDot, ...(index === 0 ? [styles.jobDotFirst] : [])]} />
                    <View style={styles.jobRow}>
                      <Text style={styles.jobTitle}>{job.title}</Text>
                      <Text style={styles.period}>{job.period}</Text>
                    </View>
                    <Text style={styles.org}>{job.org}</Text>
                    <View style={styles.bullets}>
                      {job.bullets.map((bullet) => (
                        <View key={bullet} style={styles.bulletRow}>
                          <Text style={styles.bulletMark}>–</Text>
                          <Text style={styles.bulletText}>{bullet}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.section} wrap={false}>
              <SectionHead index={2} title={cv.projectsTitle} />
              <View style={styles.projects}>
                {cv.selected.map((item) => (
                  <View key={item.name} style={styles.project}>
                    <View style={styles.projectHead}>
                      <Link src={item.url} style={styles.projectName}>
                        {item.name}
                      </Link>
                      <Text style={styles.projectDomain}>{bare(item.url).split("/")[0]} ↗</Text>
                    </View>
                    <Text style={styles.projectText}>{item.text}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.sectionLast} wrap={false}>
              <SectionHead index={3} title={cv.educationTitle} />
              {cv.education.map((item) => (
                <View key={item.title} style={styles.school}>
                  <Text style={styles.schoolPeriod}>{item.period}</Text>
                  <View style={styles.schoolBody}>
                    <Text style={styles.schoolTitle}>{item.title}</Text>
                    <Text style={styles.schoolName}>{item.school}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.side}>
            <View style={styles.sideBlock}>
              <Text style={styles.sideTitle}>{dict.nav.contact}</Text>
              <Text style={styles.sideText}>{cv.address}</Text>
              <Text style={[styles.sideText, { marginTop: 3, color: muted }]}>{cv.license}</Text>
            </View>

            <View style={styles.sideBlock}>
              <Text style={styles.sideTitle}>{cv.stackTitle}</Text>
              <View style={styles.pills}>
                {cv.stack.map((item) => (
                  <Text key={item} style={styles.pill}>
                    {item}
                  </Text>
                ))}
              </View>
            </View>

            <View style={styles.sideBlock}>
              <Text style={styles.sideTitle}>{cv.languagesTitle}</Text>
              {cv.languages.map((item) => (
                <Text key={item} style={styles.language}>
                  {item}
                </Text>
              ))}
            </View>

            <View style={[styles.sideBlock, styles.sideBlockLast]}>
              <Text style={styles.sideTitle}>{cv.skillsTitle}</Text>
              <View style={styles.pills}>
                {cv.skills.map((item) => (
                  <Text key={item} style={styles.pill}>
                    {item}
                  </Text>
                ))}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text>
            {profile.name} — {cv.metaTitle}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Link src={online} style={styles.footerLink}>
              {bare(online)}
            </Link>
            <Mark size={9} color={faint} />
          </View>
        </View>
      </Page>
    </Document>
  );
}
