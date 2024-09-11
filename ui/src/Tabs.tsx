export interface TabsProps {}

export function Tabs(props: TabsProps) {
  return (
    <div id="tabs">
      <button id="recordsTab" className="tab-button">
        Records
      </button>
      <button id="graphTab" className="tab-button">
        Graph
      </button>
      <input type="text" id="searchInput" placeholder="Search..." />
      <div id="graphControls" style={{ display: "none" }}>
        <button id="resetZoom">Reset Zoom</button>
      </div>
    </div>
  );
}
