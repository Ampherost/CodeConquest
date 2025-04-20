import Link from "next/link";
import Image from "next/image";
import Logo from "@/app/assets/LogoTwo.png";

const Header: React.FC = () => {
  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Modules" },
    { href: "/contact", label: "Sign in" },
  ];

  return (
    <header className=" bg-sky-500 shadow-md">
      <div className="container mx-auto bg-amber-400 px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src={Logo}
            alt="Logo"
            width={60}
            height={60}
            className="mr-2"
          />
          <span className="text-2xl text-black font-semibold">CodeConquest</span>
        </Link>

        {/* Navigation */}
        <nav className="flex space-x-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-700 hover:text-blue-600 transition"
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
