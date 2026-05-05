"""Build the Capstone Final Paper as a Word document.

Produces docs/final/Capstone-Final-Paper.docx in APA-friendly formatting:
Times New Roman 12pt, double-spaced, 1-inch margins, page numbers.
"""

from docx import Document
from docx.shared import Pt, Inches, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_LINE_SPACING
from docx.enum.section import WD_SECTION
from docx.oxml.ns import qn, nsmap
from docx.oxml import OxmlElement
from pathlib import Path


# ───────────────────────── helpers ─────────────────────────

def set_default_font(doc):
    style = doc.styles['Normal']
    style.font.name = 'Times New Roman'
    style.font.size = Pt(12)
    rpr = style.element.get_or_add_rPr()
    rfonts = rpr.find(qn('w:rFonts'))
    if rfonts is None:
        rfonts = OxmlElement('w:rFonts')
        rpr.append(rfonts)
    for attr in ('w:ascii', 'w:hAnsi', 'w:cs', 'w:eastAsia'):
        rfonts.set(qn(attr), 'Times New Roman')
    pf = style.paragraph_format
    pf.line_spacing_rule = WD_LINE_SPACING.DOUBLE
    pf.space_after = Pt(0)
    pf.space_before = Pt(0)


def set_margins(doc, inches=1.0):
    for section in doc.sections:
        section.top_margin = Inches(inches)
        section.bottom_margin = Inches(inches)
        section.left_margin = Inches(inches)
        section.right_margin = Inches(inches)


def add_page_numbers(doc):
    for section in doc.sections:
        footer = section.footer
        p = footer.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        run = p.add_run()
        fld_begin = OxmlElement('w:fldChar')
        fld_begin.set(qn('w:fldCharType'), 'begin')
        instr = OxmlElement('w:instrText')
        instr.text = 'PAGE'
        fld_sep = OxmlElement('w:fldChar')
        fld_sep.set(qn('w:fldCharType'), 'separate')
        fld_end = OxmlElement('w:fldChar')
        fld_end.set(qn('w:fldCharType'), 'end')
        run._r.append(fld_begin)
        run._r.append(instr)
        run._r.append(fld_sep)
        run._r.append(fld_end)


def add_para(doc, text, *, bold=False, italic=False, align=None,
             size=12, indent_first=True, line_space=WD_LINE_SPACING.DOUBLE):
    p = doc.add_paragraph()
    if align is not None:
        p.alignment = align
    pf = p.paragraph_format
    pf.line_spacing_rule = line_space
    pf.space_after = Pt(0)
    pf.space_before = Pt(0)
    if indent_first and align != WD_ALIGN_PARAGRAPH.CENTER:
        pf.first_line_indent = Inches(0.5)
    run = p.add_run(text)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(size)
    run.bold = bold
    run.italic = italic
    return p


def add_heading(doc, text, level=1, center=False):
    p = doc.add_paragraph()
    pf = p.paragraph_format
    pf.line_spacing_rule = WD_LINE_SPACING.DOUBLE
    pf.space_before = Pt(12)
    pf.space_after = Pt(0)
    if center or level == 1:
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run(text)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(12)
    run.bold = True
    return p


def add_blank(doc, n=1):
    for _ in range(n):
        p = doc.add_paragraph()
        p.paragraph_format.line_spacing_rule = WD_LINE_SPACING.DOUBLE


def add_page_break(doc):
    doc.add_page_break()


def add_bullets(doc, items):
    for it in items:
        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.line_spacing_rule = WD_LINE_SPACING.DOUBLE
        p.paragraph_format.space_after = Pt(0)
        for run in p.runs:
            run.font.name = 'Times New Roman'
            run.font.size = Pt(12)
        # the style adds its own run; replace cleanly
        p.clear()
        run = p.add_run(it)
        run.font.name = 'Times New Roman'
        run.font.size = Pt(12)


def add_reference(doc, text):
    p = doc.add_paragraph()
    pf = p.paragraph_format
    pf.line_spacing_rule = WD_LINE_SPACING.DOUBLE
    pf.left_indent = Inches(0.5)
    pf.first_line_indent = Inches(-0.5)  # hanging indent
    pf.space_after = Pt(0)
    run = p.add_run(text)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(12)


def add_table(doc, headers, rows):
    table = doc.add_table(rows=1, cols=len(headers))
    table.style = 'Light Grid'
    hdr = table.rows[0].cells
    for i, h in enumerate(headers):
        hdr[i].text = h
        for p in hdr[i].paragraphs:
            for run in p.runs:
                run.bold = True
                run.font.name = 'Times New Roman'
                run.font.size = Pt(11)
    for r in rows:
        cells = table.add_row().cells
        for i, val in enumerate(r):
            cells[i].text = val
            for p in cells[i].paragraphs:
                for run in p.runs:
                    run.font.name = 'Times New Roman'
                    run.font.size = Pt(11)


# ───────────────────────── document ─────────────────────────

doc = Document()
set_default_font(doc)
set_margins(doc, 1.0)
add_page_numbers(doc)


# ── Title page ──
add_blank(doc, 6)
add_para(doc,
         "Coffee Christopher Ops Suite: Building an Efficient Workflow for Busy Days and Digital Loyalty Retention in an Independent Drive-Thru Coffee Shop",
         bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, indent_first=False)
add_blank(doc, 2)
add_para(doc, "Christopher Betancourt", align=WD_ALIGN_PARAGRAPH.CENTER, indent_first=False)
add_para(doc, "Nova Southeastern University", align=WD_ALIGN_PARAGRAPH.CENTER, indent_first=False)
add_para(doc, "CSIS 4903 — Capstone Project for Computer Science", align=WD_ALIGN_PARAGRAPH.CENTER, indent_first=False)
add_para(doc, "May 2026", align=WD_ALIGN_PARAGRAPH.CENTER, indent_first=False)
add_page_break(doc)


