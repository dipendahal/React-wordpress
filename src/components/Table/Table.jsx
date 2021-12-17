import React, {useState} from 'react'
import update from 'immutability-helper'
import _get from 'lodash/get'
import {getTrack} from '@utils/transformations/table.transformation.js'
import {DndProvider, useDrag, useDrop} from 'react-dnd'
import {HTML5Backend} from 'react-dnd-html5-backend'


// Contexts
import {
    TableConstants,
    TableContext
} from '@utils/contexts/table.context.js'

// Styles
import {
    Element,
    HeaderColumn,
    HeaderRow,
    Row,
    Cell,
    DeleteButton,
    RankColumnHandle
} from './Table.styles.js'

const DragHandleColumn = ({
	id,
	handleDragging,
	moveItem,
	findItem,
}) => {
	const originalIndex = findItem(id).index

	const [{ isDragging }, drag] = useDrag({
        type: TableConstants.REORDER_COLUMN_ID, 
	    item: { 
	    	id, 
	    	originalIndex 
	    },
	    collect: (monitor) => ({
	      	isDragging: monitor.isDragging(),
	    }),
	    end: (dropResult, monitor) => {
	      	const { 
	      		id: droppedId, 
	      		originalIndex 
	      	} = monitor.getItem()
	      
	      	const didDrop = monitor.didDrop()
	      
	      	if(!didDrop) {
	        	moveItem(droppedId, originalIndex)
	      	} else {
				handleDragging(false)
			}
	    },
	})

	const [, drop] = useDrop({
	    accept: TableConstants.REORDER_COLUMN_ID,
	    hover({ id: draggedId }) {
            if (draggedId !== id) {
	        	const { index: overIndex } = findItem(id)
	        
	        	moveItem(draggedId, overIndex)
	      	}
	    },
	})

	return(
		<RankColumnHandle
        onMouseDown={() => {
            handleDragging(true)
        }}
        onMouseUp={() => {
            handleDragging(false)
        }}
        dragging={isDragging}
        ref={(node) => drag(drop(node))}>
			<svg 
            width="8" 
            height="13" 
            viewBox="0 0 8 13">
                <path 
                fillRule="evenodd" 
                clipRule="evenodd" 
                d="M1.5 3C2.32843 3 3 2.32843 3 1.5C3 0.671573 2.32843 0 1.5 0C0.671573 0 0 0.671573 0 1.5C0 2.32843 0.671573 3 1.5 3ZM1.5 8C2.32843 8 3 7.32843 3 6.5C3 5.67157 2.32843 5 1.5 5C0.671573 5 0 5.67157 0 6.5C0 7.32843 0.671573 8 1.5 8ZM3 11.5C3 12.3284 2.32843 13 1.5 13C0.671573 13 0 12.3284 0 11.5C0 10.6716 0.671573 10 1.5 10C2.32843 10 3 10.6716 3 11.5ZM6.5 8C7.32843 8 8 7.32843 8 6.5C8 5.67157 7.32843 5 6.5 5C5.67157 5 5 5.67157 5 6.5C5 7.32843 5.67157 8 6.5 8ZM8 1.5C8 2.32843 7.32843 3 6.5 3C5.67157 3 5 2.32843 5 1.5C5 0.671573 5.67157 0 6.5 0C7.32843 0 8 0.671573 8 1.5ZM6.5 13C7.32843 13 8 12.3284 8 11.5C8 10.6716 7.32843 10 6.5 10C5.67157 10 5 10.6716 5 11.5C5 12.3284 5.67157 13 6.5 13Z" 
                fill="#6F7F86" />
            </svg>
		</RankColumnHandle>
	);
}

export const TableHeader = () => (
    <TableContext.Consumer>
        {
            ({
                columns, 
                track
            }) => (
                <HeaderRow
                css={{
                    gridTemplateColumns: track
                }}>
                    {
                        columns.map(column => 
                            <HeaderColumn 
                            key={column.id}
                            onClick={() => {
                                'onClick' in column && column.onClick()
                            }}
                            align={_get(column, 'align', 'leading')}>
                                {column.name}
                            </HeaderColumn>
                        )
                    }
                </HeaderRow>
            )
        }
    </TableContext.Consumer>
)

export const TableRowWithDrop = ({
    children,
    css,
    dragging,
    id,
    findItem,
    moveItem,
}) => {
    const [, drop] = useDrop({ 
        accept: TableConstants.REORDER_COLUMN_ID,
        hover({ id: draggedId }) {
            if (draggedId !== id) {
	        	const { index: overIndex } = findItem(id)
	        
	        	moveItem(draggedId, overIndex)
	      	}
	    },
    })

    return(
        <Row
        css={css}
        dragging={dragging}
        ref={drop}>
            {children}
        </Row>
    )
}

