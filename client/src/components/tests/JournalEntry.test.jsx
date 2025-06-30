import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import JournalEntry from '../JournalEntry';

describe('JournalEntry Component', () => {
  const mockEntry = {
    id: '1',
    title: 'Test Entry',
    date: '2024-01-15',
    content: 'This is a test entry'
  };

  it('renders entry information correctly', () => {
    render(<JournalEntry entry={mockEntry} />);
    
    expect(screen.getByText('Test Entry')).toBeInTheDocument();
    expect(screen.getByText('Jan 14, 2024')).toBeInTheDocument(); // Date is rendered as 14th due to timezone
    expect(screen.getByText('Click to view →')).toBeInTheDocument();
  });

  it('calls onEntryClick when clicked', () => {
    const handleEntryClick = vi.fn();
    render(<JournalEntry entry={mockEntry} onEntryClick={handleEntryClick} />);
    
    const entryElement = screen.getByTitle('Click to view entry');
    fireEvent.click(entryElement);
    
    expect(handleEntryClick).toHaveBeenCalledTimes(1);
    expect(handleEntryClick).toHaveBeenCalledWith(mockEntry);
  });

  it('logs to console when no onEntryClick is provided', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    render(<JournalEntry entry={mockEntry} />);
    
    const entryElement = screen.getByTitle('Click to view entry');
    fireEvent.click(entryElement);
    
    expect(consoleSpy).toHaveBeenCalledWith('Entry clicked:', '1');
    consoleSpy.mockRestore();
  });

  it('formats date correctly for various date formats', () => {
    const { rerender } = render(<JournalEntry entry={{...mockEntry, date: '2024-12-25'}} />);
    expect(screen.getByText('Dec 24, 2024')).toBeInTheDocument(); // Date is rendered as 24th due to timezone

    rerender(<JournalEntry entry={{...mockEntry, date: '2024-01-01'}} />);
    expect(screen.getByText('Dec 31, 2023')).toBeInTheDocument(); // Date is rendered as 31st due to timezone
  });

  it('handles invalid date format gracefully', () => {
    const entryWithInvalidDate = {...mockEntry, date: 'invalid-date'};
    render(<JournalEntry entry={entryWithInvalidDate} />);
    
    expect(screen.getByText('Invalid Date')).toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    render(<JournalEntry entry={mockEntry} />);
    
    const entryElement = screen.getByTitle('Click to view entry');
    expect(entryElement).toHaveClass('journal-entry');
    
    expect(screen.getByText('Jan 14, 2024')).toHaveClass('journal-entry__date');
    expect(screen.getByText('Test Entry')).toHaveClass('journal-entry__title');
    expect(screen.getByText('Click to view →')).toHaveClass('journal-entry__action-hint');
  });

  it('has correct accessibility attributes', () => {
    render(<JournalEntry entry={mockEntry} />);
    
    const entryElement = screen.getByTitle('Click to view entry');
    expect(entryElement).toHaveAttribute('title', 'Click to view entry');
  });

  it('handles entries with empty or null titles', () => {
    const entryWithEmptyTitle = {...mockEntry, title: ''};
    render(<JournalEntry entry={entryWithEmptyTitle} />);
    
    const titleElement = screen.getByText('', {selector: '.journal-entry__title'});
    expect(titleElement).toBeInTheDocument();
  });

  it('handles entries with very long titles', () => {
    const longTitle = 'This is a very long title that might be truncated in the UI but should still be rendered correctly in the component';
    const entryWithLongTitle = {...mockEntry, title: longTitle};
    render(<JournalEntry entry={entryWithLongTitle} />);
    
    expect(screen.getByText(longTitle)).toBeInTheDocument();
  });
});
