import AltContainer from 'alt-container';
import React from 'react';
import Notes from './Notes.jsx';
import NoteActions from '../actions/NoteActions';
import LaneActions from '../actions/LaneActions'
import NoteStore from '../stores/NoteStore';

export default class Lane extends React.Component {
    render() {
        const {lane, ...props} = this.props;

        console.log(this.props.lane.id);

        return (
            <div {...props}>
                <div className="lane-header">
                    <div className="lane-add-note">
                        <button
                            className="ui small button"
                            onClick={this.addNote}>+ Add a task</button>
                    </div>
                    <h2 className="lane-name">{lane.name}</h2>
                </div>
                <AltContainer
                    stores={[NoteStore]}
                    inject={{
                        notes: () => NoteStore.getLaneNotes(lane.notes)
                    }}
                    >
                    <Notes onEdit={this.editNote} onDelete={this.deleteNote} />
                </AltContainer>
            </div>
        )
    }

    editNote(id, task) {
        // Don't modify if trying set an empty value
        if(!task.trim()) {
          return;
        }
        NoteActions.update({id, task});
    }

    addNote = (e) => {
        console.log('add note');
        const laneId = this.props.lane.id
        const note = NoteActions.create({task: 'New task'});
        LaneActions.addToLane({
            laneId,
            noteId: note.id
        })
    }

    deleteNote = (noteId, e) => {
        e.stopPropagation();
        const laneId = this.props.lane.id
        LaneActions.removeFromLane({
            laneId,
            noteId
        })
        NoteActions.delete(noteId);
    }
}
