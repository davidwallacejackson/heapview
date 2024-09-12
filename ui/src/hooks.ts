import { HeapRecordInfoResponse, HeapRecordsResponse } from "./types";
import useSWRImmutable from "swr/immutable";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useRecords = () => {
  return useSWRImmutable<HeapRecordsResponse>("/api/records", fetcher);
};

export const useRecordInfo = () => {
  return useSWRImmutable<HeapRecordInfoResponse>("/api/record-info", fetcher);
};

export const useGraphContent = () => {
  return useSWRImmutable("/api/graph", fetcher);
};
