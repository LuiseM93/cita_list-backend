import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full py-stack-gap-lg px-edge-margin mt-stack-gap-lg flex flex-col items-center gap-stack-gap-sm max-w-container-max-width mx-auto bg-surface-container-low rounded-t-xl">
      <span className="text-headline-sm font-headline-sm text-on-surface">citalist</span>
      <p className="font-body-md text-body-md text-on-surface-variant text-center text-xs mt-2 max-w-xs">Tus datos están seguros. No guardamos información en servidores; todo se almacena localmente en tu celular.</p>
      <div className="flex flex-wrap justify-center gap-4 mt-2">
        <Link href="/calculadora-citas-perdidas" className="font-label-caps text-label-caps text-secondary hover:text-primary transition-colors opacity-90 hover:opacity-100 uppercase">Calculadora</Link>
        <Link href="/legal#privacidad" className="font-label-caps text-label-caps text-secondary hover:text-primary transition-colors opacity-90 hover:opacity-100 uppercase">Privacidad</Link>
        <Link href="/legal#terminos" className="font-label-caps text-label-caps text-secondary hover:text-primary transition-colors opacity-90 hover:opacity-100 uppercase">Términos</Link>
        <a href="/#premium" className="font-label-caps text-label-caps text-secondary hover:text-primary transition-colors opacity-90 hover:opacity-100 uppercase">Premium</a>
      </div>
      <p className="font-body-md text-body-md text-on-surface-variant text-center text-xs mt-4">© 2026 citalist. Hecho para negocios en México.</p>
    </footer>
  );
}
