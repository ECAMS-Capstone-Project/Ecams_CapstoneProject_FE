import { Activity, Club, LucideIcon, User } from "lucide-react"

type Status = {
    value: string
    label: string
    icon?: LucideIcon
  }
export const packageType: Status[] = [
    {
      value: "Students",
      label: "Students",
      icon: User,
    },
    {
      value: "Clubs",
      label: "Clubs",
      icon: Club,
    },
    {
      value: "Events",
      label: "Events",
      icon: Activity,
    },
    
  ]
   