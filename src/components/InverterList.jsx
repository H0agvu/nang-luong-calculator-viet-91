
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Edit, Trash2, List } from "lucide-react";

const InverterList = ({ inverters, onEdit, onDelete }) => {
  if (inverters.length === 0) {
    return (
      <div className="h-32 flex flex-col justify-center items-center text-gray-500">
        <List className="w-8 h-8 mb-2" />
        Chưa có dữ liệu inverter nào
      </div>
    );
  }

  return (
    <div className="overflow-auto max-w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>STT</TableHead>
            <TableHead>Tên</TableHead>
            <TableHead>Công suất (kW)</TableHead>
            <TableHead>Hiệu suất (%)</TableHead>
            <TableHead>Số MPPT</TableHead>
            {(onEdit || onDelete) && <TableHead>Hành động</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {inverters.map((inv, idx) => (
            <TableRow key={inv.id}>
              <TableCell>{idx + 1}</TableCell>
              <TableCell>{inv.name}</TableCell>
              <TableCell>{inv.power}</TableCell>
              <TableCell>{inv.efficiency}</TableCell>
              <TableCell>{inv.mpptCount}</TableCell>
              {(onEdit || onDelete) &&
                <TableCell>
                  <div className="flex gap-2">
                    {onEdit && (
                      <button
                        className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded transition text-xs"
                        onClick={() => onEdit(idx)}
                        type="button"
                        aria-label="Sửa inverter"
                      >
                        <Edit className="w-4 h-4" /> Sửa
                      </button>
                    )}
                    {onDelete && (
                      <button
                        className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded transition text-xs"
                        onClick={() => onDelete(idx)}
                        type="button"
                        aria-label="Xoá inverter"
                      >
                        <Trash2 className="w-4 h-4" /> Xoá
                      </button>
                    )}
                  </div>
                </TableCell>
              }
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default InverterList;
