import Link from "next/link";

export default ({ currentuser }) => {
  const links = [
    !currentuser && { label: "Sign Up", href: "/auth/signup" },
    !currentuser && { label: "Sign In", href: "/auth/signin" },
    currentuser && { label: "Sign Out", href: "/auth/signout" },
  ] // this will showlike [false, false, {label:sign out}]
    .filter((linkConfig) => linkConfig)
    .map(({ label, href }) => {
      return (
        <li key={href} className="nav-ietm">
          <Link href={href} className="nav-link">
            {label}
          </Link>
        </li>
      );
    });
  return (
    <nav className="navbar navbar-light bg-light">
      <Link className="navbar-brand" href="/">
        GitTix
      </Link>

      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">
          {/* {currentuser ? "Sign Out" : "Sign In/Out"} */}
          {links}
        </ul>
      </div>
    </nav>
  );
};
