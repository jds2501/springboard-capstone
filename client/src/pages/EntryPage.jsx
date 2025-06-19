import { useParams } from 'react-router-dom';

function EntryPage() {
  const { id } = useParams();
  
  return (
    <div>
      <h1>{id ? `Edit Entry ${id}` : 'Add New Entry'}</h1>
      <p>Entry Page - Add/Edit functionality coming soon</p>
      {id && <p>Editing entry with ID: {id}</p>}
    </div>
  );
}

export default EntryPage;
