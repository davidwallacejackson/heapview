import { TabTypes } from "./types";

export interface TabsProps {
  activeTab: TabTypes;
  onClickTab: (tab: TabTypes) => void;
  onResetZoom: () => void;
}

export function Tabs({ activeTab, onClickTab, onResetZoom }: TabsProps) {
  return (
    <div id="tabs">
      <button
        id="recordsTab"
        className="tab-button"
        onClick={() => onClickTab("records")}
      >
        Records
      </button>
      <button
        id="graphTab"
        className="tab-button"
        onClick={() => onClickTab("graph")}
      >
        Graph
      </button>
      <input type="text" id="searchInput" placeholder="Search..." />
      {activeTab === "graph" ? (
        <div id="graphControls">
          <button id="resetZoom" onClick={onResetZoom}>
            Reset Zoom
          </button>
        </div>
      ) : null}
    </div>
  );
}
