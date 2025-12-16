"use client";

import { Calendar } from "lucide-react";

function Header() {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
              RoomCompanion
            </h1>
            <p className="text-sm text-slate-500">
              Medical Room Management System
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col min-h-screen">
      {/* <Header /> */}
      {children}
    </section>
  );
}