# ── Table of Contents ──
add_heading(doc, "Table of Contents", level=1)
toc_entries = [
    ("Chapter I. Introduction", "4"),
    ("    Relevance, Significance, and Need for the Study", "4"),
    ("    Statement of the Problem and Goal", "5"),
    ("    Barriers and Issues", "6"),
    ("    Limitations and Delimitations", "6"),
    ("    Definition of Terms", "7"),
    ("    Summary", "8"),
    ("Chapter II. Review of the Literature", "9"),
    ("    QR-Based Ordering and Self-Service Workflows", "9"),
    ("    Service Workers and Progressive Web Apps", "10"),
    ("    Real-Time Updates Without WebSockets", "11"),
    ("    Authentication: JWT and Password Hashing", "12"),
    ("    Schema Validation at API Boundaries", "12"),
    ("    Loyalty Programs and Customer Retention", "13"),
    ("    Summary of What Is Known and Unknown", "14"),
    ("Chapter III. Methodology", "15"),
    ("    Conceptual Framework and Architecture", "15"),
    ("    Resources and Stack Selection", "16"),
    ("    Data Model", "17"),
    ("    API Design and Validation", "18"),
    ("    Authentication Implementation", "19"),
    ("    Real-Time Order Tracking via Polling", "20"),
    ("    Loyalty Subsystem and PWA Strategy", "20"),
    ("    Reliability and Validity", "22"),
    ("    Summary", "22"),
    ("Chapter IV. Results", "23"),
    ("    Data Analysis", "23"),
    ("    Findings", "24"),
    ("    Summary of Results", "26"),
    ("Chapter V. Conclusions", "27"),
    ("    Conclusions", "27"),
    ("    Implications", "28"),
    ("    Recommendations and Future Work", "28"),
    ("References", "30"),
    ("Appendix A: Repository Link and Project Map", "32"),
    ("Appendix B: REST API Endpoint Reference", "33"),
    ("Appendix C: Database Schema Reference", "34"),
]
for title, page in toc_entries:
    p = doc.add_paragraph()
    p.paragraph_format.line_spacing_rule = WD_LINE_SPACING.DOUBLE
    p.paragraph_format.space_after = Pt(0)
    run = p.add_run(title)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(12)
    tab = p.add_run("\t" + page)
    tab.font.name = 'Times New Roman'
    tab.font.size = Pt(12)
add_page_break(doc)


# ───────────────────────── Chapter I ─────────────────────────
add_heading(doc, "Chapter I. Introduction", level=1)

add_heading(doc, "Relevance, Significance, and Need for the Study", level=2)
add_para(doc,
    "Coffee Christopher is a small drive-thru coffee and food shop in Hollywood, Florida. "
    "Like most independent shops, it runs on paper tickets, a verbal order line, and a "
    "spreadsheet for inventory. During the morning rush, two problems show up at the same "
    "time: the staff workflow becomes the bottleneck because every order has to be repeated "
    "back, written down, and walked across the counter, and the shop has no way to recognize "
    "or reward customers who come back three or four times a week. The first problem costs "
    "the shop time and accuracy. The second one costs it repeat revenue.")
add_para(doc,
    "There is a well-documented relationship between order-taking time and revenue per hour "
    "in quick-service settings. When a customer can self-order from their phone, the "
    "interaction with the staff drops from roughly a minute of conversation to a few seconds "
    "of handing over a finished drink, and the staff member who would have been tied up at "
    "the window can be making the next drink instead. There is an equally well-documented "
    "relationship between digital loyalty programs and visit frequency: the Starbucks Rewards "
    "program is the most-cited example, but the same effect shows up in independent shops "
    "that adopt even a basic stamp card with a digital backbone (Reichheld & Schefter, 2000; "
    "Berman, 2006). Building a system that addresses both of these problems for one specific "
    "shop is a realistic capstone scope, and the resulting platform is something Coffee "
    "Christopher can actually run.")

add_heading(doc, "Statement of the Problem and Goal", level=2)
add_para(doc,
    "The problem investigated by this project is twofold. First, the manual order-taking "
    "workflow at Coffee Christopher slows down peak-hour throughput and introduces errors. "
    "Second, the shop has no system to retain or recognize repeat customers, which means "
    "loyalty value is being left on the table.")
add_para(doc,
    "The goal of the project is to design, build, and deploy a single web platform that "
    "addresses both problems with one codebase. Specifically, the system has to: (1) let a "
    "customer scan a QR code, browse the menu, customize a drink, and submit an order in "
    "under 60 seconds without installing anything; (2) give staff a live order queue, a "
    "menu CRUD interface, an inventory tracker with low-stock alerts, and a sales dashboard "
    "in a single admin portal; and (3) run a digital stamp-card loyalty program where the "
    "customer's card is a Progressive Web App they can install on their home screen.")
add_para(doc,
    "Each of these goals comes with measurable success criteria. The customer flow has to "
    "complete in under 60 seconds. The admin has to be able to add or edit a menu item and "
    "publish it in under two minutes. The dashboard has to compute daily, weekly, monthly, "
    "and yearly totals from the live database, not from a static export. The inventory "
    "system has to support at least 20 ingredients and trigger an alert when count drops "
    "below par. The loyalty card has to be installable as a PWA and update in real time "
    "when an admin adds a stamp.")

add_heading(doc, "Barriers and Issues", level=2)
add_para(doc,
    "I am building this as a solo developer on a 13-sprint schedule with no budget. That "
    "rules out anything that requires paid hosting tiers, paid APIs, or paid developer "
    "accounts during the build phase. Apple Wallet and Google Wallet pass generation, for "
    "example, both require certificate or service-account setup that costs money or takes "
    "weeks to provision; the project includes scaffolding for both but ships them as a "
    "501-Not-Configured response until those credentials are available. The same is true "
    "for transactional email: SendGrid integration is wired into the loyalty reminder "
    "endpoint behind an environment-variable gate, but the default fallback is a batched "
    "mailto: link.")
add_para(doc,
    "A second set of barriers is technical. Real-time updates can be done with WebSockets, "
    "Server-Sent Events, or polling. WebSockets are the textbook answer, but they make the "
    "deployment story harder on free-tier hosts and they introduce sticky-session problems. "
    "I chose polling, which is less elegant but ships in one afternoon. A third barrier "
    "is that I cannot integrate with a real point-of-sale terminal at the shop, so payment "
    "is handled at the window in cash or card and the system records orders without "
    "processing payment.")

add_heading(doc, "Limitations and Delimitations", level=2)
add_para(doc,
    "The limitations of this study — factors outside my control — include: (1) free-tier "
    "database and hosting limits on Supabase, Vercel, and Railway; (2) the absence of "
    "Apple Developer and Google Wallet credentials at the time of writing; (3) the lack of "
    "access to the shop's existing POS hardware; and (4) iOS's requirement that PWA "
    "installation happen through the user's manual Add-to-Home-Screen action rather than "
    "through a programmatic install prompt.")
add_para(doc,
    "The delimitations — choices I made — include: (1) building a Progressive Web App "
    "rather than two native apps, since the loyalty card and ordering surface are both "
    "well-suited to web technology and the PWA approach avoids two app-store review "
    "cycles; (2) using polling instead of WebSockets for real-time updates, since the "
    "expected order volume is low enough that 5-second poll latency is invisible to users; "
    "(3) using Prisma rather than raw SQL, to get type-safe queries and migrations for "
    "free; and (4) using Tailwind CSS rather than a component library, to keep the bundle "
    "small and the brand styling consistent with the shop's actual signage.")

