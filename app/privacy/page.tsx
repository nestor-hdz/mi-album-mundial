import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacidad y Términos – Mi Álbum Mundial 2026",
  description: "Política de privacidad y términos de uso de Mi Álbum Mundial 2026.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 px-4 py-10">
      <div className="max-w-xl mx-auto">
        <Link
          href="/album"
          className="text-xs text-slate-500 hover:text-slate-300 mb-8 inline-block transition-colors"
        >
          ← Volver al álbum
        </Link>

        <div className="text-xs font-bold tracking-widest text-amber-400 uppercase mb-2">
          FIFA WORLD CUP 2026
        </div>
        <h1 className="text-2xl font-extrabold text-slate-100 mb-1">Privacidad y Términos</h1>
        <p className="text-xs text-slate-500 mb-10">Última actualización: mayo 2026</p>

        <Section title="1. Qué datos recopilamos">
          <p>
            Solo recopilamos tu <strong>dirección de correo electrónico</strong> cuando decides
            crear una cuenta. Este dato se usa únicamente para enviarte el enlace de inicio de
            sesión (magic link) y para identificar tu álbum en nuestra base de datos.
          </p>
          <p className="mt-3">
            Guardamos el <strong>estado de tu álbum</strong> (qué estampas tienes y cuántas) en
            nuestros servidores para que puedas acceder desde cualquier dispositivo. Si usas la app
            sin cuenta, ese dato solo vive en tu propio dispositivo (localStorage).
          </p>
        </Section>

        <Section title="2. Qué NO hacemos con tus datos">
          <ul className="list-disc list-inside space-y-1.5">
            <li>No vendemos ni compartimos tus datos con terceros.</li>
            <li>No usamos tu correo para enviarte publicidad ni boletines.</li>
            <li>No rastreamos tu comportamiento con fines publicitarios propios.</li>
          </ul>
        </Section>

        <Section title="3. Cookies y almacenamiento local">
          <p>
            Usamos <strong>cookies de sesión</strong> estrictamente necesarias para mantenerte
            autenticado (proporcionadas por Supabase). No usamos cookies de seguimiento ni de
            terceros con fines publicitarios.
          </p>
          <p className="mt-3">
            La app guarda el estado de tu álbum en el <strong>localStorage</strong> de tu
            navegador para funcionar sin conexión.
          </p>
        </Section>

        <Section title="4. Servicios de terceros">
          <p>Esta aplicación utiliza los siguientes servicios externos:</p>
          <ul className="list-disc list-inside space-y-1.5 mt-2">
            <li>
              <strong>Supabase</strong> – base de datos y autenticación (
              <a
                href="https://supabase.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 underline"
              >
                política de privacidad
              </a>
              )
            </li>
            <li>
              <strong>Vercel</strong> – alojamiento web (
              <a
                href="https://vercel.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 underline"
              >
                política de privacidad
              </a>
              )
            </li>
            <li>
              <strong>Google AdSense</strong> – publicidad (puede usar cookies propias de Google
              para mostrar anuncios relevantes)
            </li>
          </ul>
        </Section>

        <Section title="5. Eliminación de datos">
          <p>
            Puedes eliminar tu cuenta y todos tus datos en cualquier momento enviando un correo a{" "}
            <a
              href="mailto:nestorhernandezvazquez@gmail.com"
              className="text-amber-400 underline"
            >
              nestorhernandezvazquez@gmail.com
            </a>
            . Procesaremos tu solicitud en un plazo máximo de 7 días hábiles.
          </p>
        </Section>

        <Section title="6. Términos de uso">
          <ul className="list-disc list-inside space-y-1.5">
            <li>La app se proporciona tal cual, sin garantías de disponibilidad continua.</li>
            <li>Está prohibido usarla para fines ilegales o para distribuir spam.</li>
            <li>
              Nos reservamos el derecho de suspender cuentas que infrinjan estos términos.
            </li>
          </ul>
        </Section>

        <Section title="7. Aviso legal">
          <p>
            <strong>Mi Álbum Mundial 2026 no está afiliada, patrocinada ni respaldada por
            la FIFA ni por Panini.</strong> Todos los nombres de equipos, torneos y marcas
            mencionados pertenecen a sus respectivos propietarios. Esta es una aplicación
            independiente creada por fans para llevar el control personal de un álbum de
            estampas.
          </p>
        </Section>

        <Section title="8. Cambios a esta política">
          <p>
            Podemos actualizar esta página ocasionalmente. La fecha de última actualización
            aparece al inicio del documento. El uso continuado de la app implica la aceptación
            de los cambios.
          </p>
        </Section>

        <p className="text-xs text-slate-600 mt-10 text-center">
          ¿Dudas?{" "}
          <a
            href="mailto:nestorhernandezvazquez@gmail.com"
            className="text-slate-500 underline hover:text-slate-300"
          >
            nestorhernandezvazquez@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-sm font-bold text-slate-100 mb-3 pb-2 border-b border-slate-800">
        {title}
      </h2>
      <div className="text-sm text-slate-400 leading-relaxed">{children}</div>
    </section>
  );
}
