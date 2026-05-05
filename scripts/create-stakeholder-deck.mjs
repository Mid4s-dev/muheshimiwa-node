import pptxgen from "pptxgenjs";
import path from "node:path";

const pptx = new pptxgen();

pptx.layout = "LAYOUT_WIDE";
pptx.author = "GitHub Copilot";
pptx.company = "Muheshimiwa MD";
pptx.subject = "Stakeholder presentation";
pptx.title = "Muheshimiwa MD Stakeholder Briefing";
pptx.lang = "en-US";
pptx.theme = {
  headFontFace: "Aptos Display",
  bodyFontFace: "Aptos",
  lang: "en-US",
};

const COLORS = {
  green: "016629",
  gold: "FDC71B",
  dark: "2F1041",
  navy: "10212B",
  ink: "1D2730",
  muted: "5E6A72",
  light: "F5F7F9",
  border: "DDE3E8",
  white: "FFFFFF",
};

const outputFile = path.resolve("docs/muheshimiwa-md-stakeholder-briefing.pptx");

function addSlideBackground(slide, accent = COLORS.dark) {
  slide.background = { color: COLORS.white };
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 13.333,
    h: 0.28,
    line: { color: accent, transparency: 100 },
    fill: { color: accent },
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 7.15,
    w: 13.333,
    h: 0.13,
    line: { color: COLORS.gold, transparency: 100 },
    fill: { color: COLORS.gold },
  });
}

function addSlideHeader(slide, kicker, title, subtitle) {
  slide.addText(kicker.toUpperCase(), {
    x: 0.55,
    y: 0.45,
    w: 3.2,
    h: 0.28,
    fontFace: "Aptos",
    fontSize: 11,
    bold: true,
    color: COLORS.green,
    charSpace: 1.1,
  });
  slide.addText(title, {
    x: 0.55,
    y: 0.75,
    w: 9.8,
    h: 0.8,
    fontFace: "Aptos Display",
    fontSize: 24,
    bold: true,
    color: COLORS.ink,
  });
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.55,
      y: 1.48,
      w: 10.8,
      h: 0.48,
      fontFace: "Aptos",
      fontSize: 11.5,
      color: COLORS.muted,
    });
  }
}

function addCard(slide, { x, y, w, h, fill = COLORS.white, stroke = COLORS.border, radius = 0.12 }) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: radius,
    line: { color: stroke, pt: 1 },
    fill: { color: fill },
    shadow: { type: "outer", color: "AAB2BA", blur: 1, angle: 45, distance: 1, opacity: 0.12 },
  });
}

function addMetricCard(slide, x, y, w, h, number, label, detail, accent = COLORS.green) {
  addCard(slide, { x, y, w, h, fill: COLORS.white, stroke: COLORS.border });
  slide.addShape(pptx.ShapeType.rect, {
    x,
    y,
    w: 0.12,
    h,
    line: { color: accent, transparency: 100 },
    fill: { color: accent },
  });
  slide.addText(number, {
    x: x + 0.2,
    y: y + 0.2,
    w: w - 0.3,
    h: 0.45,
    fontFace: "Aptos Display",
    fontSize: 24,
    bold: true,
    color: COLORS.ink,
  });
  slide.addText(label, {
    x: x + 0.2,
    y: y + 0.68,
    w: w - 0.3,
    h: 0.22,
    fontFace: "Aptos",
    fontSize: 9,
    bold: true,
    color: accent,
  });
  slide.addText(detail, {
    x: x + 0.2,
    y: y + 0.95,
    w: w - 0.3,
    h: h - 1.0,
    fontFace: "Aptos",
    fontSize: 9.5,
    color: COLORS.muted,
    margin: 0,
    valign: "top",
  });
}

function addBullets(slide, items, x, y, w, h, color = COLORS.ink) {
  slide.addText(
    items.map((item) => ({ text: item, options: { bullet: { indent: 16 } } })),
    {
      x,
      y,
      w,
      h,
      fontFace: "Aptos",
      fontSize: 12,
      color,
      breakLine: false,
      margin: 0.02,
      paraSpaceAfterPt: 8,
      valign: "top",
    },
  );
}

function addSectionPill(slide, text, x, y, w, fill) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h: 0.34,
    rectRadius: 0.08,
    line: { color: fill, pt: 1 },
    fill: { color: fill },
  });
  slide.addText(text, {
    x,
    y: y + 0.03,
    w,
    h: 0.22,
    fontFace: "Aptos",
    fontSize: 9,
    bold: true,
    align: "center",
    color: COLORS.white,
  });
}

