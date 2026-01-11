import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createAssignment } from "../../api/assignmentApi";
import { getAllUsers } from "../../api/userApi";
import { getAllProjects } from "../../api/projectApi";

export default function AssignEmployee() {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [projects, setProjects] = useState([]);
    const [formData, setFormData] = useState({
        employeeId: "",
        projectId: "",
        role_on_project: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersData, projectsData] = await Promise.all([
                    getAllUsers(),
                    getAllProjects()
                ]);

                setEmployees(usersData);
                setProjects(projectsData);
            } catch (error) {
                console.error("Failed to fetch data", error);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            userId: Number(formData.employeeId),
            projectId: Number(formData.projectId),
            role: formData.role_on_project
        };

        try {
            await createAssignment(payload);
            alert("Employee assigned successfully!");
            navigate("/matching/reassignment");
        } catch (error) {
            console.error("Failed to assign employee", error);
            alert("Assignment failed!");
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Manual Assignment</h1>

            <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl">
                <form onSubmit={handleSubmit}>
                    
                    <div className="mb-4">
                        <label className="block font-bold mb-1">Employee</label>
                        <select
                            value={formData.employeeId}
                            onChange={(e) =>
                                setFormData({ ...formData, employeeId: e.target.value })
                            }
                            className="w-full border rounded px-3 py-2"
                            required
                        >
                            <option value="">Select Employee</option>
                            {employees.map((emp) => (
                                <option key={emp.user_id} value={emp.user_id}>
                                    {emp.full_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block font-bold mb-1">Project</label>
                        <select
                            value={formData.projectId}
                            onChange={(e) =>
                                setFormData({ ...formData, projectId: e.target.value })
                            }
                            className="w-full border rounded px-3 py-2"
                            required
                        >
                            <option value="">Select Project</option>
                            {projects.map((proj) => (
                                <option key={proj.projectId} value={proj.projectId}>
                                    {proj.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block font-bold mb-1">Role on Project</label>
                        <input
                            type="text"
                            className="w-full border rounded px-3 py-2"
                            value={formData.role_on_project}
                            onChange={(e) =>
                                setFormData({ ...formData, role_on_project: e.target.value })
                            }
                            required
                        />
                    </div>

                    <button className="bg-blue-600 text-white px-4 py-2 rounded">
                        Assign
                    </button>

                </form>
            </div>
        </div>
    );
}