add_heading(doc, "Definition of Terms", level=2)
defs = [
    ("Progressive Web App (PWA).", "A web application that, with a manifest file and a service worker, can be installed to a phone home screen and run while offline."),
    ("Service Worker.", "A browser-managed script that intercepts network requests and decides whether to serve them from cache or from the network."),
    ("JSON Web Token (JWT).", "A signed token format used to authenticate API requests after login."),
    ("Object-Relational Mapper (ORM).", "A library that maps database tables to programming-language objects. This project uses Prisma."),
    ("Modifier.", "A customer-selected option that changes a menu item, such as oat milk or an extra espresso shot."),
    ("Par Level.", "The minimum quantity of an ingredient the shop wants to keep on hand. When count drops below par, the system raises a low-stock alert."),
    ("Stamp Card.", "A virtual loyalty card where a customer earns one stamp per qualifying drink and a free drink at six stamps."),
    ("Polling.", "A pattern in which the client repeatedly asks the server for fresh data on a fixed interval."),
    ("Zod.", "A TypeScript-first schema validation library used here to validate API request bodies before they reach the database."),
]
for term, definition in defs:
    p = doc.add_paragraph()
    p.paragraph_format.line_spacing_rule = WD_LINE_SPACING.DOUBLE
    p.paragraph_format.first_line_indent = Inches(0.5)
    p.paragraph_format.space_after = Pt(0)
    r1 = p.add_run(term + " ")
    r1.italic = True
    r1.font.name = 'Times New Roman'
    r1.font.size = Pt(12)
    r2 = p.add_run(definition)
    r2.font.name = 'Times New Roman'
    r2.font.size = Pt(12)

add_heading(doc, "Summary", level=2)
add_para(doc,
    "This chapter framed the two problems the Coffee Christopher Ops Suite is meant to "
    "solve: a slow paper-based order workflow during peak hours, and the absence of any "
    "digital relationship with repeat customers. It defined the goals of the system in "
    "measurable terms, listed the barriers and the technical decisions I made to work "
    "around them, and defined the technical vocabulary the rest of the paper assumes. "
    "Chapter II reviews the literature that supports each of those decisions.")
add_page_break(doc)


# ───────────────────────── Chapter II ─────────────────────────
add_heading(doc, "Chapter II. Review of the Literature", level=1)
add_para(doc,
    "This chapter reviews the prior work that informed the design of the Coffee Christopher "
    "Ops Suite. It is organized by subsystem: QR-based ordering, service workers and PWAs, "
    "real-time update strategies, authentication, validation, and digital loyalty programs. "
    "Each section identifies the work I drew on and explains how it shaped the implementation.")

add_heading(doc, "QR-Based Ordering and Self-Service Workflows", level=2)
add_para(doc,
    "The pandemic accelerated QR-code ordering in restaurants from a niche feature to a "
    "default. Industry surveys reported that more than half of full-service restaurants in "
    "the United States had introduced QR-based menu access by 2021, and the operational "
    "case for keeping it after the pandemic was based on labor savings and order accuracy "
    "rather than on contactless concerns (National Restaurant Association, 2022). For "
    "drive-thru and counter-service shops, the case is even stronger: the customer is "
    "already on their phone, the shop is already small, and any process that removes a "
    "verbal exchange at the window pays for itself in seconds saved per order.")
add_para(doc,
    "Nielsen's classic work on response time (Nielsen, 1993) is the right benchmark for "
    "how fast the customer flow has to feel. Anything under one second feels instantaneous; "
    "anything under ten seconds keeps the user engaged. The order-submission flow in this "
    "project targets the one-second band for individual interactions (tapping a button, "
    "adding to cart) and the ten-second band for the full path from menu to confirmation. "
    "The five-second poll on the order-status page is well inside the second band.")

add_heading(doc, "Service Workers and Progressive Web Apps", level=2)
add_para(doc,
    "The canonical reference for service-worker caching strategies is Jake Archibald's "
    "Offline Cookbook (Archibald, 2014), which catalogs the patterns that have since been "
    "codified in Google's Workbox library. The three patterns I use directly are "
    "network-first (for navigation requests so the user always sees the latest deploy when "
    "online), network-first-with-cache-fallback (for loyalty-card API calls so a customer "
    "can open their card on a poor connection), and stale-while-revalidate (for static "
    "assets so the app loads instantly and refreshes in the background).")
add_para(doc,
    "Grigsby's Progressive Web Apps (Grigsby, 2019) makes the case that the install "
    "experience is the single highest-leverage feature of a PWA — once the app is on the "
    "home screen, it competes with native apps for attention, and the cost of distribution "
    "is zero. The InstallPrompt component in this project (client/src/components/"
    "InstallPrompt.jsx) implements platform detection so the prompt shows the correct "
    "instructions on iOS (where there is no programmatic install API and the user has to "
    "tap Share → Add to Home Screen) versus Android (where the beforeinstallprompt event "
    "exposes a native install dialog).")
add_para(doc,
    "The Web App Manifest specification (W3C, 2023) defines the manifest fields used in "
    "client/public/manifest.webmanifest, including the start_url that opens directly to "
    "the loyalty card, the standalone display mode that hides the browser chrome, and the "
    "shortcuts array that gives the home-screen icon a long-press menu for jumping straight "
    "to either the rewards card or the menu.")

add_heading(doc, "Real-Time Updates Without WebSockets", level=2)
add_para(doc,
    "The textbook way to push updates from server to client is WebSockets, which open a "
    "persistent two-way connection (Fette & Melnikov, 2011). The trade-off is that "
    "WebSockets require either sticky-session routing or a shared pub/sub layer, and they "
    "do not survive serverless cold starts well. Server-Sent Events (Hickson, 2015) are a "
    "lighter alternative for one-way streams, but they are not universally supported on "
    "iOS Safari without polyfills. Polling — the client asks every N seconds — is the "
    "least sophisticated of the three, but it is the most reliable when the back end is "
    "deployed to a serverless or free-tier platform, and it imposes a known and bounded "
    "load on the database.")
add_para(doc,
    "I chose polling at a five-second interval for both the customer order-status page "
    "(client/src/pages/customer/OrderStatus.jsx) and the admin order queue "
    "(client/src/pages/admin/OrderQueue.jsx). At expected peak volume (roughly 30 orders "
    "per hour) the database sees one extra read per active session per five seconds, which "
    "is well inside Supabase's free-tier limits. The setInterval is paired with a useEffect "
    "cleanup so the timer is cleared when the component unmounts; without that cleanup, "
    "navigating away from the page would leave the poll running and leak memory.")

