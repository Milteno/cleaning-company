import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="footer bg-dark ">
      <div className="container">
        <p className="text-muted ">
          &copy; Cleaning Master{' | '}
          <Link className="text-white text-decoration-none" to="/">Strona główna</Link>{' | '}
          <Link className="text-white text-decoration-none"  to="/kontakt">Kontakt</Link>
        </p>
      </div>
    </footer>
  );
}
