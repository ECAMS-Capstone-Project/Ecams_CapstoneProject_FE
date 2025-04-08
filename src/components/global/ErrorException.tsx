function ErrorException() {
  return (
    <div className="w-full h-screen grid grid-cols-12 items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-6">
      {/* Left Section */}
      <div className="col-span-12 lg:col-span-7 flex flex-col items-center justify-center text-center space-y-6">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400 drop-shadow-md mb-1">
          Something went wrong
        </h1>
        <p className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-wide text-gray-400">
          Unexpected Error
        </p>
        <p className="text-lg md:text-xl lg:text-2xl text-gray-600 max-w-xl">
          Oops! Something went wrong on our end. Please be patient while we fix it.
        </p>
        <a
          href="/"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300 ease-in-out"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
          <span className="text-base font-medium">Back to Home</span>
        </a>
      </div>

      <div className="col-span-12 lg:col-span-5 flex items-center justify-center mt-10 lg:mt-0">
        <img
          src="https://res.cloudinary.com/ecams/image/upload/v1738675298/Error_Img"
          alt="Error Illustration"
          className="w-80 lg:w-96 drop-shadow-md animate-bounce-slow"
        />
      </div>

    </div>
  );
}

export default ErrorException;