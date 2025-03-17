import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClubConditionCreate } from "./ClubConditionCreate";

interface ClubCondition {
    id: number;
    clubId: string;
    conditionType: string;
    conditionValue: string;
    description?: string;
}

const fakeConditions: ClubCondition[] = [
    { id: 1, clubId: "101", conditionType: "Age", conditionValue: "18+", description: "Only for adults" },
    { id: 2, clubId: "101", conditionType: "Experience", conditionValue: "Beginner", description: "For beginners only" },
    { id: 3, clubId: "101", conditionType: "Membership", conditionValue: "Premium", description: "Only premium members" },
    { id: 4, clubId: "101", conditionType: "Membership", conditionValue: "Premium", description: "Only premium members" },
];

export function ClubConditionView() {
    return (
        <div className="p-6 space-y-6">
            <Card>
                <CardHeader className="flex justify-between items-center">
                    <CardTitle>Club Conditions</CardTitle>
                    <ClubConditionCreate />
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {fakeConditions.map((c) => (
                            <Card key={c.id} className="p-4 border shadow-md">
                                <div className="text-lg font-semibold">{c.conditionType}</div>
                                <Badge variant="outline" className="mt-2">{c.conditionValue}</Badge>
                                <p className="mt-2 text-sm text-gray-500">{c.description}</p>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}