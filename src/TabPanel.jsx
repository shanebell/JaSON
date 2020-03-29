const TabPanel = (props) => {
    const {isActive, children} = props;
    return isActive ? children : null;
};

export default TabPanel;