import { styled } from '@config/stitches'

export const Element = styled('div', {

})

export const HeaderRow = styled('div', {
    display: 'grid'
})

export const HeaderColumn = styled('div', {
    alignItems: 'center',
    backgroundColor: '$black300',
    color: '$black500',
    display: 'flex',
    fontSize: '$text300',
    fontWeight: 500,
    height: '$10',
    margin: 0,
    padding: '0 $4',
    position: 'relative',
    textTransform: 'capitalize',
    transition: 'all 0.15s ease-in-out',
    zIndex: 1,

    '&:first-child': {
        borderRadius: '$md 0 0 $md',
    },

    '&:last-child': {
        borderRadius: '0 $md $md 0',
    },

    '& + div': {
        paddingLeft: 0
    },

    variants: {
        align: {
            leading: {
                justifyContent: 'flex-start'
            },
            center: {
                justifyContent: 'center'
            },
            trailing: {
                justifyContent: 'flex-end'
            }
        }
    }
})

export const Row = styled('div', {
    display: 'grid',
})

export const Cell = styled('div', {
    alignItems: 'center',
    borderBottom: '1px solid $black300',
    display: 'flex',
    minHeight: '$10',
    margin: 0,
    leading: '$tight',
    padding: '$2 $4',
    position: 'relative',
    transition: 'all 0.15s ease-in-out',
    zIndex: 1,

    variants: {
        align: {
            leading: {
                justifyContent: 'flex-start'
            },
            center: {
                justifyContent: 'center'
            },
            trailing: {
                justifyContent: 'flex-end'
            }
        }
    },

    '& + div': {
        paddingLeft: 0
    }
})

export const DeleteButton = styled('button', {
    appearance: 'none',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    transition: 'all .1s ease',

    '&:hover': {
        opacity: .5,
    }
})

export const RankColumnHandle = styled('span', {
    cursor: 'grab',
    variants: {
        dragging: {
            true: {
                cursor: 'grabbing'
            }
        }
    }
})