import { useState, useEffect } from "react";

const WINE     = "#6B1A2A";
const IVORY    = "#F5EFE0";
const ROSE     = "#C4858F";
const CHARCOAL = "#231F1C";
const GOLD     = "#C49A2A";

const PLATFORMS = [
  { name: "YouTube",   url: "https://www.youtube.com/@TheAuthorRach/" },
  { name: "Instagram", url: "https://www.instagram.com/theauthorrach/" },
  { name: "TikTok",    url: "https://www.tiktok.com/@theauthorrach" },
  { name: "Substack",  url: "https://racheldoak.substack.com/" },
];

const TABS = ["Overview", "Stats", "Content", "Partnerships"];
const fmt  = n => Number(n).toLocaleString();

// Fallback content shown instantly while content.json loads
const DEFAULT_CONTENT = {
  bio: {
    pullQuote:  "A romance author and creator who lives inside fandom — and who knows exactly where the bodies are buried in publishing.",
    paragraph1: "Rachel D. Oak occupies a genuinely rare dual position: she's a reader with native fandom fluency (her audience reads AO3, demanded Heated Rivalry outside Canada, and will defend her on Reddit) and an author who has seen publishing from the inside — and isn't afraid to say so on camera.",
    paragraph2: "Short-form: relatable all-caps reader moments. Long-form: industry critique and video essays with cheeky humour and 2am-texting-your-friends energy underneath. Active on every platform, every day.",
  },
  whyPartner: [
    { heading: "Fandom-native audience",    body: "Her followers don't just watch — they defend, share, demand, and buy. This is the core romance fandom, not casual scrollers." },
    { heading: "Algorithmic overperformer", body: "TikTok: 397.9K views in 28 days from 14K followers. YouTube Shorts peaking at 768K. Reach dramatically outpaces follower count." },
    { heading: "Trusted, honest voice",     body: "She calls out bad tropes and publishing practices by name. That honesty is exactly why her audience trusts what she recommends." },
    { heading: "Multi-format, daily output",body: "Daily Shorts, daily Reels, weekly essays, weekly lives, weekly newsletters. One deal, 5+ organic touchpoints." },
  ],
  topics: ["Romance novels","Publishing industry critique","Trope analysis","Fandom culture","Author life","Reader identity","Book releases","AO3 + fanfic culture","Writing process","Industry exposé"],
  proofPoints: [
    { num: "#26",    label: "Substack Fiction · global",    body: "Ranked top 30 within 2 months of launch. Zero paid acquisition — driven entirely by social." },
    { num: "✦",     label: "The Reddit Defence",            body: "When someone tried to cancel her for 'TikTok cringe', Reddit came to her defence. Community loyalty, publicly demonstrated." },
    { num: "3-part",label: "Readers demanding her trilogy", body: "Organic fan demand for the final Lavender Bay book — genuine emotional investment in her fiction." },
    { num: "768K",  label: "Single Short peak views",       body: "Algorithmic reach and content quality, not just subscriber count." },
  ],
  brandFit:    ["Book publishers + indie presses","Reading apps + e-readers","Stationery + journaling brands","Book subscription boxes","Coffee + cosy lifestyle brands","Writing tools + productivity apps","Literary merch + bookish goods"],
  brandNotFit: ["Brands misaligned with feminist values","Content that erodes reader trust","Conflicts with publishing critique stance","Ethically compromised supply chains"],
  ctaText: "All enquiries welcome. If you think you're a fit — or even if you're not sure — email me and we'll figure it out.",
};

// ── Shared atoms ──────────────────────────────────────────────────────

function PlatformLinks() {
  return (
    <div style={{ display:"flex", gap:"0.5rem", flexWrap:"wrap" }}>
      {PLATFORMS.map(p => (
        <a key={p.name} href={p.url} target="_blank" rel="noreferrer"
          style={{ border:`1px solid ${GOLD}70`, color:GOLD, padding:"0.25rem 0.75rem", borderRadius:"20px", textDecoration:"none", fontSize:"0.65rem", letterSpacing:"0.1em", fontWeight:500 }}>
          {p.name} ↗
        </a>
      ))}
    </div>
  );
}

function Pulse() {
  return <span style={{ width:6, height:6, borderRadius:"50%", background:"#4ade80", display:"inline-block", animation:"pulse 2s infinite", flexShrink:0 }} />;
}

