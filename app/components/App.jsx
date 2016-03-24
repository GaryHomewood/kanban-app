import React from 'react'
import AltContainer from 'alt-container'
import Lanes from './Lanes.jsx'
import LaneActions from '../actions/LaneActions'
import LaneStore from '../stores/LaneStore'

export default class App extends React.Component {

    render() {
        return (
            <div className='ui container'>
                <button
                    className='ui blue button'
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
        LaneActions.create({name: 'Lane'})
    }
}
