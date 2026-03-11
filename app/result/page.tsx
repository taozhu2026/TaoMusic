import { ResultExperience } from '@/src/features/recommendations/components/result-experience';

interface ResultPageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function ResultPage({ searchParams }: ResultPageProps) {
  const params = await searchParams;

  return (
    <main className="pageShell">
      <ResultExperience initialResultId={params.id ?? null} />
    </main>
  );
}
