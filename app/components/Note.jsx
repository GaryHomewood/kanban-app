import React from 'react'

export default class Note extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            editing: false
        }
    }

    render() {
        if (this.state.editing) {
            return this.renderEdit()
        }
        return this.renderDisplay();
    }

    renderEdit = () => {
        return (
            <div className='ui input'>
                <input type="text"
                    ref={
                        (e) => e ? e.selectionStart = this.props.task.length : null
                    }
                    autoFocus={true}
                    defaultValue={this.props.task}
                    onBlur={this.finishEdit}
                    onKeyPress={this.checkEnter} />
            </div>
        )

    }

    renderDisplay = () => {
        const onDelete = this.props.onDelete;

        return (
            <div className='note'>
                <span onClick={this.edit}>{this.props.task}</span>
                {onDelete ? this.renderDelete() : null}
            </div>
        )
    }

    renderDelete = () => {
        return (
            <button
                className='ui mini button'
                onClick={this.props.onDelete}>
                <i className='delete icon'/>
            </button>
        )
    }

    edit = () => {
        this.setState({
          editing: true
        })
    }

    checkEnter = (e) => {
        if(e.key === 'Enter') {
            this.finishEdit(e)
        }
    }

    finishEdit = (e) => {
        const value = e.target.value;
        if (this.props.onEdit) {
            this.props.onEdit(value);
            this.setState({
                editing: false
            })
        }
    }
}
