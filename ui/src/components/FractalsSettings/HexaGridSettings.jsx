import SettingsInput from "../SettingsInput";

export default function HexaGridSettings({
  defaultParams,
  updateFractalParam,
  index,
}) {
  return (
    <>
    <h3 className="title">HexaGrid fractal settings</h3>
      <div className="canvas-settings">
        <SettingsInput
          label="Side Length:"
          type="number"
          defaultValue={defaultParams?.sideLength}
          id="side-length"
          step={10}
          onChange={(e) =>
            updateFractalParam(index, "sideLength", Number(e.target.value))
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
