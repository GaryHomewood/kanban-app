import React from 'react'
import Lane from '../components/Lane.jsx'
import LaneActions from '../actions/LaneActions'

export default ({lanes}) => {
    return (
        <div className="lanes">
            {lanes.map(lane =>
                <Lane
                    className="lane"
                    key={lane.id}
                    lane={lane}
                    editing={lane.editing}
                    onMove={LaneActions.moveLane}
                    />
            )}
        </div>
    )
}
