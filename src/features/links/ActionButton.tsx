import React from "react";
import { useNavigate } from "react-router-dom";

import ActionIcon, { ActionIconProps } from "./ActionIcon";

interface ActionButtonProps {
  content: string;
  fontClassName?: string;
  customHandler?: () => void;
}

type ComponentProps = ActionButtonProps & ActionIconProps;

const ActionButton: React.FC<ComponentProps> = ({ customHandler, icon, path, content, className, fontClassName }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    !!customHandler ? customHandler() : navigate(path);
  }

  return (
    <div style={{ cursor: "pointer" }} className={`${className || "action-button"}`} onClick={handleClick}>
      <ActionIcon className={`${fontClassName}`} icon={icon} path={path} />
      {content}
    </div>)
};

export default ActionButton;
