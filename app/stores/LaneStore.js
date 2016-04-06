import uuid from 'node-uuid'
import alt from '../libs/alt'
import LaneActions from '../actions/LaneActions'
import update from 'react-addons-update'


class LaneStore {
    constructor() {
        this.bindActions(LaneActions)
        this.lanes = []
    }

    create(lane) {
        const lanes = this.lanes
        lane.id = uuid.v4()
        lane.notes = lane.notes || []
        this.setState({
            lanes: lanes.concat(lane)
        })
    }

    update(updatedLane) {
        const lanes = this.lanes.map(
            lane => {
                if (lane.id === updatedLane.id) {
                    return Object.assign({}, lane, updatedLane)
                }
                return lane
            }
        )
        this.setState({lanes})
    }

    delete(id) {
        this.setState({
            lanes: this.lanes.filter(lane => lane.id !== id)
        })
    }

    addToLane({laneId, noteId}) {
        const lanes = this.lanes.map(lane => {
            if (lane.notes.includes(noteId)) {
                lane.notes = lane.notes.filter(note => note !== noteId)
            }

            if (lane.id === laneId) {
                if (!lane.notes.includes(noteId)) {
                    lane.notes.push(noteId);
                }
            }
            return lane;
        })
        this.setState({lanes})
    }

    removeFromLane({laneId, noteId}) {
        const lanes = this.lanes.map(lane => {
            if (lane.id === laneId) {
                lane.notes = lane.notes.filter(note => note !== noteId)
            }
            return lane
        })
        this.setState({lanes})
    }

    moveNote({sourceId, targetId}) {
        const lanes = this.lanes
        const sourceLane = lanes.filter(lane => lane.notes.includes(sourceId))[0]
        const targetLane = lanes.filter(lane => lane.notes.includes(targetId))[0]
        const sourceNoteIndex = sourceLane.notes.indexOf(sourceId)
        const targetNoteIndex = targetLane.notes.indexOf(targetId)
        if(sourceLane === targetLane) {
            sourceLane.notes = update(sourceLane.notes, {
                $splice: [
                    [sourceNoteIndex, 1],
                    [targetNoteIndex, 0, sourceId]
                    ]
                })
        } else {
            sourceLane.notes.splice(sourceNoteIndex, 1)
            targetLane.notes.splice(targetNoteIndex, 0, sourceId)
        }
        this.setState({lanes})
    }

    moveLane({sourceId, targetId}) {
        const lanes = this.lanes
        var laneIds = []
        this.lanes.map (lane => {
            laneIds.push(lane.id)
        })

        const fromLaneIndex = laneIds.indexOf(sourceId)
        const toLaneIndex = laneIds.indexOf(targetId)

        if (toLaneIndex !== fromLaneIndex) {
            const draggedLane = lanes[fromLaneIndex]
            lanes.splice(fromLaneIndex, 1)
            lanes.splice(toLaneIndex, 0, draggedLane)
        }
        this.setState({lanes})
    }
}

export default alt.createStore(LaneStore, 'LaneStore')
