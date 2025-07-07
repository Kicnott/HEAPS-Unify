import profilePlaceholder from '../../assets/placeholder_pfp.jpg';
import "../../styles/TopNavbar.css";

export const TopNavbar = ({ isRightDrawerOpen, toggleRightDrawer }) => {
    return (
        <div className="topnavbar">
            <h1>Unify</h1> {/* Unify logo / title for Top Nav Bar */}
            <div id='button'>
                <button onClick={() => toggleRightDrawer(!isRightDrawerOpen)}>
                    <img
                        src={profilePlaceholder}
                        alt="Profile"
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            cursor: 'pointer'
                        }}
                    />
                </button>
            </div>
        </div>
    );
};