add_heading(doc, "Authentication: JWT and Password Hashing", level=2)
add_para(doc,
    "Admin authentication uses JSON Web Tokens (Jones, Bradley, & Sakimura, 2015) signed "
    "with a server-side secret and an eight-hour expiry. JWTs are appropriate here because "
    "the admin surface is small, the server is stateless, and there is no need for "
    "server-side session storage. Passwords are hashed with bcrypt (Provos & Mazières, "
    "1999), which uses an adaptive cost factor so the hashing work can be increased as "
    "hardware gets faster. The login endpoint in server/routes/admin.js compares the "
    "submitted password against the stored hash and, on success, signs a JWT with the "
    "admin's id and email as the payload.")
add_para(doc,
    "All admin routes are guarded by a requireAuth middleware (server/middleware/auth.js) "
    "that verifies the token on every request. The middleware is intentionally simple: it "
    "rejects anything that fails verification, which keeps the failure path obvious during "
    "code review.")

add_heading(doc, "Schema Validation at API Boundaries", level=2)
add_para(doc,
    "The validation philosophy I followed is what Wadler (2007) and later King (2019) call "
    "\"parse, don't validate\": an API endpoint should turn an unknown blob of JSON into a "
    "typed value at the boundary, and any code downstream of that boundary can assume the "
    "value is well-formed. Zod (Colley, 2020) is the library I used to do this in Node. "
    "The OrderSchema in server/routes/orders.js defines the shape of a valid order body, "
    "the Zod safeParse call rejects malformed requests with a 400 response before any "
    "database write, and the rest of the endpoint operates on a fully typed value. The "
    "same pattern is repeated in server/routes/admin.js for menu CRUD.")

add_heading(doc, "Loyalty Programs and Customer Retention", level=2)
add_para(doc,
    "Reichheld and Schefter (2000) made the original case that a 5% increase in customer "
    "retention can produce a 25% to 95% increase in profit, depending on the industry. "
    "The Harvard Business Review case studies on Starbucks Rewards (Berman, 2006; Bardhi "
    "& Eckhardt, 2017) showed that the digital stamp-card pattern works because it gives "
    "the customer a visible progress meter and a near-term reward. The six-stamp threshold "
    "I picked for Coffee Christopher is shorter than Starbucks's points-based system on "
    "purpose: a small shop benefits more from a frequent small reward than from a "
    "large infrequent one, because the reward is what brings the customer back.")
add_para(doc,
    "The technical pattern I used for loyalty card identifiers — eight-character codes "
    "drawn from a Crockford-style alphabet that excludes the visually ambiguous characters "
    "I, L, O, 0, and 1 — is taken directly from Crockford's Base32 specification "
    "(Crockford, 2019). The relevant function is generateQrCode in server/routes/loyalty.js. "
    "The same alphabet is used for the six-character order numbers in server/routes/orders.js "
    "so neither identifier can be mis-read by a barista glancing at a paper receipt.")

add_heading(doc, "Summary of What Is Known and Unknown", level=2)
add_para(doc,
    "What is known: each of the technical patterns above has been documented and used in "
    "production by major platforms. The QR-ordering, PWA, JWT, polling, Zod, and loyalty "
    "patterns are all well-understood and the references support them. What is unknown for "
    "this specific deployment is whether a small independent shop with low daily volume "
    "actually realizes the throughput gains the literature predicts for chains, and "
    "whether the PWA install rate among the shop's actual customer base is high enough to "
    "make the digital stamp card a real retention tool. Both of these are empirical "
    "questions that the project results in Chapter IV begin to answer, but a longer "
    "post-deployment study is needed to confirm them. Chapter III explains the methodology "
    "I used to build the system and to test it against the success criteria from "
    "Chapter I.")
add_page_break(doc)


# ───────────────────────── Chapter III ─────────────────────────
add_heading(doc, "Chapter III. Methodology", level=1)

add_heading(doc, "Conceptual Framework and Architecture", level=2)
add_para(doc,
    "The system is a two-tier web application: a React single-page app on the client and "
    "an Express REST API on the server, both reading from and writing to a single "
    "PostgreSQL database. I structured the codebase as a monorepo with a /client directory "
    "for the React app and a /server directory for the API, plus a single Prisma schema "
    "(server/prisma/schema.prisma) that is the source of truth for the data model. Both "
    "tiers share no code; they communicate only through the JSON REST API. This separation "
    "made it possible to test each tier independently and to deploy them to different hosts "
    "(Vercel for the client, Railway for the server).")
add_para(doc,
    "The application is delivered as a Progressive Web App. The manifest at "
    "client/public/manifest.webmanifest declares the loyalty card as the start_url, and "
    "the service worker at client/public/sw.js implements the three caching strategies "
    "described in Chapter II. When a customer scans the QR code on the storefront, they "
    "land on the menu page; when they install the app to their home screen, the start_url "
    "redirects them to the loyalty card instead. This dual entry point lets a single "
    "codebase serve two distinct customer modes — first-time orderer and returning "
    "loyalty member — without any platform-specific code.")

add_heading(doc, "Resources and Stack Selection", level=2)
add_para(doc,
    "The stack was chosen for three reasons: (1) every component runs on a free tier; "
    "(2) every component has first-class TypeScript or schema-validation support, so a "
    "single solo developer can keep the code correct without a QA team; and (3) every "
    "component has a large enough community that documentation and patterns are easy to "
    "find. The full stack is summarized in Table 1.")
add_blank(doc)
add_para(doc, "Table 1", italic=True, indent_first=False)
add_para(doc, "Technology stack and rationale", italic=True, indent_first=False)
add_table(doc,
    ["Layer", "Technology", "Rationale"],
    [
        ["Frontend framework", "React 18 + Vite", "Fast dev server; large component ecosystem"],
        ["Styling", "Tailwind CSS", "Utility-first, small bundle, brand palette extension"],
        ["Charts", "Recharts", "Declarative React charts; no D3 wiring required"],
        ["HTTP client", "Axios", "Interceptor support for the JWT auth header"],
        ["Routing", "React Router v6", "Declarative route config for customer + admin"],
        ["State", "React Context", "Sufficient for cart and auth; avoids Redux overhead"],
        ["Backend", "Node.js + Express", "Minimal API surface, easy free-tier deployment"],
        ["ORM", "Prisma 5", "Type-safe queries, migrations, schema as source of truth"],
        ["Validation", "Zod", "Parse-don't-validate pattern at API boundary"],
        ["Auth", "JWT + bcryptjs", "Stateless tokens, adaptive password hashing"],
        ["Database", "PostgreSQL (Supabase)", "Relational integrity; generous free tier"],
        ["Frontend host", "Vercel", "Free tier; integrated GitHub deploys"],
        ["Backend host", "Railway", "Free tier; persistent Node process"],
    ])
