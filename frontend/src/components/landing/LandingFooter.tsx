import Image from "next/image";

/** Footer minimalista, sem navegação — só identidade e direitos autorais, tudo centralizado. */
export function LandingFooter() {
  const ano = new Date().getFullYear();

  return (
    <footer className="bg-white">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-3 px-4 py-12 text-center sm:px-6">
        <div className="flex items-center gap-2">
          <Image src="/brand/beautyflow-icon.png" alt="BeautyFlow" width={30} height={30} className="h-6 w-6" />
          <span className="font-serif text-sm font-semibold">
            <span className="text-bf-heading">Beauty</span>
            <span className="text-bf-rose">Flow</span>
          </span>
        </div>
        <p className="text-sm text-bf-text-muted">
          Tecnologia para simplificar a rotina de quem faz a beleza acontecer.
        </p>
        <p className="text-xs text-bf-text-muted">© {ano} BeautyFlow. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
