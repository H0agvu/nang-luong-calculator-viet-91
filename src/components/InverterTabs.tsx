
import { FC } from "react";
import { Inverter } from "@/data/solarData";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Edit, Trash2, LayoutList } from "lucide-react";

interface InverterTabsProps {
  inverters: Inverter[];
  onEdit: (idx: number) => void;
  onDelete: (idx: number) => void;
}

const InverterTabs: FC<InverterTabsProps> = ({ inverters, onEdit, onDelete }) => {
  if (inverters.length === 0) {
    return (
      <div className="h-32 flex flex-col justify-center items-center text-gray-500">
        <LayoutList className="w-8 h-8 mb-2" />
        Chưa có dữ liệu inverter nào
      </div>
    );
  }

  return (
    <Tabs defaultValue={inverters[0]?.id} className="w-full">
      <TabsList className="flex max-w-full overflow-x-auto rounded gap-1 bg-blue-50 p-1">
        {inverters.map((inv) => (
          <TabsTrigger
            key={inv.id}
            value={inv.id}
            className="min-w-28"
          >
            {inv.name || "Inverter"}
          </TabsTrigger>
        ))}
      </TabsList>
      {inverters.map((inv, idx) => (
        <TabsContent
          key={inv.id}
          value={inv.id}
          className="mt-0 p-4 bg-white rounded shadow border max-w-md mx-auto"
        >
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-center text-blue-900 font-medium text-lg">
              <LayoutList className="w-5 h-5" />
              Thông tin inverter #{idx + 1}
            </div>
            <ul className="grid gap-2 pt-2 text-sm">
              <li><span className="font-semibold">Tên:</span> {inv.name}</li>
              <li><span className="font-semibold">Công suất:</span> {inv.power} kW</li>
              <li><span className="font-semibold">Hiệu suất:</span> {inv.efficiency}%</li>
              <li><span className="font-semibold">Số MPPT:</span> {inv.mpptCount}</li>
            </ul>
            <div className="flex gap-2 mt-3">
              <button
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded transition"
                onClick={() => onEdit(idx)}
                type="button"
                aria-label="Sửa inverter"
              >
                <Edit className="w-4 h-4" /> Sửa
              </button>
              <button
                className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded transition"
                onClick={() => onDelete(idx)}
                type="button"
                aria-label="Xoá inverter"
              >
                <Trash2 className="w-4 h-4" /> Xoá
              </button>
            </div>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default InverterTabs;

