
import { InverterCombination } from "@/utils/solarCalculations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface InverterSelectionProps {
  totalPower: number;
  inverterPower: number;
  inverterCombination: InverterCombination | null;
  dcAcRatio: number;
}

const InverterSelection = ({
  totalPower,
  inverterPower,
  inverterCombination,
  dcAcRatio
}: InverterSelectionProps) => {
  // Kiểm tra tỷ lệ DC/AC có nằm trong khoảng hợp lệ không
  const isValidRatio = dcAcRatio >= 1.05 && dcAcRatio <= 1.21;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Thông số đầu ra</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium">Tổng công suất dự kiến</div>
            <div className="text-2xl font-bold">{totalPower.toLocaleString()} W</div>
          </div>
          <div>
            <div className="text-sm font-medium">Công suất tìm inverter</div>
            <div className="text-2xl font-bold">{inverterPower.toLocaleString()} W</div>
          </div>
        </div>

        {inverterCombination && inverterCombination.inverters.length > 0 && (
          <>
            <div className="pt-4">
              <div className="text-lg font-medium mb-2">Tổ hợp Inverter tối ưu</div>
              <div className="space-y-2">
                {inverterCombination.inverters.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span>{item.inverter.name} ({item.inverter.power} kW)</span>
                    <span className="font-semibold">{item.count} cái</span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-2">
                  <span className="font-medium">Tổng công suất</span>
                  <span className="font-semibold">{inverterCombination.totalPower} kW</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Sai lệch</span>
                  <span className="font-semibold">{(inverterCombination.deviation * 100).toFixed(2)}%</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <div className="text-lg font-medium mb-2">Tỷ số DC/AC</div>
              <div className="text-2xl font-bold mb-1">{dcAcRatio.toFixed(2)}</div>
              <Progress 
                value={((dcAcRatio - 1) / 0.25) * 100} 
                className="h-2" 
              />
              <div className="flex justify-between mt-1 text-sm">
                <span>1.0</span>
                <span className={`${isValidRatio ? 'text-green-600 font-medium' : 'text-gray-600'}`}>
                  {isValidRatio ? '✓ Hợp lệ (1.05-1.21)' : 'Ngoài phạm vi'}
                </span>
                <span>1.25</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default InverterSelection;