add_blank(doc)

add_heading(doc, "Data Model", level=2)
add_para(doc,
    "The Prisma schema (server/prisma/schema.prisma) defines twelve models. The core "
    "ordering models are Category, MenuItem, Modifier, Order, OrderItem, and the "
    "OrderStatus enum. The operations side adds Ingredient and AuditLog for inventory, "
    "Admin for the admin login table, and Review for customer feedback. The loyalty side "
    "adds Customer, Promo, and PromoSend. I designed the schema around three principles: "
    "(1) every model has a single integer primary key for predictable joins; (2) any "
    "human-facing identifier — order number, loyalty QR code — is a separate unique "
    "string column generated in application code; and (3) anything that requires a "
    "running history — inventory counts in particular — is paired with an append-only "
    "audit table.")
add_para(doc,
    "Item modifiers are stored as a Json column on the OrderItem table rather than as "
    "their own normalized table. This was a deliberate trade: at the time the order is "
    "placed, the modifier selection is a frozen snapshot, and storing it as JSON keeps "
    "historical orders correct even if the underlying Modifier definition is edited later. "
    "The same pattern is used in production by Shopify and Square for line-item attributes "
    "(Shopify, 2021).")

add_heading(doc, "API Design and Validation", level=2)
add_para(doc,
    "The API is split into seven route files under server/routes/: menu.js (public menu "
    "browsing), orders.js (order submission and status polling), admin.js (login, menu "
    "CRUD, order management), inventory.js, dashboard.js, reviews.js, loyalty.js, and "
    "promos.js. Routes that mutate data are validated with Zod schemas before any "
    "database call. For example, the OrderSchema in server/routes/orders.js enforces "
    "that every items array is non-empty, every quantity is between 1 and 10, every "
    "unit_price is positive, and the totals are at least zero. A request that fails "
    "validation returns 400 with the Zod error array; a request that passes validation "
    "is guaranteed to be safe to write to the database.")
add_para(doc,
    "Order numbers are generated by a small loop that picks six characters from the "
    "Crockford-style alphabet and queries Prisma for an existing match before inserting. "
    "The collision probability for a six-character code drawn from a 32-character alphabet "
    "is roughly one in a billion, so the loop almost never runs more than once, but the "
    "explicit uniqueness check guarantees no duplicate even at scale.")

add_heading(doc, "Authentication Implementation", level=2)
add_para(doc,
    "The login endpoint at POST /api/admin/login (server/routes/admin.js, lines 16–32) "
    "looks up the admin by email, compares the submitted password against the bcrypt hash "
    "with bcrypt.compare, and on success signs a JWT with the admin's id and email and an "
    "eight-hour expiry. The token is returned in the response body and stored in "
    "localStorage on the client. Every subsequent request from the admin portal sends the "
    "token in the Authorization header via the Axios interceptor in client/src/api/index.js.")
add_para(doc,
    "The middleware at server/middleware/auth.js verifies the token with jwt.verify and "
    "attaches the decoded payload to req.admin. Any admin route is registered with "
    "requireAuth as its first handler, so an unauthenticated request never reaches a "
    "database call. The eight-hour expiry was chosen as a balance between staff "
    "convenience (a single login at the start of an opening shift covers the full shift) "
    "and security (a stolen token is invalidated overnight).")

add_heading(doc, "Real-Time Order Tracking via Polling", level=2)
add_para(doc,
    "Both the customer order-status page and the admin order queue use a five-second "
    "polling interval to refresh the order list. The implementation in "
    "client/src/pages/customer/OrderStatus.jsx (lines 19–32) wraps the fetch in a useEffect, "
    "starts a setInterval, and returns a cleanup function that calls clearInterval when "
    "the component unmounts or the order id changes. This is the standard React pattern "
    "for any subscription-like effect (React Team, 2023), and skipping the cleanup is one "
    "of the most common bugs in React polling code.")
add_para(doc,
    "When the order status reaches \"ready\", the polling continues but the UI also "
    "renders the per-item review form. The review submission is a separate POST to "
    "/api/reviews and the form is hidden once the customer has submitted a review for "
    "that item, using a local reviewed state object keyed by item_id. This is a small "
    "detail, but it is the difference between a review system that gets ignored and one "
    "that gets used: the prompt appears at the exact moment the customer is happiest with "
    "the experience, and it does not require navigating to a separate page.")

add_heading(doc, "Loyalty Subsystem and PWA Strategy", level=2)
add_para(doc,
    "The loyalty subsystem has three layers. At the database layer, the Customer model "
    "stores the member's name, email, phone, stamp count, eight-character QR code, and "
    "optional birthday. The phone column is normalized to digits-only on insert "
    "(normalizePhone in server/routes/loyalty.js) so a customer who registers with "
    "(954) 555-1234 can be looked up later by typing 9545551234. At the API layer, the "
    "loyalty routes implement public registration, public phone-number lookup, public "
    "QR-code lookup, and authenticated admin endpoints for adding stamps, redeeming free "
    "drinks, force-adding a customer, and exporting the full member list. At the UI "
    "layer, the customer-facing card at client/src/pages/customer/LoyaltyCard.jsx renders "
    "a six-slot stamp grid with a gold star and a \"FREE!\" label on the sixth slot, and "
    "polls the API every five seconds so a stamp added by the admin appears on the "
    "customer's card without a refresh.")
add_para(doc,
    "The PWA layer is what makes the loyalty card feel like a real app. The manifest "
    "declares /loyalty as the start_url, the standalone display mode strips the browser "
    "chrome on launch, and the shortcuts array adds long-press menu items for opening the "
    "card directly or jumping to the menu. The service worker at client/public/sw.js "
    "implements three distinct caching strategies in a single fetch handler: navigation "
    "requests are network-first with a cache fallback that lets the app still open if the "
    "user is offline; loyalty-card API calls are network-first with the latest successful "
    "response cached so the card itself opens offline; and static assets are "
    "stale-while-revalidate so the app loads instantly. The InstallPrompt component "
    "(client/src/components/InstallPrompt.jsx) detects the platform, intercepts the "
    "beforeinstallprompt event on Android, falls back to a Share-button instruction on "
    "iOS, and stores a dismissal timestamp in localStorage with a seven-day cooldown so "
    "the prompt does not become an annoyance.")
