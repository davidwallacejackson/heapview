export interface PointerData {
  Index: number;
  Address: string;
  Incoming: string;
  Outgoing: string;
}

export interface HeapRecord {
  RowID: number;
  RecordType: string;
  Repr: string;
  HasPointers: boolean;
  Pointers: PointerData[];
}
export interface HeapRecordsResponse {
  heapRecords: HeapRecord[];
  total: number;
  cursor: number;
}

export interface HeapRecordInfoResponse {
  heapRecordTypes: HeapRecordInfo[];
}
export interface HeapRecordInfo {
  heapRecordType: string;
  heapRecordTypeStr: string;
}
