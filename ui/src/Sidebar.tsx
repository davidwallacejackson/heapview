import { useRecordInfo } from "./hooks";

interface SidebarProps {}
export function Sidebar({}: SidebarProps) {
  const { data } = useRecordInfo();
  return (
    <div id="sidebar">
      {data?.heapRecordTypes.map((recordType) => (
        <div
          className="record-type"
          data-type={recordType.heapRecordType}
          key={recordType.heapRecordType}
        >
          {recordType.heapRecordTypeStr}
        </div>
      ))}
    </div>
  );
}
