import { HeapRecordType } from "./types";

interface SidebarProps {
  heapRecordTypes: HeapRecordType[];
}
export function Sidebar({ heapRecordTypes: recordTypes }: SidebarProps) {
  return (
    <div id="sidebar">
      {recordTypes.map((recordType) => (
        <div className="record-type" data-type={recordType.RecordType}>
          {recordType.RecordTypeStr}
        </div>
      ))}
    </div>
  );
}
