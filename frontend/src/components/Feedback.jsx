import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

const FeedbackContext = createContext(null);

const COLOR_BORDE_TOAST = {
  error: "border-l-[color:var(--error)]",
  exito: "border-l-[color:var(--accent)]",
  info: "border-l-[color:var(--ink-soft)]",
};

export function FeedbackProvider({ children }) {
  const [dialogo, setDialogo] = useState(null);
  const [toasts, setToasts] = useState([]);
  const resolverRef = useRef(null);
  const idRef = useRef(0);
  const botonCancelarRef = useRef(null);

  const confirmar = useCallback((opciones) => {
    return new Promise((resolve) => {
      resolverRef.current = resolve;
      setDialogo(opciones);
    });
  }, []);

  const cerrar = useCallback((resultado) => {
    if (resolverRef.current) resolverRef.current(resultado);
    resolverRef.current = null;
    setDialogo(null);
  }, []);

  const quitarToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const avisar = useCallback(
    (mensaje, tipo = "info") => {
      const id = ++idRef.current;
      setToasts((prev) => [...prev, { id, mensaje, tipo }]);
      setTimeout(() => quitarToast(id), tipo === "error" ? 7000 : 4500);
    },
    [quitarToast]
  );

  useEffect(() => {
    if (!dialogo) return;
    function onKey(e) {
      if (e.key === "Escape") cerrar(false);
    }
    window.addEventListener("keydown", onKey);
    botonCancelarRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [dialogo, cerrar]);

  return (
    <FeedbackContext.Provider value={{ confirmar, avisar }}>
      {children}

      {dialogo && (
        <div
          className="fb-overlay fixed inset-0 z-[1000] flex items-center justify-center bg-[rgba(28,30,27,0.45)] p-6"
          onClick={() => cerrar(false)}
        >
          <div
            className="fb-dialogo w-full max-w-[420px] rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-7 shadow-[0_20px_50px_rgba(0,0,0,0.2)]"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="fb-titulo"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={
                "mb-4 flex h-11 w-11 items-center justify-center rounded-full text-[22px] font-bold " +
                (dialogo.peligro
                  ? "bg-[#FBEAE5] text-[color:var(--error)]"
                  : "bg-[#EAF1EE] text-[color:var(--accent)]")
              }
            >
              {dialogo.peligro ? "!" : "?"}
            </div>

            <h2 id="fb-titulo" className="mb-2 text-lg font-semibold text-[color:var(--ink)]">
              {dialogo.titulo || "Confirmar"}
            </h2>
            <p className="mb-6 text-sm leading-relaxed text-[color:var(--ink-soft)]">
              {dialogo.mensaje}
            </p>

            <div className="flex justify-end gap-2.5">
              <button
                ref={botonCancelarRef}
                onClick={() => cerrar(false)}
                className="cursor-pointer rounded-lg border border-[color:var(--border)] bg-transparent px-[18px] py-2.5 text-sm font-semibold text-[color:var(--ink)] hover:bg-black/5"
              >
                {dialogo.textoCancelar || "Cancelar"}
              </button>
              <button
                onClick={() => cerrar(true)}
                className={
                  "cursor-pointer rounded-lg border-0 px-[18px] py-2.5 text-sm font-semibold text-white " +
                  (dialogo.peligro
                    ? "bg-[color:var(--error)] hover:brightness-90"
                    : "bg-[color:var(--accent)] hover:bg-[color:var(--accent-hover)]")
                }
              >
                {dialogo.textoConfirmar || "Aceptar"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed right-5 top-5 z-[1100] flex flex-col gap-2.5" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={
              "fb-toast flex min-w-[260px] max-w-[380px] items-start justify-between gap-3 rounded-[10px] border border-l-4 border-[color:var(--border)] bg-[color:var(--surface)] py-3 pl-4 pr-3.5 shadow-[0_8px_24px_rgba(0,0,0,0.12)] " +
              COLOR_BORDE_TOAST[t.tipo]
            }
          >
            <span className="text-sm leading-snug text-[color:var(--ink)]">{t.mensaje}</span>
            <button
              onClick={() => quitarToast(t.id)}
              aria-label="Cerrar aviso"
              className="cursor-pointer border-0 bg-transparent p-0 text-xl leading-none text-[color:var(--ink-soft)] hover:text-[color:var(--ink)]"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </FeedbackContext.Provider>
  );
}

export function useConfirm() {
  return useContext(FeedbackContext).confirmar;
}

export function useToast() {
  return useContext(FeedbackContext).avisar;
}