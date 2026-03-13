export default function SierpinskySettings({ setSize, setDepth }) {
  return (
    <>
      <div className="canvas-settings">
        <div className="">
          <label htmlFor="depth">Depth:</label>
          <input
            id="depth"
            type="number"
            defaultValue={4}
            onChange={(e) => {
              setDepth(Number(e.target.value));
            }}
          />
        </div>
        <div className="">
          <label htmlFor="depth">Size:</label>
          <input
            id="depth"
            type="number"
            defaultValue={400}
            step={10}
            onChange={(e) => {
              setSize(Number(e.target.value));
            }}
          />
        </div>
      </div>
    </>
  );
}
