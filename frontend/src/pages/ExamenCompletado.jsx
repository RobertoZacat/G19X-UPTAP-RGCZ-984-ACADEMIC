export default function ExamenCompletado() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F6F3] p-6">
      <div className="max-w-[420px] rounded-xl border border-[#DCD9D0] bg-white px-10 py-12 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#2D5F4C] text-[28px] text-white">✓</div>
        <h1 className="mb-3 text-2xl font-semibold text-[#1C1E1B]">¡Examen enviado!</h1>
        <p className="m-0 text-sm leading-6 text-[#5C5B54]">
          Tus respuestas fueron registradas y calificadas correctamente.
          El equipo de reclutamiento revisará tus resultados y se pondrá en contacto contigo.
        </p>
      </div>
    </div>
  );
}