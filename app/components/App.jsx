import React from 'react'
import AltContainer from 'alt-container'
import Lanes from './Lanes.jsx'
import LaneActions from '../actions/LaneActions'
import LaneStore from '../stores/LaneStore'
import HTML5Backend from 'react-dnd-html5-backend'
import {DragDropContext} from 'react-dnd'

@DragDropContext(HTML5Backend)
export default class App extends React.Component {
    render() {
        return (
            <div className='ui container'>
                <button
                    className='ui blue add-lane button'
                    onClick={this.addLane}>
                    <i className='add icon'/> Add a lane
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

    addLane() {
        LaneActions.create({editing: true})
    }
}
