
import { useState } from "react";
import { Inverter } from "@/data/solarData";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListCheck, LayoutList, Edit, Trash2 } from "lucide-react";

const defaultInverter = {
  id: "",
  name: "",
  power: 0,
  efficiency: 0,
  mpptCount: 0,
};

interface InverterDataInputProps {
  value: Inverter[];
  onChange: (data: Inverter[]) => void;
}

const InverterDataInput = ({ value, onChange }: InverterDataInputProps) => {
  const [inverters, setInverters] = useState<Inverter[]>(value);
  const [edit, setEdit] = useState<Partial<Inverter>>(defaultInverter);
  const [isEditing, setIsEditing] = useState<null | number>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEdit({
      ...edit,
      [e.target.name]: e.target.value,
    });
  };

  const addInverter = () => {
    if (!edit.name || !edit.power) return;
    const newInverter = {
      id: `${edit.name}-${edit.power}`,
      name: edit.name!,
      power: Number(edit.power),
      efficiency: Number(edit.efficiency) || 0,
      mpptCount: Number(edit.mpptCount) || 0,
    };
    const newList = [...inverters, newInverter];
    setInverters(newList);
    setEdit(defaultInverter);
    onChange(newList);
  };

  const removeInverter = (index: number) => {
    const newList = [...inverters];
    newList.splice(index, 1);
    setInverters(newList);
    onChange(newList);
  };

  const startEdit = (idx: number) => {
    setIsEditing(idx);
    setEdit(inverters[idx]);
  };

  const cancelEdit = () => {
    setEdit(defaultInverter);
    setIsEditing(null);
  };

  const saveEdit = () => {
    if (isEditing === null) return;
    const updated: Inverter = {
      id: `${edit.name}-${edit.power}`,
      name: edit.name!,
      power: Number(edit.power),
      efficiency: Number(edit.efficiency) || 0,
      mpptCount: Number(edit.mpptCount) || 0,
    };
    const newList = [...inverters];
    newList[isEditing] = updated;
    setInverters(newList);
    setIsEditing(null);
    setEdit(defaultInverter);
    onChange(newList);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg flex gap-2 items-center">
          <LayoutList className="w-5 h-5 text-blue-500" />
          Nhập dữ liệu Inverter
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={e => {
            e.preventDefault();
            isEditing !== null ? saveEdit() : addInverter();
          }}
          className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-4"
        >
          <div>
            <Label htmlFor="name">Tên inverter</Label>
            <Input id="name" name="name" value={edit.name || ""} onChange={handleChange} placeholder="VD: Solis 100" required />
          </div>
          <div>
            <Label htmlFor="power">Công suất (kW)</Label>
            <Input id="power" name="power" value={edit.power || ""} onChange={handleChange} type="number" min="0" required />
          </div>
          <div>
            <Label htmlFor="efficiency">Hiệu suất (%)</Label>
            <Input id="efficiency" name="efficiency" value={edit.efficiency || ""} onChange={handleChange} type="number" min="0" max="100" />
          </div>
          <div>
            <Label htmlFor="mpptCount">Số MPPT</Label>
            <Input id="mpptCount" name="mpptCount" value={edit.mpptCount || ""} onChange={handleChange} type="number" min="0" />
          </div>
          <div className="flex flex-col-reverse md:flex-row items-end md:items-center gap-2 mt-2 md:mt-6">
            {isEditing === null ? (
              <button type="submit" className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Thêm</button>
            ) : (
              <>
                <button type="button" className="px-3 py-2 bg-gray-400 text-white rounded hover:bg-gray-500" onClick={cancelEdit}>Huỷ</button>
                <button type="submit" className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Cập nhật</button>
              </>
            )}
          </div>
        </form>

        <div>
          <div className="font-semibold mb-2 flex gap-2 items-center">
            <ListCheck className="w-4 h-4 text-green-600" />
            Danh sách inverter
          </div>
          <div className="overflow-x-auto bg-white rounded shadow-sm border">
            <table className="min-w-full table-auto text-sm [&>thead>tr]:bg-blue-50 [&>thead>tr]:text-blue-800 animate-fade-in">
              <thead>
                <tr>
                  <th className="py-2 px-3 font-semibold">#</th>
                  <th className="py-2 px-3 font-semibold text-left">Tên inverter</th>
                  <th className="py-2 px-3 font-semibold">Công suất (kW)</th>
                  <th className="py-2 px-3 font-semibold">Hiệu suất (%)</th>
                  <th className="py-2 px-3 font-semibold">MPPT</th>
                  <th className="py-2 px-3 font-semibold">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {inverters.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center text-gray-500 py-3">
                      Chưa có dữ liệu inverter nào
                    </td>
                  </tr>
                )}
                {inverters.map((inv, idx) => (
                  <tr
                    key={inv.id}
                    className="border-t hover:bg-blue-50 transition animate-fade-in"
                  >
                    <td className="py-2 px-3 text-center">{idx + 1}</td>
                    <td className="py-2 px-3 font-medium">{inv.name}</td>
                    <td className="py-2 px-3 text-center">{inv.power}</td>
                    <td className="py-2 px-3 text-center">{inv.efficiency}%</td>
                    <td className="py-2 px-3 text-center">{inv.mpptCount}</td>
                    <td className="py-2 px-3 flex gap-3 justify-center">
                      <button
                        className="hover-scale text-blue-600"
                        title="Sửa"
                        onClick={() => startEdit(idx)}
                        type="button"
                        aria-label="Sửa inverter"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        className="hover-scale text-red-600"
                        title="Xoá"
                        onClick={() => removeInverter(idx)}
                        type="button"
                        aria-label="Xoá inverter"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InverterDataInput;

