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
  style,
}) => {
  return (
    <Button
      type={type}
      size={size}
      as={as}
      to={to}
      className={className}
      onClick={onClick}
      style={style}
    >
        
      {svg}
      
      {text}
    </Button>
  );
};
