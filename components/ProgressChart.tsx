
import React from 'react';
import { LearnedWord } from '../types';
import { processLearningDataForChart, calculateAverageKnowledge, ChartData } from '../utils/chartUtils';
import ChartBarIcon from './icons/ChartBarIcon';

interface StatCardProps {
    label: string;
    value: string | number;
}

const StatCard: React.FC<StatCardProps> = ({ label, value }) => (
    <div className="bg-slate-100 dark:bg-slate-900/50 p-4 rounded-lg text-center">
        <div className="text-3xl font-bold text-slate-900 dark:text-white">{value}</div>
        <div className="text-sm text-slate-500 dark:text-slate-400">{label}</div>
    </div>
);

const BarChart: React.FC<{ data: ChartData }> = ({ data }) => {
    const chartHeight = 120;
    const barWidth = 30;
    const barMargin = 15;
    const chartWidth = data.labels.length * (barWidth + barMargin);

    return (
        <div className="flex justify-center mt-4">
            <svg width="100%" height={chartHeight + 20} viewBox={`0 0 ${chartWidth} ${chartHeight + 20}`}>
                {data.values.map((value, index) => {
                    const barHeight = (value / data.maxValue) * chartHeight;
                    const x = index * (barWidth + barMargin) + (barMargin/2);
                    const y = chartHeight - barHeight;

                    return (
                        <g key={index}>
                            <rect
                                x={x}
                                y={y}
                                width={barWidth}
                                height={barHeight}
                                className="fill-current text-blue-500"
                                rx="4"
                                ry="4"
                            />
                             <text
                                x={x + barWidth / 2}
                                y={y - 5}
                                textAnchor="middle"
                                className="text-xs font-bold fill-current text-slate-700 dark:text-slate-200"
                            >
                                {value > 0 ? value : ''}
                            </text>
                            <text
                                x={x + barWidth / 2}
                                y={chartHeight + 15}
                                textAnchor="middle"
                                className="text-xs font-medium fill-current text-slate-500 dark:text-slate-400"
                            >
                                {data.labels[index]}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};

const ProgressChart: React.FC<{ learnedWords: LearnedWord[] }> = ({ learnedWords }) => {
    const chartData = processLearningDataForChart(learnedWords);
    const averageKnowledge = calculateAverageKnowledge(learnedWords);

    return (
        <div className="bg-white dark:bg-slate-800/50 p-6 mb-4 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
            <div className="flex items-center mb-4">
                <div className="bg-blue-100 dark:bg-blue-900/40 p-2 rounded-full mr-4 text-blue-600 dark:text-blue-300">
                   <ChartBarIcon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Learning Progress</h3>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Total Words" value={learnedWords.length} />
                <StatCard label="Avg. Knowledge" value={averageKnowledge} />
                <StatCard label="Words This Week" value={chartData.values.reduce((a,b) => a+b, 0)} />
                 <div className="bg-slate-100 dark:bg-slate-900/50 p-4 rounded-lg text-center flex flex-col justify-center">
                    <div className="text-sm text-slate-500 dark:text-slate-400">Keep up the great work!</div>
                </div>
            </div>

            <div className="mt-4">
                <h4 className="text-center font-semibold text-slate-600 dark:text-slate-300 mb-2">New Words (Last 7 Days)</h4>
                <BarChart data={chartData} />
            </div>
        </div>
    );
};

export default ProgressChart;
