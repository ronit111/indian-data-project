import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { TopicDef, TopicDataBag } from '../../lib/topicConfig.ts';
import { DomainBadges } from './DomainBadges.tsx';

interface TopicCardProps {
  topic: TopicDef;
  bag: TopicDataBag;
  index: number;
  isVisible?: boolean;
}

function resolveValue(v: string | ((bag: TopicDataBag) => string), bag: TopicDataBag): string {
  return typeof v === 'function' ? v(bag) : v;
}

export function TopicCard({ topic, bag, index, isVisible = true }: TopicCardProps) {
  const heroValue = resolveValue(topic.heroStat.value, bag);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.5,
        delay: index * 0.06,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="h-full"
    >
      <Link
        to={`/topics/${topic.id}`}
        className="group block h-full rounded-xl p-5 no-underline transition-all duration-200 hover:brightness-110"
        style={{
          background: 'var(--bg-raised)',
          border: `1px solid ${topic.accent}15`,
        }}
      >
        {/* Hero stat */}
        <span
          className="block font-mono text-2xl sm:text-3xl font-black mb-1"
          style={{ color: topic.accent }}
        >
          {heroValue}
        </span>
        <span className="block text-[10px] mb-3" style={{ color: 'var(--text-muted)' }}>
          {topic.heroStat.label}
        </span>

        {/* Title */}
        <span
          className="block text-base font-bold mb-1 group-hover:underline"
          style={{ color: 'var(--text-primary)' }}
        >
          {topic.title}
        </span>
        <span
          className="block text-xs leading-relaxed mb-3"
          style={{ color: 'var(--text-secondary)' }}
        >
          {topic.subtitle}
        </span>

        {/* Domain badges */}
        <DomainBadges domains={topic.contributingDomains} />
      </Link>
    </motion.div>
  );
}
