import { bouncy } from "ldrs";

bouncy.register();

const DialogLoading = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <l-bouncy size="45" speed="1.75" color="#136CB5"></l-bouncy>
    </div>
  );
};

export default DialogLoading;