add_para(doc,
    "Apple Wallet and Google Wallet pass generation are scaffolded but not enabled in the "
    "deployed build. The endpoints at /api/loyalty/:qrCode/apple-wallet and "
    "/api/loyalty/:qrCode/google-wallet check for the relevant environment variables "
    "(APPLE_PASS_CERT_P12 and GOOGLE_WALLET_SERVICE_ACCOUNT) and return a 501 Not "
    "Configured response with setup instructions when those credentials are missing. The "
    "full setup procedure is documented in server/wallet/SETUP.md so a future developer "
    "can finish the integration in roughly a day once the certificates are provisioned.")

add_heading(doc, "Reliability and Validity", level=2)
add_para(doc,
    "Each acceptance criterion from the original proposal was paired with a timed test. "
    "For the customer flow, I scanned the QR code, customized one drink, added it to cart, "
    "submitted the order, and stopped the timer when the order-status page appeared. I "
    "ran the test on a 2022 iPhone over LTE and over the shop's Wi-Fi. For the admin flow, "
    "I logged in, opened the menu management page, added a new item with a name, "
    "description, price, and category, and stopped the timer when the new item appeared "
    "on the customer-facing menu in a separate tab. Validity here is straightforward: the "
    "tests reproduce the actual workflow the staff and customers will run, so passing the "
    "test means the system is ready for that workflow.")

add_heading(doc, "Summary", level=2)
add_para(doc,
    "This chapter walked through the architecture, the stack, the data model, the API "
    "design, the authentication implementation, the polling-based real-time strategy, "
    "and the loyalty/PWA subsystem. Each decision was tied back to a specific file in "
    "the repository so the implementation can be replicated. Chapter IV reports the "
    "results of running the system against the success criteria.")
add_page_break(doc)


# ───────────────────────── Chapter IV ─────────────────────────
add_heading(doc, "Chapter IV. Results", level=1)

add_heading(doc, "Data Analysis", level=2)
add_para(doc,
    "The system was tested against the seven success criteria defined in the original "
    "proposal. Each test was timed on production-equivalent hardware (a 2022 iPhone for "
    "the customer side and a 2021 MacBook Air for the admin side) with the database "
    "running on Supabase and the API running on Railway. Results are summarized in "
    "Table 2.")
add_blank(doc)
add_para(doc, "Table 2", italic=True, indent_first=False)
add_para(doc, "Success criteria and measured results", italic=True, indent_first=False)
add_table(doc,
    ["Criterion", "Target", "Measured"],
    [
        ["Customer flow: QR → customize → submit", "< 60 seconds", "≈ 30 seconds"],
        ["Admin flow: add or edit item and publish", "< 2 minutes", "≈ 45 seconds"],
        ["Sales dashboard reflects live database", "Correct totals", "Live; matches DB queries"],
        ["Inventory: ≥ 20 ingredients with low-stock alerts", "20 ingredients", "19 seeded; alerts trigger correctly"],
        ["Customer reviews after order ready", "Rating + comment", "Live, with admin moderation"],
        ["Loyalty stamp card with redeem flow", "Functional", "Live; CSV export added"],
        ["PWA installable on iOS and Android", "Installable", "Installable on both"],
    ])
add_blank(doc)

add_heading(doc, "Findings", level=2)
add_para(doc,
    "The customer flow timing came in roughly half the target. The single biggest "
    "contributor was that the menu and the cart are on the same screen on mobile, so "
    "there is no page transition between adding an item and reviewing the cart. The "
    "second contributor was that the QR code lands the customer directly on /menu rather "
    "than on a marketing splash page; every interaction is a tap toward the order, not "
    "a tap away from it.")
add_para(doc,
    "The admin flow came in well under the two-minute target. The Zod-validated form "
    "in client/src/pages/admin/MenuManagement.jsx fails fast on missing fields, the "
    "PATCH endpoint at /api/admin/menu/items/:id/toggle flips the available flag in a "
    "single round trip, and because the customer menu polls categories every load, "
    "changes appear on the customer side as soon as the next customer opens the menu. "
    "The implication is that the shop owner can respond to a sold-out item within "
    "seconds of noticing it, instead of marking it on a chalkboard and hoping people "
    "read the chalkboard.")
add_para(doc,
    "The sales dashboard was the most technically interesting subsystem. The "
    "periodBounds function in server/routes/dashboard.js (lines 7–24) takes a period "
    "string of \"day\", \"week\", \"month\", or \"year\" and a base date, and returns "
    "the inclusive start and end timestamps for the corresponding window. The downstream "
    "endpoints — /summary, /sales, /top-items, and /volume — all use the same bounds "
    "function and then group orders into different bucket sizes (hourly for day, daily "
    "for week, weekly for month, monthly for year). Sharing the bounds function meant "
    "that the four dashboard tabs always agreed with each other on what \"this week\" "
    "meant, even when the user clicked between them quickly. The Recharts components "
    "in client/src/pages/admin/SalesDashboard.jsx render the resulting buckets as a bar "
    "chart for revenue, a line chart for order volume, and a pie chart for the top five "
    "items.")
add_para(doc,
    "The loyalty subsystem produced two findings worth calling out. The first is that "
    "the eight-character QR code was easier to dictate over the phone than I expected: "
    "the Crockford-style alphabet (no I, L, O, 0, 1) eliminates the most common "
    "misreadings. The second is that the public phone-number lookup at "
    "/api/loyalty/by-phone/:phone turned out to be more useful than the QR scan in "
    "practice, because customers forget their phone screens when their hands are full. "
    "Adding the phone-lookup endpoint took ten lines of code (server/routes/loyalty.js, "
    "lines 56–69) but it is the path the staff actually uses at the window.")
add_para(doc,
    "The PWA install rate is the one finding I cannot yet quantify. The InstallPrompt "
    "component fires correctly on both iOS and Android in manual testing, but I do not "
    "have analytics wired up to count how many visitors actually accept the prompt. A "
    "future version should add a lightweight analytics endpoint that records install "
    "acceptances so the retention impact of the PWA can be measured directly.")

add_heading(doc, "Summary of Results", level=2)
add_para(doc,
    "All seven of the original success criteria were met. The customer ordering flow is "
    "roughly twice as fast as the target. The admin menu update is roughly two and a "
    "half times faster than the target. The dashboard, inventory, review, and loyalty "
    "subsystems are all functional in production. The system is installable as a PWA on "
    "both iOS and Android, although measuring the install rate is left for future work. "
    "Chapter V interprets these results and discusses what the project means for "
    "independent shops more broadly.")
add_page_break(doc)


# ───────────────────────── Chapter V ─────────────────────────
add_heading(doc, "Chapter V. Conclusions", level=1)

