import SettingsInput from "../SettingsInput";

export default function IslamicGridSettings({
  defaultParams,
  updateFractalParam,
  index,
}) {
  return (
    <>
    <h3 className="title">IslamicGrid fractal settings</h3>
      <div className="canvas-settings">
        <SettingsInput
          label="Size:"
          type="number"
          defaultValue={defaultParams?.size}
          id="size"
          onChange={(e) =>
            updateFractalParam(index, "size", Number(e.target.value))
          }
        />

        <SettingsInput
          label="Rows:"
          type="number"
          defaultValue={defaultParams?.rows}
          id="rows"
          onChange={(e) =>
            updateFractalParam(index, "rows", Number(e.target.value))
          }
        />

        <SettingsInput
          label="Cols:"
          type="number"
          defaultValue={defaultParams?.cols}
          id="cols"
          onChange={(e) =>
            updateFractalParam(index, "cols", Number(e.target.value))
          }
        />
      </div>
    </>
  );
}
