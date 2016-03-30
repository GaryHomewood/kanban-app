import React from 'react'

export default class Editable extends React.Component {

    render() {
        const {value, onEdit, onValueClick, editing, ...props} = this.props;

        return (
            <div {...props}>
                {editing ? this.renderEdit() : this.renderValue()}
            </div>
        )
    }

    renderEdit = () => {
        return (
            <div className='ui input'>
                <input type="text"
                    ref={
                        (e) => {
                            return (
                                (e && this.props.value) ? e.selectionStart = this.props.value.length : null
                            )
                        }
                    }
                    autoFocus={true}
                    defaultValue={this.props.value}
                    onBlur={this.finishEdit}
                    onKeyPress={this.keyPress} />
            </div>
        )
    }

    renderValue = () => {
        const onDelete = this.props.onDelete;

        return (
            <div onClick={this.props.onValueClick}>
                <span className="value">{this.props.value}</span>
                {onDelete ? this.renderDelete() : null }
            </div>
        )
    }

    renderDelete = () => {
        return (
            <button
                className='ui mini delete button'
                onClick={this.props.onDelete}>
                <i className='delete icon'/>
            </button>
        )
    }

    keyPress = (e) => {
        if (e.key === 'Enter') {
            this.finishEdit(e)
        }
    }

    finishEdit = (e) => {
        const value = e.target.value;

        if (this.props.onEdit) {
            this.props.onEdit(value)
        }
    }
}