function StatCard({ val, label, numColor, live }) {
  return (
    <div style={{ background:"#fff", borderRadius:"10px", padding:"0.9rem", border:`0.5px solid ${numColor}20`, textAlign:"center", position:"relative" }}>
      {live && <span style={{ position:"absolute", top:6, right:8 }}><Pulse /></span>}
      <div style={{ fontFamily:"Impact,'Arial Black',sans-serif", fontSize:"1.3rem", color:numColor, lineHeight:1 }}>{val}</div>
      <div style={{ fontSize:"0.6rem", color:"#888", textTransform:"uppercase", letterSpacing:"0.09em", marginTop:"0.3rem", lineHeight:1.4 }}>{label}</div>
    </div>
  );
}

function StatsGrid({ items, numColor }) {
  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(118px,1fr))", gap:"0.7rem" }}>
      {items.map(i => <StatCard key={i.label} {...i} numColor={numColor} />)}
    </div>
  );
}

function SectionHead({ title, url, note, color }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:"0.85rem", marginBottom:"0.9rem" }}>
      <a href={url} target="_blank" rel="noreferrer"
        style={{ fontFamily:"Impact,'Arial Black',sans-serif", fontSize:"0.9rem", letterSpacing:"0.15em", color, textDecoration:"none", flexShrink:0 }}>
        {title} <span style={{ fontSize:"0.68rem", opacity:0.65 }}>↗</span>
      </a>
      <div style={{ height:"1px", flex:1, background:GOLD, opacity:0.18 }} />
      {note && <span style={{ fontSize:"0.6rem", color:"#999", flexShrink:0 }}>{note}</span>}
    </div>
  );
}

const ST = { fontFamily:"Georgia,serif", fontStyle:"italic", fontSize:"1.55rem", color:WINE, margin:"0 0 0.35rem", fontWeight:300 };
const GR = { height:"1px", background:GOLD, opacity:0.4, maxWidth:"48px", marginBottom:"1.4rem" };

// ── Main app ──────────────────────────────────────────────────────────

