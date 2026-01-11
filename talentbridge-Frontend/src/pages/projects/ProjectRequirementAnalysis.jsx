import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRequirementsByProject } from "../../api/requirementApi";
import BarChart from "../../components/charts/BarChart";

export default function ProjectRequirementAnalysis() {
    const { id } = useParams();
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const requirements = await getRequirementsByProject(id);

                // Example analysis: Distribution of required skills
                const labels = requirements.map(r => r.skill);
                const data = requirements.map(r => r.count);

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: 'Required Count',
                            data: data,
                            backgroundColor: 'rgba(54, 162, 235, 0.5)',
                        },
                    ],
                });
            } catch (error) {
                console.error("Failed to fetch analysis data", error);
            }
        };
        fetchData();
    }, [id]);

    if (!chartData) return <div className="p-4">Loading Analysis...</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Requirement Analysis</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="h-96">
                    <BarChart data={chartData} title="Skill Demand Distribution" />
                </div>
            </div>
        </div>
    );
}
