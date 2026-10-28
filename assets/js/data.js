/* Edit this file to add articles, projects, certifications and videos. */
window.PORTFOLIO_DATA = {
  profile: {
    name: "Atharva Nanche",
    email: "atharvananche001@gmail.com",
    linkedin: "https://www.linkedin.com/in/atharva-nanche-393a651ba/",
    github: "https://github.com/PentestBuddy01",
    youtube: "https://www.youtube.com/"
  },
  categories: [
    {id:"web-api",label:"Web / API"},
    {id:"mobile",label:"Mobile"},
    {id:"thick-client",label:"Thick Client"},
    {id:"cloud",label:"Cloud"},
    {id:"devsecops",label:"DevSecOps"},
    {id:"source-code-review",label:"Source Code Review"},
    {id:"ai-llm",label:"AI / LLM Security"},
    {id:"infrastructure",label:"Infrastructure"}
  ],
  posts: [
    {slug:"building-a-practical-api-testing-checklist",title:"Building a Practical API Security Testing Checklist",category:"web-api",date:"2026-10-28",readTime:"7 min read",excerpt:"A repeatable approach to mapping endpoints, validating authorization, and testing API behavior beyond the happy path.",featured:true,tags:["API Security","Methodology"],content:`
      <p>API testing gets more useful when it is treated as a structured investigation rather than a list of payloads. Start by understanding the application's roles, objects, workflows, and trust boundaries.</p>
      <h2>1. Map the attack surface</h2><p>Collect routes from documentation, traffic, client code, and observed application behavior. Record HTTP methods, authentication requirements, input fields, and the objects each endpoint acts on.</p>
      <h2>2. Test authorization in context</h2><p>Use at least two controlled test accounts with different roles and owned objects. Check object-level authorization, function-level authorization, tenant boundaries, and whether state changes are enforced server-side.</p>
      <div class="callout">Perform testing only against systems you own or are explicitly authorized to assess. Use test data and avoid destructive actions.</div>
      <h2>3. Go beyond injection</h2><p>Review mass assignment, excessive data exposure, pagination, rate limits, workflow sequencing, replay behavior, and inconsistent validation across endpoints.</p>
      <h2>4. Capture useful evidence</h2><p>For each issue, record the preconditions, sanitized request and response, reproducible steps, security impact, and a specific remediation. Make it easy for an engineer to validate the fix.</p>
      <h2>Closing thought</h2><p>The best checklist adapts to the application's business model. Use it to guide reasoning, not replace it.</p>`}
  ],
  projects: [
    {slug:"mobile-security-lab",title:"Mobile Application Security Lab",status:"Learning lab",summary:"A controlled Android and iOS setup for instrumentation, traffic analysis, and mobile application testing.",description:"A personal lab for understanding runtime behavior, app storage, transport security, jailbreak/root detection, and client-server trust boundaries.",stack:["Android","iOS","Frida","Mobile"],github:"",featured:true}
  ],
  certifications: [
    {id:"ceh",name:"Certified Ethical Hacker (CEH)",issuer:"EC-Council",year:"2025",certificate:"assets/certificates/ceh.pdf",summary:"Ethical hacking and security assessment certification."},
    {id:"ejptv2",name:"eJPTv2",issuer:"INE Security",year:"2024",credential:"https://certs.ine.com/eb9c31e7-d3e3-4319-b299-7df0d071af31",certificate:"assets/certificates/ejptv2.pdf",summary:"Junior penetration testing certification."}
    
  ],
  videos: [
    {title:"Container Chaos",description:"Conference session. Replace the video ID with the ID from your YouTube URL.",youtubeId:"VLMGRsYpQCk",event:"Foxxcon"}
    ]
};