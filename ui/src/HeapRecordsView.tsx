import { HeapRecord } from "./types";

function toggleRow(rowId: string) {
  var row = document.getElementById(rowId);
  var pointerInfo = document
    .getElementById(rowId)
    .querySelector(".pointer-info");
  if (row.style.display === "none") {
    row.style.display = "block";
    pointerInfo.style.display = "block";
  } else {
    row.style.display = "none";
    pointerInfo.style.display = "none";
  }
}

interface HeapRecordsViewProps {
  heapRecords: HeapRecord[];
}

export function HeapRecordsView({ heapRecords }: HeapRecordsViewProps) {
  return (
    <div id="recordsView">
      {heapRecords.map((heapRecord) => (
        <div className={`row ${heapRecord.RecordType}`}>
          {heapRecord.Repr}
          {heapRecord.HasPointers && (
            <>
              <button onClick={() => toggleRow(heapRecord.RowID)}>
                Toggle
              </button>
              <div
                id={heapRecord.RowID}
                className="pointer-info"
                style={{ display: "none" }}
              >
                {heapRecord.Pointers.map((pointer) => (
                  <p>
                    Pointer({pointer.Index}) at address 0x{pointer.Address}{" "}
                    (incoming = 0x{pointer.Incoming}, outgoing = 0x
                    {pointer.Outgoing})
                  </p>
                ))}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
