import './JournalEntry.css';

const JournalEntry = ({ entry }) => {
  const handleEntryClick = () => {
    // TODO: Implement entry click functionality (view/edit)
    console.log('Entry clicked:', entry.id);
  };

  // Format the date for display
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString; // Return original if formatting fails
    }
  };

  return (
    <div className="journal-entry" onClick={handleEntryClick}>
      <div className="journal-entry__date">{formatDate(entry.date)}</div>
      <h3 className="journal-entry__title">{entry.title}</h3>
    </div>
  );
};

export default JournalEntry;
