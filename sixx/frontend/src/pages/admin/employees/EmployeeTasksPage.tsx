import { useEffect, useState } from "react";
import api from "../../../utils/api";
import PageContainer, { SectionHeader, DashCard } from "../../../components/layout/PageContainer";
import AssignTaskForm from "../../../components/admin/tasks/AssignTaskForm";
import TaskTable from "../../../components/admin/tasks/TaskTable";

export default function EmployeeTasksPage() {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data.tasks);
    } catch (err) {
      console.error("Fetch tasks error:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <PageContainer>
      <SectionHeader title="Employee Tasks" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assign Task Form */}
        <DashCard className="p-6">
          <h3 className="text-white font-semibold mb-4">Assign New Task</h3>
          <AssignTaskForm onCreated={fetchTasks} />
        </DashCard>

        {/* Task List */}
        <div className="lg:col-span-2">
          <DashCard className="p-6">
            <h3 className="text-white font-semibold mb-4">All Assigned Tasks</h3>
            <TaskTable tasks={tasks} onDeleted={fetchTasks} />
          </DashCard>
        </div>
      </div>
    </PageContainer>
  );
}
