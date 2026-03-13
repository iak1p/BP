import { useEffect } from "react";
import { useState } from "react";

export default function Console() {
  const [show, setShow] = useState(false);
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
      <h3 className="title">
        Console <button onClick={() => setShow(!show)}>Toggle console</button>
      </h3>

      {show && (
        <div className="console">
          {logs.length === 0 ? (
            <p style={{ color: "gray" }}>No logs yet...</p>
          ) : (
            logs.map((el, index) => (
              <p
                style={{ color: el.type === "error" ? "red" : "black" }}
                key={index}
              >
                <span style={{ color: "gray" }}>
                  {el.at ? new Date(el.at).toLocaleTimeString() : ""}
                </span>
                {el.step}
              </p>
            ))
          )}
        </div>
      )}
    </>
  );
}
