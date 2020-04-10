import React from "react";

const TabPanel: React.FC<{ isActive: boolean; children: any }> = ({ isActive, children }) => {
  return isActive ? children : null;
};

export default TabPanel;
