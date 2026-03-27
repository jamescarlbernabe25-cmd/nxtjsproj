import Link from "next/link";

const Layout = ({children}:{children: React.ReactNode}) => {
    return ( 
        <div>
            <nav>
      <ul>
        <li><button>Dark Mode</button></li>
        <li><Link href="/signin">Sign In</Link></li>
      </ul>
    </nav>
            {children}
            <footer>
        <h3>About</h3>
        <p>This is a blog website created as a mini project for Next.js to showcase a full stack knowledge in building using this technology.</p>
      <p>&copy; 2026 Blog by James Carl Bernabe. All Rights Reserved.</p>
      </footer>
        </div>
     );
}
 
export default Layout;