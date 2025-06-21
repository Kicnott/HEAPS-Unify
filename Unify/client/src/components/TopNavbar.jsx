import "../styles/TopNavbar.css";

export const TopNavbar = ({isRightDrawerOpen, toggleRightDrawer}) => {
    return (
        <div className="topnavbar">
                <h1>Unify</h1> {/* Unify logo / title for Top Nav Bar */}
                <div id='button'>
                    <button onClick={() => toggleRightDrawer(!isRightDrawerOpen)}>Stuff</button> {/* Creates the 'stuff' butto to open the right drawer by toggling the isRightDrawerOpen state */}
                </div>
        </div>
    );
};
