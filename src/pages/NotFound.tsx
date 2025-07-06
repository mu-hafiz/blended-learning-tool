import Button from "@components/Button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1 className="mb-4">404 Not Found</h1>
      <p className="mb-4">That link doesn't seem to exist...</p>
      <Button
        onClick={() => { navigate('/') }}
      >
        Go to Home
      </Button>
    </div>
  )
}

export default NotFound;