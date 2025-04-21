
import { InverterCombination } from "@/utils/solarCalculations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface InverterSelectionProps {
  totalPower: number;
  inverterPower: number;
  inverterCombination: InverterCombination | null;
  dcAcRatio: number;
  strings: number; // nhận tổng số lượng string từ props
}

const InverterSelection = ({
  totalPower,
  inverterPower,
  inverterCombination,
  dcAcRatio,
  strings,
}: InverterSelectionProps) => {
  // Kiểm tra tỷ lệ DC/AC có nằm trong khoảng hợp lệ không
  const isValidRatio = dcAcRatio >= 1.05 && dcAcRatio <= 1.21;

  // Tính tổng số MPPT có được từ tổ hợp inverter
  const totalMppt =
    inverterCombination?.inverters.reduce(
      (sum, item) => sum + (item.inverter.mpptCount ?? 0) * item.count,
      0
    ) || 0;

  // So sánh tổng số string với tổng số mppt
  const isStringOverMppt = strings > totalMppt;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Thông số đầu ra
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium">Tổng công suất dự kiến</div>
            <div className="text-2xl font-bold">
              {totalPower.toLocaleString()} W
            </div>
          </div>
          <div>
            <div className="text-sm font-medium">Công suất tìm inverter</div>
            <div className="text-2xl font-bold">
              {inverterPower.toLocaleString()} W
            </div>
          </div>
        </div>

        {inverterCombination && inverterCombination.inverters.length > 0 && (
          <>
            <div className="pt-4">
              <div className="text-lg font-medium mb-2">
                Tổ hợp Inverter tối ưu
              </div>
              <div className="space-y-2">
                {inverterCombination.inverters.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <span>
                      {item.inverter.name} ({item.inverter.power} kW)
                    </span>
                    <span className="font-semibold">{item.count} cái</span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-2">
                  <span className="font-medium">Tổng công suất</span>
                  <span className="font-semibold">
                    {inverterCombination.totalPower} kW
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Sai lệch</span>
                  <span className="font-semibold">
                    {(inverterCombination.deviation * 100).toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
            {/* THÔNG SỐ MPPT */}
            <div className="pt-2">
              <div className="text-lg font-medium mb-2">Tổng số cổng MPPT</div>
              <div className="flex items-center gap-2 text-2xl font-bold mb-1">
                {totalMppt}
                <span className="text-base font-medium text-gray-500">
                  cổng
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Số string yêu cầu</span>
                <span
                  className={
                    isStringOverMppt
                      ? "text-red-600 font-bold"
                      : "text-green-600 font-semibold"
                  }
                >
                  {strings}{" "}
                  {isStringOverMppt
                    ? "(VƯỢT số cổng MPPT! Chia lại hoặc tối ưu thiết kế)"
                    : "≤ tổng MPPT (Hợp lệ)"}
                </span>
              </div>
            </div>
            {/* DC/AC Ratio */}
            <div className="pt-2">
              <div className="text-lg font-medium mb-2">Tỷ số DC/AC</div>
              <div className={`text-2xl font-bold mb-1 ${isValidRatio ? "" : "text-red-600"}`}>
                {dcAcRatio.toFixed(2)}
              </div>
              <Progress value={((dcAcRatio - 1) / 0.25) * 100} className="h-2" />
              <div className="flex justify-between mt-1 text-sm">
                <span>1.0</span>
                <span
                  className={
                    isValidRatio
                      ? "text-green-600 font-medium"
                      : "text-red-600 font-semibold"
                  }
                >
                  {isValidRatio
                    ? "✓ Hợp lệ (1.05-1.21)"
                    : "Tỷ số DC/AC ngoài phạm vi cho phép (1.05-1.21)"}
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