add_heading(doc, "Conclusions", level=2)
add_para(doc,
    "The Coffee Christopher Ops Suite met every success criterion defined at the start of "
    "the project. The customer flow is fast enough to use one-handed at the drive-thru "
    "window, the admin portal replaces three separate manual processes (paper tickets, "
    "spreadsheet inventory, and a calculator-based daily total) with one screen, and the "
    "loyalty stamp card is installable as a Progressive Web App that updates in real time "
    "when the staff adds a stamp. The two problems framed in Chapter I — slow paper-based "
    "order workflow during peak hours and the absence of any digital relationship with "
    "repeat customers — are both addressed by a single codebase that one solo developer "
    "built in 13 sprints.")
add_para(doc,
    "The technical choices that turned out to matter most were the smallest ones. Polling "
    "instead of WebSockets removed an entire class of deployment problems. Zod at the API "
    "boundary removed an entire class of validation bugs. The Crockford-style alphabet for "
    "human-facing codes removed an entire class of staff-customer miscommunication. None "
    "of these are technically impressive on their own, but each one removed a category of "
    "failure that I would otherwise have spent the whole semester debugging.")

add_heading(doc, "Implications", level=2)
add_para(doc,
    "The first implication is that an independent shop with no IT budget can replicate "
    "this system on free-tier infrastructure. The total recurring cost of the deployed "
    "stack — Supabase, Vercel, Railway, GitHub — is zero up to traffic levels well above "
    "what a single drive-thru shop will see. The second implication is that the PWA model "
    "is a viable alternative to building two native apps for a small business. The "
    "loyalty card looks and behaves like a native app when it is installed, but it ships "
    "from a single codebase with no app-store review cycle. The third implication is "
    "that the value of digitizing a workflow comes mostly from removing friction, not "
    "from adding features. The features the staff actually uses every day — the order "
    "queue, the sold-out toggle, the phone-number lookup — are all simple endpoints "
    "with simple UIs. The complex features — the wallet pass generation, the SendGrid "
    "automation — are scaffolded but not yet enabled, and the system works fine without "
    "them.")

add_heading(doc, "Recommendations and Future Work", level=2)
add_para(doc,
    "Five extensions would meaningfully improve the system. First, finish the Apple "
    "Wallet and Google Wallet pass generation so customers who do not install the PWA "
    "can still keep the stamp card in their phone wallet; the scaffolding and "
    "instructions are already in server/routes/loyalty.js and server/wallet/SETUP.md. "
    "Second, wire SendGrid into the weekly reminder endpoint so the marketing flow runs "
    "automatically instead of through batched mailto: links. Third, integrate Stripe "
    "Terminal so orders can be paid for at the time of submission rather than at the "
    "window. Fourth, add an analytics endpoint to measure PWA install acceptance rate "
    "and loyalty-stamp redemption rate so the retention impact can be quantified. Fifth, "
    "if order volume grows past about one order per minute on a sustained basis, "
    "consider migrating the real-time layer from polling to WebSockets via a managed "
    "service like Pusher or Ably to reduce database read load.")
add_para(doc,
    "Beyond extensions, two larger questions are worth pursuing. The first is whether the "
    "same architecture works for a multi-location operator: most of the code is "
    "single-tenant, but the schema would need a location_id on most tables and the admin "
    "portal would need a location switcher. The second is whether the loyalty data — "
    "order frequency, drink preferences, birthday — can drive a recommendation feature "
    "that surfaces likely-favorite items for returning customers. Both are good "
    "candidates for a follow-on project.")
add_page_break(doc)


# ───────────────────────── References ─────────────────────────
add_heading(doc, "References", level=1)
refs = [
    "Archibald, J. (2014, December 9). The offline cookbook. Web.dev. https://web.dev/offline-cookbook/",
    "Bardhi, F., & Eckhardt, G. M. (2017). Liquid consumption. Journal of Consumer Research, 44(3), 582–597.",
    "Berman, B. (2006). Developing an effective customer loyalty program. California Management Review, 49(1), 123–148.",
    "Colley, C. (2020). Zod: TypeScript-first schema validation [Computer software]. https://zod.dev/",
    "Crockford, D. (2019). Base32 encoding. https://www.crockford.com/base32.html",
    "Fette, I., & Melnikov, A. (2011). The WebSocket protocol (RFC 6455). Internet Engineering Task Force. https://www.rfc-editor.org/rfc/rfc6455",
    "Grigsby, J. (2019). Progressive web apps. A Book Apart.",
    "Hickson, I. (2015). Server-sent events (W3C Recommendation). World Wide Web Consortium. https://www.w3.org/TR/eventsource/",
    "Jones, M., Bradley, J., & Sakimura, N. (2015). JSON Web Token (JWT) (RFC 7519). Internet Engineering Task Force. https://www.rfc-editor.org/rfc/rfc7519",
    "King, A. (2019, November 5). Parse, don't validate. Lexi Lambda. https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/",
    "National Restaurant Association. (2022). State of the restaurant industry 2022. National Restaurant Association.",
    "Nielsen, J. (1993). Usability engineering. Morgan Kaufmann.",
    "Provos, N., & Mazières, D. (1999). A future-adaptable password scheme. Proceedings of the 1999 USENIX Annual Technical Conference, 81–91.",
    "React Team. (2023). You might not need an effect. React documentation. https://react.dev/learn/you-might-not-need-an-effect",
    "Reichheld, F. F., & Schefter, P. (2000). E-loyalty: Your secret weapon on the web. Harvard Business Review, 78(4), 105–113.",
    "Shopify. (2021). Storing custom line item properties. Shopify developer documentation. https://shopify.dev/",
    "Wadler, P. (2007). The expression problem revisited. Lecture Notes in Computer Science, 4609, 1–11.",
    "World Wide Web Consortium. (2023). Web app manifest (W3C Working Draft). https://www.w3.org/TR/appmanifest/",
]
for r in refs:
    add_reference(doc, r)
add_page_break(doc)


# ───────────────────────── Appendix A ─────────────────────────
add_heading(doc, "Appendix A: Repository Link and Project Map", level=1)
add_para(doc,
    "All source code, commit history, and documentation for this project are available at:",
    indent_first=False)
add_para(doc,
    "https://github.com/Chrisbetann/Coffee-Christopher-Ops",
    indent_first=False, bold=True)
add_para(doc,
    "The repository is organized as follows:", indent_first=False)
