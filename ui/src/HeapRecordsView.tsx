import { useVirtualizer } from "@tanstack/react-virtual";
import { HeapRecord } from "./types";
import { Ref, useRef, useState } from "react";
import { useRecords } from "./hooks";

interface HeapRecordsRowProps {
  heapRecord: HeapRecord;
  index: number;
  innerRef: Ref<HTMLDivElement>;
  start: number;
}

function HeapRecordsRow({ heapRecord, index, innerRef }: HeapRecordsRowProps) {
  const [showPointers, setShowPointers] = useState(false);
  const togglePointers = () => setShowPointers((showPointers) => !showPointers);
  return (
    <div
      className={`row ${heapRecord.RecordType}`}
      data-index={index}
      ref={innerRef}
    >
      {heapRecord.Repr}
      {heapRecord.HasPointers && (
        <>
          <button onClick={togglePointers}>Toggle</button>
          {showPointers ? (
            <div key={heapRecord.RowID} className="pointer-info">
              {heapRecord.Pointers.map((pointer: any) => (
                <p>
                  Pointer({pointer.Index}) at address 0x{pointer.Address}{" "}
                  (incoming = 0x{pointer.Incoming}, outgoing = 0x
                  {pointer.Outgoing})
                </p>
              ))}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

interface HeapRecordsViewProps {}

export function HeapRecordsView({}: HeapRecordsViewProps) {
  const { data } = useRecords();

  const parentRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: data?.total || 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    enabled: !!data,
  });
  const items = rowVirtualizer.getVirtualItems();

  return (
    <div
      ref={parentRef}
      style={{
        flex: "1 1 auto",
        overflowY: "auto",
        contain: "strict",
      }}
    >
      <div
        style={{
          height: rowVirtualizer.getTotalSize(),
          width: "100%",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            transform: `translateY(${items[0]?.start ?? 0}px)`,
          }}
        >
          {items.map((item) =>
            data ? (
              <HeapRecordsRow
                key={item.key}
                index={item.index}
                innerRef={rowVirtualizer.measureElement}
                heapRecord={data.heapRecords[item.index]}
                start={item.start}
              />
            ) : null
          )}
        </div>
      </div>
    </div>
  );
}
