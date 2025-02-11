const Header = () => {
  return (
    <header className="w-full h-[80px] md:h-[100px] top-0 left-0 z-50">
      <div className="fixed top-7 left-28 gap-4 ">
        {/* Logo */}
        <img
          src="https://res.cloudinary.com/ecams/image/upload/v1739124259/ECAMS_Logo_ow82lc.png"
          alt="App Logo"
          className="w-24 h-20"
        />
        {/* Title */}
      </div>
    </header>
  );
};

export default Header;
