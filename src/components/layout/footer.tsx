export const Footer = () => {
  return (
    <footer className="w-full bg-gradient-to-r from-[#136CB5] to-[#49BBBD] text-white py-12">
      <div className="container mx-auto text-center">
        <p className="text-lg font-medium">
          &copy; 2025 ECAMS. All rights reserved.
        </p>
        <div className="mt-6 flex justify-center space-x-6">
          <a href="#" className="hover:underline">
            Privacy Policy
          </a>
          <a href="#" className="hover:underline">
            Terms of Service
          </a>
          <a href="#" className="hover:underline">
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  );
};
