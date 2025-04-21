
import { useState } from "react";
import { Inverter } from "@/data/solarData";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InverterDataInputProps {
  value: Inverter[];
  onChange: (data: Inverter[]) => void;
}

const defaultInverter = {
  id: "",
  name: "",
  power: 0,
  efficiency: 0,
  mpptCount: 0,
};

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
  }

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
        <CardTitle className="text-lg">Nhập dữ liệu Inverter</CardTitle>
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
          <div className="font-semibold mb-1">Danh sách inverter</div>
          <div className="overflow-auto max-h-56">
            <table className="w-full text-sm border border-gray-200 rounded">
              <thead>
                <tr>
                  <th className="font-semibold border px-2 py-1">Tên</th>
                  <th className="font-semibold border px-2 py-1">Công suất (kW)</th>
                  <th className="font-semibold border px-2 py-1">Hiệu suất (%)</th>
                  <th className="font-semibold border px-2 py-1">Số MPPT</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {inverters.map((inv, idx) => (
                  <tr key={inv.id}>
                    <td className="border px-2">{inv.name}</td>
                    <td className="border px-2">{inv.power}</td>
                    <td className="border px-2">{inv.efficiency}</td>
                    <td className="border px-2">{inv.mpptCount}</td>
                    <td className="border px-2">
                      <button className="text-blue-600 pr-2" onClick={() => startEdit(idx)}>Sửa</button>
                      <button className="text-red-600" onClick={() => removeInverter(idx)}>Xoá</button>
                    </td>
                  </tr>
                ))}
                {inverters.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center text-gray-500 py-2">Chưa có dữ liệu inverter nào</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InverterDataInput;

