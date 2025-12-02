/**
 * Displays the detected note name and octave.
 */

import type { Note } from '../../domain/types';
import { formatNote } from '../../domain/note-converter';

interface NoteDisplayProps {
    note: Note | null;
}

export function NoteDisplay({ note }: NoteDisplayProps) {
    return (
        <div className="text-center">
            <div className="note-display">
                {note ? formatNote(note) : '--'}
            </div>
        </div>
    );
}
