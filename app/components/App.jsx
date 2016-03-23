import React from 'react'
import AltContainer from 'alt-container'
import Lanes from './Lanes.jsx'
import LaneActions from '../actions/LaneActions'
import LaneStore from '../stores/LaneStore'

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
                    stores={[LaneStore]}
                    inject={{
                        lanes: () => LaneStore.getState().lanes
                    }}>
                    <Lanes />
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
