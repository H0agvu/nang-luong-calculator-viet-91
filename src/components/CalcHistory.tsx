
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

interface CalcHistoryProps {
  history: {
    time: string;
    panelName: string;
    totalPanels: number;
    strings: number;
    inverterResult: string;
    dcAcRatio: number;
  }[];
}

const CalcHistory = ({ history }: CalcHistoryProps) => {
  if (history.length === 0) {
    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Lịch sử tính toán</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-gray-500">Chưa có lịch sử.</div>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Lịch sử tính toán</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-auto max-w-full">
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="p-2 border-b">Thời gian</th>
                <th className="p-2 border-b">Tấm pin</th>
                <th className="p-2 border-b">Số lượng pin</th>
                <th className="p-2 border-b">String</th>
                <th className="p-2 border-b">Kết quả inverter</th>
                <th className="p-2 border-b">Tỷ số DC/AC</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, i) => (
                <tr key={i}>
                  <td className="p-2 border-b whitespace-nowrap">{item.time}</td>
                  <td className="p-2 border-b">{item.panelName}</td>
                  <td className="p-2 border-b text-center">{item.totalPanels}</td>
                  <td className="p-2 border-b text-center">{item.strings}</td>
                  <td className="p-2 border-b">{item.inverterResult}</td>
                  <td className="p-2 border-b text-center">
                    {item.dcAcRatio.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
export default CalcHistory;
