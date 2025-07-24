"use client";

import Link from "next/link";
import AuthRedirect from "@/components/AuthRedirect";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <>
      {/* Redirect signed‑in users straight to their dashboard */}
      <AuthRedirect />

      {/* SITE WRAPPER */}
      <div className="min-h-screen flex flex-col bg-white text-gray-800 w-full">
        {/* NAVBAR */}
        <header className="w-full sticky top-0 z-30 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
            <Link href="/" className="text-2xl font-extrabold text-blue-600">DocuFlow</Link>
            <nav className="hidden md:flex gap-8 text-sm font-medium">
              <Link href="#features" className="hover:text-blue-600 transition">Features</Link>
              <Link href="#workflow" className="hover:text-blue-600 transition">Workflow</Link>
              <Link href="#pricing" className="hover:text-blue-600 transition">Pricing</Link>
              <Link href="#contact" className="hover:text-blue-600 transition">Contact</Link>
            </nav>
            <div className="flex items-center gap-4 text-sm font-medium">
              <Link href="/sign-in" className="hover:text-blue-600">Sign in</Link>
              <Link href="/sign-up" className="rounded-lg bg-blue-600 text-white px-4 py-2 shadow hover:bg-blue-700 transition">Get Started</Link>
            </div>
          </div>
        </header>

        {/* HERO */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex-grow flex flex-col justify-center items-center text-center px-6 py-24 bg-gradient-to-b from-white via-blue-50 to-blue-100"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 text-gray-900 max-w-3xl">
            Real‑Time <span className="text-blue-600">Document Workflows</span> that Keep Your BPO Moving
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-10 max-w-2xl">
            Upload, assign, and track Excel & PDF tasks in minutes—no more email chains or manual handoffs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/sign-up" className="bg-blue-600 text-white px-8 py-4 rounded-lg shadow-lg hover:bg-blue-700 transition text-lg">Start Free Trial</Link>
            <Link href="#features" className="text-blue-600 font-semibold underline underline-offset-4 decoration-2 decoration-blue-600 text-lg">See Features</Link>
          </div>
        </motion.section>

        {/* FEATURES */}
        <section id="features" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Built for High‑Volume Document Operations</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
              {[
                {
                  title: "Automated Task Generation",
                  desc: "Every uploaded file or Excel row instantly becomes an actionable task—no spreadsheets required.",
                  icon: "FileStack"
                },
                {
                  title: "Role‑Based Access",
                  desc: "Admins, managers, and employees see exactly what they need with granular permissions.",
                  icon: "ShieldCheck"
                },
                {
                  title: "Real‑Time Tracking",
                  desc: "Stay on top of progress with live dashboards and status alerts.",
                  icon: "Activity"
                },
                {
                  title: "Flexible Task Splitting",
                  desc: "Distribute Excel rows evenly or assign manually for ultimate control.",
                  icon: "Split"
                },
                {
                  title: "Email Notifications",
                  desc: "Automatic reminders and completion emails keep everyone in the loop.",
                  icon: "Mail"
                },
                {
                  title: "Stripe‑Powered Billing",
                  desc: "Upgrade anytime with transparent usage‑based pricing.",
                  icon: "CreditCard"
                }
              ].map((f) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="p-8 bg-gray-50 rounded-2xl shadow border hover:shadow-lg transition"
                >
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">{f.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* WORKFLOW */}
        <section id="workflow" className="py-20 bg-blue-50">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How DocuFlow Works</h2>
            <ol className="relative border-l border-blue-200">
              {[
                {
                  step: "Upload Documents",
                  text: "Drag‑and‑drop PDFs and Excel sheets or connect an S3 bucket—files are stored securely.",
                },
                {
                  step: "Auto‑Generate Tasks",
                  text: "Each file or spreadsheet row is parsed and turned into a task ready for assignment.",
                },
                {
                  step: "Assign & Process",
                  text: "Split tasks evenly or manually among employees; they download, process, and re‑upload.",
                },
                {
                  step: "Track & Notify",
                  text: "Managers watch live dashboards while automated emails notify stakeholders of progress.",
                },
              ].map((item, idx) => (
                <li key={item.step} className="mb-10 ml-6">
                  <span className="absolute -left-3 flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white font-semibold">{idx + 1}</span>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.step}</h3>
                  <p className="text-gray-700">{item.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Flexible, Usage‑Based Pricing</h2>
            <p className="text-gray-700 mb-12 max-w-2xl mx-auto">
              Start for free, pay only when your team scales. Switch plans or cancel anytime.
            </p>
            <div className="grid sm:grid-cols-3 gap-8">
              {[
                {
                  plan: "Free",
                  price: "$0",
                  detail: "Up to 3 users • 100 tasks/mo • 50 MB Storage",
                  cta: "Get Started",
                },
                {
                  plan: "Pro",
                  price: "$49/mo",
                  detail: "Up to 15 users • 5k tasks/mo • 10 GB Storage",
                  cta: "Start 14‑day Trial",
                },
                {
                  plan: "Enterprise",
                  price: "Custom",
                  detail: "Unlimited users • Unlimited tasks • 1 TB Storage",
                  cta: "Contact Sales",
                },
              ].map((p) => (
                <div key={p.plan} className="p-8 rounded-2xl border shadow-sm flex flex-col">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">{p.plan}</h3>
                  <p className="text-3xl font-bold text-blue-600 mb-4">{p.price}</p>
                  <p className="text-gray-700 mb-6 flex-grow">{p.detail}</p>
                  <Link href="/sign-up" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 font-medium transition">{p.cta}</Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="contact" className="py-20 bg-blue-600 text-white text-center">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Document Workflow?</h2>
            <p className="text-lg md:text-xl mb-8">
              Join hundreds of BPOs speeding up task turnaround times by 60% with DocuFlow.
            </p>
            <Link href="/sign-up" className="inline-block bg-white text-blue-600 font-semibold px-8 py-4 rounded-lg shadow-xl hover:shadow-2xl transition text-lg">
              Create Your Free Account
            </Link>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-10 bg-gray-100 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} DocuFlow. All rights reserved.
        </footer>
      </div>
    </>
  );
}
