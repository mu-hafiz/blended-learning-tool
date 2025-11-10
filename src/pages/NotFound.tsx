import { Button } from "@components";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div>
      <h1 className="mb-4">404 Not Found</h1>
      <p className="mb-4">That link doesn't seem to exist...</p>
      <Link to="/dashboard">
        <Button>
          Go to Home
        </Button>
      </Link>
    </div>
  )
}

export default NotFound;