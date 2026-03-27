import React from "react";

const Layout = ({children}:{children: React.ReactNode}) => {
    return ( 
        <div>
            <nav>
      <ul>
        <li><button>Dark Mode</button></li>
        
      </ul>
    </nav>
            {children}
            <footer>
       
      <p>&copy; 2026 Blog by James Carl Bernabe. All Rights Reserved.</p>
      </footer>
        </div>
     );
}
 
export default Layout;