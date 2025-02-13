"use client";
import TrackBar from "@/components/TrackBar";

export default function Home() {
  return (
    <>
      {/* Main Content */}
      <main className="px-6 pt-20 pb-32">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Lost in tracking? Discover
          </h1>
          <div className="text-5xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500 text-transparent bg-clip-text animate-gradient">
            THE PERFECT WAY
          </div>
          <h2 className="text-2xl md:text-4xl text-white font-light">
            to stay updated
          </h2>
        </div>
        <TrackBar />
      </main>
    </>
  );
}
