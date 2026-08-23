import { Link } from "react-router-dom";
import ClinkMark from "@/components/ClinkMark";

const NotFound = () => (
  <div className="container-custom flex min-h-screen flex-col items-center justify-center gap-6 text-center">
    <ClinkMark className="h-10 w-10 text-amber" />
    <p className="display-heading text-3xl">Nothing poured here.</p>
    <p className="body-copy max-w-[44ch]">
      This page does not exist — or its chapter has not been revealed yet.
    </p>
    <Link to="/" className="link-cta">
      Back to the toast →
    </Link>
  </div>
);

export default NotFound;
