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
          { value: `${(summary.totalStudents / 10000000).toFixed(1)} Cr`, label: "Students — India solved the access problem", sectionId: 'enrollment' },
          { value: '1 in 5', label: 'Class 3 students who can read a Class 2 textbook — the learning crisis', sectionId: 'quality' },
          { value: `${summary.ptrNational}:1`, label: 'Students per teacher — a root cause', sectionId: 'teacher' },
          { value: `${summary.educationSpendGDP}% of GDP`, label: 'Spent on education — vs 6% target in NEP 2020', sectionId: 'spending' },
        ]}
      />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="India runs the largest school system on Earth. 248 million students. Primary enrollment above 100%. By any access metric, it's a success story."
        highlights={{
          'largest': 'var(--blue)',
          '248': 'var(--blue)',
          'success': 'var(--blue)',
        }}
      />

      <div className="composition-divider" />

      {enrollment && <EnrollmentSection data={enrollment} />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="Girls now nearly match boys in secondary enrollment — a quiet revolution. But the funnel narrows sharply after primary school. Getting in is not the same as staying in."
        highlights={{
          'revolution': 'var(--blue)',
          'narrows': 'var(--saffron)',
          'staying': 'var(--saffron)',
        }}
      />

      <div className="composition-divider" />

      {enrollment && <GenderSection data={enrollment} />}

      <div className="composition-divider" />

      {enrollment && <DropoutSection data={enrollment} />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="The students who stay are not necessarily learning. ASER tested children across India with one simple question: can a third-grader read a second-grade textbook? The answer collapsed the access triumph."
        highlights={{
          'necessarily': 'var(--saffron)',
          'collapsed': 'var(--saffron)',
          'triumph': 'var(--blue)',
        }}
      />

      <div className="composition-divider" />

      {quality && <QualitySection data={quality} />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="The teacher at the front of the classroom matters more than any policy document. The national average pupil-teacher ratio masks extremes: 8 students per teacher in Sikkim, 35 in Jharkhand."
        highlights={{
          'teacher': 'var(--blue)',
          'extremes': 'var(--saffron)',
          'jharkhand': 'var(--saffron)',
        }}
      />

      <div className="composition-divider" />

      {quality && <TeacherSection data={quality} />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="Teachers need support. Schools need infrastructure. Both need money. India spends 4% of GDP on education. The NEP 2020 target is 6%. That gap funds everything upstream: larger classes, fewer trained teachers, crumbling buildings."
        highlights={{
          'money': 'var(--saffron)',
          '4%': 'var(--saffron)',
          '6%': 'var(--blue)',
        }}
      />

      <div className="composition-divider" />

      {spending && <SpendingSection data={spending} />}

      <div className="composition-divider" />

      <DomainCTA domain="education" />
    </motion.div>
  );
}
