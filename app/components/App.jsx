import React from 'react'
import Notes from './Notes.jsx'
import AltContainer from 'alt-container'
import NoteActions from '../actions/NoteActions'
import NoteStore from '../stores/NoteStore'

export default class App extends React.Component {

    render() {
        return (
            <div className='ui text container'>
                <button
                    className='ui blue button'
                    onClick={this.addNote}>
                    <i className='add icon'/> Add
                </button>
                <AltContainer
                    stores={[NoteStore]}
                    inject={{
                        notes: () => NoteStore.getState().notes
                    }}>
                    <Notes
                        onEdit={this.editNote}
                        onDelete={this.deleteNote} />
                </AltContainer>
            </div>
        )
    }

    addNote = () => {
        NoteActions.create({task: 'new task'})
    }

    editNote = (id, task) => {
        if (!task.trim()) {
            return
        }
        NoteActions.update({id, task})
    }

    deleteNote = (id) => {
        NoteActions.delete(id)
    }
}
