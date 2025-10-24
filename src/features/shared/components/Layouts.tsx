import { Outlet, Link } from "react-router-dom"


export const Layouts = () => {
    return (
        <div className="wrapper">
            <header className="p-4 bg-gray-100">
                <h1 className="text-2xl font-bold">E-Commerce App</h1>
            </header>

            <main className="p-4">
                <Outlet />
            </main>
        </div>
    )
}
