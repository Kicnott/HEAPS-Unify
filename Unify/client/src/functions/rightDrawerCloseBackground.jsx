
export const RightDrawerCloseBackground = ({isRightDrawerOpen, toggleRightDrawer}) => {
    return <div>
            {isRightDrawerOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.4)',
                        zIndex: 1000
                    }}
                    onClick={() => toggleRightDrawer(!isRightDrawerOpen)} // Lets you click background to close right drawer
                /> // When isRightDrawer is true, this creates an overlay over the rest of the screen
            )}
            </div>
}