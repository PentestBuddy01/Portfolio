(() => {
  const data = window.PORTFOLIO_DATA || {};
  const path = location.pathname;
  const $ = (s, root=document) => root.querySelector(s);
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const categoryLabel = id => (data.categories || []).find(c=>c.id===id)?.label || id;
  const header = () => {
    const links=[["Home","/"],["Blog","/blog/"],["Projects","/projects/"],["Certifications","/certifications/"],["Public Speaking","/public-speaking/"]];
    const base = window.SITE_BASE || "";
    $("#site-header").innerHTML=`<header class="site-header"><div class="container nav-wrap"><a class="brand" href="${base}/"><span class="brand-mark">AN</span><span>Atharva Nanche<small>OFFENSIVE SECURITY</small></span></a><button class="menu-toggle" aria-label="Toggle navigation" aria-expanded="false">☰</button><nav class="nav-links">${links.map(([label,url])=>`<a href="${base}${url}" class="${path.replace(/index\.html$/,"").replace(/\/$/,"")===url.replace(/\/$/,"")?"active":""}">${label}</a>`).join("")}<a class="nav-contact" href="mailto:${esc(data.profile?.email || "atharvananche001@gmail.com")}">Let’s talk ↗</a></nav></div></header>`;
    const btn=$(".menu-toggle"), nav=$(".nav-links");
    btn.addEventListener("click",()=>{const open=nav.classList.toggle("open");btn.setAttribute("aria-expanded",String(open));});
  };
  const footer = () => {
    const base=window.SITE_BASE||"";
    $("#site-footer").innerHTML=`<footer class="site-footer"><div class="container footer-inner"><span>© ${new Date().getFullYear()} Atharva Nanche · Built for curious minds and safer systems.</span><div class="footer-links"><a href="${base}/assets/Atharva_Nanche_Resume.pdf" target="_blank" rel="noopener">Résumé</a><a href="https://github.com/PentestBuddy01" target="_blank" rel="noopener">GitHub</a><a href="https://www.linkedin.com/in/atharva-nanche-393a651ba/" target="_blank" rel="noopener">LinkedIn</a><a href="mailto:${esc(data.profile?.email || "atharvananche001@gmail.com")}">Email</a></div></div></footer>`;
  };
  const tagList = tags => `<div class="tag-list">${(tags||[]).map(t=>`<span class="tag">${esc(t)}</span>`).join("")}</div>`;
  const projectCard = p => `<article class="project-card"><div class="project-visual" aria-hidden="true">&lt; ${esc(p.slug?.slice(0,10)||"PROJECT")} /&gt;</div><div class="project-card-content"><div class="article-meta"><span>${esc(p.status||"PROJECT")}</span><span>CASE FILE</span></div><h3>${esc(p.title)}</h3><p>${esc(p.summary)}</p>${tagList(p.stack)}<div class="card-link">${p.github?`<a href="${esc(p.github)}" target="_blank" rel="noopener">View on GitHub ↗</a>`:`<span>Repository link to be added</span>`}</div></div></article>`;
  const postCard = p => `<a class="article-card" href="${(window.SITE_BASE||"")}/blog/article.html?slug=${encodeURIComponent(p.slug)}"><div class="article-meta"><span>${esc(categoryLabel(p.category))}</span><span>${esc(p.readTime||"")}</span></div><h3>${esc(p.title)}</h3><p>${esc(p.excerpt)}</p><div class="article-meta"><span>${esc(p.date||"Draft")}</span><span class="accent">Read article ↗</span></div></a>`;
  function renderHome(){
    if($("#featured-projects")) $("#featured-projects").innerHTML=(data.projects||[]).filter(p=>p.featured).slice(0,3).map(projectCard).join("");
    if($("#latest-posts")) $("#latest-posts").innerHTML=(data.posts||[]).slice().sort((a,b)=>(b.date||"").localeCompare(a.date||"")).slice(0,3).map(postCard).join("");
  }
  function renderBlog(){
    const grid=$("#blog-grid"), search=$("#blog-search"), filters=$("#blog-filters"); if(!grid)return;
    const params=new URLSearchParams(location.search); let selected=params.get("category")||"all";
    filters.innerHTML=[{id:"all",label:"All topics"},...(data.categories||[])].map(c=>`<button class="filter-chip ${c.id===selected?"active":""}" data-category="${esc(c.id)}">${esc(c.label)}</button>`).join("");
    const update=()=>{const q=(search.value||"").toLowerCase();const posts=(data.posts||[]).filter(p=>(selected==="all"||p.category===selected)&&[p.title,p.excerpt,categoryLabel(p.category),...(p.tags||[])].join(" ").toLowerCase().includes(q));grid.innerHTML=posts.length?posts.map(postCard).join(""):`<div class="empty-state">No articles match this search yet. Try another topic or search term.</div>`;filters.querySelectorAll("button").forEach(b=>b.classList.toggle("active",b.dataset.category===selected));};
    filters.addEventListener("click",e=>{const b=e.target.closest("button[data-category]");if(!b)return;selected=b.dataset.category;update();});search.addEventListener("input",update);update();
  }
  function renderArticle(){
    const slug=new URLSearchParams(location.search).get("slug");const post=(data.posts||[]).find(p=>p.slug===slug);const root=$("#article-root");if(!root)return;
    if(!post){root.innerHTML=`<div class="container content-section"><div class="empty-state">Article not found. <a class="accent" href="index.html">Return to the blog</a>.</div></div>`;return;}
    document.title=`${post.title} | Atharva Nanche`;
    root.innerHTML=`<div class="container"><div class="article-title"><a class="back-link" href="index.html">← ALL ARTICLES</a><p class="eyebrow" style="margin-top:25px">${esc(categoryLabel(post.category))} / FIELD NOTES</p><h1>${esc(post.title)}</h1><p class="dek">${esc(post.excerpt)}</p><div class="article-meta"><span>${esc(post.date||"Draft")} · ${esc(post.readTime||"")}</span><span>ATHARVA NANCHE</span></div>${tagList(post.tags)}</div><div class="article-body">${post.content||"<p>Article content coming soon.</p>"}<div class="callout"><strong>Authorized testing only.</strong> Examples and techniques should be used only on systems you own or have explicit permission to assess.</div><p><a class="text-link" href="index.html">← Back to all articles</a></p></div></div>`;
  }
  function renderProjects(){
    const grid=$("#projects-grid"),search=$("#project-search");if(!grid)return;
    const update=()=>{const q=(search.value||"").toLowerCase();const list=(data.projects||[]).filter(p=>[p.title,p.summary,p.description,p.status,...(p.stack||[])].join(" ").toLowerCase().includes(q));grid.innerHTML=list.length?list.map(projectCard).join(""):`<div class="empty-state">No projects found.</div>`;};
    search.addEventListener("input",update);update();
  }
  function renderCertifications(){
    const grid=$("#cert-grid");if(!grid)return;
    grid.innerHTML=(data.certifications||[]).map(c=>`<article class="cert-card"><div class="cert-art">${esc(c.id.toUpperCase())}</div><div class="cert-content"><div class="article-meta"><span>${esc(c.year||"COURSE AUTHORSHIP")}</span><span>CREDENTIAL</span></div><h3>${esc(c.name)}</h3><p class="issuer">${esc(c.issuer)}</p><p>${esc(c.summary||"Add certification details in assets/js/data.js.")}</p><a href="details.html?id=${encodeURIComponent(c.id)}">View details ↗</a></div></article>`).join("");
  }
  function renderCertDetail(){
    const root=$("#cert-detail");if(!root)return;const id=new URLSearchParams(location.search).get("id");const c=(data.certifications||[]).find(x=>x.id===id);
    if(!c){root.innerHTML=`<div class="container content-section"><div class="empty-state">Certification not found. <a class="accent" href="index.html">Back to certifications</a>.</div></div>`;return;}
    document.title=`${c.name} | Certifications`;
    let preview=`<div class="certificate-preview"><div><strong class="accent">CERTIFICATE PREVIEW</strong><p>Add a JPG, PNG or PDF path in <code>assets/js/data.js</code>.</p><small>Suggested path: assets/certificates/${esc(c.id)}.pdf</small></div></div>`;
    if(c.certificate){const ext=c.certificate.split(".").pop().toLowerCase();preview=ext==="pdf"?`<div class="certificate-preview"><iframe title="Certificate PDF" src="../${esc(c.certificate)}"></iframe></div>`:`<div class="certificate-preview"><img src="../${esc(c.certificate)}" alt="${esc(c.name)} certificate"></div>`;}
    root.innerHTML=`<section class="page-hero"><div class="container page-heading"><a class="back-link" href="index.html">← ALL CERTIFICATIONS</a><p class="eyebrow" style="margin-top:20px">CREDENTIAL DETAILS</p><h1>${esc(c.name)}</h1><p>${esc(c.issuer)}${c.year?" · "+esc(c.year):""}</p></div></section><section class="content-section container"><div class="certificate-viewer">${preview}<aside class="detail-sidebar"><h3>Credential information</h3><p><strong>Issuer</strong><br>${esc(c.issuer)}</p><p><strong>Year</strong><br>${esc(c.year||"Add year")}</p><p><strong>About</strong><br>${esc(c.summary||"Add description")}</p>${c.credential?`<p><strong>Credential / verification</strong><br><a href="${esc(c.credential)}" target="_blank" rel="noopener">Open verification ↗</a></p>`:"<p>Add a verification URL if available.</p>"}<p><a class="text-link" href="index.html">← All certifications</a></p></aside></div></section>`;
  }
  function renderExperience(){
    const root=$("#experience-timeline");if(!root)return;
    const jobs=[
      {date:"DEC 2024 — PRESENT",title:"Security Consultant",company:"Redfox Cybersecurity · Mumbai",items:["Lead grey-box, black-box and white-box penetration tests for web, API, mobile and thick-client applications.","Review AWS and Azure environments and Terraform scripts for IAM, network, storage, container and secrets misconfigurations.","Assess AI, LLM and MCP applications for prompt injection, hallucination and data leakage.","Conduct Active Directory assume-breach, network, wireless and Docker assessments.","Authored the CiAPT and CWHE certification courses and spoke at Foxxcon."]},
      {date:"JUN 2022 — DEC 2024",title:"Associate Consultant",company:"Sequretek Pvt. Ltd. · Mumbai",items:["Delivered DAST across web, API, mobile and thick-client applications and SAST on Android applications.","Performed vulnerability assessments and configuration audits using Nessus Professional.","Produced penetration-testing reports aligned with OWASP standards.","Started as a trainee on HDFC Bank's encryption security support team, handling ServiceNow tickets, monitoring and Seclore troubleshooting."]},
      {date:"APR 2022 — JUL 2022",title:"Security Analyst Intern",company:"CyberSapiens United LLP · Bangalore",items:["Tested client web applications and APIs.","Received client appreciation certificates for assessment work."]}
    ];
    root.innerHTML=jobs.map(j=>`<article class="experience-item"><div class="experience-date">${esc(j.date)}</div><div><h2>${esc(j.title)}</h2><p class="experience-company">${esc(j.company)}</p><ul>${j.items.map(i=>`<li>${esc(i)}</li>`).join("")}</ul></div></article>`).join("");
  }
  function renderSpeaking(){
    const grid=$("#video-grid");if(!grid)return;
    grid.innerHTML=(data.videos||[]).map(v=>`<article class="video-card">${v.youtubeId?`<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(v.youtubeId)}" title="${esc(v.title)}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`:`<div class="video-placeholder"><div><strong>▶</strong><span>${esc(v.event||"VIDEO")}</span><small><br>Add your YouTube video ID in assets/js/data.js</small></div></div>`}<div class="video-info"><h3>${esc(v.title)}</h3><p>${esc(v.description)}</p></div></article>`).join("");
  }
  header();footer();renderHome();renderBlog();renderArticle();renderProjects();renderCertifications();renderCertDetail();renderExperience();renderSpeaking();
})();