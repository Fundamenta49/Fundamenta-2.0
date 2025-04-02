import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import cloud from 'd3-cloud';

interface WordCloudProps {
  words: Array<{ text: string; size: number }>;
}

interface CloudWord {
  text: string;
  size: number;
  x?: number;
  y?: number;
  rotate?: number;
}

export default function WordCloud({ words }: WordCloudProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !words.length) return;

    const width = 300;
    const height = 200;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    const layout = cloud()
      .size([width, height])
      .padding(5)
      .rotate(() => 0)
      .fontSize((d: CloudWord) => Math.min(d.size * 5, 40))
      .words(words.map(w => ({ ...w, text: w.text, size: w.size })));

    layout.on("end", (words: CloudWord[]) => {
      d3.select(svgRef.current)
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width/2},${height/2})`)
        .selectAll("text")
        .data(words)
        .enter()
        .append("text")
        .style("font-size", (d: CloudWord) => `${d.size}px`)
        .style("fill", () => d3.interpolateBlues(Math.random()))
        .attr("text-anchor", "middle")
        .attr("transform", (d: CloudWord) => `translate(${d.x},${d.y})rotate(${d.rotate})`)
        .text((d: CloudWord) => d.text);
    });

    layout.start();
  }, [words]);

  return (
    <div className="w-full flex justify-center">
      <svg ref={svgRef} className="max-w-full"></svg>
    </div>
  );
}