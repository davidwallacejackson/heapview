import * as d3 from "d3";
import { useLayoutEffect, useMemo, useRef } from "react";
import { useGraphContent } from "./hooks";
import { GraphData } from "./types";
interface GraphViewProps {
  searchInput: string;
}

function renderGraph(data: GraphData) {
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const width = window.innerWidth - margin.left - margin.right;
  const height = window.innerHeight - margin.top - margin.bottom - 200;

  d3.select("#graphContainer").selectAll("*").remove();

  const svg = d3
    .select("#graphContainer")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const zoom = d3
    .zoom()
    .scaleExtent([0.1, 10])
    .on("zoom", (event) => {
      g.attr("transform", event.transform);
    });

  svg.call(zoom as any);

  const simulation = d3
    .forceSimulation(data.nodes)
    .force(
      "link",
      d3
        .forceLink(data.links)
        .id((d: any) => d.id)
        .distance(30)
    )
    .force("charge", d3.forceManyBody().strength(-300))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collide", d3.forceCollide().radius(30))
    .force("x", d3.forceX(width / 2).strength(0.1))
    .force("y", d3.forceY(height / 2).strength(0.1));

  const link = g
    .append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(data.links)
    .enter()
    .append("line")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
    .attr("stroke-width", 1);

  const node = g
    .append("g")
    .attr("class", "nodes")
    .selectAll("g")
    .data(data.nodes)
    .enter()
    .append("g")
    .call(
      d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any
    );

  node.append("circle").attr("r", 8).attr("fill", "#69b3a2");

  node
    .append("text")
    .text((d: any) => d.label)
    .attr("x", 10)
    .attr("y", 3)
    .style("font-size", "8px");

  simulation.nodes(data.nodes).on("tick", ticked);

  (simulation.force("link") as any).links(data.links);

  function ticked() {
    link
      .attr("x1", (d: any) => d.source.x)
      .attr("y1", (d: any) => d.source.y)
      .attr("x2", (d: any) => d.target.x)
      .attr("y2", (d: any) => d.target.y);

    node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
  }

  function dragstarted(event: any, d: any) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event: any, d: any) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragended(event: any, d: any) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  // Search and color nodes
  const searchInput = document.getElementById("searchInput");
  (searchInput as any).addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase();
    node.each(function (d: any) {
      const isMatch = d.label.toLowerCase().includes(searchTerm);
      d3.select(this)
        .select("circle")
        .attr("fill", isMatch ? "#ff0000" : "#69b3a2")
        .attr("r", isMatch ? 12 : 8);

      if (isMatch && searchTerm !== "") {
        const transform = d3.zoomTransform(svg.node() as SVGElement);
        const scale = transform.k;
        const x = -d.x * scale + width / 2;
        const y = -d.y * scale + height / 2;
        svg
          .transition()
          .duration(750)
          .call(zoom.transform, d3.zoomIdentity.translate(x, y).scale(scale));
      }
    });
  });

  // Reset zoom
  const resetZoomButton = document.getElementById("resetZoom");
  resetZoomButton.addEventListener("click", function () {
    svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity);
  });
}

function filterGraphData(data: GraphData, searchTerm: string) {
  if (!searchTerm) {
    return {
      nodes: [],
      links: [],
    };
  }

  const searchTermAsNumber = parseInt(searchTerm);

  const filteredNodes = data.nodes.filter((node) => {
    if (!Number.isNaN(searchTermAsNumber)) {
      if (node.address === searchTermAsNumber) {
        return true;
      }
    }

    return node.label.includes(searchTerm);
  });

  const filteredNodeIDs = new Set(filteredNodes.map((node) => node.id));

  const filteredLinks = data.links.filter(
    (link) =>
      filteredNodeIDs.has(link.source) || filteredNodeIDs.has(link.target)
  );

  return {
    nodes: filteredNodes,
    links: filteredLinks,
  };
}

export function GraphView({ searchInput }: GraphViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { isLoading, data } = useGraphContent();

  const filteredData = useMemo(
    () => filterGraphData(data, searchInput),
    [data, searchInput]
  );

  const updateGraph = () => {
    if (containerRef.current && filteredData) {
      renderGraph(filteredData);
    }
  };

  useLayoutEffect(() => {
    updateGraph();
  }, [isLoading, data]);

  return (
    <div
      id="graphView"
      style={{
        flex: "1 1 auto",
        display: "flex",
      }}
    >
      <div
        id="graphContainer"
        ref={containerRef}
        style={{
          flex: "1 1 auto",
          overflow: "hidden",
        }}
      ></div>
    </div>
  );
}
