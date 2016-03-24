import React from 'react'
import Lane from '../components/Lane.jsx'

export default ({lanes}) => {
    return (
        <div className="lanes">
            {lanes.map(lane =>
                <Lane className="lane" key={lane.id} lane={lane} />
            )}
        </div>
    )
}
