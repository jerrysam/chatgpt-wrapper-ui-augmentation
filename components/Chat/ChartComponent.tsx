import React from 'react';
import { Chart as ChartJS, ArcElement, LineElement, BarElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend, Colors, Filler, RadialLinearScale} from 'chart.js';
import { Pie, Line, Bar, Doughnut, PolarArea, Radar, Scatter, Bubble } from 'react-chartjs-2';

ChartJS.register( ArcElement, LineElement, BarElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend, Colors, Filler, RadialLinearScale );

interface ChartComponentProps {
  config: {
    type: 'Pie' | 'Line' | 'Bar' | 'Doughnut' | 'PolarArea' | 'Radar' | 'Scatter' | 'Bubble';
    data: any;
    options?: any;
  };
}

const ChartComponent: React.FC<ChartComponentProps> = ({ config }) => {
  let ChartType = config.type === 'Pie' ? Pie : config.type === 'Line' ? Line : config.type === 'Bar' ? Bar : config.type === 'Doughnut' ? Doughnut : config.type === 'PolarArea' ? PolarArea : config.type === 'Radar' ? Radar : config.type === 'Scatter' ? Scatter : Bubble;
  return <ChartType data={config.data} options={config.options}  />;
};

export default ChartComponent;