import './JournalEntry.css';

const JournalEntry = ({ entry }) => {
  const handleEntryClick = () => {
    // TODO: Implement entry click functionality (view/edit)
    console.log('Entry clicked:', entry.id);
  };

  return (
    <div className="journal-entry" onClick={handleEntryClick}>
      <div className="entry-date">{entry.date}</div>
      <h3 className="entry-title">{entry.title}</h3>
    </div>
  );
};

export default JournalEntry;
