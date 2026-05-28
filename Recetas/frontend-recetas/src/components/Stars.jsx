export default function Stars({ value = 0, onChange, readOnly = false }) {
    const rounded = value ? Math.round(value * 10) / 10 : 0;

    return (
        <div className="stars">
            {[1, 2, 3, 4, 5].map((n) => (
                <button
                    key={n}
                    className={`star ${n <= value ? "on" : ""}`}
                    onClick={() => !readOnly && onChange?.(n)}
                    disabled={readOnly}
                    title={`${n} estrella(s)`}
                >
                    ★
                </button>
            ))}
            <span className="stars-meta">{readOnly ? `(${rounded})` : ""}</span>
        </div>
    );
}

