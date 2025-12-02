export default function AnkletSettings() {
  return (
    <>
      <div className="canvas-settings">
        <div className="">
          <label htmlFor="depth">Depth:</label>
          <input id="depth" type="number" defaultValue={4} />
        </div>
        <div className="">
          <label htmlFor="depth">Line length:</label>
          <input id="depth" type="number" defaultValue={10} />
        </div>
        <div className="">
          <label htmlFor="depth">Square side:</label>
          <input id="depth" type="number" defaultValue={10} />
        </div>
      </div>
    </>
  );
}
