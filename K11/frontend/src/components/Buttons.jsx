import { Button } from "react-bootstrap";

export const ButtonComponent = ({
  text,
  svg,
  onClick,
  type,
  size,
  as,
  to,
  className,
}) => {
  return (
    <Button
      type={type}
      size={size}
      as={as}
      to={to}
      className={className}
      onClick={onClick}
    >
        
      {svg}
      
      {text}
    </Button>
  );
};
