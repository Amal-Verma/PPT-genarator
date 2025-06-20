import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4 py-12">
      <header className="mb-10 flex flex-col items-center">
        <Image
          src="/file.svg"
          alt="PPT Generator Logo"
          width={64}
          height={64}
          className="mb-4"
        />
        <h1 className="text-4xl font-extrabold text-blue-900 mb-2 text-center">
          AI Presentation Generator
        </h1>
        <p className="text-lg text-gray-700 text-center max-w-xl">
          Instantly generate professional presentation slides with AI. Create
          outlines, full presentations, and export to PowerPoint.
        </p>
      </header>

      <nav className="flex flex-col sm:flex-row gap-6 mb-12 w-full max-w-2xl justify-center">
        <Link
          href="/generate"
          className="flex-1 px-6 py-4 bg-blue-600 text-white rounded-lg shadow-lg text-xl font-semibold text-center hover:bg-blue-700 transition"
        >
          Generate Presentation
        </Link>
        <Link
          href="/websearch"
          className="flex-1 px-6 py-4 bg-white border border-blue-200 text-blue-700 rounded-lg shadow-lg text-xl font-semibold text-center hover:bg-blue-50 transition"
        >
          Web Search
        </Link>
        <Link
          href="/chat"
          className="flex-1 px-6 py-4 bg-white border border-blue-200 text-blue-700 rounded-lg shadow-lg text-xl font-semibold text-center hover:bg-blue-50 transition"
        >
          Gemini Chat
        </Link>
      </nav>

      <section className="max-w-2xl w-full bg-white rounded-xl shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-blue-800">How it works</h2>
        <ol className="list-decimal list-inside text-gray-700 space-y-2">
          <li>Enter your topic and select the number of slides and tone.</li>
          <li>Review the generated outline and customize as needed.</li>
          <li>Generate the full presentation and preview each slide.</li>
          <li>Export your slides to PowerPoint (.pptx) with one click.</li>
        </ol>
      </section>

      <footer className="mt-auto text-center text-gray-400 text-sm pt-8">
        <span>
          Made with Next.js &amp; Gemini AI &middot;{" "}
          <a
            href="https://github.com/amalshaji/ppt-genarator"
            className="underline hover:text-blue-700"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </span>
      </footer>
    </div>
  );
}
