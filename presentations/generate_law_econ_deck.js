const path = require('path');
const sharp = require('/Users/tsclark/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const pptxgen = require('/Users/tsclark/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/pptxgenjs');

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_WIDE';
pptx.author = 'Tom S. Clark, Jeffrey K. Staton, Yu Wang, and Eugene Agichtein';
pptx.company = 'Emory University';
pptx.subject = 'Law and economics colloquium presentation draft';
pptx.title = 'Can the Supreme Court Settle Policy—and Unsettle the Public?';
pptx.lang = 'en-US';
pptx.theme = {
  headFontFace: 'Cambria',
  bodyFontFace: 'Arial',
  lang: 'en-US',
};
pptx.defineSlideMaster({
  title: 'CONTENT',
  background: { color: 'FFFFFF' },
  objects: [],
  slideNumber: { x: 12.25, y: 7.08, w: 0.45, h: 0.2, color: '7A7377', fontFace: 'Arial', fontSize: 9, align: 'right', margin: 0 },
});

const C = {
  oxblood: '571D2B',
  oxblood2: '772D3D',
  ink: '242126',
  muted: '6F686D',
  gray: 'E7E4E6',
  gray2: 'F4F2F3',
  white: 'FFFFFF',
  jade: '2A8C82',
  jadeLight: 'DCEFEB',
  coral: 'D65F5F',
  coralLight: 'F8E1E1',
  gold: 'D7A62A',
  goldLight: 'F7EDCF',
  violet: '775DA6',
  violetLight: 'E9E3F2',
  slate: '405466',
};

const SH = pptx.ShapeType;
const ASSETS = path.join(__dirname, 'assets');
const OUT = path.join(__dirname, 'CourtOMeter_LawEcon_Colloquium_Draft_v1.pptx');

function addText(slide, text, x, y, w, h, options = {}) {
  slide.addText(text, {
    x, y, w, h,
    fontFace: options.fontFace || 'Arial',
    fontSize: options.fontSize || 18,
    color: options.color || C.ink,
    bold: options.bold || false,
    italic: options.italic || false,
    margin: options.margin === undefined ? 0 : options.margin,
    valign: options.valign || 'mid',
    align: options.align || 'left',
    breakLine: options.breakLine,
    fit: options.fit || 'shrink',
    isTextBox: true,
    ...options,
  });
}

function addRuns(slide, runs, x, y, w, h, options = {}) {
  slide.addText(runs, {
    x, y, w, h,
    fontFace: options.fontFace || 'Arial',
    fontSize: options.fontSize || 18,
    color: options.color || C.ink,
    margin: options.margin === undefined ? 0 : options.margin,
    valign: options.valign || 'mid',
    align: options.align || 'left',
    fit: options.fit || 'shrink',
    ...options,
  });
}

function addShape(slide, type, x, y, w, h, fill, line = C.gray, radius = 0.08, extra = {}) {
  slide.addShape(type, {
    x, y, w, h,
    rectRadius: radius,
    fill: fill ? { color: fill } : { color: C.white, transparency: 100 },
    line: line ? { color: line, width: 1 } : { color: C.white, transparency: 100 },
    ...extra,
  });
}

function addCard(slide, x, y, w, h, fill = C.white, line = C.gray, shadow = true) {
  addShape(slide, SH.roundRect, x, y, w, h, fill, line, 0.08, shadow ? {
    shadow: { type: 'outer', color: '000000', opacity: 0.12, blur: 1.5, angle: 45, distance: 1 },
  } : {});
}

function addChip(slide, text, x, y, w, fill, color = C.ink) {
  addShape(slide, SH.roundRect, x, y, w, 0.34, fill, fill, 0.15);
  addText(slide, text, x + 0.08, y + 0.01, w - 0.16, 0.30, { fontSize: 11, bold: true, color, align: 'center' });
}

function addLine(slide, x, y, w, h, color = C.muted, width = 1.5, arrow = false, dash = 'solid') {
  slide.addShape(SH.line, {
    x, y, w, h,
    line: { color, width, dash, endArrowType: arrow ? 'triangle' : 'none' },
  });
}

function addTitle(slide, title, section, options = {}) {
  const dark = options.dark || false;
  const titleColor = dark ? C.white : C.ink;
  const mutedColor = dark ? 'E8DDE1' : C.oxblood2;
  addText(slide, section.toUpperCase(), 0.68, 0.25, 4.8, 0.24, {
    fontSize: 10.5, bold: true, color: mutedColor, charSpacing: 1.2,
  });
  addText(slide, title, 0.68, 0.54, 11.7, 0.64, {
    fontFace: 'Cambria', fontSize: options.fontSize || 30, bold: true, color: titleColor,
  });
  addShape(slide, SH.ellipse, 12.18, 0.35, 0.30, 0.30, dark ? 'C7939D' : C.jade, null, 0);
  addShape(slide, SH.ellipse, 12.38, 0.35, 0.30, 0.30, dark ? 'E2B5B0' : C.coral, null, 0, { transparency: 18 });
}

function addFooter(slide, text, dark = false) {
  addText(slide, text, 0.68, 7.03, 10.9, 0.22, {
    fontSize: 8.5, color: dark ? 'DCCED3' : C.muted,
  });
}

function addNote(slide, note) {
  slide.addNotes(note);
}

async function addImageContain(slide, imagePath, x, y, w, h, options = {}) {
  const meta = await sharp(imagePath).metadata();
  const imgRatio = meta.width / meta.height;
  const boxRatio = w / h;
  let iw = w;
  let ih = h;
  let ix = x;
  let iy = y;
  if (imgRatio > boxRatio) {
    ih = w / imgRatio;
    iy = y + (h - ih) / 2;
  } else {
    iw = h * imgRatio;
    ix = x + (w - iw) / 2;
  }
  slide.addImage({ path: imagePath, x: ix, y: iy, w: iw, h: ih, ...options });
}

function addCourtIcon(slide, x, y, scale = 1, color = C.white) {
  addShape(slide, SH.chevron, x, y, 2.55 * scale, 0.58 * scale, color, null, 0, { rotate: 270, transparency: 8 });
  for (let i = 0; i < 4; i += 1) {
    addShape(slide, SH.roundRect, x + (0.34 + i * 0.52) * scale, y + 0.58 * scale, 0.24 * scale, 1.45 * scale, color, null, 0.04, { transparency: 8 });
  }
  addShape(slide, SH.rect, x + 0.15 * scale, y + 2.02 * scale, 2.25 * scale, 0.18 * scale, color, null, 0, { transparency: 8 });
  addShape(slide, SH.rect, x + 0.02 * scale, y + 2.26 * scale, 2.50 * scale, 0.14 * scale, color, null, 0, { transparency: 8 });
}

function addBigNumber(slide, number, label, x, y, w, color = C.oxblood) {
  addText(slide, number, x, y, w, 0.64, { fontFace: 'Cambria', fontSize: 35, bold: true, color, align: 'center' });
  addText(slide, label, x + 0.08, y + 0.61, w - 0.16, 0.56, { fontSize: 12, color: C.muted, align: 'center', valign: 'top' });
}

function addOutcomeArrow(slide, x, y, color, direction = 'right') {
  if (direction === 'right') {
    addLine(slide, x, y, 0.75, 0, color, 3, true);
  } else if (direction === 'down') {
    addLine(slide, x, y, 0, 0.52, color, 3, true);
  } else {
    addLine(slide, x, y, 0.75, 0, color, 3, false);
  }
}

async function buildDeck() {
  // 1. Title
  {
    const slide = pptx.addSlide();
    slide.background = { color: C.oxblood };
    addShape(slide, SH.ellipse, 8.45, -0.95, 5.8, 5.8, C.oxblood2, null, 0, { transparency: 10 });
    addShape(slide, SH.ellipse, 9.25, -0.25, 4.4, 4.4, C.coral, null, 0, { transparency: 77 });
    addShape(slide, SH.ellipse, 10.15, 0.55, 2.7, 2.7, C.gold, null, 0, { transparency: 78 });
    addCourtIcon(slide, 9.22, 1.48, 1.18, C.white);
    addText(slide, 'CAN THE SUPREME COURT', 0.72, 0.62, 6.9, 0.32, { fontSize: 12, bold: true, color: 'E3C7CD', charSpacing: 1.7 });
    addText(slide, 'settle policy—and\nunsettle the public?', 0.72, 1.08, 7.45, 1.72, {
      fontFace: 'Cambria', fontSize: 38, bold: true, color: C.white, breakLine: true, valign: 'top',
    });
    addText(slide, 'Public reactions to Windsor and Perry in 2.5 million tweets', 0.76, 3.10, 7.2, 0.48, {
      fontSize: 19, color: 'F2E9EC',
    });
    addText(slide, 'Using Twitter to Study Public Discourse in the Wake of Judicial Decisions', 0.76, 3.74, 7.15, 0.42, {
      fontSize: 13.5, italic: true, color: 'D9C5CB',
    });
    addText(slide, 'Tom S. Clark · Jeffrey K. Staton · Yu Wang · Eugene Agichtein', 0.76, 5.63, 8.8, 0.36, {
      fontSize: 14.5, bold: true, color: C.white,
    });
    addText(slide, 'Law & Economics Colloquium  |  Presentation draft', 0.76, 6.12, 7.6, 0.32, {
      fontSize: 12, color: 'D9C5CB',
    });
    addFooter(slide, 'Paper version 5', true);
    addNote(slide, 'Opening: A Supreme Court decision can be legally final and socially unsettled at the same time. The talk asks whether judicial authority produces acceptance or instead reorganizes conflict. I will use the 2013 same-sex marriage cases and high-frequency public speech to distinguish those possibilities.');
  }

  // 2. Event and puzzle
  {
    const slide = pptx.addSlide('CONTENT');
    addTitle(slide, 'The Court changed the rule. What happened to the argument?', 'The puzzle');
    addText(slide, 'JUNE 26, 2013', 0.74, 1.42, 2.2, 0.28, { fontSize: 12, bold: true, color: C.oxblood2, charSpacing: 1.1 });
    addLine(slide, 1.0, 3.18, 11.1, 0, C.gray, 2, false);
    addShape(slide, SH.ellipse, 2.43, 2.99, 0.38, 0.38, C.jade, C.white, 0);
    addShape(slide, SH.ellipse, 6.37, 2.99, 0.38, 0.38, C.coral, C.white, 0);
    addShape(slide, SH.ellipse, 10.30, 2.99, 0.38, 0.38, C.gold, C.white, 0);
    addCard(slide, 0.82, 1.78, 3.65, 1.03, C.jadeLight, C.jade, false);
    addText(slide, 'United States v. Windsor', 1.05, 1.92, 3.2, 0.30, { fontFace: 'Cambria', fontSize: 18, bold: true, color: C.ink });
    addText(slide, 'DOMA §3 unconstitutional under Fifth Amendment principles', 1.05, 2.27, 3.10, 0.38, { fontSize: 13.5, color: C.slate, valign: 'top' });
    addCard(slide, 4.77, 1.78, 3.65, 1.03, C.coralLight, C.coral, false);
    addText(slide, 'Hollingsworth v. Perry', 5.00, 1.92, 3.2, 0.30, { fontFace: 'Cambria', fontSize: 18, bold: true });
    addText(slide, 'No standing; the judgment against Proposition 8 remained in place', 5.00, 2.27, 3.10, 0.38, { fontSize: 13.5, color: C.slate, valign: 'top' });
    addCard(slide, 8.72, 1.78, 3.65, 1.03, C.goldLight, C.gold, false);
    addText(slide, 'A liberal—but incomplete—policy shift', 8.95, 1.92, 3.2, 0.30, { fontFace: 'Cambria', fontSize: 17.5, bold: true });
    addText(slide, 'The Court did not yet establish a nationwide constitutional right', 8.95, 2.27, 3.08, 0.38, { fontSize: 13.5, color: C.slate, valign: 'top' });
    addCard(slide, 1.22, 4.07, 10.88, 1.65, C.gray2, C.gray, false);
    addText(slide, 'Institutional authority', 1.67, 4.51, 2.35, 0.40, { fontFace: 'Cambria', fontSize: 23, bold: true, align: 'center' });
    addOutcomeArrow(slide, 4.15, 4.74, C.muted, 'right');
    addChip(slide, 'CONSENT', 5.02, 4.15, 2.15, C.jadeLight, C.jade);
    addText(slide, 'support rises\nanger falls', 5.04, 4.58, 2.12, 0.76, { fontSize: 15, align: 'center', color: C.slate });
    addText(slide, 'or', 7.31, 4.63, 0.55, 0.32, { fontFace: 'Cambria', fontSize: 17, italic: true, align: 'center', color: C.muted });
    addChip(slide, 'COUNTERMOBILIZATION', 7.97, 4.15, 2.95, C.coralLight, C.coral);
    addText(slide, 'positions harden\nconflict intensifies', 8.08, 4.58, 2.72, 0.76, { fontSize: 15, align: 'center', color: C.slate });
    addText(slide, 'The legal outcome is observable. The social response is the dependent variable.', 2.05, 6.13, 9.25, 0.42, { fontSize: 20, bold: true, color: C.oxblood, align: 'center' });
    addFooter(slide, 'Source: Clark et al., version 5, pp. 7–8.');
    addNote(slide, 'Give the doctrinal background quickly. Windsor invalidated the federal definition in DOMA; Perry was a standing decision whose practical effect was to leave the district-court judgment in place. The key design fact is that the combined outcome was liberal but not maximally liberal. That creates room for both acceptance and counter-response.');
  }

  // 3. Law and economics stakes
  {
    const slide = pptx.addSlide('CONTENT');
    addTitle(slide, 'Legal finality and social settlement are different outcomes', 'Why law & economics should care');
    addShape(slide, SH.ellipse, 5.39, 2.14, 2.55, 2.55, C.oxblood, null, 0);
    addCourtIcon(slide, 6.04, 2.67, 0.48, C.white);
    addText(slide, 'COURT\nRULING', 5.82, 3.56, 1.70, 0.66, { fontSize: 13, bold: true, color: C.white, align: 'center' });
    const cards = [
      { x: 0.78, y: 1.72, w: 3.75, h: 1.37, fill: C.jadeLight, line: C.jade, title: 'Persuasion', body: 'Authority can lower the political cost of policy change by bringing preferences toward the result.' },
      { x: 0.78, y: 4.24, w: 3.75, h: 1.37, fill: C.violetLight, line: C.violet, title: 'Coordination', body: 'A clear rule can settle expectations and behavior even when underlying preferences do not move.' },
      { x: 8.79, y: 2.98, w: 3.75, h: 1.37, fill: C.coralLight, line: C.coral, title: 'Backlash', body: 'A salient judgment can harden positions, increase anger, and raise downstream conflict costs.' },
    ];
    for (const c of cards) {
      addCard(slide, c.x, c.y, c.w, c.h, c.fill, c.line, false);
      addText(slide, c.title, c.x + 0.28, c.y + 0.17, c.w - 0.56, 0.33, { fontFace: 'Cambria', fontSize: 20, bold: true, color: c.line });
      addText(slide, c.body, c.x + 0.28, c.y + 0.54, c.w - 0.56, 0.66, { fontSize: 14.2, color: C.slate, valign: 'top' });
    }
    addLine(slide, 4.53, 2.38, 0.88, 0.42, C.jade, 2, true);
    addLine(slide, 4.53, 4.75, 0.88, -0.42, C.violet, 2, true);
    addLine(slide, 7.94, 3.42, 0.83, 0, C.coral, 2, true);
    addCard(slide, 4.44, 5.25, 4.47, 0.92, C.gray2, C.gray, false);
    addText(slide, 'The paper asks which social technology judicial review actually supplies.', 4.78, 5.46, 3.80, 0.52, { fontSize: 16, bold: true, align: 'center', color: C.ink });
    addFooter(slide, 'Interpretive frame for a law-and-economics colloquium.');
    addNote(slide, 'Translate the public-law question into institutional terms. Judicial legitimacy may function as persuasion, as coordination, or as a trigger for costly countermobilization. Our data primarily distinguish persuasion from conflict-structuring. Avoid claiming a welfare analysis that the paper does not estimate.');
  }

  // 4. Predictions
  {
    const slide = pptx.addSlide('CONTENT');
    addTitle(slide, 'Three accounts make observably different predictions', 'Theory');
    const cols = [
      { x: 2.55, w: 3.24, title: 'Legitimation', fill: C.jadeLight, line: C.jade, sub: 'deference to authority' },
      { x: 5.94, w: 3.24, title: 'Structural response', fill: C.coralLight, line: C.coral, sub: 'discussion reinforces groups' },
      { x: 9.33, w: 3.24, title: 'Thermostatic response', fill: C.goldLight, line: C.gold, sub: 'policy prompts counter-demand' },
    ];
    addText(slide, 'OUTCOME', 0.72, 1.54, 1.55, 0.32, { fontSize: 11, bold: true, color: C.muted, charSpacing: 1.1 });
    for (const c of cols) {
      addCard(slide, c.x, 1.36, c.w, 0.86, c.fill, c.line, false);
      addText(slide, c.title, c.x + 0.18, 1.48, c.w - 0.36, 0.31, { fontFace: 'Cambria', fontSize: 18, bold: true, color: c.line, align: 'center' });
      addText(slide, c.sub, c.x + 0.18, 1.82, c.w - 0.36, 0.22, { fontSize: 10.5, color: C.slate, align: 'center' });
    }
    const rows = [
      { y: 2.52, label: 'Policy support', a: 'moves toward the ruling  →', b: 'supporters ↑  opponents ↓', c: 'left and right counter-react' },
      { y: 3.68, label: 'Anger', a: 'falls—especially among opponents  ↓', b: 'opponents ↑  supporters ↓', c: 'rises at ideological extremes  ↑' },
      { y: 4.84, label: 'Intensity', a: 'likely falls  ↓', b: 'may rise on both sides  ↑', c: 'rises with counter-demand  ↑' },
    ];
    for (const r of rows) {
      addCard(slide, 0.72, r.y, 1.62, 0.88, C.gray2, C.gray, false);
      addText(slide, r.label, 0.88, r.y + 0.20, 1.30, 0.40, { fontFace: 'Cambria', fontSize: 17, bold: true, color: C.ink, align: 'center' });
      const vals = [r.a, r.b, r.c];
      cols.forEach((c, i) => {
        addCard(slide, c.x, r.y, c.w, 0.88, C.white, C.gray, false);
        addText(slide, vals[i], c.x + 0.22, r.y + 0.15, c.w - 0.44, 0.54, { fontSize: 14.2, align: 'center', color: C.slate });
      });
    }
    addChip(slide, 'KEY TEST', 0.76, 6.23, 1.10, C.oxblood, C.white);
    addText(slide, 'Does institutional authority soften opposition—or sort people into more opposed camps?', 2.03, 6.21, 10.08, 0.38, { fontSize: 19, bold: true, color: C.oxblood });
    addFooter(slide, 'Theories synthesized from Dahl; Gibson and Caldeira; Franklin and Kosaki; Ura; Wlezien.');
    addNote(slide, 'The most important contrast is legitimation versus structural response. Legitimation predicts movement toward acceptance and less anger. Structural response predicts that a salient decision becomes a discussion focal point and reinforces preexisting opinion groups. The thermostatic account also predicts counter-response, but more cleanly along ideology and policy distance.');
  }

  // 5. Research design
  {
    const slide = pptx.addSlide('CONTENT');
    addTitle(slide, 'A sharp legal event inside a high-frequency stream of speech', 'Research design');
    addText(slide, 'MARCH 26', 0.88, 1.52, 1.25, 0.26, { fontSize: 10.5, bold: true, color: C.muted, align: 'center' });
    addText(slide, 'JUNE 26', 5.98, 1.52, 1.25, 0.26, { fontSize: 10.5, bold: true, color: C.oxblood2, align: 'center' });
    addText(slide, 'AUGUST 10', 10.95, 1.52, 1.25, 0.26, { fontSize: 10.5, bold: true, color: C.muted, align: 'center' });
    addLine(slide, 1.5, 2.17, 10.1, 0, C.gray, 4, false);
    addShape(slide, SH.ellipse, 1.42, 2.00, 0.34, 0.34, C.slate, null, 0);
    addShape(slide, SH.ellipse, 6.42, 1.91, 0.52, 0.52, C.oxblood, C.white, 0);
    addShape(slide, SH.ellipse, 11.42, 2.00, 0.34, 0.34, C.slate, null, 0);
    addText(slide, 'Observation window', 1.98, 1.94, 3.75, 0.38, { fontSize: 16, color: C.slate, align: 'center' });
    addText(slide, 'Windsor + Perry', 5.71, 2.55, 1.95, 0.36, { fontFace: 'Cambria', fontSize: 17, bold: true, color: C.oxblood, align: 'center' });
    addText(slide, 'Observation window', 7.62, 1.94, 3.35, 0.38, { fontSize: 16, color: C.slate, align: 'center' });
    addCard(slide, 0.84, 3.36, 2.72, 1.70, C.gray2, C.gray, false);
    addBigNumber(slide, '2.5M+', 'same-sex-marriage tweets', 1.05, 3.61, 2.30, C.oxblood);
    addCard(slide, 3.85, 3.36, 2.72, 1.70, C.coralLight, C.coral, false);
    addBigNumber(slide, '335,399', 'tweets on decision day', 4.06, 3.61, 2.30, C.coral);
    addCard(slide, 6.86, 3.36, 2.72, 1.70, C.jadeLight, C.jade, false);
    addBigNumber(slide, '≈700', 'frequent accounts in panel', 7.07, 3.61, 2.30, C.jade);
    addCard(slide, 9.87, 3.36, 2.72, 1.70, C.goldLight, C.gold, false);
    addBigNumber(slide, '1,400', 'human-coded training tweets', 10.08, 3.61, 2.30, C.gold);
    addCard(slide, 1.51, 5.64, 10.30, 0.78, C.white, C.gray, false);
    addChip(slide, 'DESIGN NOTE', 1.79, 5.86, 1.42, C.violetLight, C.violet);
    addText(slide, 'A before/after observational design: the ruling is the event—not a randomized treatment.', 3.44, 5.80, 7.94, 0.38, { fontSize: 16.5, bold: true, color: C.slate });
    addFooter(slide, 'Keywords: “ssm,” “same sex marriage,” “DOMA,” “Prop8,” and “gay marriage.” English-language tweets only.');
    addNote(slide, 'Make the identification claim modest from the start. The event date is sharp and discourse is observed daily, but there is no untreated counterfactual. The value of the design is temporal resolution, enormous coverage of relevant speech, and replication across a daily stream and a fixed panel.');
  }

  // 6. Samples
  {
    const slide = pptx.addSlide('CONTENT');
    addTitle(slide, 'Two samples separate public attention from within-account change', 'Research design');
    addCard(slide, 0.82, 1.53, 5.63, 4.58, C.gray2, C.gray, false);
    addChip(slide, 'DAILY STREAM', 1.18, 1.89, 1.56, C.oxblood, C.white);
    addText(slide, 'Who is speaking today?', 1.17, 2.40, 4.85, 0.42, { fontFace: 'Cambria', fontSize: 24, bold: true });
    for (let r = 0; r < 4; r += 1) {
      for (let i = 0; i < 10; i += 1) {
        const colors = [C.slate, C.jade, C.coral, C.gold, C.violet];
        addShape(slide, SH.ellipse, 1.22 + i * 0.43, 3.17 + r * 0.45, 0.19, 0.19, colors[(i + r * 2) % colors.length], null, 0, { transparency: (i + r) % 3 === 0 ? 30 : 5 });
      }
    }
    addText(slide, 'Large, changing cross-section of issue-related tweets each day', 1.17, 5.16, 4.86, 0.56, { fontSize: 15.5, color: C.slate, align: 'center' });
    addCard(slide, 6.88, 1.53, 5.63, 4.58, C.jadeLight, C.jade, false);
    addChip(slide, 'ACCOUNT PANEL', 7.24, 1.89, 1.72, C.jade, C.white);
    addText(slide, 'How do the same speakers change?', 7.23, 2.40, 4.85, 0.42, { fontFace: 'Cambria', fontSize: 24, bold: true });
    const tracked = [C.coral, C.gold, C.violet, C.slate, C.oxblood];
    tracked.forEach((color, i) => {
      const yy = 3.15 + i * 0.43;
      addShape(slide, SH.ellipse, 7.47, yy, 0.20, 0.20, color, null, 0);
      addLine(slide, 7.78, yy + 0.10, 3.40, 0, C.gray, 1.4, true);
      addShape(slide, SH.ellipse, 11.35, yy, 0.20, 0.20, color, null, 0);
    });
    addText(slide, 'Frequent accounts tracked continuously—without being recruited into a survey panel', 7.23, 5.16, 4.86, 0.56, { fontSize: 15.5, color: C.slate, align: 'center' });
    addText(slide, 'When both samples move together, simple compositional turnover becomes a less satisfying explanation.', 1.15, 6.39, 11.05, 0.42, { fontSize: 18, bold: true, color: C.oxblood, align: 'center' });
    addFooter(slide, '“Random sample” refers to the Twitter stream, not a national probability sample.');
    addNote(slide, 'The daily sample captures the discourse that is visible on a given day, including changing attention and participation. The panel captures within-account change among frequent speakers. Neither is nationally representative. Agreement across the two views helps address—but does not eliminate—concerns about changing composition.');
  }

  // 7. Pipeline
  {
    const slide = pptx.addSlide('CONTENT');
    addTitle(slide, 'From public speech to theoretically meaningful quantities', 'Measurement');
    addCard(slide, 0.78, 1.47, 8.22, 4.70, C.white, C.gray, true);
    await addImageContain(slide, path.join(ASSETS, 'figure-1-pipeline.png'), 1.03, 1.76, 7.72, 3.88);
    addText(slide, 'A reusable architecture—not a one-off word count', 1.35, 5.62, 7.05, 0.34, { fontSize: 15.5, bold: true, color: C.oxblood, align: 'center' });
    addCard(slide, 9.42, 1.47, 3.12, 1.14, C.jadeLight, C.jade, false);
    addText(slide, 'SUPPORT', 9.68, 1.67, 2.60, 0.28, { fontSize: 11.5, bold: true, color: C.jade, charSpacing: 1.1, align: 'center' });
    addText(slide, 'supportive · neutral · opposed', 9.68, 2.01, 2.60, 0.28, { fontSize: 13, color: C.slate, align: 'center' });
    addCard(slide, 9.42, 2.91, 3.12, 1.14, C.violetLight, C.violet, false);
    addText(slide, 'INTENSITY', 9.68, 3.11, 2.60, 0.28, { fontSize: 11.5, bold: true, color: C.violet, charSpacing: 1.1, align: 'center' });
    addText(slide, 'intense · dispassionate', 9.68, 3.45, 2.60, 0.28, { fontSize: 13, color: C.slate, align: 'center' });
    addCard(slide, 9.42, 4.35, 3.12, 1.14, C.coralLight, C.coral, false);
    addText(slide, 'ANGER', 9.68, 4.55, 2.60, 0.28, { fontSize: 11.5, bold: true, color: C.coral, charSpacing: 1.1, align: 'center' });
    addText(slide, 'pleased · neutral · angry', 9.68, 4.89, 2.60, 0.28, { fontSize: 13, color: C.slate, align: 'center' });
    addCard(slide, 3.27, 6.40, 6.78, 0.52, C.gray2, C.gray, false);
    addText(slide, 'The claim is about revealed public discourse—not private preferences.', 3.53, 6.49, 6.28, 0.30, { fontSize: 16, bold: true, color: C.ink, align: 'center' });
    addFooter(slide, 'Source: Clark et al., version 5, Figure 1 and pp. 14–16.');
    addNote(slide, 'Emphasize the conceptual bridge. A tweet is an utterance shaped by what is salient and activated in a network; it is not a direct readout of a stable latent preference. The classifiers recover support, intensity, and anger from human-coded examples. Those dimensions correspond to the competing theoretical predictions.');
  }

  // 8. Validation
  {
    const slide = pptx.addSlide('CONTENT');
    addTitle(slide, 'Measurement is imperfect—but the errors are visible', 'Validation');
    addCard(slide, 0.77, 1.46, 4.12, 4.92, C.gray2, C.gray, false);
    addText(slide, '10-fold cross-validation', 1.11, 1.78, 3.43, 0.40, { fontFace: 'Cambria', fontSize: 22, bold: true, align: 'center' });
    addBigNumber(slide, '68%', 'support classification accuracy', 1.10, 2.39, 1.05, C.jade);
    addBigNumber(slide, '73%', 'intensity classification accuracy', 2.29, 2.39, 1.05, C.violet);
    addBigNumber(slide, '69%', 'anger classification accuracy', 3.48, 2.39, 1.05, C.coral);
    addCard(slide, 1.09, 3.84, 3.50, 1.65, C.white, C.gray, false);
    addText(slide, 'What works best', 1.37, 4.05, 2.94, 0.28, { fontSize: 14, bold: true, color: C.jade });
    addText(slide, 'Supportive and neutral tweets; intense versus dispassionate speech.', 1.37, 4.38, 2.94, 0.54, { fontSize: 14.2, color: C.slate, valign: 'top' });
    addText(slide, 'Harder cases', 1.37, 4.97, 2.94, 0.26, { fontSize: 14, bold: true, color: C.coral });
    addText(slide, 'Rare opposition and anger categories.', 1.37, 5.26, 2.94, 0.32, { fontSize: 14.2, color: C.slate });
    addCard(slide, 5.30, 1.46, 7.26, 4.92, C.white, C.gray, true);
    await addImageContain(slide, path.join(ASSETS, 'figure-2-classifier-validation.png'), 5.63, 1.78, 6.60, 3.74);
    addText(slide, 'Daily classifier estimates track the hand-coded series', 5.89, 5.58, 6.05, 0.34, { fontSize: 15.5, bold: true, color: C.oxblood, align: 'center' });
    addText(slide, 'The main inference relies on patterns and contrasts—not on pretending each label is error-free.', 1.24, 6.61, 10.91, 0.35, { fontSize: 17.5, bold: true, color: C.ink, align: 'center' });
    addFooter(slide, 'Source: Clark et al., version 5, Table 2 and Figure 2.');
    addNote(slide, 'Be candid here. The classifier is useful but not perfect, and rare classes are the hardest. The stronger evidence is that daily aggregate estimates track the hand-coded series and that key patterns recur in two samples. A colloquium audience may ask about attenuation, class imbalance, and whether error changes at the event date.');
  }

  // 9. Ideology validation
  {
    const slide = pptx.addSlide('CONTENT');
    addTitle(slide, 'Follower networks recover ideology—but ideology is not issue position', 'Validation');
    addCard(slide, 0.80, 1.46, 6.45, 4.91, C.white, C.gray, true);
    await addImageContain(slide, path.join(ASSETS, 'figure-4-ideology-validation.png'), 1.20, 1.66, 5.65, 4.32);
    addCard(slide, 7.68, 1.46, 4.87, 1.16, C.violetLight, C.violet, false);
    addText(slide, '1. Infer latent distance', 7.99, 1.66, 4.22, 0.28, { fontFace: 'Cambria', fontSize: 18, bold: true, color: C.violet });
    addText(slide, 'People are less likely to follow accounts far from them in ideological space.', 7.99, 1.99, 4.22, 0.44, { fontSize: 13.8, color: C.slate, valign: 'top' });
    addCard(slide, 7.68, 2.91, 4.87, 1.16, C.jadeLight, C.jade, false);
    addText(slide, '2. Validate against profiles', 7.99, 3.11, 4.22, 0.28, { fontFace: 'Cambria', fontSize: 18, bold: true, color: C.jade });
    addText(slide, 'Self-described liberals and conservatives separate strongly on the recovered scale.', 7.99, 3.44, 4.22, 0.44, { fontSize: 13.8, color: C.slate, valign: 'top' });
    addCard(slide, 7.68, 4.36, 4.87, 1.16, C.coralLight, C.coral, false);
    addText(slide, '3. Keep the concepts distinct', 7.99, 4.56, 4.22, 0.28, { fontFace: 'Cambria', fontSize: 18, bold: true, color: C.coral });
    addText(slide, 'General ideology and prior support for marriage equality need not sort the same people.', 7.99, 4.89, 4.22, 0.44, { fontSize: 13.8, color: C.slate, valign: 'top' });
    addText(slide, 'That distinction becomes the central empirical result.', 7.87, 6.12, 4.52, 0.45, { fontSize: 18, bold: true, color: C.oxblood, align: 'center' });
    addFooter(slide, 'Source: Clark et al., version 5, Figure 4 and pp. 20–23.');
    addNote(slide, 'The ideology measure comes from who follows whom, using a latent-distance model. Its construct validity is supported by self-declared profiles and recognizable elite accounts at the endpoints. The conceptual warning is important: ideology and issue-specific prior opinion are different groupings. The results polarize by the latter, not the former.');
  }

  // 10. Aggregate result
  {
    const slide = pptx.addSlide('CONTENT');
    addTitle(slide, 'No aggregate movement toward the Court’s policy', 'Finding 1');
    addCard(slide, 0.83, 1.55, 5.55, 3.93, C.gray2, C.gray, false);
    addChip(slide, 'DAILY STREAM', 1.18, 1.91, 1.62, C.oxblood, C.white);
    addText(slide, '1.68', 1.23, 2.58, 1.65, 0.78, { fontFace: 'Cambria', fontSize: 44, bold: true, color: C.ink, align: 'center' });
    addText(slide, 'before', 1.58, 3.30, 0.95, 0.30, { fontSize: 12.5, color: C.muted, align: 'center' });
    addOutcomeArrow(slide, 3.10, 3.02, C.coral, 'right');
    addText(slide, '1.56', 4.15, 2.58, 1.65, 0.78, { fontFace: 'Cambria', fontSize: 44, bold: true, color: C.coral, align: 'center' });
    addText(slide, 'after', 4.50, 3.30, 0.95, 0.30, { fontSize: 12.5, color: C.muted, align: 'center' });
    addText(slide, 'Supportiveness index', 1.18, 4.12, 4.85, 0.34, { fontSize: 14.5, color: C.slate, align: 'center' });
    addCard(slide, 6.95, 1.55, 5.55, 3.93, C.jadeLight, C.jade, false);
    addChip(slide, 'ACCOUNT PANEL', 7.30, 1.91, 1.68, C.jade, C.white);
    addText(slide, '1.13', 7.35, 2.58, 1.65, 0.78, { fontFace: 'Cambria', fontSize: 44, bold: true, color: C.ink, align: 'center' });
    addText(slide, 'before', 7.70, 3.30, 0.95, 0.30, { fontSize: 12.5, color: C.muted, align: 'center' });
    addOutcomeArrow(slide, 9.22, 3.02, C.coral, 'right');
    addText(slide, '1.11', 10.27, 2.58, 1.65, 0.78, { fontFace: 'Cambria', fontSize: 44, bold: true, color: C.coral, align: 'center' });
    addText(slide, 'after', 10.62, 3.30, 0.95, 0.30, { fontSize: 12.5, color: C.muted, align: 'center' });
    addText(slide, 'Supportiveness index', 7.30, 4.12, 4.85, 0.34, { fontSize: 14.5, color: C.slate, align: 'center' });
    addShape(slide, SH.ellipse, 0.96, 5.96, 0.54, 0.54, C.coral, null, 0);
    addText(slide, '×', 1.05, 5.97, 0.36, 0.43, { fontSize: 21, bold: true, color: C.white, align: 'center' });
    addText(slide, 'Statistically detectable because N is enormous; substantively small and in the wrong direction for legitimation.', 1.73, 5.84, 10.68, 0.76, { fontSize: 19, bold: true, color: C.oxblood, valign: 'mid' });
    addFooter(slide, 'Source: Clark et al., version 5, p. 24. Decision-day tweets excluded from pre/post comparisons.');
    addNote(slide, 'The aggregate support result is straightforward. Support does not move toward the Court. The means actually decline slightly in both samples. The differences are statistically meaningful because the samples are huge, but the paper correctly treats them as substantively tiny. This is no evidence for aggregate legitimation.');
  }

  // 11. Polarization result
  {
    const slide = pptx.addSlide('CONTENT');
    addTitle(slide, 'Prior policy position predicts polarization; ideology does not', 'Finding 2');
    addCard(slide, 0.78, 1.39, 11.78, 4.82, C.white, C.gray, true);
    await addImageContain(slide, path.join(ASSETS, 'figure-5-polarization.png'), 1.04, 1.67, 11.24, 3.50);
    addChip(slide, 'NEAR-FLAT', 2.09, 5.29, 1.18, C.gray2, C.muted);
    addText(slide, 'general ideology', 3.39, 5.30, 2.28, 0.30, { fontSize: 15, color: C.slate });
    addChip(slide, 'UPWARD', 7.42, 5.29, 1.18, C.coralLight, C.coral);
    addText(slide, 'prior issue support', 8.73, 5.30, 2.28, 0.30, { fontSize: 15, color: C.slate });
    addCard(slide, 1.63, 6.37, 10.10, 0.54, C.oxblood, C.oxblood, false);
    addText(slide, 'Supporters became more supportive; opponents became more opposed.', 1.95, 6.46, 9.46, 0.30, { fontSize: 18, bold: true, color: C.white, align: 'center' });
    addFooter(slide, 'Source: Clark et al., version 5, Figure 5. Point sizes reflect each panelist’s tweet volume.');
    addNote(slide, 'This is the central result. The left panel is essentially flat: general liberal-conservative location does not explain change. The right panel slopes upward: people who were supportive before become more supportive, while those opposed become more opposed. The Court appears to structure conflict among issue groups, not simply push everyone toward its result.');
  }

  // 12. Emotion result
  {
    const slide = pptx.addSlide('CONTENT');
    addTitle(slide, 'Emotion moves faster—and more sharply—than policy support', 'Finding 3');
    addCard(slide, 0.78, 1.46, 5.74, 4.87, C.white, C.gray, true);
    await addImageContain(slide, path.join(ASSETS, 'figure-6-intensity-random.png'), 1.05, 1.72, 5.20, 3.75);
    addChip(slide, 'INTENSITY', 1.18, 5.58, 1.22, C.violetLight, C.violet);
    addText(slide, 'Both supportive and opposed speech spike, then fade.', 2.61, 5.56, 3.48, 0.45, { fontSize: 14.7, bold: true, color: C.slate });
    addCard(slide, 6.82, 1.46, 5.74, 4.87, C.white, C.gray, true);
    await addImageContain(slide, path.join(ASSETS, 'figure-6-anger-random.png'), 7.09, 1.72, 5.20, 3.75);
    addChip(slide, 'ANGER', 7.22, 5.58, 1.02, C.coralLight, C.coral);
    addText(slide, 'Opposition spikes; supportive speech becomes less angry at first.', 8.46, 5.56, 3.70, 0.45, { fontSize: 14.7, bold: true, color: C.slate });
    addText(slide, 'The response is pronounced but short-lived—exactly the kind of burst surveys are likely to miss.', 1.26, 6.59, 10.83, 0.35, { fontSize: 18, bold: true, color: C.oxblood, align: 'center' });
    addFooter(slide, 'Source: Clark et al., version 5, Figure 6 and pp. 26–30. Blue = supportive; red = opposed.');
    addNote(slide, 'Focus on the discontinuity around the decision rather than every wiggle. Intensity rises on both sides and then declines. Anger drops among supportive tweets and rises among opposed tweets immediately after the decision. The later reversal is consistent with an interactional dynamic: one side’s angry response becomes material for the other side’s response.');
  }

  // 13. Mechanism
  {
    const slide = pptx.addSlide('CONTENT');
    addTitle(slide, 'The likely mechanism is structured response—not deference', 'Mechanism');
    const nodes = [
      { x: 0.86, y: 2.42, w: 2.35, title: '1  Salient ruling', body: 'A common legal event supplies a focal point for discussion.', fill: C.oxblood, text: C.white },
      { x: 3.72, y: 2.42, w: 2.35, title: '2  Opponents react', body: 'Discontent has a responsible institutional target.', fill: C.coralLight, text: C.ink },
      { x: 6.58, y: 2.42, w: 2.35, title: '3  Supporters answer', body: 'Counter-speech reacts to the opposing side’s anger.', fill: C.jadeLight, text: C.ink },
      { x: 9.44, y: 2.42, w: 2.35, title: '4  Conflict persists', body: 'Positions harden even as the emotional burst dissipates.', fill: C.goldLight, text: C.ink },
    ];
    nodes.forEach((n, i) => {
      addCard(slide, n.x, n.y, n.w, 2.04, n.fill, i === 0 ? C.oxblood : C.gray, false);
      addText(slide, n.title, n.x + 0.22, n.y + 0.24, n.w - 0.44, 0.38, { fontFace: 'Cambria', fontSize: 19, bold: true, color: n.text, align: 'center' });
      addText(slide, n.body, n.x + 0.25, n.y + 0.79, n.w - 0.50, 0.80, { fontSize: 14.5, color: i === 0 ? 'F2E9EC' : C.slate, align: 'center', valign: 'mid' });
      if (i < nodes.length - 1) addLine(slide, n.x + n.w + 0.11, n.y + 1.02, 0.39, 0, C.muted, 2, true);
    });
    addCard(slide, 1.27, 5.26, 10.80, 0.94, C.gray2, C.gray, false);
    addRuns(slide, [
      { text: 'Inference: ', options: { bold: true, color: C.oxblood } },
      { text: 'the observed sequence is consistent with Franklin and Kosaki’s discussion-group mechanism; the design does not directly identify each conversational link.', options: { color: C.slate } },
    ], 1.63, 5.45, 10.08, 0.52, { fontSize: 16.5, align: 'center' });
    addText(slide, 'A decision can end litigation while beginning a new round of social interaction.', 1.53, 6.55, 10.30, 0.38, { fontFace: 'Cambria', fontSize: 21, bold: true, color: C.oxblood, align: 'center' });
    addFooter(slide, 'Mechanism discussion: Clark et al., version 5, pp. 28–30.');
    addNote(slide, 'Treat this as a mechanism interpretation, not a directly identified mediation analysis. The ruling makes the issue salient, opponents direct anger toward an accountable institution, and supporters react to that opposition. The sequence fits the structural-response account. A stronger design would trace replies and retweets or compare interaction networks around multiple decisions.');
  }

  // 14. No ideological polarization
  {
    const slide = pptx.addSlide('CONTENT');
    addTitle(slide, 'Why no liberal–conservative split? Look at age within party', 'Heterogeneity');
    addText(slide, 'Support for same-sex marriage, spring 2013', 0.92, 1.47, 5.35, 0.36, { fontFace: 'Cambria', fontSize: 20, bold: true });
    const barX = 2.38;
    const barW = 4.16;
    const rows = [
      { y: 2.20, label: 'All Republicans', value: 33, color: C.coral },
      { y: 2.88, label: 'Republicans 18–29', value: 54, color: C.oxblood },
      { y: 4.03, label: 'All Democrats', value: 62, color: C.jade },
      { y: 4.71, label: 'Democrats 18–29', value: 76, color: C.violet },
    ];
    rows.forEach((r) => {
      addText(slide, r.label, 0.92, r.y, 1.32, 0.30, { fontSize: 13.5, bold: true, color: C.slate, align: 'right' });
      addShape(slide, SH.roundRect, barX, r.y + 0.03, barW, 0.28, C.gray2, C.gray, 0.10);
      addShape(slide, SH.roundRect, barX, r.y + 0.03, barW * r.value / 100, 0.28, r.color, r.color, 0.10);
      addText(slide, `${r.value}%`, 6.70, r.y - 0.01, 0.70, 0.34, { fontSize: 15, bold: true, color: r.color });
    });
    addCard(slide, 7.62, 1.54, 4.78, 3.93, C.gray2, C.gray, false);
    addText(slide, 'Structural response needs group separation', 8.01, 1.91, 4.00, 0.62, { fontFace: 'Cambria', fontSize: 23, bold: true, color: C.ink, align: 'center' });
    addShape(slide, SH.ellipse, 8.20, 2.88, 1.55, 1.55, C.coralLight, C.coral, 0, { transparency: 10 });
    addShape(slide, SH.ellipse, 9.08, 2.88, 1.55, 1.55, C.jadeLight, C.jade, 0, { transparency: 10 });
    addText(slide, 'within-group\nvariation', 8.12, 3.31, 1.38, 0.58, { fontSize: 13, bold: true, color: C.coral, align: 'center' });
    addText(slide, 'between-group\ndifference', 9.54, 3.31, 1.72, 0.58, { fontSize: 13, bold: true, color: C.jade, align: 'center' });
    addText(slide, 'A younger Twitter population compresses the partisan gap on this issue.', 8.02, 4.65, 3.98, 0.50, { fontSize: 15.5, bold: true, color: C.oxblood, align: 'center' });
    addCard(slide, 1.44, 5.90, 10.49, 0.72, C.goldLight, C.gold, false);
    addText(slide, 'The result is not “no polarization.” It is polarization along the grouping that is actually coherent on the policy.', 1.84, 6.05, 9.69, 0.38, { fontSize: 17, bold: true, color: C.ink, align: 'center' });
    addFooter(slide, 'Source: Clark et al., version 5, Table 3; Pew Research Center data aggregated March–May 2013.');
    addNote(slide, 'The paper’s interpretation is demographic. Twitter users skew younger, and young Republicans were much more supportive of marriage equality than Republicans overall. That weakens the relationship between general ideology and this particular issue. Structural response predicts polarization only when the relevant groups have low within-group variation and high between-group separation.');
  }

  // 15. Legal interpretation
  {
    const slide = pptx.addSlide('CONTENT');
    addTitle(slide, 'What the Court settled—and what it left unsettled', 'Legal interpretation');
    addCard(slide, 0.84, 1.54, 5.57, 4.84, C.jadeLight, C.jade, false);
    addChip(slide, 'LEGAL SETTLEMENT', 1.20, 1.91, 1.86, C.jade, C.white);
    addText(slide, 'The judgment changed', 1.18, 2.49, 4.90, 0.42, { fontFace: 'Cambria', fontSize: 23, bold: true, color: C.ink });
    const leftItems = [
      'Federal recognition rules under DOMA §3',
      'The practical status of California’s Proposition 8',
      'Immediate rights, obligations, and administrative expectations',
    ];
    leftItems.forEach((t, i) => {
      addShape(slide, SH.ellipse, 1.22, 3.15 + i * 0.78, 0.28, 0.28, C.jade, null, 0);
      addText(slide, '✓', 1.26, 3.16 + i * 0.78, 0.20, 0.22, { fontSize: 12.5, bold: true, color: C.white, align: 'center' });
      addText(slide, t, 1.70, 3.08 + i * 0.78, 4.18, 0.55, { fontSize: 15.3, color: C.slate });
    });
    addCard(slide, 6.93, 1.54, 5.57, 4.84, C.coralLight, C.coral, false);
    addChip(slide, 'SOCIAL SETTLEMENT', 7.29, 1.91, 1.90, C.coral, C.white);
    addText(slide, 'The judgment did not settle', 7.27, 2.49, 4.90, 0.42, { fontFace: 'Cambria', fontSize: 23, bold: true, color: C.ink });
    const rightItems = [
      'The public meaning or legitimacy of marriage equality',
      'Agreement among the most committed issue groups',
      'A nationwide constitutional right—that came later in Obergefell',
    ];
    rightItems.forEach((t, i) => {
      addShape(slide, SH.ellipse, 7.31, 3.15 + i * 0.78, 0.28, 0.28, C.coral, null, 0);
      addText(slide, '×', 7.35, 3.16 + i * 0.78, 0.20, 0.22, { fontSize: 12.5, bold: true, color: C.white, align: 'center' });
      addText(slide, t, 7.79, 3.08 + i * 0.78, 4.18, 0.55, { fontSize: 15.3, color: C.slate });
    });
    addText(slide, 'Judicial authority can coordinate behavior without producing opinion convergence.', 1.29, 6.63, 10.77, 0.35, { fontSize: 19, bold: true, color: C.oxblood, align: 'center' });
    addFooter(slide, 'Interpretation of Windsor and Perry; Obergefell v. Hodges followed in 2015.');
    addNote(slide, 'This is the doctrinal and institutional takeaway. The decisions changed legal relations and administrative expectations. They did not create consensus about the policy, and Perry did not resolve a nationwide right. Coordination and persuasion should not be collapsed into one concept of “legitimation.”');
  }

  // 16. Credibility
  {
    const slide = pptx.addSlide('CONTENT');
    addTitle(slide, 'What this design can—and cannot—support', 'Credibility');
    addText(slide, 'STRENGTHS', 0.84, 1.49, 5.62, 0.34, { fontSize: 11.5, bold: true, color: C.jade, charSpacing: 1.2 });
    addText(slide, 'LIMITS', 6.88, 1.49, 5.62, 0.34, { fontSize: 11.5, bold: true, color: C.coral, charSpacing: 1.2 });
    const strengths = [
      ['Real-time behavior', 'Daily speech captures short-lived reactions that survey waves miss.'],
      ['Two samples', 'Cross-section and fixed panel offer complementary checks.'],
      ['Theory-linked measures', 'Support, intensity, anger, and ideology map to explicit predictions.'],
      ['Transparent error', 'Human coding and validation reveal classifier weaknesses.'],
    ];
    const limits = [
      ['No national sample', 'Twitter participants—especially frequent speakers—are selected.'],
      ['No untreated counterfactual', 'Before/after patterns are not a fully identified causal effect.'],
      ['One issue and era', 'Marriage equality in 2013 may not travel to other rulings or platforms.'],
      ['Measurement error', 'Rare opposition and anger are the hardest classes to detect.'],
    ];
    strengths.forEach((item, i) => {
      const y = 1.95 + i * 1.10;
      addCard(slide, 0.84, y, 5.62, 0.90, i % 2 === 0 ? C.jadeLight : C.white, C.jade, false);
      addText(slide, item[0], 1.12, y + 0.14, 1.62, 0.29, { fontFace: 'Cambria', fontSize: 16, bold: true, color: C.jade });
      addText(slide, item[1], 2.92, y + 0.12, 3.20, 0.54, { fontSize: 13.2, color: C.slate, valign: 'top' });
    });
    limits.forEach((item, i) => {
      const y = 1.95 + i * 1.10;
      addCard(slide, 6.88, y, 5.62, 0.90, i % 2 === 0 ? C.coralLight : C.white, C.coral, false);
      addText(slide, item[0], 7.16, y + 0.14, 1.80, 0.29, { fontFace: 'Cambria', fontSize: 16, bold: true, color: C.coral });
      addText(slide, item[1], 9.08, y + 0.12, 3.08, 0.54, { fontSize: 13.2, color: C.slate, valign: 'top' });
    });
    addCard(slide, 1.54, 6.54, 10.20, 0.42, C.oxblood, C.oxblood, false);
    addText(slide, 'Defensible claim: the decisions reorganized discourse among Twitter participants—not “the Court caused national opinion to polarize.”', 1.80, 6.60, 9.68, 0.26, { fontSize: 14.8, bold: true, color: C.white, align: 'center' });
    addFooter(slide, 'Scope conditions and limitations synthesized from Clark et al., version 5.');
    addNote(slide, 'This slide should defuse the obvious objections. The paper is strongest as evidence about the content and dynamics of public discourse among platform participants. It is not a national causal estimate. The panel, temporal resolution, and validation matter; they do not solve selection or the missing counterfactual.');
  }

  // 17. Contributions and future tests
  {
    const slide = pptx.addSlide('CONTENT');
    addTitle(slide, 'Three contributions—and a sharper next test', 'Contribution');
    const circles = [
      { x: 0.93, color: C.oxblood, n: '1', title: 'Institutional', body: 'Judicial legitimacy need not become policy legitimation.' },
      { x: 4.55, color: C.violet, n: '2', title: 'Methodological', body: 'Language data recover emotional dynamics absent from sparse surveys.' },
      { x: 8.17, color: C.jade, n: '3', title: 'Normative', body: 'Brief emotional shocks may reshape mobilization and deliberation.' },
    ];
    circles.forEach((c) => {
      addShape(slide, SH.ellipse, c.x + 0.88, 1.61, 1.30, 1.30, c.color, null, 0);
      addText(slide, c.n, c.x + 1.22, 1.85, 0.62, 0.66, { fontFace: 'Cambria', fontSize: 34, bold: true, color: C.white, align: 'center' });
      addText(slide, c.title, c.x, 3.12, 3.08, 0.36, { fontFace: 'Cambria', fontSize: 21, bold: true, color: c.color, align: 'center' });
      addText(slide, c.body, c.x + 0.16, 3.59, 2.76, 0.93, { fontSize: 15.2, color: C.slate, align: 'center', valign: 'top' });
    });
    addCard(slide, 1.02, 5.17, 11.28, 1.20, C.gray2, C.gray, false);
    addChip(slide, 'NEXT TEST', 1.34, 5.51, 1.24, C.goldLight, C.gold);
    addText(slide, 'Compare many rulings that vary in salience, ideological direction, unanimity, remedy, and implementation costs—then trace replies, retweets, and offline participation.', 2.85, 5.34, 9.02, 0.73, { fontSize: 16.5, bold: true, color: C.ink, valign: 'mid' });
    addFooter(slide, 'Proposed extension for discussion.');
    addNote(slide, 'The institutional contribution is to separate legitimacy of the institution from persuasion about policy. The methodological contribution is fine-grained measurement of speech and emotion. The normative contribution is that short emotional bursts may matter for mobilization even if they fade quickly. The next design should compare a population of rulings and directly model conversational networks.');
  }

  // 18. Conclusion
  {
    const slide = pptx.addSlide();
    slide.background = { color: C.oxblood };
    addShape(slide, SH.ellipse, -1.10, 4.68, 4.50, 4.50, C.oxblood2, null, 0, { transparency: 10 });
    addShape(slide, SH.ellipse, 10.25, -1.10, 4.40, 4.40, C.coral, null, 0, { transparency: 76 });
    addText(slide, 'TAKEAWAY', 0.78, 0.65, 2.10, 0.30, { fontSize: 11.5, bold: true, color: 'E3C7CD', charSpacing: 1.6 });
    addText(slide, 'Courts can win the case\nwithout winning the argument.', 0.78, 1.14, 8.90, 1.38, { fontFace: 'Cambria', fontSize: 36, bold: true, color: C.white, valign: 'top' });
    const conclusions = [
      { y: 3.22, n: '01', text: 'No aggregate legitimation of the policy', color: C.jade },
      { y: 4.18, n: '02', text: 'Opinion groups polarize—even when ideological groups do not', color: C.coral },
      { y: 5.14, n: '03', text: 'Emotion responds immediately, asymmetrically, and briefly', color: C.gold },
    ];
    conclusions.forEach((c) => {
      addShape(slide, SH.ellipse, 0.84, c.y, 0.56, 0.56, c.color, null, 0);
      addText(slide, c.n, 0.94, c.y + 0.10, 0.36, 0.28, { fontSize: 10.5, bold: true, color: C.white, align: 'center' });
      addText(slide, c.text, 1.72, c.y - 0.01, 9.45, 0.55, { fontSize: 20, bold: true, color: C.white });
    });
    addText(slide, 'Questions', 9.92, 6.13, 2.02, 0.48, { fontFace: 'Cambria', fontSize: 25, italic: true, color: 'EFD4D3', align: 'right' });
    addFooter(slide, 'Tom S. Clark · Jeffrey K. Staton · Yu Wang · Eugene Agichtein', true);
    addNote(slide, 'Close on the distinction between legal victory and social agreement. The Court did not produce aggregate movement toward its result. It did structure disagreement among people already divided on the policy, and it produced a fast emotional response. Invite questions about causal identification, platform selection, the ideology measure, and how the framework might apply to contemporary decisions.');
  }

  await pptx.writeFile({ fileName: OUT });
  console.log(OUT);
}

buildDeck().catch((error) => {
  console.error(error);
  process.exit(1);
});
