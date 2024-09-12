import "./App.css";
import { GraphView } from "./GraphView";
import { HeapRecordsView } from "./HeapRecordsView";
import { Sidebar } from "./Sidebar";
import { Tabs } from "./Tabs";

function App() {
  return (
    <>
      <header>
        <h1>HeapView</h1>
        <p>a heap dump viewer for Go heap dumps</p>
      </header>

      <Sidebar />

      <Tabs />
      <div id="content">
        <HeapRecordsView />
        <GraphView />
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
