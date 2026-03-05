import { useEffect } from "react";
import { useState } from "react";

export default function Console() {
  const [show, setShow] = useState(true);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const es = new EventSource(
      "http://localhost:4001/api/pipeline/logs/stream",
    );

    es.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      setLogs((prev) => [...prev, msg]);
    };

    return () => es.close();
  }, []);

  return (
    <>
      <button onClick={() => setShow(!show)} style={{ width: "100%" }}>
        Toggle console
      </button>
      <div className="console">
        {show
          ? logs.map((el) => {
              return (
                <>
                  <p style={{ color: el.type === "error" ? "red" : "black" }}>
                    <span style={{ color: "gray" }}>
                      {new Date(el.at).toLocaleTimeString()}
                    </span>
                    {el.step}
                  </p>
                </>
              );
            })
          : null}
      </div>
    </>
  );
}
