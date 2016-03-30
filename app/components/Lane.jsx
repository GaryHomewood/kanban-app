import AltContainer from 'alt-container';
import React from 'react';
import Notes from './Notes.jsx';
import NoteActions from '../actions/NoteActions';
import LaneActions from '../actions/LaneActions'
import NoteStore from '../stores/NoteStore';
import Editable from './Editable.jsx'

export default class Lane extends React.Component {
    render() {
        const {lane, ...props} = this.props;

        return (
            <div {...props}>
                <div className="lane-header clearfix">
                    <div className="lane-name" onClick={this.activateLaneEdit}>
                        <Editable
                            editing={lane.editing}
                            value={lane.name}
                            onEdit={this.editLane}/>
                    </div>
                    <button
                        className="ui mini delete button"
                        onClick={this.deleteLane}>
                        <i className="delete icon"/>
                    </button>
                </div>
                <div className="lane-items clearfix">
                    <AltContainer
                        stores={[NoteStore]}
                        inject={{
                            notes: () => NoteStore.getLaneNotes(lane.notes)
                        }}>
                        <Notes
                            onValueClick={this.activateNoteEdit}
                            onEdit={this.editNote}
                            onDelete={this.deleteNote} />
                    </AltContainer>
                    <button
                        className="ui tiny button"
                        onClick={this.addNote}>+ Add a task</button>
                </div>
            </div>
        )
    }

    // -------------------------------------------------------------------------
    // notes

    activateNoteEdit(id) {
        NoteActions.update({id, editing: true})
    }

    addNote = (e) => {
        console.log('add note');
        const laneId = this.props.lane.id
        const note = NoteActions.create({editing: true});
        LaneActions.addToLane({
            laneId,
            noteId: note.id
        })
    }

    editNote(id, task) {
        if (!task.trim()) {
            NoteActions.update({id, editing: false});
            return;
        }
        NoteActions.update({id, task, editing: false});
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

    // -------------------------------------------------------------------------
    // lane

    activateLaneEdit = (name) => {
        const laneId = this.props.lane.id
        LaneActions.update({id: laneId, editing: true});
    }

    editLane = (name) => {
        const laneId = this.props.lane.id
        if (!name.trim()) {
            LaneActions.update({id: laneId, editing: false});
            return
        }
        LaneActions.update({id: laneId, name, editing: false})
    }

    deleteLane = () => {
        const laneId = this.props.lane.id
        LaneActions.delete(laneId)
    }
}
