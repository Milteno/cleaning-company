import { FC } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Endpoints } from "../../app/constans";

interface ISaveButtonProps {
  isSubmitting: boolean;
  endpoint: Endpoints;
}

export const SaveButton: FC<ISaveButtonProps> = ({ isSubmitting, endpoint }) => {
  return (<div className="text-center mb-3">
    <Button
      variant="primary"
      type="submit"
      disabled={isSubmitting}>
      {isSubmitting ? "Zapisywanie..." : "Zapisz"}
    </Button>
    {' '}
    <Link to={endpoint}>Powrót</Link>
  </div>);
}
