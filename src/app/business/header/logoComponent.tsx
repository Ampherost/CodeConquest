import Image from "next/image";
const LogoComponent = () => {
  return (
    <div className="logo">
      <a className="bg-green-700" href="/assets/CodeConquestLogo.png">
        <Image
          src="/assets/CodeConquestLogo.png"
          alt="Code Conquest Logo"
          width={50}
          height={50}
        />
      </a>
    </div>
  );
};
export default LogoComponent;
