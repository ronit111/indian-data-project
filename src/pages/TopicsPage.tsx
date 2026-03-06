import { motion } from 'framer-motion';
import { SEOHead } from '../components/seo/SEOHead.tsx';
import { TopicCard } from '../components/topics/TopicCard.tsx';
import { useTopicData } from '../hooks/useTopicData.ts';
import { ALL_TOPICS } from '../lib/topicConfigs/index.ts';
import type { DomainDataKey } from '../lib/topicConfig.ts';

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Collect all unique summary data keys across all topics
const allSummaryKeys: DomainDataKey[] = [
  ...new Set(ALL_TOPICS.flatMap((t) => t.summaryData)),
];

export default function TopicsPage() {
  const { data: bag, loading } = useTopicData(allSummaryKeys);

  return (
    <>
      <SEOHead
        title="Cross-Domain Topics — Indian Data Project"
        description="11 curated topics that weave data from multiple domains into coherent stories about India's biggest challenges and opportunities."
        path="/topics"
        image="/og-topics.png"
      />

      {/* Hero */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-16 px-6 sm:px-8 max-w-7xl mx-auto">
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-center"
          style={{ color: 'var(--text-primary)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
        >
          Cross-Domain Insights
        </motion.h1>
        <motion.p
          className="text-base sm:text-lg text-center mt-4 max-w-2xl mx-auto"
          style={{ color: 'var(--text-secondary)' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE_OUT_EXPO }}
        >
          India's biggest questions don't fit inside one dataset. These 11 topics weave data
          from multiple domains into stories that connect the dots.
        </motion.p>
      </section>

      {/* Loading */}
      {loading && (
        <div className="py-16 text-center">
          <div
            className="inline-block w-6 h-6 border-2 rounded-full animate-spin"
            style={{ borderColor: 'rgba(255,255,255,0.1)', borderTopColor: 'var(--saffron)' }}
          />
          <p className="text-sm mt-3" style={{ color: 'var(--text-muted)' }}>
            Loading summaries from 11 domains…
          </p>
        </div>
      )}

      {/* Topic grid */}
      {!loading && (
        <div
          className="max-w-7xl mx-auto px-6 sm:px-8 pb-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {ALL_TOPICS.map((topic, i) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              bag={bag}
              index={i}
            />
          ))}
        </div>
      )}
    </>
  );
}
