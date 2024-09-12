import { useState } from "react";
import "./App.css";
import { GraphView } from "./GraphView";
import { HeapRecordsView } from "./HeapRecordsView";
import { Sidebar } from "./Sidebar";
import { Tabs } from "./Tabs";
import { TabTypes } from "./types";

function App() {
  const [activeTab, setActiveTab] = useState<TabTypes>("records");
  return (
    <>
      <header>
        <h1>HeapView</h1>
        <p>a heap dump viewer for Go heap dumps</p>
      </header>

      <Sidebar />

      <Tabs
        activeTab={activeTab}
        onClickTab={setActiveTab}
        onResetZoom={() => {}}
      />

      <div id="content">
        {activeTab === "records" ? <HeapRecordsView /> : <GraphView />}
      </div>

      <footer>
        <p>
          Source code:{" "}
          <a href="https://github.com/davidwallacejackson/heapview">
            https://github.com/davidwallacejackson/heapview
          </a>
        </p>
      </footer>
    </>
  );
}

export default App;
