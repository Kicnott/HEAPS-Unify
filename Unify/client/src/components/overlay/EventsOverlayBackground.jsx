
export const EventsOverlayBackground = ({ isHidden, onClick }) => {
    return (
        <div
            style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                zIndex: 999,
                display: isHidden ? 'none' : 'block'
            }}
            onClick={onClick}
        />
    )
}
