import React from 'react';
const mockIcon = React.createElement('svg');

// Add icons to the list
const iconNames = ['uil-angle-down'];

const icons: Record<string, JSX.Element> = {};

iconNames.forEach((iconName) => {
  icons[iconName] = mockIcon;
});

export default icons;