// Slide 1: Title
{
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.dark };
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 13.333,
    h: 7.5,
    line: { color: COLORS.dark, transparency: 100 },
    fill: { color: COLORS.dark },
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: 7.55,
    y: 0,
    w: 5.78,
    h: 7.5,
    line: { color: COLORS.green, transparency: 100 },
    fill: { color: COLORS.green, transparency: 12 },
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 6.95,
    w: 13.333,
    h: 0.55,
    line: { color: COLORS.gold, transparency: 100 },
    fill: { color: COLORS.gold },
  });

  slide.addText("MUHESHIMWA MD", {
    x: 0.7,
    y: 0.7,
    w: 3.5,
    h: 0.3,
    fontFace: "Aptos",
    fontSize: 11,
    bold: true,
    color: COLORS.gold,
    charSpace: 1.2,
  });
  slide.addText("Stakeholder Briefing", {
    x: 0.7,
    y: 1.0,
    w: 6.4,
    h: 0.7,
    fontFace: "Aptos Display",
    fontSize: 30,
    bold: true,
    color: COLORS.white,
  });
  slide.addText(
    "A constituency management platform for bursaries, projects, polling stations, communication, and impact tracking.",
    {
      x: 0.7,
      y: 1.9,
      w: 6.3,
      h: 0.7,
      fontFace: "Aptos",
      fontSize: 14,
      color: "E9EEF2",
      breakLine: false,
    },
  );
  addSectionPill(slide, "Next.js 15  |  Prisma  |  tRPC  |  NextAuth", 0.7, 2.88, 4.35, COLORS.green);

  slide.addText("What stakeholders get", {
    x: 7.95,
    y: 0.75,
    w: 4.6,
    h: 0.35,
    fontFace: "Aptos",
    fontSize: 11,
    bold: true,
    color: COLORS.white,
    align: "left",
  });
  addMetricCard(slide, 7.95, 1.15, 4.65, 1.1, "500+", "STUDENTS SUPPORTED", "Bursary tracking and support workflows.", COLORS.gold);
  addMetricCard(slide, 7.95, 2.42, 4.65, 1.1, "8", "WARDS IMPACTED", "Delivery and visibility across the constituency.", COLORS.white);
  addMetricCard(slide, 7.95, 3.69, 4.65, 1.1, "50+", "SECURITY INITIATIVES", "Community safety efforts with measurable outcomes.", COLORS.gold);

  slide.addText("Built for visibility, accountability, and faster delivery.", {
    x: 0.7,
    y: 5.95,
    w: 6.0,
    h: 0.4,
    fontFace: "Aptos",
    fontSize: 12.5,
    italic: true,
    color: "F6F7F8",
  });
  slide.addText("May 2026", {
    x: 11.25,
    y: 7.03,
    w: 1.25,
    h: 0.22,
    fontFace: "Aptos",
    fontSize: 9,
    color: COLORS.dark,
    align: "right",
  });
}

// Slide 2: Problem
{
  const slide = pptx.addSlide();
  addSlideBackground(slide, COLORS.green);
  addSlideHeader(
    slide,
    "Why this matters",
    "The coordination problem the platform solves",
    "Stakeholders need a single operating picture for public engagement, project tracking, and service delivery.",
  );

  const problems = [
    {
      title: "Fragmented records",
      body: "Bursaries, projects, posts, and contact data are often spread across tools and spreadsheets.",
    },
    {
      title: "Low visibility",
      body: "It is hard for leadership to quickly see what has been delivered, what is pending, and where coverage is thin.",
    },
    {
      title: "Slower response cycles",
      body: "Without a structured workflow, supporters and residents wait longer for updates and follow-up.",
    },
  ];

  problems.forEach((item, index) => {
    const x = 0.65 + index * 4.18;
    addCard(slide, { x, y: 2.05, w: 3.85, h: 2.2, fill: COLORS.light, stroke: COLORS.border });
    slide.addText(String(index + 1).padStart(2, "0"), {
      x: x + 0.18,
      y: 2.22,
      w: 0.45,
      h: 0.25,
      fontFace: "Aptos",
      fontSize: 11,
      bold: true,
      color: COLORS.green,
    });
    slide.addText(item.title, {
      x: x + 0.18,
      y: 2.5,
      w: 3.2,
      h: 0.3,
      fontFace: "Aptos Display",
      fontSize: 16,
      bold: true,
      color: COLORS.ink,
    });
    slide.addText(item.body, {
      x: x + 0.18,
      y: 2.88,
      w: 3.35,
      h: 0.85,
      fontFace: "Aptos",
      fontSize: 11,
      color: COLORS.muted,
      valign: "top",
    });
  });

  addCard(slide, { x: 0.65, y: 4.7, w: 12.0, h: 1.45, fill: COLORS.white, stroke: COLORS.border });
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.65,
    y: 4.7,
    w: 0.14,
    h: 1.45,
    line: { color: COLORS.gold, transparency: 100 },
    fill: { color: COLORS.gold },
  });
  slide.addText("The response", {
    x: 0.92,
    y: 4.92,
    w: 1.6,
    h: 0.25,
    fontFace: "Aptos",
    fontSize: 10.5,
    bold: true,
    color: COLORS.green,
  });
  slide.addText(
    "Muheshimiwa MD centralizes constituency operations so teams can manage public information, track outcomes, and follow up on requests using one system.",
    {
      x: 0.92,
      y: 5.18,
      w: 10.7,
      h: 0.7,
      fontFace: "Aptos",
      fontSize: 12.5,
      color: COLORS.ink,
    },
  );
}