export default function MediaKit() {
  const [tab, setTab]       = useState("Overview");
  const [loaded, setLoaded] = useState(false);
  const [content, setContent] = useState(DEFAULT_CONTENT);

  const [yt, setYt] = useState({ subscribers:31688, monthlyViews:"3.1M", monthlyAudience:"613.7K", topShort:"768K", shortsRange:"19.7K–52.9K", videoRange:"290–1.2K", liveRange:"80–150", live:false });
  const [ig, setIg] = useState({ followers:50616, posts:840 });
  const [tt, setTt] = useState({ followers:"14K", totalLikes:"1.2M", videoViews:"397.9K", profileViews:"20.1K", likes28:"21.6K", comments:"286", shares:"2.4K", engRate:"~5.4%" });
  const [ss, setSs] = useState({ subscribers:"577", rank:"#26", openRate:"27.75%", views30d:"2,528", usAudience:"36%" });
  const [lastUpdated, setLastUpdated] = useState("May 2026");

  useEffect(() => {
    // 1. Load stats.json (numbers)
    fetch("/stats.json")
      .then(r => r.json())
      .then(data => {
        if (data.youtube)    setYt(p => ({ ...p, ...data.youtube }));
        if (data.instagram)  setIg(p => ({ ...p, ...data.instagram }));
        if (data.tiktok)     setTt(p => ({ ...p, ...data.tiktok }));
        if (data.substack)   setSs(p => ({ ...p, ...data.substack }));
        if (data.lastUpdated) setLastUpdated(data.lastUpdated);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));

    // 2. Load content.json (prose)
    fetch("/content.json")
      .then(r => r.json())
      .then(data => setContent(c => ({ ...c, ...data })))
      .catch(() => {});

    // 3. Auto-fetch live YouTube subscriber count via serverless function
    // (requires YOUTUBE_API_KEY set in Vercel environment variables)
    fetch("/api/youtube")
      .then(r => r.json())
      .then(data => {
        if (data.subscribers) setYt(p => ({ ...p, subscribers: data.subscribers, live: true }));
      })
      .catch(() => {}); // silently falls back to stats.json value if not configured
  }, []);

  const navBtn = active => ({
    background:"none", border:"none",
    color: active ? GOLD : `${IVORY}75`,
    padding:"0.9rem 1.1rem", cursor:"pointer",
    fontSize:"0.68rem", letterSpacing:"0.15em", textTransform:"uppercase",
    borderBottom:`2px solid ${active ? GOLD : "transparent"}`,
    transition:"all 0.18s", fontFamily:"inherit",
  });

  if (!loaded) return (
    <div style={{ minHeight:"100vh", background:WINE, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <span style={{ fontFamily:"Georgia,serif", fontStyle:"italic", color:IVORY, opacity:0.45, fontSize:"1rem" }}>Loading…</span>
    </div>
  );

  return (
    <div style={{ fontFamily:"system-ui,-apple-system,sans-serif", background:IVORY, color:CHARCOAL, minHeight:"100vh" }}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}`}</style>

      {/* ═══ HERO ═══════════════════════════════════════════════════ */}
      <div style={{ background:WINE, padding:"3rem 2.5rem 2.25rem", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:0, right:0, width:"45%", height:"100%", background:`linear-gradient(135deg,transparent 55%,${ROSE}12 100%)`, pointerEvents:"none" }} />
        <p style={{ margin:"0 0 0.4rem", color:ROSE, fontSize:"0.65rem", letterSpacing:"0.22em", textTransform:"uppercase" }}>media kit · {lastUpdated}</p>
        <h1 style={{ margin:"0 0 0.15rem", fontFamily:"Georgia,serif", fontStyle:"italic", fontSize:"clamp(2rem,5vw,3.25rem)", color:IVORY, fontWeight:300, letterSpacing:"-0.02em" }}>Rachel D. Oak</h1>
        <p style={{ margin:"0 0 1.2rem", color:IVORY, opacity:0.5, fontSize:"0.75rem", letterSpacing:"0.13em" }}>romance · publishing · book culture · @theauthorrach</p>
        <div style={{ height:"1px", background:GOLD, opacity:0.38, maxWidth:"400px", marginBottom:"1.4rem" }} />
        <div style={{ display:"flex", gap:"2rem", flexWrap:"wrap", marginBottom:"1.6rem" }}>
          {[
            { p:"YouTube",   v:fmt(yt.subscribers), s:`${yt.monthlyViews} mo. views`, c:GOLD,  live:yt.live },
            { p:"Instagram", v:fmt(ig.followers),   s:"followers",                    c:ROSE },
            { p:"TikTok",    v:tt.followers,         s:`${tt.totalLikes} likes`,       c:IVORY },
            { p:"Substack",  v:fmt(ss.subscribers), s:`${ss.rank} fiction`,            c:GOLD },
          ].map(s => (
            <div key={s.p} style={{ minWidth:"70px", position:"relative" }}>
              {s.live && <span style={{ position:"absolute", top:2, right:-10 }}><Pulse /></span>}
              <div style={{ fontFamily:"Impact,'Arial Black',sans-serif", fontSize:"1.5rem", color:s.c, lineHeight:1 }}>{s.v}</div>
              <div style={{ fontSize:"0.58rem", color:ROSE, letterSpacing:"0.14em", textTransform:"uppercase", marginTop:"0.18rem" }}>{s.p}</div>
              <div style={{ fontSize:"0.58rem", color:IVORY, opacity:0.45, marginTop:"0.1rem" }}>{s.s}</div>
            </div>
          ))}
        </div>
        <PlatformLinks />
      </div>

      {/* ═══ NAV ════════════════════════════════════════════════════ */}
      <div style={{ background:CHARCOAL, display:"flex", alignItems:"center", padding:"0 1.5rem", position:"sticky", top:0, zIndex:100, flexWrap:"wrap" }}>
        {TABS.map(t => <button key={t} style={navBtn(tab===t)} onClick={() => setTab(t)}>{t}</button>)}
        {yt.live && (
          <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:5, padding:"0.4rem 0" }}>
            <Pulse /><span style={{ fontSize:"0.58rem", color:"#4ade80", letterSpacing:"0.08em" }}>YT LIVE</span>
          </div>
        )}
      </div>

      {/* ═══ OVERVIEW ════════════════════════════════════════════════ */}
      {tab === "Overview" && (
        <div style={{ padding:"2.5rem" }}>
          <div style={{ background:"#fff", borderRadius:"14px", padding:"2rem", border:`0.5px solid ${ROSE}28`, borderTop:`3px solid ${WINE}`, marginBottom:"2rem" }}>
            <div style={{ color:ROSE, fontSize:"0.6rem", letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:"0.65rem" }}>Who she is</div>
            <p style={{ fontFamily:"Georgia,serif", fontStyle:"italic", fontSize:"1.1rem", color:WINE, lineHeight:1.85, margin:"0 0 1rem" }}>"{content.bio.pullQuote}"</p>
            <p style={{ fontSize:"0.875rem", color:"#555", lineHeight:1.85, margin:"0 0 0.75rem" }}>{content.bio.paragraph1}</p>
            <p style={{ fontSize:"0.875rem", color:"#555", lineHeight:1.85, margin:0 }}>{content.bio.paragraph2}</p>
          </div>

          <h2 style={ST}>Why partner with Rachel</h2>
          <div style={GR} />
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:"1rem", marginBottom:"2rem" }}>
            {content.whyPartner.map(v => (
              <div key={v.heading} style={{ background:"#fff", borderRadius:"12px", padding:"1.25rem", border:`0.5px solid ${ROSE}22` }}>
                <div style={{ color:GOLD, fontSize:"1.1rem", marginBottom:"0.45rem" }}>✦</div>
                <div style={{ fontWeight:600, color:WINE, fontSize:"0.84rem", marginBottom:"0.4rem" }}>{v.heading}</div>
                <div style={{ fontSize:"0.77rem", color:"#666", lineHeight:1.78 }}>{v.body}</div>
              </div>
            ))}
          </div>

          <h2 style={ST}>Audience profile</h2>
          <div style={GR} />
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:"1rem", marginBottom:"2rem" }}>
            {[
              { val:"18–34",               label:"Primary age range" },
              { val:"~80%",                label:"Female / female-aligned" },
              { val:"Fandom-native",       label:"Audience identity" },
              { val:"US · UK · IN · CA · DE", label:"Top markets" },
            ].map(a => (
              <div key={a.label} style={{ background:"#fff", borderRadius:"10px", padding:"1.1rem", border:`0.5px solid ${ROSE}22`, textAlign:"center" }}>
                <div style={{ fontFamily:"Impact,'Arial Black',sans-serif", fontSize:"1.1rem", color:WINE, lineHeight:1 }}>{a.val}</div>
                <div style={{ fontSize:"0.58rem", color:"#888", textTransform:"uppercase", letterSpacing:"0.1em", marginTop:"0.35rem" }}>{a.label}</div>
              </div>
            ))}
          </div>

          <h2 style={ST}>What she covers</h2>
          <div style={GR} />
          <div style={{ display:"flex", flexWrap:"wrap", gap:"0.5rem", marginBottom:"2rem" }}>
            {content.topics.map(t => (
              <span key={t} style={{ background:`${WINE}10`, color:WINE, padding:"0.35rem 0.85rem", borderRadius:"20px", fontSize:"0.74rem", fontWeight:500, border:`1px solid ${WINE}22` }}>{t}</span>
            ))}
          </div>

          <h2 style={ST}>Proof points</h2>
          <div style={GR} />
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:"1rem" }}>
            {content.proofPoints.map(m => (
              <div key={m.label} style={{ background:"#fff", borderRadius:"12px", padding:"1.25rem", border:`0.5px solid ${ROSE}22`, borderTop:`3px solid ${GOLD}` }}>
                <div style={{ fontFamily:"Impact,'Arial Black',sans-serif", fontSize:"1.8rem", color:GOLD, lineHeight:1, marginBottom:"0.4rem" }}>{m.num}</div>
                <div style={{ fontWeight:600, color:WINE, fontSize:"0.81rem", marginBottom:"0.4rem" }}>{m.label}</div>
                <div style={{ fontSize:"0.75rem", color:"#666", lineHeight:1.75 }}>{m.body}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ STATS ═══════════════════════════════════════════════════ */}
      {tab === "Stats" && (
        <div style={{ padding:"2.5rem" }}>
          <h2 style={ST}>Platform performance</h2>
          <div style={GR} />

          <div style={{ background:WINE, borderRadius:"14px", padding:"1.5rem", marginBottom:"2rem" }}>
            <div style={{ color:GOLD, fontSize:"0.58rem", letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:"1rem", opacity:0.75 }}>Combined reach</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))", gap:"1rem", textAlign:"center" }}>
              {[["96.9K+","Total followers"],["3.5M+","Monthly video views"],["5","Active platforms"],["~5.4%","TikTok eng. rate (avg 2–4%)"]].map(([v,l]) => (
                <div key={l}>
                  <div style={{ fontFamily:"Impact,'Arial Black',sans-serif", fontSize:"1.9rem", color:GOLD, lineHeight:1 }}>{v}</div>
                  <div style={{ fontSize:"0.56rem", color:IVORY, opacity:0.45, textTransform:"uppercase", letterSpacing:"0.09em", marginTop:"0.3rem" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom:"2rem" }}>
            <SectionHead title="YOUTUBE" url="https://www.youtube.com/@TheAuthorRach/" note={yt.live ? "✦ live" : `updated ${lastUpdated}`} color={WINE} />
            <StatsGrid numColor={WINE} items={[
              { val:fmt(yt.subscribers),  label:"Subscribers",           live:yt.live },
              { val:yt.monthlyViews,      label:"Views (28d)" },
              { val:yt.monthlyAudience,   label:"Monthly audience" },
              { val:yt.topShort,          label:"Top single Short" },
              { val:yt.shortsRange,       label:"Shorts typical range" },
              { val:yt.videoRange,        label:"Long-form range" },
              { val:yt.liveRange,         label:"Live viewers (typical)" },
            ]} />
          </div>

          <div style={{ marginBottom:"2rem" }}>
            <SectionHead title="INSTAGRAM" url="https://www.instagram.com/theauthorrach/" note={`updated ${lastUpdated}`} color={ROSE} />
            <StatsGrid numColor={ROSE} items={[
              { val:fmt(ig.followers), label:"Followers" },
              { val:fmt(ig.posts),     label:"Posts published" },
              { val:"Daily",           label:"Reels + Stories" },
              { val:"US · UK · IN · CA · DE", label:"Top markets" },
            ]} />
          </div>

          <div style={{ marginBottom:"2rem" }}>
            <SectionHead title="TIKTOK" url="https://www.tiktok.com/@theauthorrach" note={`updated ${lastUpdated}`} color={CHARCOAL} />
            <StatsGrid numColor={CHARCOAL} items={[
              { val:tt.followers,    label:"Followers" },
              { val:tt.totalLikes,   label:"Total likes (all-time)" },
              { val:tt.videoViews,   label:"Video views (28d)" },
              { val:tt.profileViews, label:"Profile views (28d)" },
              { val:tt.likes28,      label:"Likes (28d)" },
              { val:tt.shares,       label:"Shares (28d)" },
              { val:tt.comments,     label:"Comments (28d)" },
              { val:tt.engRate,      label:"Engagement rate" },
            ]} />
          </div>

          <div>
            <SectionHead title="SUBSTACK" url="https://racheldoak.substack.com/" note={`updated ${lastUpdated}`} color={GOLD} />
            <StatsGrid numColor={GOLD} items={[
              { val:fmt(ss.subscribers), label:"Subscribers" },
              { val:ss.rank,             label:"Fiction leaderboard" },
              { val:ss.openRate,         label:"Open rate" },
              { val:ss.views30d,         label:"Views (30d)" },
              { val:ss.usAudience,       label:"US audience" },
              { val:"IN · UK",           label:"Next top markets" },
            ]} />
            <p style={{ fontSize:"0.65rem", color:"#aaa", marginTop:"0.55rem" }}>Industry avg open rate 20–25% · Rachel: 27.75% ✦</p>
          </div>
        </div>
      )}

      {/* ═══ CONTENT ═════════════════════════════════════════════════ */}
      {tab === "Content" && (
        <div style={{ padding:"2.5rem" }}>
          <h2 style={ST}>Formats & cadence</h2>
          <div style={GR} />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", marginBottom:"2.5rem" }}>
            {[
              { p:"YouTube · Long-form", f:"Weekly", url:"https://www.youtube.com/@TheAuthorRach/",  d:"Video essays and publishing critiques. 10–20 min deep dives into industry dynamics, trope analysis, and the honest truth. Sharp, critical, cheeky underneath." },
              { p:"YouTube · Shorts",    f:"Daily",  url:"https://www.youtube.com/@TheAuthorRach/",  d:"Relatable all-caps reader moments in 60 seconds or less. Consistently reaching 19.7K–768K views per Short." },
              { p:"YouTube · Lives",     f:"Weekly", url:"https://www.youtube.com/@TheAuthorRach/",  d:"Read-alongs, Q&As, reaction content. 80–150 live viewers per stream — a highly engaged core audience." },
              { p:"Instagram",           f:"Daily",  url:"https://www.instagram.com/theauthorrach/", d:"Reels and behind-the-scenes story presence. 50.6K followers, daily cadence, global audience." },
              { p:"TikTok",              f:"Daily",  url:"https://www.tiktok.com/@theauthorrach",    d:"The discovery engine. 397.9K views in 28 days from 14K followers — algorithmic reach far outperforming follower count." },
              { p:"Substack",            f:"Weekly", url:"https://racheldoak.substack.com/",         d:"Long-form written essays. #26 on Fiction leaderboard globally in 2 months. 27.75% open rate — above the 20–25% industry average." },
            ].map(item => (
              <div key={item.p} style={{ background:"#fff", borderRadius:"12px", padding:"1.25rem", border:`0.5px solid ${ROSE}22`, borderTop:`3px solid ${WINE}` }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"0.5rem" }}>
                  <a href={item.url} target="_blank" rel="noreferrer" style={{ fontWeight:600, color:WINE, fontSize:"0.84rem", textDecoration:"none" }}>{item.p} ↗</a>
                  <span style={{ background:`${ROSE}1a`, color:ROSE, fontSize:"0.58rem", padding:"0.15rem 0.5rem", borderRadius:"20px" }}>{item.f}</span>
                </div>
                <div style={{ fontSize:"0.77rem", color:"#555", lineHeight:1.78 }}>{item.d}</div>
              </div>
            ))}
          </div>

          <h2 style={ST}>Content registers</h2>
          <div style={GR} />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", marginBottom:"2.5rem" }}>
            <div style={{ background:`${WINE}0c`, border:`1px solid ${ROSE}40`, borderRadius:"12px", padding:"1.5rem" }}>
              <div style={{ color:ROSE, fontSize:"0.6rem", letterSpacing:"0.18em", textTransform:"uppercase", fontWeight:600, marginBottom:"0.45rem" }}>Tender Yearning</div>
              <div style={{ fontFamily:"Georgia,serif", fontStyle:"italic", color:WINE, fontSize:"1rem", marginBottom:"0.65rem" }}>"so… he either howled or said nothing"</div>
              <div style={{ fontSize:"0.76rem", color:"#555", lineHeight:1.75 }}>Warm, intimate, cosy reader energy. The Shorts that go viral. "I'm crying too." Best fit for lifestyle, wellness, bookish, and emotional brands.</div>
            </div>
            <div style={{ background:`${CHARCOAL}07`, border:`1px solid ${CHARCOAL}20`, borderRadius:"12px", padding:"1.5rem" }}>
              <div style={{ color:WINE, fontSize:"0.6rem", letterSpacing:"0.18em", textTransform:"uppercase", fontWeight:600, marginBottom:"0.45rem" }}>Righteous Anger</div>
              <div style={{ fontFamily:"Georgia,serif", fontStyle:"italic", color:CHARCOAL, fontSize:"1rem", marginBottom:"0.65rem" }}>"Publishers are buying your trust for free"</div>
              <div style={{ fontSize:"0.76rem", color:"#555", lineHeight:1.75 }}>Sharp, critical, publishing insider with receipts. Activates the core community. Best fit for tools, platforms, and indie-aligned brands.</div>
            </div>
          </div>

          <h2 style={ST}>What a partnership looks like</h2>
          <p style={{ fontSize:"0.76rem", color:"#999", fontStyle:"italic", margin:"-0.15rem 0 1rem" }}>Illustrative concepts — final content always tailored to the brief.</p>
          <div style={GR} />
          <div style={{ display:"grid", gap:"0.7rem" }}>
            {[
              { fmt:"YouTube Essay",    tags:["Long-form","Righteous Anger"], idea:'Publishing critique with brand as the reader-first alternative — narrative integration, not an ad read.' },
              { fmt:"YouTube Short",    tags:["Shorts","Tender Yearning"],    idea:'"the moment in [product] that made me stop and cry" — brand appears inside a genuine emotional reader beat.' },
              { fmt:"TikTok / Reels",  tags:["Short-form","Discovery"],      idea:'"types of romance readers as [brand categories]" — relatable taxonomy with brand as the natural punchline.' },
              { fmt:"Substack feature",tags:["Newsletter","Long-form"],      idea:"Personal essay on reading as a political act — sponsor earns its place by fitting the argument, not interrupting it." },
              { fmt:"Live stream",     tags:["Lives","Community"],           idea:"Sponsored read-along with live commentary and brand gifting for active participants." },
            ].map(item => (
              <div key={item.fmt} style={{ background:"#fff", borderRadius:"10px", padding:"1rem 1.25rem", border:`0.5px solid ${ROSE}22`, display:"flex", gap:"1rem", alignItems:"flex-start", flexWrap:"wrap" }}>
                <div style={{ minWidth:"115px", flexShrink:0 }}>
                  <div style={{ fontWeight:600, color:WINE, fontSize:"0.8rem" }}>{item.fmt}</div>
                  <div style={{ display:"flex", gap:"0.3rem", flexWrap:"wrap", marginTop:"0.3rem" }}>
                    {item.tags.map(t => <span key={t} style={{ background:`${ROSE}18`, color:ROSE, fontSize:"0.57rem", padding:"0.1rem 0.42rem", borderRadius:"10px" }}>{t}</span>)}
                  </div>
                </div>
                <div style={{ fontSize:"0.79rem", color:"#555", lineHeight:1.78, flex:1 }}>{item.idea}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ PARTNERSHIPS ═══════════════════════════════════════════ */}
      {tab === "Partnerships" && (
        <div style={{ padding:"2.5rem" }}>
          <h2 style={ST}>Partnership types</h2>
          <div style={GR} />
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(205px,1fr))", gap:"1rem", marginBottom:"2.5rem" }}>
            {[
              { t:"Sponsored integration",  d:"Brand woven into content naturally — a story beat, not an ad break. Available across any platform or format." },
              { t:"Affiliate partnership",  d:"Performance-based. Rachel promotes, audience converts. Trackable, low-risk entry point." },
              { t:"Brand ambassador",       d:"Longer-term alignment. Brand present across content, stories, and community for a defined period." },
              { t:"Co-created content",     d:"Brand briefs, Rachel creates. Editorial control stays with Rachel — that's what makes it authentic." },
              { t:"Substack sponsorship",   d:"Newsletter feature slot. 27.75% open rate — above-industry-average readership." },
              { t:"Speaking / events",      d:"Panel appearances, bookish events, publishing conversations. In-person and virtual." },
              { t:"Book / author features", d:"Highest-alignment category. Publishers, authors, book-adjacent brands." },
              { t:"Digital product collab", d:"Reading journals, curated lists, branded merch. Right brand, right format." },
            ].map(p => (
              <div key={p.t} style={{ background:"#fff", borderRadius:"12px", padding:"1.25rem", border:`0.5px solid ${ROSE}22`, borderLeft:`3px solid ${ROSE}` }}>
                <div style={{ fontWeight:600, color:WINE, fontSize:"0.84rem", marginBottom:"0.4rem" }}>{p.t}</div>
                <div style={{ fontSize:"0.75rem", color:"#666", lineHeight:1.75 }}>{p.d}</div>
              </div>
            ))}
          </div>

          <h2 style={ST}>Base rate guidance</h2>
          <div style={GR} />
          <p style={{ fontSize:"0.77rem", color:"#777", lineHeight:1.85, marginBottom:"1.35rem", maxWidth:"600px", fontStyle:"italic" }}>
            Rates reflect engagement performance, not vanity counts. Rachel's YouTube view-to-subscriber ratio (~100:1) and TikTok engagement (~5.4% vs 2–4% average) significantly outperform niche benchmarks. All figures are starting points — final pricing depends on deliverables, exclusivity, and campaign length.
          </p>
          <div style={{ display:"grid", gap:"0.6rem", marginBottom:"2.5rem" }}>
            {[
              { item:"YouTube · Long-form integration (60s+ segment)", rate:"$800–$1,500",   note:"Deep narrative brand integration" },
              { item:"YouTube · Dedicated Short",                       rate:"$300–$600",     note:"3.1M monthly views channel" },
              { item:"Instagram · Dedicated Reel",                      rate:"$500–$1,000",   note:"50.6K followers · daily cadence" },
              { item:"TikTok · Dedicated video",                        rate:"$200–$400",     note:"~5.4% engagement rate" },
              { item:"Substack · Newsletter feature",                   rate:"$150–$300",     note:"27.75% open rate" },
              { item:"Multi-platform package (3+ touchpoints)",         rate:"$2,000–$4,500", note:"Custom scope — request a proposal" },
              { item:"Book / publishing brand premium",                  rate:"+25% on base",  note:"Highest content-brand alignment" },
            ].map(r => (
              <div key={r.item} style={{ background:"#fff", borderRadius:"10px", padding:"1rem 1.25rem", border:`0.5px solid ${GOLD}35`, display:"flex", justifyContent:"space-between", alignItems:"center", gap:"1rem", flexWrap:"wrap" }}>
                <div style={{ flex:1, minWidth:"175px" }}>
                  <div style={{ fontWeight:500, fontSize:"0.84rem", color:CHARCOAL }}>{r.item}</div>
                  <div style={{ fontSize:"0.65rem", color:"#999", marginTop:"0.12rem" }}>{r.note}</div>
                </div>
                <div style={{ fontFamily:"Impact,'Arial Black',sans-serif", fontSize:"1.05rem", color:WINE, flexShrink:0 }}>{r.rate}</div>
              </div>
            ))}
          </div>

          <h2 style={ST}>Brand alignment</h2>
          <div style={GR} />
          <p style={{ fontSize:"0.76rem", color:"#888", lineHeight:1.75, marginBottom:"1.1rem", fontStyle:"italic", maxWidth:"540px" }}>
            Rachel's audience trust her because she has standards. Knowing you're a fit before reaching out saves everyone time.
          </p>
          <div style={{ background:CHARCOAL, borderRadius:"14px", padding:"1.75rem", marginBottom:"2.5rem" }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.5rem" }}>
              <div>
                <div style={{ color:GOLD, fontSize:"0.7rem", fontWeight:700, marginBottom:"0.8rem", letterSpacing:"0.1em" }}>✦ Ideal fit</div>
                {content.brandFit.map(b => (
                  <div key={b} style={{ fontSize:"0.77rem", color:IVORY, opacity:0.75, marginBottom:"0.4rem", lineHeight:1.55 }}>{b}</div>
                ))}
              </div>
              <div>
                <div style={{ color:"#f87171", fontSize:"0.7rem", fontWeight:700, marginBottom:"0.8rem", letterSpacing:"0.1em" }}>✗ Not a fit</div>
                {content.brandNotFit.map(b => (
                  <div key={b} style={{ fontSize:"0.77rem", color:IVORY, opacity:0.75, marginBottom:"0.4rem", lineHeight:1.55 }}>{b}</div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ background:WINE, borderRadius:"14px", padding:"2.5rem", textAlign:"center" }}>
            <div style={{ height:"1px", background:GOLD, opacity:0.3, marginBottom:"1.5rem" }} />
            <div style={{ fontFamily:"Georgia,serif", fontStyle:"italic", color:IVORY, fontSize:"1.5rem", marginBottom:"0.5rem", fontWeight:300 }}>Let's work together</div>
            <p style={{ color:IVORY, opacity:0.55, fontSize:"0.82rem", lineHeight:1.8, maxWidth:"340px", margin:"0 auto 1.75rem" }}>{content.ctaText}</p>
            <a href="mailto:theauthorrach@gmail.com"
              style={{ display:"inline-block", background:GOLD, color:CHARCOAL, padding:"0.9rem 2.5rem", borderRadius:"6px", textDecoration:"none", fontSize:"0.84rem", fontWeight:700, letterSpacing:"0.1em" }}>
              theauthorrach@gmail.com
            </a>
            <div style={{ height:"1px", background:GOLD, opacity:0.3, marginTop:"1.75rem" }} />
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div style={{ background:CHARCOAL, padding:"1.5rem 2.5rem", marginTop:"0.5rem" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"0.75rem", marginBottom:"1rem" }}>
          <span style={{ fontFamily:"Georgia,serif", fontStyle:"italic", color:IVORY, opacity:0.45, fontSize:"0.78rem" }}>Rachel D. Oak · @theauthorrach · Media Kit {lastUpdated}</span>
          <span style={{ fontSize:"0.58rem", color:IVORY, opacity:0.22, letterSpacing:"0.1em" }}>Living document</span>
        </div>
        <PlatformLinks />
      </div>
    </div>
  );
}
