"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Copy, Mail, MessageCircle, Send, ShieldCheck } from "lucide-react";

export default function InviteAthletePage() {
  const [channel, setChannel] = useState<"email"|"sms">("email");
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);
  const createInvite = async () => { const response = await fetch("/api/invitations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ athleteId: "maya-chen", channel }) }); const result = await response.json(); setLink(result.link); };
  return <main className="access-screen"><section className="access-card invite-card"><Link href="/?workspace=coach" className="back-link"><ArrowLeft size={15}/> Coach workspace</Link><span className="eyebrow">Athlete onboarding</span><h1>Invite Maya securely.</h1><p>The invitation grants access only to Maya’s athlete portal. It expires after 48 hours and can be revoked by the coach.</p><label>Athlete<input value="Maya Chen · maya@baystriders.demo" readOnly/></label><div className="role-picker channel-picker"><button className={channel === "email" ? "active" : ""} onClick={() => setChannel("email")}><Mail size={19}/><span><b>Email</b><small>Send a private link</small></span></button><button className={channel === "sms" ? "active" : ""} onClick={() => setChannel("sms")}><MessageCircle size={19}/><span><b>SMS</b><small>Mobile-first access</small></span></button></div>{link ? <div className="invite-result"><span><Check size={18}/></span><b>Invitation ready</b><small>{link}</small><button onClick={async()=>{await navigator.clipboard.writeText(link);setCopied(true)}}><Copy size={14}/>{copied ? "Copied" : "Copy link"}</button></div> : <button className="primary-button large full" onClick={createInvite}><Send size={17}/> Create secure invitation</button>}<footer><ShieldCheck size={15}/> Delivery uses a demo copy-link fallback until a mail or SMS provider is configured.</footer></section></main>;
}
