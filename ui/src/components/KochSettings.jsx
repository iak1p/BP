import SettingsInput from "./SettingsInput";

export default function KochSettings({
  setDepth,
  setSize,
  setSides,
  usecase,
  updateFractalParam,
  index
}) {
  return (
    <>
      <div className="canvas-settings">
        <SettingsInput
          label="Depth:"
          type="number"
          defaultValue={4}
          id="depth"
          // onChange={(e) => setDepth(Number(e.target.value))}
          onChange={(e) => updateFractalParam(index, "depth", Number(e.target.value))}
        />

        <SettingsInput
          label="Size:"
          type="number"
          defaultValue={usecase?.size}
          id="size"
          step={10}
          onChange={(e) => setSize(Number(e.target.value))}
        />

        <SettingsInput
          label="Sides:"
          type="number"
          defaultValue={usecase?.sides}
          id="sides"
          onChange={(e) => setSides(Number(e.target.value))}
        />
      </div>
    </>
  );
}
