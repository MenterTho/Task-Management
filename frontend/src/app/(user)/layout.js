"use client"
import { useEffect } from "react"
// import Navbar from "@/components/ui-navbar/navbar"
import Footer from "@/components/footer"

export default function UserLayout({ children }) {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      {/* <Navbar /> */}
      <main className="flex-1 p-6 bg-[#1d1e20] dark:bg-[#0e1116] duration-300 ease-in-out">
        {children}
      </main>
      <Footer />
    </div>
  )
}
