import { TableRow, TableCell } from "@heroui/react";
import React from "react";
<TableRow>
  {(col) => {
    return <TableCell>{col as any}</TableCell>;
  }}
</TableRow>;
