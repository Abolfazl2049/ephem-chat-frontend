import React from "react";

export default function DataTemplate({
  isFetched,
  data,
  children,
  emptyTemplate = <div>not found</div>,
  loadingTemplate = <div>loading</div>,
}: {
  isFetched: boolean;
  data: any;
  children: React.ReactNode;
  loadingTemplate?: React.ReactNode;
  emptyTemplate?: React.ReactNode;
}) {
  const isDataArray = Array.isArray(data);
  if ((isDataArray && data.length) || (!isDataArray && data)) return <>{children}</>;
  else if (isFetched) return <>{emptyTemplate}</>;
  else return <>{loadingTemplate}</>;
}
