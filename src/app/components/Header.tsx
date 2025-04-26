import Link from "next/link";
import Image from "next/image";

const Header: React.FC = () => {
  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/modules", label: "Modules" },
    { href: "/contact", label: "Sign in" },
  ];

  // The sign in page does not exist yet

  return (
    <header className="bg-zinc-900 shadow-md">
      <div className="container mx-auto bg-zinc-900 px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/assets/CodeConquestLogo.png"
            alt="Logo"
            width={60}
            height={60}
            className="mr-2"
          />
          <span className="text-2xl text-white font-semibold">CodeConquest</span>
        </Link>

        {/* Navigation */}
        <nav className="flex space-x-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white hover:text-blue-600 transition"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
