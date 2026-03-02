import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';
import { DomainBadges } from './DomainBadges.tsx';
import { DeepLinks } from './DeepLinks.tsx';
import { TopicChartRenderer } from './TopicChartRenderer.tsx';
import type { TopicSectionDef, TopicDataBag } from '../../lib/topicConfig.ts';

interface TopicSectionProps {
  section: TopicSectionDef;
  bag: TopicDataBag;
  topicId: string;
  accent: string;
}

export function TopicSection({ section, bag, topicId, accent }: TopicSectionProps) {
  const [ref, isVisible] = useScrollTrigger<HTMLElement>({ threshold: 0.15 });

  return (
    <section ref={ref} id={section.id} className="py-16 md:py-24 max-w-4xl mx-auto px-6 sm:px-8">
      <SectionNumber number={section.sectionNumber} isVisible={isVisible} />

      <h2
        className="text-2xl sm:text-3xl font-bold mt-4 mb-3"
        style={{ color: 'var(--text-primary)' }}
      >
        {section.title}
      </h2>

      <DomainBadges domains={section.domains} />

      <p
        className="text-sm sm:text-base mt-4 mb-8 leading-relaxed"
        style={{ color: 'var(--text-secondary)' }}
      >
        {section.annotation}
      </p>

      {/* Charts */}
      <ChartActionsWrapper
        registryKey={`topics/${topicId}-${section.id}`}
        data={bag}
      >
        <div className="space-y-8">
          {section.charts.map((chart, i) => (
            <div key={`${topicId}-${section.id}-${i}`}>
              <TopicChartRenderer chart={chart} bag={bag} />
            </div>
          ))}
        </div>
      </ChartActionsWrapper>

      {/* Sources */}
      {section.sources.length > 0 && (
        <p className="source-attribution">
          Source: {section.sources.join(' · ')}
        </p>
      )}

      {/* Deep links */}
      <DeepLinks links={section.deepLinks} />
    </section>
  );
}
