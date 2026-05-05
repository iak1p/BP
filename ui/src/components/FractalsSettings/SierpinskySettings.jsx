import SettingsInput from "../SettingsInput";

export default function SierpinskySettings({
  defaultParams,
  updateFractalParam,
  index,
}) {
  return (
    <>
      <h3 className="title">Sierpinsky fractal settings</h3>
      <div className="canvas-settings">
        <SettingsInput
          label="Depth:"
          type="number"
          defaultValue={defaultParams?.depth}
          id="depth"
          onChange={(e) =>
            updateFractalParam(index, "depth", Number(e.target.value))
          }
        />

        <SettingsInput
          label="Size:"
          type="number"
          defaultValue={defaultParams?.size}
          id="size"
          step={10}
          onChange={(e) =>
            updateFractalParam(index, "size", Number(e.target.value))
          }
        />
      </div>
    </>
  );
}
