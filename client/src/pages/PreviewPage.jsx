import { useParams } from 'react-router-dom';

function PreviewPage() {
  const { id } = useParams();
  
  return (
    <div>
      <h1>Preview Entry {id}</h1>
      <p>Preview Page - Read-only entry view coming soon</p>
      <p>Previewing entry with ID: {id}</p>
    </div>
  );
}

export default PreviewPage;