export const TableRow = ({ 
    children,
    id,
}) => {
    

    return(
        <TableContext.Consumer>
            {
                ({
                    dragging,
                    findItem,
                    moveItem,
                    track,
                }) => (
                    <TableRowWithDrop
                    id={id}
                    findItem={findItem}
                    moveItem={moveItem}
                    dragging={id === dragging}
                    css={{
                        gridTemplateColumns: track
                    }}>
                        {children}
                    </TableRowWithDrop>
                )
            }
        </TableContext.Consumer>
    )
}

const TableCell = ({ 
    children 
}) => (
    <Cell>
        {children}
    </Cell>
)

export const RenderTable = React.forwardRef(
    ({
        children, 
        css = {},
    }, ref) => (
    <TableContext.Consumer>
        {
            ({
                source,
            }) => (
                <Element
                ref={ref}
                css={css}>
                    {children(source)}
                </Element>
            )
        }
    </TableContext.Consumer>
))

const TableProvider = ({
    children,
	css = {},
	columns = [],
    onDelete = undefined,
    onOrder = undefined,
    source = [],
    track = null,
}) => {
    const [isDragging, setIsDragging] = useState(false)

    const moveItem = (id, atIndex) => {
		const { 
            row, 
            index 
        } = findItem(id)
		
	    onOrder(
	      	update(source, {
	        	$splice: [
	          		[index, 1],
	          		[atIndex, 0, row],
	        	],
	      	}).map(item => item.id),
	    )
	}

    const findItem = (id) => {
	    const row = source.filter(i => i.id === id)[0]
        
	    return {
	      	row,
	      	index: source.indexOf(row),
	    }
	}

    let mapped_columns = columns
    let mapped_track = track

    if(onDelete !== undefined) {
        mapped_columns = mapped_columns.concat([{
            id: TableConstants.DELETE_COLUMN_ID
        }])
        
        if(mapped_track !== null) {
            mapped_track = mapped_track.concat(['20px'])
        }
    }
    
    if(onOrder !== undefined) {
        mapped_columns = [{
            id:  TableConstants.REORDER_COLUMN_ID,
        }].concat(mapped_columns)

        if(mapped_track !== null) {
            mapped_track = ['50px'].concat(mapped_track)
        }
    }

	return(
        <TableContext.Provider
        value={{
            columns: mapped_columns,
            source: source.map(item => {
                return {
                    id: item.id,
                    values: mapped_columns.map(c => {
                        if(c.id === TableConstants.DELETE_COLUMN_ID) {
                            return(
                                <DeleteButton
                                onClick={() => onDelete(item.id)}>
                                    <svg 
                                    width="10" 
                                    height="10"
                                    viewBox="0 0 10 10">
                                        <path 
                                        fillRule="evenodd" 
                                        clipRule="evenodd" 
                                        d="M0.46967 0.46967C0.762563 0.176777 1.23744 0.176777 1.53033 0.46967L5 3.93934L8.46967 0.46967C8.76256 0.176777 9.23744 0.176777 9.53033 0.46967C9.82322 0.762563 9.82322 1.23744 9.53033 1.53033L6.06066 5L9.53033 8.46967C9.82322 8.76256 9.82322 9.23744 9.53033 9.53033C9.23744 9.82322 8.76256 9.82322 8.46967 9.53033L5 6.06066L1.53033 9.53033C1.23744 9.82322 0.762563 9.82322 0.46967 9.53033C0.176777 9.23744 0.176777 8.76256 0.46967 8.46967L3.93934 5L0.46967 1.53033C0.176777 1.23744 0.176777 0.762563 0.46967 0.46967Z" 
                                        fill="#EB5757" />
                                    </svg>
                                </DeleteButton>
                            )
                        }

                        if(c.id === TableConstants.REORDER_COLUMN_ID) {
                            return(
                                <DragHandleColumn 
                                id={item.id}
                                moveItem={moveItem}
                                findItem={findItem}
                                handleDragging={dragging => {
                                    setIsDragging(dragging ? item.id : false)
                                }} />
                            )
                        }

                        return _get(item, c.id, '')
                    })
                }
            }),
            findItem,
            moveItem,
            track: getTrack(mapped_track, mapped_columns),
            dragging: isDragging,
        }}>
            <DndProvider 
            backend={HTML5Backend}>
                <RenderTable
                css={css}>
                    {children}
                </RenderTable>
            </DndProvider>
        </TableContext.Provider>
	)
}

const TableWrapper = (props) => (
    <DndProvider 
    backend={HTML5Backend}>
        <TableProvider 
        {...props} />
    </DndProvider>
)

const Table = {
    Wrapper: TableWrapper,
    Row: TableRow,
    Header: TableHeader,
    Cell: TableCell
}

export default Table