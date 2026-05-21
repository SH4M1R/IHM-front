import Navbar from "../components/Navbar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="bg-gray-100 min-h-screen pt-14">
        {children}
      </main>
    </>
  );
}