// Slide 3: What we built
{
  const slide = pptx.addSlide();
  addSlideBackground(slide, COLORS.dark);
  addSlideHeader(
    slide,
    "Platform scope",
    "What the system already covers",
    "The application brings together public-facing content, operational workflows, and admin control in one stack.",
  );

  const modules = [
    ["Bursary workflows", "Applications, distributions, and student support visibility."],
    ["Projects", "Track infrastructure and community initiatives by status and impact."],
    ["Polling stations", "Map voting locations, codes, and constituent coverage."],
    ["Impact stories", "Capture and publish outcomes residents can understand."],
    ["Supporter registry", "Manage contacts, registrations, and follow-up lists."],
    ["Admin dashboard", "Secure operational access for staff and leadership."],
  ];

  modules.forEach((module, index) => {
    const col = index % 3;
    const row = Math.floor(index / 3);
    const x = 0.65 + col * 4.12;
    const y = 2.05 + row * 1.7;
    addCard(slide, { x, y, w: 3.72, h: 1.28, fill: COLORS.light, stroke: COLORS.border });
    slide.addShape(pptx.ShapeType.rect, {
      x,
      y,
      w: 0.12,
      h: 1.28,
      line: { color: index % 2 === 0 ? COLORS.green : COLORS.gold, transparency: 100 },
      fill: { color: index % 2 === 0 ? COLORS.green : COLORS.gold },
    });
    slide.addText(module[0], {
      x: x + 0.2,
      y: y + 0.15,
      w: 2.8,
      h: 0.22,
      fontFace: "Aptos Display",
      fontSize: 14,
      bold: true,
      color: COLORS.ink,
    });
    slide.addText(module[1], {
      x: x + 0.2,
      y: y + 0.48,
      w: 3.2,
      h: 0.55,
      fontFace: "Aptos",
      fontSize: 10.5,
      color: COLORS.muted,
    });
  });

  addSectionPill(slide, "Built on Next.js 15 + Prisma + tRPC + NextAuth", 0.65, 6.2, 4.8, COLORS.green);
}

// Slide 4: Stakeholder value
{
  const slide = pptx.addSlide();
  addSlideBackground(slide, COLORS.green);
  addSlideHeader(
    slide,
    "Audience value",
    "Who benefits and how",
    "The platform is designed to serve constituents, internal teams, and external partners with different levels of visibility.",
  );

  const audiences = [
    {
      title: "Residents",
      items: ["Find services and projects faster.", "Understand what is delivered and where.", "Register or engage through clear public pages."],
    },
    {
      title: "Constituency staff",
      items: ["Update records without duplication.", "Work from a shared source of truth.", "Reduce manual follow-up and reporting effort."],
    },
    {
      title: "Leadership",
      items: ["See progress at a glance.", "Prioritize resources with better data.", "Communicate achievements with evidence."],
    },
    {
      title: "Partners and stakeholders",
      items: ["Review transparent outcomes.", "Support planning and coordination.", "Track commitments over time."],
    },
  ];

  audiences.forEach((audience, index) => {
    const x = 0.65 + (index % 2) * 6.18;
    const y = 2.0 + Math.floor(index / 2) * 2.08;
    addCard(slide, { x, y, w: 5.68, h: 1.7, fill: COLORS.white, stroke: COLORS.border });
    slide.addText(audience.title, {
      x: x + 0.2,
      y: y + 0.14,
      w: 2.8,
      h: 0.24,
      fontFace: "Aptos Display",
      fontSize: 15,
      bold: true,
      color: COLORS.dark,
    });
    addBullets(slide, audience.items, x + 0.22, y + 0.47, 5.0, 1.0, COLORS.ink);
  });
}

