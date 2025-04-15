import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { User, Clock, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TaskDetailCard = () => {
  const [tab, setTab] = useState("submission");
  const navigate = useNavigate();
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <Card className="shadow-md">
        <CardContent className="py-6 space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-white/90 hover:bg-white rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[#136cb9]" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Bieu dien dan tranh
              </h1>
              <p className="mt-1">The task requires students to write a comprehensive essay addressing the topic of environmental issues. In the essay, students should explore the various causes of environmental degradation, including deforestation, pollution, and climate change, and discuss their effects on biodiversity and human health. Additionally, students are expected to propose practical solutions to mitigate these issues, such as renewable energy adoption, conservation efforts, and changes in consumption patterns. The essay should be well-structured, with a clear introduction, body paragraphs detailing the main points, and a conclusion summarizing the key takeaways. Students are encouraged to incorporate relevant statistics and research findings to support their arguments.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-700">Start Time</p>
                <p>13/04/2025 07:00</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-700">Deadline</p>
                <p>15/04/2025 07:00</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-green-500 inline-block" />
              <div>
                <p className="text-sm font-medium text-gray-700">Status</p>
                <p className="text-green-600 font-semibold">Completed</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-700">Assign to club</p>
                <p>Green Life</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="w-full grid grid-cols-2 mb-4">
          <TabsTrigger value="submission">Submission</TabsTrigger>
          <TabsTrigger value="assigned">Assigned Members</TabsTrigger>
        </TabsList>

        {/* Submission Tab */}
        <TabsContent value="submission">
          <Card>
            <CardContent className="p-6 space-y-2">
              <h3 className="text-lg font-semibold mb-2">Submissions</h3>
              <div className="border p-4 rounded-md space-y-2">
                <p className="font-semibold text-blue-600">📄 Submission 1</p>
                <p>Submitted by: John Doe</p>
                <p>Submitted at: 01/01/2021 07:00</p>
                <p>Content: This is the content of the submission</p>
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" size="sm" onClick={() => navigate('/club/task-submission')}>👁️ View</Button>
                  <Button variant="outline" size="sm">⬇️ Download</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assigned Members Tab */}
        <TabsContent value="assigned">
          <Card>
            <CardContent className="p-6 space-y-2">
              <h3 className="text-lg font-semibold mb-2">Assigned Members</h3>
              <div className="border p-4 rounded-md space-y-2">
                <p className="font-semibold text-blue-600">👤 Member 1</p>
                <p>Vai trò: Member</p>
                <p className="text-green-600 font-semibold">Completed</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaskDetailCard;