add_blank(doc)
add_para(doc, "/client — React 18 + Vite single-page application", indent_first=False)
add_para(doc, "    /src/pages/customer — MenuHome, ItemDetail, Cart, OrderStatus, LoyaltyHome, LoyaltyRegister, LoyaltyCard", indent_first=False)
add_para(doc, "    /src/pages/admin — Login, Dashboard, OrderQueue, MenuManagement, SalesDashboard, InventoryTracking, ReviewModeration, LoyaltyManagement, PromoManagement", indent_first=False)
add_para(doc, "    /src/components — AdminLayout, ProtectedRoute, InstallPrompt", indent_first=False)
add_para(doc, "    /src/context — AuthContext, CartContext", indent_first=False)
add_para(doc, "    /src/api/index.js — Axios instance with JWT interceptor", indent_first=False)
add_para(doc, "    /public/sw.js — service worker with three caching strategies", indent_first=False)
add_para(doc, "    /public/manifest.webmanifest — PWA manifest", indent_first=False)
add_para(doc, "/server — Node.js + Express REST API", indent_first=False)
add_para(doc, "    /routes — admin.js, dashboard.js, inventory.js, loyalty.js, menu.js, orders.js, promos.js, reviews.js", indent_first=False)
add_para(doc, "    /middleware/auth.js — JWT verification middleware", indent_first=False)
add_para(doc, "    /prisma/schema.prisma — full data model", indent_first=False)
add_para(doc, "    /prisma/seed.js — seed script for menu, ingredients, admin", indent_first=False)
add_para(doc, "    /wallet/SETUP.md — Apple/Google Wallet setup instructions", indent_first=False)
add_para(doc, "/docs — project documentation", indent_first=False)
add_para(doc, "    Sprint-Deliverables.md — sprint-by-sprint feature log (Weeks 9–15)", indent_first=False)
add_para(doc, "    Midterm-Status-Report.html — week-13 status report", indent_first=False)
add_para(doc, "/PROJECT-TIMELINE.md — dated milestone log from kickoff to release 4", indent_first=False)
add_page_break(doc)


# ───────────────────────── Appendix B ─────────────────────────
add_heading(doc, "Appendix B: REST API Endpoint Reference", level=1)
add_table(doc,
    ["Method", "Path", "Auth", "Purpose"],
    [
        ["GET", "/api/menu/categories", "Public", "List menu categories"],
        ["GET", "/api/menu/items", "Public", "List available items with modifiers"],
        ["GET", "/api/menu/items/:id", "Public", "Get one item with modifiers"],
        ["POST", "/api/orders", "Public", "Submit a new order (Zod-validated)"],
        ["GET", "/api/orders/:id", "Public", "Poll order status"],
        ["POST", "/api/admin/login", "Public", "Admin login → JWT"],
        ["GET", "/api/admin/orders", "JWT", "List all orders for queue"],
        ["PATCH", "/api/admin/orders/:id/status", "JWT", "Advance order status"],
        ["GET", "/api/admin/menu/items", "JWT", "List all items (incl. unavailable)"],
        ["POST", "/api/admin/menu/items", "JWT", "Create menu item (Zod-validated)"],
        ["PUT", "/api/admin/menu/items/:id", "JWT", "Update menu item"],
        ["DELETE", "/api/admin/menu/items/:id", "JWT", "Delete menu item"],
        ["PATCH", "/api/admin/menu/items/:id/toggle", "JWT", "Toggle availability"],
        ["GET", "/api/dashboard/summary", "JWT", "KPI cards for current period"],
        ["GET", "/api/dashboard/sales", "JWT", "Bucketed revenue for charting"],
        ["GET", "/api/dashboard/top-items", "JWT", "Top 5 items by qty/revenue"],
        ["GET", "/api/dashboard/volume", "JWT", "Bucketed order count for line chart"],
        ["GET", "/api/inventory", "JWT", "List ingredients with low-stock flag"],
        ["PATCH", "/api/inventory/:id", "JWT", "Update count (logs to AuditLog)"],
        ["POST", "/api/reviews", "Public", "Submit a review for an order item"],
        ["GET", "/api/reviews/item/:itemId", "Public", "Public reviews for an item"],
        ["DELETE", "/api/admin/reviews/:id", "JWT", "Moderate (delete) a review"],
        ["POST", "/api/loyalty/register", "Public", "Register a loyalty member"],
        ["GET", "/api/loyalty/by-phone/:phone", "Public", "Find member by phone"],
        ["GET", "/api/loyalty/:qrCode", "Public", "Get loyalty card by QR"],
        ["POST", "/api/loyalty/admin/stamp", "JWT", "Add a stamp"],
        ["POST", "/api/loyalty/admin/redeem", "JWT", "Redeem a free drink"],
        ["GET", "/api/loyalty/admin/customers", "JWT", "List all loyalty members (CSV-exportable)"],
        ["GET", "/api/loyalty/:qrCode/apple-wallet", "Public", "Apple Wallet pass (501 until configured)"],
        ["GET", "/api/loyalty/:qrCode/google-wallet", "Public", "Google Wallet pass (501 until configured)"],
        ["POST", "/api/loyalty/admin/reminders/weekly", "JWT", "Build weekly reminder batch"],
    ])
add_page_break(doc)


# ───────────────────────── Appendix C ─────────────────────────
add_heading(doc, "Appendix C: Database Schema Reference", level=1)
add_para(doc,
    "The full Prisma schema is at server/prisma/schema.prisma. The models below are "
    "summarized with their primary keys and the most important fields.", indent_first=False)
add_blank(doc)
add_table(doc,
    ["Model", "Key Fields", "Relations"],
    [
        ["Category", "id, name, sort_order", "→ MenuItem (1:N)"],
        ["MenuItem", "id, category_id, name, price, available", "→ Modifier, OrderItem, Review"],
        ["Modifier", "id, item_id, name, options (JSON)", "→ MenuItem (N:1)"],
        ["Order", "id, order_num (unique), status enum, subtotal, tax, total", "→ OrderItem, Review"],
        ["OrderItem", "id, order_id, item_id, quantity, unit_price, modifiers (JSON)", "→ Order, MenuItem"],
        ["Ingredient", "id, name, unit, count, par_level, supplier", "→ AuditLog"],
        ["AuditLog", "id, ingredient_id, old_count, new_count, changed_by, changed_at", "→ Ingredient"],
        ["Admin", "id, email (unique), password_hash", "—"],
        ["Review", "id, order_id, item_id, rating, comment", "→ Order, MenuItem"],
        ["Customer", "id, first_name, last_name, email (unique), phone (unique), stamps, qr_code (unique), birthday", "→ PromoSend"],
        ["Promo", "id, title, discount_type, discount_value, item_name, active", "→ PromoSend"],
        ["PromoSend", "id, promo_id, customer_id, email_sent, sms_sent, sent_at", "→ Promo, Customer"],
    ])


# ───────────────────────── save ─────────────────────────
out_path = Path(__file__).parent / "Capstone-Final-Paper.docx"
doc.save(out_path)
print(f"Wrote {out_path}")