// Slide 5: Impact metrics
{
  const slide = pptx.addSlide();
  addSlideBackground(slide, COLORS.dark);
  addSlideHeader(
    slide,
    "Measured impact",
    "Signals that stakeholders can understand quickly",
    "The current demo data already gives the platform credible proof points for outreach and reporting.",
  );

  addMetricCard(slide, 0.7, 2.0, 2.9, 1.55, "500+", "STUDENTS SUPPORTED", "Bursary access and education support.", COLORS.green);
  addMetricCard(slide, 3.85, 2.0, 2.9, 1.55, "8", "WARDS IMPACTED", "Coverage across the constituency.", COLORS.gold);
  addMetricCard(slide, 7.0, 2.0, 2.9, 1.55, "50+", "SECURITY INITIATIVES", "Public safety and lighting efforts.", COLORS.green);
  addMetricCard(slide, 10.15, 2.0, 2.45, 1.55, "10K+", "SUPPORTER LIST", "A growing audience for updates.", COLORS.gold);

  addCard(slide, { x: 0.7, y: 4.0, w: 12.0, h: 1.7, fill: COLORS.light, stroke: COLORS.border });
  slide.addText("Why these numbers matter", {
    x: 0.92,
    y: 4.2,
    w: 3.0,
    h: 0.25,
    fontFace: "Aptos Display",
    fontSize: 15,
    bold: true,
    color: COLORS.ink,
  });
  addBullets(
    slide,
    [
      "They translate the platform into outcomes instead of software jargon.",
      "They provide a simple story for meetings, reports, and public communication.",
      "They create a baseline for tracking progress over time.",
    ],
    0.95,
    4.55,
    10.9,
    0.95,
    COLORS.ink,
  );
}

// Slide 6: Architecture
{
  const slide = pptx.addSlide();
  addSlideBackground(slide, COLORS.green);
  addSlideHeader(
    slide,
    "Technical foundation",
    "How the system is put together",
    "The stack is modern, type-safe, and easy to extend without introducing unnecessary complexity.",
  );

  const layers = [
    { title: "Public site", body: "Home, about, projects, polling stations, register, manifesto.", x: 0.7, y: 2.25, w: 2.2 },
    { title: "Next.js app", body: "Server components, route handlers, and secure pages.", x: 3.15, y: 2.25, w: 2.2 },
    { title: "Auth + APIs", body: "NextAuth, tRPC, React Query, server actions.", x: 5.6, y: 2.25, w: 2.2 },
    { title: "Prisma + MySQL", body: "Schema, migrations, seed data, persistence.", x: 8.05, y: 2.25, w: 2.2 },
    { title: "Admin workflows", body: "Dashboard, login, content management, analytics.", x: 10.5, y: 2.25, w: 2.1 },
  ];

  layers.forEach((layer, index) => {
    addCard(slide, { x: layer.x, y: layer.y, w: layer.w, h: 1.9, fill: COLORS.white, stroke: COLORS.border });
    slide.addText(layer.title, {
      x: layer.x + 0.16,
      y: layer.y + 0.18,
      w: layer.w - 0.32,
      h: 0.25,
      fontFace: "Aptos Display",
      fontSize: 13.5,
      bold: true,
      color: COLORS.ink,
    });
    slide.addText(layer.body, {
      x: layer.x + 0.16,
      y: layer.y + 0.55,
      w: layer.w - 0.32,
      h: 0.95,
      fontFace: "Aptos",
      fontSize: 10.3,
      color: COLORS.muted,
    });
    if (index < layers.length - 1) {
      slide.addShape(pptx.ShapeType.chevron, {
        x: layer.x + layer.w + 0.08,
        y: 2.9,
        w: 0.18,
        h: 0.4,
        line: { color: COLORS.gold, pt: 1 },
        fill: { color: COLORS.gold },
      });
    }
  });

  addCard(slide, { x: 0.7, y: 4.55, w: 12.0, h: 1.55, fill: COLORS.light, stroke: COLORS.border });
  slide.addText("Operational advantages", {
    x: 0.95,
    y: 4.75,
    w: 2.5,
    h: 0.25,
    fontFace: "Aptos Display",
    fontSize: 14,
    bold: true,
    color: COLORS.ink,
  });
  addBullets(
    slide,
    ["Type-safe API boundaries.", "Centralized data model and migrations.", "Reusable components for fast iteration."],
    0.95,
    5.05,
    10.9,
    0.7,
    COLORS.ink,
  );
}

