import { Label } from "@/components/ui/label";

import { Autocomplete, TextField } from "@mui/material";
import { SearchIcon } from "lucide-react";
const options = [
  { label: "The Godfather", id: 1 },
  { label: "Pulp Fiction", id: 2 },
];
export const SearchBar = () => {
  // const [, setOpen] = useState(false);
  return (
    <div className="relative  w-full max-w-md sm:max-w-sm md:max-w-lg lg:max-w-2xl xl:max-w-5xl 2xl:max-w-6xl mx-auto -mt-20 z-10">
      <div className=" w-full bg-gradient-to-r from-[#136CB5] to-[#49BBBD] shadow-lg py-7 rounded-lg flex justify-center flex-wrap gap-5">
        <div className="flex flex-col gap-3 rounded w-fit">
          <Label className="text-white">Looking for</Label>

          <Autocomplete
            disablePortal
            options={options}
            sx={{ width: 250 }}
            className="bg-white rounded-lg"
            renderInput={(params) => <TextField {...params} label="Type" />}
          />
        </div>
        <div className="flex flex-col gap-3 rounded  w-fit">
          <Label className="text-white">Location</Label>

          <Autocomplete
            disablePortal
            options={options}
            sx={{ width: 250 }}
            className="bg-white rounded-lg"
            renderInput={(params) => <TextField {...params} label="Location" />}
          />
        </div>
        <div className="flex flex-col gap-3 rounded w-fit">
          <Label className="text-white">When</Label>

          <Autocomplete
            disablePortal
            options={options}
            sx={{ width: 250 }}
            className="bg-white rounded-lg"
            renderInput={(params) => <TextField {...params} label="Location" />}
          />
        </div>
        <div className="flex flex-col justify-end gap-3 rounded ">
          <button className="bg-[#136CB5] text-white p-4 rounded hover:bg-[#136CB5]/80 transition w-[60px] h-[60px] ">
            <SearchIcon size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};
