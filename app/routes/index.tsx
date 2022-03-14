import { Link } from "remix";

export default function Index() {
    return (
        <div>
            <h1>Welcome to Remix</h1>
            <ul>
                <li>
                    <Link to="/posts">
                        <a>Home</a>
                    </Link>
                </li>
            </ul>
        </div>
    );
}
