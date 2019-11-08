import React from 'react';
import { scaleLinear, ScaleSequential } from 'd3';

interface ILegendPresentation {
    barWidth?: number;
    barHeight?: number;
    colourScale: ScaleSequential<string>;
    fontSize?: number;
    fontFamily?: string;
}

const defaultValues = {
    barWidth: 10,
    barHeight: 300,
    fontSize: 10,
    fontFamily: "sans-serif"
}

// reference: https://github.com/d3/d3-axis/blob/master/src/axis.js
export const LegendPresentation: React.FunctionComponent<ILegendPresentation> = (props: ILegendPresentation) => {

    const {barWidth, barHeight, colourScale, fontSize, fontFamily } = { ...defaultValues, ...props };

    const margin = {top: 10, right: 40, bottom: 10, left: 10};
    const tickPadding = 3;
    const axisScale = scaleLinear().domain(colourScale.domain()).range([barHeight, 0]);
   
    return (
        <>
            <defs>
                <linearGradient id="linear-gradient" x1={"0%"} y1={"100%"} x2={"0%"} y2={"0%"}> 
                    {
                        axisScale.ticks().map((value, index, array) => (
                            <stop key={index} offset={`${100*index/array.length}%`} stopColor={colourScale(value)}></stop>
                        ))
                    }
                </linearGradient>
            </defs>
            <g transform={`translate(${margin.left},${margin.top})`}>
                <rect transform={`translate(0, 0)`} width={barWidth} height={barHeight} fill={"url(#linear-gradient)"}></rect>
            </g>
            <g transform={`translate(${margin.left + barWidth},${margin.top})`} fill={"none"} fontSize={fontSize} textAnchor={"start"}>
                {
                    axisScale.ticks(5).map((value, index) => (
                        <g key={index} opacity={0.8} transform={`translate(0,${axisScale(value)})`}>
                            <text fill={"#AAAAAA"} x={tickPadding} fontFamily={fontFamily}>{value}</text>
                        </g>
                    ))
                }
            </g>
        </>
    );
}