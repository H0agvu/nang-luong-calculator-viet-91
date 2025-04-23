
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet } from "lucide-react";
import { exportHistoryToExcel } from "@/utils/exportExcel";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

interface CalcHistoryProps {
  history: {
    time: string;
    panelName: string;
    totalPanels: number;
    inverterResult: string;
    dcAcRatio: number;
    inverterWireSummary?: string;
    mainWireSummary?: string;
  }[];
  onExport?: () => void;
}

const CalcHistory = ({ history, onExport }: CalcHistoryProps) => {
  const handleExport = () => {
    exportHistoryToExcel(history);
    if (onExport) onExport();
  };

  return (
    <Card className="mt-4">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <CardTitle>Lịch sử tính toán</CardTitle>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            title="Xuất Excel"
            onClick={handleExport}
            disabled={history.length === 0}
          >
            <FileSpreadsheet className="mr-2" /> Xuất
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="text-gray-500">Chưa có lịch sử.</div>
        ) : (
          <div className="overflow-auto max-w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Thời gian</TableHead>
                  <TableHead>Tấm pin</TableHead>
                  <TableHead className="text-center">Số lượng pin</TableHead>
                  <TableHead>Kết quả inverter</TableHead>
                  <TableHead className="text-center">Tỷ số DC/AC</TableHead>
                  <TableHead>Dây inverter + MCCB</TableHead>
                  <TableHead>Dây tổng + MCCB</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell className="whitespace-nowrap">{item.time}</TableCell>
                    <TableCell>{item.panelName}</TableCell>
                    <TableCell className="text-center">{item.totalPanels}</TableCell>
                    <TableCell>{item.inverterResult}</TableCell>
                    <TableCell className="text-center">
                      {item.dcAcRatio !== undefined && item.dcAcRatio !== null
                        ? item.dcAcRatio.toFixed(2)
                        : ""}
                    </TableCell>
                    <TableCell>
                      {item.inverterWireSummary && item.inverterWireSummary.trim() !== ""
                        ? item.inverterWireSummary
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {item.mainWireSummary && item.mainWireSummary.trim() !== ""
                        ? item.mainWireSummary
                        : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
export default CalcHistory;
