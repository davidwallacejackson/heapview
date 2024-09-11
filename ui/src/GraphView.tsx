interface GraphViewProps {}

export function GraphView(props: GraphViewProps) {
  return (
    <div id="graphView" style={{ display: "none" }}>
      <div id="graphContainer"></div>
    </div>
  );
}
