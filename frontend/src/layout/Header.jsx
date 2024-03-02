import { Link } from "react-router-dom";

function Header() {
	return (
		<header className="bg-slate-100 px-8 py-4">
			<nav>
				<ul className="flex gap-6">
					<li>
						<Link to="/" className="nav-link">
							Home
						</Link>
					</li>
					<li>
						<Link to="/bookmarks" className="nav-link">
							View Bookmarks
						</Link>
					</li>
					<li>
						<Link to="/add" className="nav-link">
							Add New Bookmark
						</Link>
					</li>
				</ul>
			</nav>
		</header>
	);
}

export default Header;
