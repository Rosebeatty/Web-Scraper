import React from 'react';
import {
  PieChart, Pie, Cell,
} from 'recharts';
import '../App.css'
import Title from './Title'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;

export default class Chart extends React.Component { 
    state={
        data: [],
        isAnimation: false
    }

    componentDidUpdate(prevProps) {
        if(prevProps.data !== this.props.data) {
             this.setState({data: this.props.data})
        }
    }
    
    render() {
        const { data } = this.state
        const renderCustomizedLabel = ({
          cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value
        }) => {
          const radius = innerRadius + (outerRadius - innerRadius) * 0.2;
          const x = cx + radius * Math.cos(-midAngle * RADIAN);
          const y = cy + radius * Math.sin(-midAngle * RADIAN);
          return percent > 0 ? 
          (
          <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'}              dominantBaseline="central">
              {name} - {value} 
            </text>
          ) : 
          (
          <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
          </text> 
          )
        };
    return (
      <div 
        style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center"
        }}>
      <Title>Links</Title>
        { this.props.loading ? <div>loading</div> 
        :
        data[0] ? 
            <div>
            <p style={{margin: 0, fontSize: "0.7em"}}>Title: {this.props.title}</p>
            <PieChart className="pie" height={280} width={625} style={{display: "flex", width:"50vw"}}>
                <Pie
                data={data}
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={140}
                fill="#8884d8"
                dataKey="value"
                // isAnimationActive={this.setState({IsAnimation:true}) }
                // onAnimationEnd={ this.setState({IsAnimation:false}) }
                isAnimationActive={false}
                nameKey={data.name}
                >
                { data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />) }
                </Pie>
            </PieChart>
            </div> 
         : <div>Search a website to scrape data</div> }
         </div>
    );
  }
}
