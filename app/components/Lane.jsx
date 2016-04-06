import AltContainer from 'alt-container';
import React from 'react';
import Notes from './Notes.jsx';
import NoteActions from '../actions/NoteActions';
import LaneActions from '../actions/LaneActions'
import NoteStore from '../stores/NoteStore';
import Editable from './Editable.jsx'
import {DragSource, DropTarget} from 'react-dnd'
import ItemTypes from '../constants/itemTypes'

const spec = {
    hover(targetProps, monitor) {
        const sourceProps = monitor.getItem();
        const sourceId = sourceProps.id
        const targetId = targetProps.id

        if (monitor.getItemType() === ItemTypes.NOTE) {
            LaneActions.addToLane({
                laneId: targetProps.lane.id,
                noteId: sourceId
            })
        } else if (monitor.getItemType() === ItemTypes.LANE) {
            LaneActions.moveLane({
                    sourceId: sourceId,
                    targetId: targetProps.lane.id
            })
        }
    }
}

const laneSource = {
    beginDrag(props) {
        return {
            id: props.lane.id
        }
    },
    isDragging(props, monitor) {
        return props.id === monitor.getItem().id;
    }
}


const laneTarget = {
    hover(targetProps, monitor) {
        const sourceProps = monitor.getItem();
        const sourceId = sourceProps.id
        const targetId = targetProps.lane.id
        if (sourceId !== targetId) {
            // reordering lanes
            LaneActions.moveLane({
                    sourceId: sourceId,
                    targetId: targetId
            })
        }
    }
}

@DragSource(ItemTypes.LANE, laneSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
}))

@DropTarget(
        [ItemTypes.NOTE, ItemTypes.LANE],
        spec, (connect) => ({
    connectDropTarget: connect.dropTarget()
}))

export default class Lane extends React.Component {
    render() {
        const {
            connectDropTarget,
            connectDragSource,
            isDragging,
            lane, ...props} = this.props

        return connectDragSource(connectDropTarget(
            <div style={{
                    opacity: isDragging ? 0.4 : 1
                }} {...props}>
                <div className="lane-header">
                    <div className="dragHandle"></div>
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
        ))
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
