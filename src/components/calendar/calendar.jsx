import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const topicWiseQSolved = [
    {
        categoryName: "advanced",
        topics: [{ name: "Graph", solved: 56 }, { name: "Tree", solved: 43 }, { name: "Trie", solved: 32 }],
        _id: "67bb0bf4d0c77a8a26c18158"
    },
    {
        categoryName: "fundamental",
        topics: [{ name: "Array", solved: 27 }, { name: "Hash", solved: 21 }],
        _id: "67bb0bf4d0c77a8a26c18168"
    },
    {
        categoryName: "intermediate",
        topics: [{ name: "Sorting", solved: 39 }, { name: "DP", solved: 25 }],
        _id: "67bb0bf4d0c77a8a26c18173"
    }
];

// Extract Data for Chart
const labels = [];
const data = [];
const backgroundColors = [];

const categoryColors = {
    advanced: "#FF4C4C", // Red
    intermediate: "#FFD700", // Yellow
    fundamental: "#4CAF50" // Green
};

topicWiseQSolved.forEach(category => {
    category.topics.forEach(topic => {
        labels.push(topic.name);
        data.push(topic.solved);
        backgroundColors.push(categoryColors[category.categoryName]);
    });
});

const barData = {
    labels,
    datasets: [{
        data,
        backgroundColor: backgroundColors,
        barThickness: 15,
        categoryPercentage: 0.6,
        barPercentage: 0.8
    }]
};

const barOptions = {
    indexAxis: 'y', // Horizontal Bar Chart
    scales: {
        x: { display: false },
        y: { grid: { display: false } }
    },
    plugins: {
        legend: { display: false }
    }
};

const TopicBarChart = () => {
    return <Bar data={barData} options={barOptions} />;
};

export default TopicBarChart;