import AdditionInfoUniversityForm from "@/components/partial/university-representative-register/additionInfoUniversityForm";

export default function AdditionRegisterUniversity() {
  return (
    <>
      <div className="mb-2 flex items-center justify-between space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center space-x-2"></div>
      </div>
      <div>
        <AdditionInfoUniversityForm />
      </div>
    </>
  );
}
