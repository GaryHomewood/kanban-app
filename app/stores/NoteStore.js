import alt from '../libs/alt'
import NoteActions from '../actions/NoteActions'
import uuid from 'node-uuid'

class NoteStore {
    constructor() {
        this.bindActions(NoteActions)
        this.notes = []
        this.exportPublicMethods({
            getLaneNotes: this.getLaneNotes.bind(this)
        })
    }

    getLaneNotes(ids) {
        return (ids || []).map(
            id => this.notes.filter(note => note.id === id)
        ).filter(a => a.length).map(a => a[0])
    }

    create(note) {
        const notes = this.notes
        note.id = uuid.v4()
        this.setState({
            notes: notes.concat(note)
        })
        return note
    }

    update(updatedNote) {
        const notes = this.notes.map(
            note => {
                if (note.id === updatedNote.id) {
                    // ES6 object property assigmnet
                    return Object.assign({}, note, updatedNote)
                }
                return note
            }
        )

        // ES6 property shorthand
        this.setState({notes})
    }

    delete(id) {
        this.setState({
            notes: this.notes.filter(note => note.id !== id)
        })
    }
}

export default alt.createStore(NoteStore, 'NoteStore')
