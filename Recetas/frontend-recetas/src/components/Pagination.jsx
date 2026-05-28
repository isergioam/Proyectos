export default function Pagination({ page, totalPages, onPage }) {
    return (
        <div className="pagination">
            <button disabled={page <= 1} onClick={() => onPage(page - 1)}>
                ◀
            </button>
            <span>
                Página <b>{page}</b> / {totalPages}
            </span>
            <button disabled={page >= totalPages} onClick={() => onPage(page + 1)}>
                ▶
            </button>
        </div>
    );
}
