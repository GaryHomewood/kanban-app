import alt from '../libs/alt'
import NoteActions from '../actions/NoteActions'
import uuid from 'node-uuid'

class NoteStore {
    constructor() {
        this.bindActions(NoteActions)
        this.notes = []
    }

    create(note) {
        const notes = this.notes
        note.id = uuid.v4()
        this.setState({
            notes: notes.concat(note)
        })
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
