 interface LayoutProps {
    children: React.ReactNode;
 }

 const Layout = ({children}: LayoutProps) => {
    return (
        <div className="h-screen bg-black">
            {children}
        </div>
    )
}
export default Layout