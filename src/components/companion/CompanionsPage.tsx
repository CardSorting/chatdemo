import { useParams } from 'react-router-dom';
import { Companion } from '../../lib/companions';

export default function CompanionsPage() {
  const { companionId } = useParams<{ companionId: string }>();
  // Fetch companion data using companionId
  // const companion = useCompanion(companionId);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Companion Details</h1>
      {/* Display companion details */}
    </div>
  );
}