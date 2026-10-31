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
{slug:"installing-burp-ca-system-certificate-android-11-magisk",title:"Installing Burp Suite's CA as a System Certificate on Android 11+ with Magisk",category:"mobile",date:"2026-10-31",readTime:"8 min read",excerpt:"Android 11+ makes /system effectively read-only, so the old remount-and-copy trick no longer works. Here is how to overlay Burp's CA as a system certificate using a systemless Magisk module.",featured:false,tags:["Android","Burp Suite","Magisk","Mobile Security"],content:`
      <p>Intercepting HTTPS traffic from Android apps is a core part of mobile security testing. Since Android 7, apps ignore user-installed CAs unless they explicitly opt in through <code>network_security_config.xml</code>. Installing Burp's CA as a system certificate removes that restriction, but on Android 11+ it takes a different approach than it used to.</p>
      <h2>1. Why a system certificate?</h2><p>Certificates in the system store are trusted by default. Once Burp's CA is installed there, you can intercept HTTPS traffic system-wide, including from apps that reject user-installed certificates.</p>
      <h2>2. Why the old method no longer works</h2><p>On earlier Android versions, a tester with root could remount <code>/system</code> as read-write and copy the CA into <code>/system/etc/security/cacerts/</code>. Newer versions use system-as-root, dynamic partitions, and Android Verified Boot 2.0, so <code>/system</code> is strictly read-only and integrity-checked, even on many rooted devices. Remounting it is difficult or impossible without advanced methods such as Magisk modules or modified boot images.</p>
      <div class="callout">Perform testing only on devices and applications you own or are explicitly authorized to assess. This technique requires a rooted test device, so do not use your personal daily-driver phone.</div>
      <h2>3. Export Burp's CA certificate (DER)</h2><p>In Burp Suite, go to <strong>Proxy &gt; Proxy settings</strong> and click <strong>Import / export CA certificate</strong>. Choose <strong>Certificate in DER format</strong>, click <strong>Next</strong>, select a save location, name the file <code>Burp.der</code>, then finish the export wizard. You can also download the certificate from <code>http://burpsuite/cert</code> in a browser that is proxied through Burp.</p>
      <h2>4. Convert DER to PEM and name it by hash</h2><p>Copy <code>Burp.der</code> to a Linux machine (Kali in this example) and run the following from that folder:</p>
      <pre><code>openssl x509 -inform DER -in Burp.der -out Burp.pem
openssl x509 -inform PEM -subject_hash_old -in Burp.pem | head -1
cp Burp.pem 9a5ba575.0</code></pre>
      <p>The second command prints the subject hash (<code>9a5ba575</code> in this example). Android looks up system CAs by <code>&lt;hash&gt;.0</code> filenames, so the copied file must use the hash your own certificate returns.</p>
      <h2>5. Build the Magisk module</h2><p>Create a folder (for example <code>CustomCert</code>) with the following structure:</p>
      <pre><code>CustomCert/
├── module.prop
├── post-fs-data.sh
└── system/etc/security/cacerts/9a5ba575.0</code></pre>
      <p><strong>module.prop</strong> is the module's metadata file, covering name, version, author, and description. Without it, Magisk will not recognize the folder as a valid module.</p>
      <pre><code>id=custom_cert_module
name=Custom System Certificate
version=1.0
versionCode=1
author=You
description=Installs custom certificate into system cacerts</code></pre>
      <p><strong>post-fs-data.sh</strong> tells Android which interpreter runs the script. <code>#!</code> marks an interpreter directive and <code>/system/bin/sh</code> is Android's default shell.</p>
      <pre><code>#!/system/bin/sh</code></pre>
      <p><strong>system/etc/security/cacerts/9a5ba575.0</strong> is the certificate itself. The path mirrors Android's system CA store at <code>/system/etc/security/cacerts/</code>, and Magisk overlays it at boot. Finally, select the three items (<code>module.prop</code>, <code>post-fs-data.sh</code>, and the <code>system</code> folder) and compress them into <code>CustomCert.zip</code>. Zip the contents, not the parent folder, so the files sit at the root of the archive.</p>
      <h2>6. Load the module in Magisk</h2><p>Transfer <code>CustomCert.zip</code> to the device (Android 11+), then:</p>
      <p>1. Open the <strong>Magisk</strong> app.<br>2. Go to the <strong>Modules</strong> tab.<br>3. Tap <strong>Install from storage</strong>, select <code>CustomCert.zip</code>, and confirm with <strong>OK</strong>.<br>4. Once the log shows the installation finished successfully, tap <strong>Reboot</strong>.</p>
      <h2>7. Verify the installation</h2><p>After the reboot, open <strong>Settings</strong> and search for <strong>Trusted certificates</strong>. Under the <strong>System</strong> tab, scroll to <strong>PortSwigger CA</strong>. If it is listed and enabled, the Burp CA is now trusted as a system certificate.</p>
      <h2>Important: this is not a one-time setup</h2><p>If the Burp CA changes (for example, you regenerate the certificate or use a different Burp installation), the subject hash changes too. Because Android relies on the hash-based filename, you must re-export the certificate, regenerate the hash, rebuild the module, and reinstall it each time.</p>
      <h2>Closing thought</h2><p>Magisk's systemless approach overlays the Burp CA at boot without modifying the actual system partition. The certificate is trusted as a system CA while system integrity and boot verification stay intact, which makes full HTTPS interception practical on modern Android.</p>`}
  ],
  projects: [
    {slug:"Android-PT",title:"Android Pentesting",status:"Tools & Testcases",summary:"My Android Pentesting Toolkit",description:"Android pentesting checklist to cover maximum testcases",stack:["Android","Mobile","DAST","SAST"],github:"https://github.com/PentestBuddy01/AndroidPentest",featured:true}
  ],
  certifications: [
    {id:"ceh",name:"Certified Ethical Hacker (CEH)",issuer:"EC-Council",year:"2025",certificate:"assets/certificates/ceh.pdf",summary:"Ethical hacking and security assessment certification."},
    {id:"ejptv2",name:"eJPTv2",issuer:"INE Security",year:"2024",credential:"https://certs.ine.com/eb9c31e7-d3e3-4319-b299-7df0d071af31",certificate:"assets/certificates/ejptv2.pdf",summary:"Junior penetration testing certification."}
    
  ],
  videos: [
    {title:"Container Chaos",description:"Docker and containers are everywhere, but misconfigurations can quickly turn them into serious security risks.",youtubeId:"VLMGRsYpQCk",event:"Foxxcon"},
    {title:"OAuth Misconfiguration",description:"Developers in the room were shocked to see how tiny configuration mistakes can open the door to big-impact vulnerabilities. ",youtubeId:"SZeP6Jd2ANs",event:"Foxxcon"},
    {title:"Prototype Pollution",description:"Ever wondered how a single vulnerability could let attackers take over your JavaScript app? Watch this explosive live demo as Redfox Security and Atharva Nanche dive into the dark world of Prototype Pollution — a critical but often misunderstood security flaw.",youtubeId:"AMQP66kCQKA",event:"Foxxcon"}
    ]
};
