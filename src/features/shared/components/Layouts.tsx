import { Outlet, Link } from "react-router-dom"
import { Header } from "./Header"


export const Layouts = () => {
    return (
        <div className="wrapper">
            {/* header */}
            <Header />

            <main className="p-4">
                <Outlet />
            </main>
        </div>
    )
}
