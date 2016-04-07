import React from 'react'
import {DragSource, DropTarget} from 'react-dnd'
import ItemTypes from '../constants/itemTypes'

const sourceSpec = {
    beginDrag(props) {
        return {
            id: props.id
        }
    },
    isDragging(props, monitor) {
        return props.id === monitor.getItem().id;
    }
}

const targetSpec = {
    hover(targetProps, monitor) {
        const sourceProps = monitor.getItem();
        const sourceId = sourceProps.id
        const targetId = targetProps.id
        if (sourceId !== targetId) {
            targetProps.onMove({sourceId, targetId})
        }
    }
}

@DragSource(ItemTypes.NOTE, sourceSpec, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
}))

@DropTarget(ItemTypes.NOTE, targetSpec, (connect) => ({
    connectDropTarget: connect.dropTarget()
}))

export default class Note extends React.Component {
    render() {
        const {
            connectDragSource,
            connectDropTarget,
            isDragging,
            id,
            editing,
            onMove, ...props} = this.props;

        const dragSource = editing ? a => a : connectDragSource

        return dragSource(connectDropTarget(
            <li style={{
                    opacity: isDragging ? 0.4 : 1
                  }} {...props}>{props.children}</li>
          ))
    }
}
