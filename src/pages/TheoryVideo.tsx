import { ArrowLeft, ExternalLink, Youtube } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { syllabusUrl, theorySections, topicCount } from '@/data/theory';

const topicEntries = theorySections.flatMap(section =>
  section.categories.flatMap(category =>
    category.topics.map(topic => ({ section, category, topic })),
  ),
);

export default function TheoryVideo() {
  const [params] = useSearchParams();
  const videoId = params.get('video') ?? '';
  const resourceTitle = params.get('title') || 'Learning resource';
  const source = params.get('source') || `https://www.youtube.com/watch?v=${videoId}`;
  const topicId = params.get('topic') ?? '';
  const entryIndex = topicEntries.findIndex(entry => entry.topic.id === topicId);
  const entry = entryIndex >= 0 ? topicEntries[entryIndex] : null;
  const validVideoId = /^[a-zA-Z0-9_-]{11}$/.test(videoId);
  const syllabusLabel = entry
    ? entry.category.supplementary ? 'AICC foundation' : `${entry.topic.mode} in syllabus`
    : 'Learning resource';

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#0a0a0f] dark:text-white">
      <Navigation />
      {!validVideoId ? (
        <main className="flex min-h-[65vh] items-center justify-center px-5 pt-24 text-center">
          <div className="max-w-md">
            <Youtube className="mx-auto h-10 w-10 text-red-500" />
            <h1 className="mt-4 text-2xl font-bold">Invalid YouTube video</h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">This video link is missing or not supported.</p>
            <Link to="/theory" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-aicc-purple hover:underline">
              <ArrowLeft className="h-4 w-4" /> Back to Theory
            </Link>
          </div>
        </main>
      ) : (
        <main className="mx-auto max-w-7xl px-4 pb-14 pt-24 sm:px-6 lg:pt-28">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <Link to={entry ? `/theory/${entry.section.id}/${entry.topic.id}` : '/theory'} className="inline-flex items-center gap-2 text-sm font-semibold text-aicc-purple hover:underline dark:text-purple-300">
              <ArrowLeft className="h-4 w-4" /> Back to {entry ? 'topic' : 'Theory Roadmap'}
            </Link>
            {entry && <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-600 dark:border-white/10 dark:bg-white/5 dark:text-gray-300">
              Topic {entryIndex + 1} of {topicCount}
            </span>}
          </div>

          <section className="mb-7">
            <p className="text-sm font-semibold text-aicc-purple dark:text-purple-300">
              <Link to="/theory" className="hover:underline">Theory Roadmap</Link>
              {entry && <> <span className="px-1 text-gray-400">/</span> Topic {entryIndex + 1} of {topicCount}</>}
            </p>
            {entry ? (
              <>
                <p className="mt-3 text-sm font-medium leading-relaxed text-gray-500 dark:text-gray-400">
                  {entry.section.title} <span className="px-1">/</span> {entry.category.title}
                </p>
                <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-950 dark:text-white sm:text-4xl lg:text-5xl">
                  {entry.topic.title}
                </h1>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700 dark:border-teal-800 dark:bg-teal-900/20 dark:text-teal-300">
                    {syllabusLabel}
                  </span>
                  <a href={syllabusUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-aicc-purple dark:text-gray-400 dark:hover:text-purple-300">
                    Official syllabus <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </>
            ) : (
              <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{resourceTitle}</h1>
            )}
          </section>

          <section aria-label="Embedded YouTube video" className="overflow-hidden rounded-2xl border border-gray-200 bg-black shadow-xl shadow-black/10 dark:border-white/10 dark:shadow-black/30">
            <div className="aspect-video w-full">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
                title={entry ? `${entry.topic.title} — ${resourceTitle}` : resourceTitle}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </section>

          <div className="mt-5 flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.03] sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Video resource</p>
              <p className="mt-1 text-sm font-semibold text-gray-800 dark:text-gray-200">{resourceTitle}</p>
              <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                Embedded from YouTube. The video and all associated rights remain with its original creator or rights holder; AICC does not claim ownership.
              </p>
            </div>
            <a href={source} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 transition-colors hover:border-aicc-purple hover:text-aicc-purple dark:border-white/10 dark:text-gray-200 dark:hover:text-purple-300">
              Open on YouTube <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </main>
      )}
      <Footer />
    </div>
  );
}
