
import { useState } from "react";
import { Inverter } from "@/data/solarData";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListCheck, LayoutList } from "lucide-react";

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
          <div className="flex flex-wrap gap-4 overflow-x-auto pb-1.5">
            {inverters.length === 0 && (
              <div className="w-full text-center text-gray-500 py-2 bg-white border rounded shadow-sm">
                Chưa có dữ liệu inverter nào
              </div>
            )}
            {inverters.map((inv, idx) => (
              <div
                key={inv.id}
                className="min-w-[210px] max-w-xs bg-white border border-gray-200 rounded-lg shadow-sm p-4 relative group hover:shadow-lg transition-shadow duration-200 animate-fade-in"
              >
                <div className="flex justify-between mb-2 items-center">
                  <span className="font-semibold text-blue-800">{inv.name}</span>
                  <span className="text-xs text-gray-400">{inv.power}kW</span>
                </div>
                <div className="flex flex-col gap-0.5 text-sm mb-3">
                  <div>
                    <span className="text-gray-500">Hiệu suất:</span>{" "}
                    <span className="font-medium">{inv.efficiency}%</span>
                  </div>
                  <div>
                    <span className="text-gray-500">MPPT:</span>{" "}
                    <span className="font-medium">{inv.mpptCount}</span>
                  </div>
                </div>
                <div className="flex gap-2 absolute top-3 right-3 opacity-60 group-hover:opacity-100 transition-opacity">
                  <button
                    className="hover:scale-110 transition text-blue-600"
                    title="Sửa"
                    onClick={() => startEdit(idx)}
                    type="button"
                  >
                    <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z" /></svg>
                  </button>
                  <button
                    className="hover:scale-110 transition text-red-600"
                    title="Xoá"
                    onClick={() => removeInverter(idx)}
                    type="button"
                  >
                    <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InverterDataInput;