// Slide 7: Deployment and governance
{
  const slide = pptx.addSlide();
  addSlideBackground(slide, COLORS.dark);
  addSlideHeader(
    slide,
    "Delivery model",
    "Deployment and governance considerations",
    "The project already has a strong path for local development, Docker deployment, and repeatable database setup.",
  );

  const items = [
    ["Docker-ready", "The repo includes Dockerfiles and compose files for local and cloud deployment."],
    ["Database lifecycle", "Prisma migrations and seed scripts support predictable environments."],
    ["Secure access", "Admin pages use authentication guards and session management."],
    ["Content operations", "Supporter, post, project, and story updates are handled centrally."],
  ];

  items.forEach((item, index) => {
    const x = 0.65 + (index % 2) * 6.18;
    const y = 2.1 + Math.floor(index / 2) * 1.8;
    addCard(slide, { x, y, w: 5.68, h: 1.45, fill: COLORS.light, stroke: COLORS.border });
    slide.addText(item[0], {
      x: x + 0.2,
      y: y + 0.15,
      w: 2.5,
      h: 0.22,
      fontFace: "Aptos Display",
      fontSize: 14,
      bold: true,
      color: COLORS.ink,
    });
    slide.addText(item[1], {
      x: x + 0.2,
      y: y + 0.45,
      w: 5.0,
      h: 0.72,
      fontFace: "Aptos",
      fontSize: 10.8,
      color: COLORS.muted,
    });
  });

  addSectionPill(slide, "Ready for review, demo, and refinement", 0.65, 5.95, 3.9, COLORS.gold);
}

// Slide 8: Next steps
{
  const slide = pptx.addSlide();
  addSlideBackground(slide, COLORS.green);
  addSlideHeader(
    slide,
    "Decision slide",
    "Recommended next steps for stakeholders",
    "Use this deck as the basis for approval, demo feedback, or a roadmap discussion with leadership and partners.",
  );

  const steps = [
    "Validate the current feature set against stakeholder priorities.",
    "Approve branding, messaging, and data fields for public reporting.",
    "Decide whether to expand with SMS, analytics, or a donor-facing view.",
    "Set a rollout date for the next review or demonstration.",
  ];

  addCard(slide, { x: 0.75, y: 2.15, w: 7.1, h: 3.65, fill: COLORS.white, stroke: COLORS.border });
  slide.addText("Action items", {
    x: 1.0,
    y: 2.38,
    w: 2.0,
    h: 0.24,
    fontFace: "Aptos Display",
    fontSize: 16,
    bold: true,
    color: COLORS.ink,
  });
  addBullets(slide, steps, 1.0, 2.78, 6.3, 2.45, COLORS.ink);

  addCard(slide, { x: 8.15, y: 2.15, w: 4.45, h: 3.65, fill: COLORS.light, stroke: COLORS.border });
  slide.addText("Outcome", {
    x: 8.42,
    y: 2.38,
    w: 1.5,
    h: 0.22,
    fontFace: "Aptos Display",
    fontSize: 16,
    bold: true,
    color: COLORS.ink,
  });
  slide.addText(
    "A unified platform that helps the constituency communicate better, operate faster, and prove delivery with data.",
    {
      x: 8.42,
      y: 2.78,
      w: 3.7,
      h: 1.2,
      fontFace: "Aptos Display",
      fontSize: 18,
      bold: true,
      color: COLORS.green,
      valign: "mid",
    },
  );
  slide.addText("Stakeholder-ready. Deployment-ready. Ready for the next review.", {
    x: 8.42,
    y: 4.32,
    w: 3.55,
    h: 0.45,
    fontFace: "Aptos",
    fontSize: 11,
    italic: true,
    color: COLORS.muted,
  });
}

await pptx.writeFile({ fileName: outputFile });
