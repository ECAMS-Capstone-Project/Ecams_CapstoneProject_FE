const Header = () => {
  return (
    <header className="w-full h-[80px] md:h-[100px] top-0 left-0 z-50 ">
      <div className="fixed top-7 left-32 gap-4">
        {/* Logo */}
        <img
          src="/image/appLogo.png"
          alt="App Logo"
          className="w-[150px] h-auto"
        />
        {/* Title */}
      </div>
    </header>
  );
};

export default Header;
