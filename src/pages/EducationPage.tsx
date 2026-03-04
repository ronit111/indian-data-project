import { motion } from 'framer-motion';
import { SEOHead } from '../components/seo/SEOHead.tsx';
import { SkeletonChart } from '../components/ui/Skeleton.tsx';
import { KeyTakeaways } from '../components/ui/KeyTakeaways.tsx';
import { NarrativeBridge } from '../components/ui/NarrativeBridge.tsx';
import { useEducationStore } from '../store/educationStore.ts';
import { useEducationData } from '../hooks/useEducationData.ts';
import { EducationHeroSection } from '../components/education/EducationHeroSection.tsx';
import { EnrollmentSection } from '../components/education/EnrollmentSection.tsx';
import { GenderSection } from '../components/education/GenderSection.tsx';
import { DropoutSection } from '../components/education/DropoutSection.tsx';
import { QualitySection } from '../components/education/QualitySection.tsx';
import { TeacherSection } from '../components/education/TeacherSection.tsx';
import { SpendingSection } from '../components/education/SpendingSection.tsx';
import { DomainCTA } from '../components/ui/DomainCTA.tsx';

export default function EducationPage() {
  const year = useEducationStore((s) => s.selectedYear);
  const { summary, enrollment, quality, spending, loading, error } = useEducationData(year);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-24 space-y-12">
        <SkeletonChart height={400} />
        <SkeletonChart height={300} />
        <SkeletonChart height={300} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-24 text-center">
        <p style={{ color: 'var(--text-secondary)' }}>Failed to load education data.</p>
        <button
          className="mt-4 px-4 py-2 rounded-lg text-sm"
          style={{ background: 'var(--bg-raised)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }}
          onClick={() => window.location.reload()}
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <SEOHead
        title="Education — 248 Million Students | Indian Data Project"
        description="Enrollment, learning outcomes, teacher availability, school infrastructure, and education spending across India's states — visualized from UDISE+, ASER, and World Bank data."
        path="/education"
        image="/og-education.png"
      />

      <EducationHeroSection summary={summary} />

      {summary && <KeyTakeaways
        accent="#3B82F6"
        pills={[
          { value: `${(summary.totalStudents / 10000000).toFixed(1)} Cr`, label: "Students — more than Brazil's population", sectionId: 'enrollment' },
          { value: `${summary.ptrNational}:1`, label: 'Students per teacher, in every classroom', sectionId: 'teacher' },
          { value: `${summary.gerSecondary?.toFixed(0) ?? '—'}%`, label: 'Secondary enrollment — 1 in 5 teens not in school', sectionId: 'dropout' },
          { value: `${summary.educationSpendGDP}% of GDP`, label: 'What India spends on education', sectionId: 'spending' },
        ]}
      />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="But enrollment is not learning. Getting children into classrooms was the easy part. What happens inside them tells a different story."
        highlights={{
          'enrollment': 'var(--blue)',
          'learning': 'var(--blue)',
          'classrooms': 'var(--blue)',
          'story': 'var(--blue)',
        }}
      />

      <div className="composition-divider" />

      {enrollment && <EnrollmentSection data={enrollment} />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="Girls now match boys in enrollment. But the funnel narrows sharply after primary school."
        highlights={{
          'girls': 'var(--blue)',
          'boys': 'var(--blue)',
          'narrows': 'var(--saffron)',
          'primary': 'var(--blue)',
        }}
      />

      <div className="composition-divider" />

      {enrollment && <GenderSection data={enrollment} />}

      <div className="composition-divider" />

      {enrollment && <DropoutSection data={enrollment} />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="The teacher at the front of the classroom matters more than any policy document."
        highlights={{
          'teacher': 'var(--blue)',
          'classroom': 'var(--blue)',
          'policy': 'var(--blue)',
        }}
      />

      <div className="composition-divider" />

      {quality && <QualitySection data={quality} />}

      <div className="composition-divider" />

      {quality && <TeacherSection data={quality} />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="India spends less on education than most major economies. The question: is it enough?"
        highlights={{
          'spends': 'var(--blue)',
          'education': 'var(--blue)',
          'enough': 'var(--saffron)',
        }}
      />

      <div className="composition-divider" />

      {spending && <SpendingSection data={spending} />}

      <div className="composition-divider" />

      <DomainCTA domain="education" />
    </motion.div>
  );
}
