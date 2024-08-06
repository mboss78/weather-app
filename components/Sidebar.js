import { useState } from 'react'; // Importing useState hook from React for state management
import { useRouter } from 'next/router'; // Importing useRouter from Next.js for routing
import { useTranslation } from 'react-i18next'; // Importing useTranslation from react-i18next for translations

const Sidebar = () => {
  // State to manage the sidebar's open/closed state
  const [isOpen, setIsOpen] = useState(true);
  
  // Router instance for navigation
  const router = useRouter();
  
  // Translation function
  const { t } = useTranslation();

  // Function to toggle the sidebar's open/closed state
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Function to navigate to a different path
  const navigateTo = (path) => {
    router.push(path);
  };

  // Styles for the sidebar
  const sidebarStyle = {
    width: isOpen ? '60px' : '0', // Width changes based on isOpen state
    backgroundColor: '#202020', // Dark background color
    color: 'white', // White text color
    padding: isOpen ? '20px' : '0', // Padding changes based on isOpen state
    height: '100vh', // Full viewport height
    position: 'fixed', // Fixed position
    top: 0, // Align to top
    left: 0, // Align to left
    overflowY: 'auto', // Enable vertical scrolling
    transition: 'width 0.3s ease, padding 0.3s ease', // Smooth transition for width and padding
  };

  // Styles for the toggle button
  const toggleButtonStyle = {
    position: 'absolute', // Absolute positioning
    top: '10px', // 10px from the top
    left: isOpen ? '90px' : '10px', // Adjust position based on isOpen state
    backgroundColor: '#0056b3', // Button background color
    color: 'white', // Button text color
    border: '2px solid white', // White border
    cursor: 'pointer', // Pointer cursor on hover
    width: '25px', // Fixed width
    height: '25px', // Fixed height
    display: 'flex', // Flexbox for centering content
    justifyContent: 'center', // Center content horizontally
    alignItems: 'center', // Center content vertically
    borderRadius: '10%', // Rounded corners
    transition: 'left 0.3s ease', // Smooth transition for left property
    zIndex: 2000, // High z-index to ensure it's above other elements
  };

  // Styles for the navigation buttons
  const buttonStyle = {
    backgroundColor: 'transparent', // Transparent background
    color: 'white', // White text color
    border: 'none', // No border
    cursor: 'pointer', // Pointer cursor on hover
    textAlign: 'left', // Left-aligned text
    padding: '15px 0', // Vertical padding
    width: '100%', // Full width
  };

  return (
    <div>
      <div style={sidebarStyle}>
        <h2>{t('sidebar.menu')}</h2> {/* Sidebar menu heading */}
        <nav>
          <ul style={{ listStyleType: 'none', padding: 0 }}> {}
            <li>
              <button style={buttonStyle} onClick={() => navigateTo('/')}>{t('sidebar.home')}</button> {}
            </li>
            <li>
              <button style={buttonStyle} onClick={() => navigateTo('/about')}>{t('sidebar.about')}</button> {}
            </li>
            <li>
              <button style={buttonStyle} onClick={() => navigateTo('/contact')}>{t('sidebar.contact')}</button> {}
            </li>
            <li>
              <button style={buttonStyle} onClick={() => navigateTo('/settings')}>{t('sidebar.settings')}</button> {}
            </li>
          </ul>
        </nav>
      </div>
      <button style={toggleButtonStyle} onClick={toggleSidebar}>
        {isOpen ? '<<' : '>>'} {}
      </button>
    </div>
  );
};

export default Sidebar;
