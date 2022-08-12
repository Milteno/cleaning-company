import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from '@fortawesome/fontawesome-svg-core';

export interface ActionIconProps {
  icon: IconProp,
  path: string,
  className?: string
}

// by default ActionIcon has mr-2 class to get initial right margin
const ActionIcon: React.FC<ActionIconProps> = ({ icon, className }) => {
  return (
    <FontAwesomeIcon
      className={`mr-2 ${className}`}
      icon={icon}
    />)
};

export default ActionIcon;