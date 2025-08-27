// src/app/terms/page.tsx
import PublicLayout from "@/app/(public)/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsOfServicePage() {
  return (
    <PublicLayout>
      <div className="bg-background text-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <Card className="max-w-4xl mx-auto shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl sm:text-4xl font-extrabold text-center">Términos de Servicio</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground text-justify">
              <p className="text-sm text-center">Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

              <h2 className="text-2xl font-bold mt-8">1. Acuerdo de los Términos</h2>
              <p>
                Estos Términos de Servicio constituyen un acuerdo legalmente vinculante hecho entre usted, ya sea personalmente o en nombre de una entidad ("usted") y EcoConnect ("Compañía", "nosotros", "nos" o "nuestro"), con respecto a su acceso y uso de la plataforma EcoConnect, así como cualquier otra forma de medios, canal de medios, sitio web móvil o aplicación móvil relacionada, vinculada o conectada de otra manera (colectivamente, la "Plataforma").
              </p>
              <p>
                Usted acepta que al acceder a la Plataforma, ha leído, entendido y aceptado estar sujeto a todos estos Términos de Servicio. Si no está de acuerdo con todos estos Términos de Servicio, tiene prohibido expresamente usar la Plataforma y debe suspender su uso de inmediato.
              </p>

              <h2 className="text-2xl font-bold mt-8">2. Cuentas de Usuario</h2>
              <p>
                Al crear una cuenta en EcoConnect, usted es responsable de mantener la seguridad de su cuenta y es totalmente responsable de todas las actividades que ocurran bajo la cuenta. Debe notificarnos de inmediato sobre cualquier uso no autorizado de su cuenta o cualquier otra violación de seguridad. No seremos responsables de ninguna pérdida o daño que surja de su incumplimiento de esta obligación de seguridad.
              </p>

              <h2 className="text-2xl font-bold mt-8">3. Contenido del Usuario</h2>
              <p>
                Usted es el único responsable de la información, fotos, perfiles, mensajes, notas, texto y otro contenido que cargue, publique o muestre (en adelante, "publique") en o a través del Servicio, o transmita a o comparta con otros usuarios (colectivamente, el "Contenido del Usuario"). No puede publicar, transmitir o compartir Contenido de Usuario en la Plataforma que no haya creado o para el que no tenga permiso para publicar.
              </p>

              <h2 className="text-2xl font-bold mt-8">4. Terminación</h2>
              <p>
                Nos reservamos el derecho de suspender o cancelar su cuenta y negarle todo uso actual o futuro de la Plataforma por cualquier motivo y en cualquier momento. Dicha terminación del Servicio resultará en la desactivación o eliminación de su Cuenta o su acceso a su Cuenta, y la renuncia y abandono de todo el Contenido en su Cuenta. Nos reservamos el derecho de negarnos a prestar el servicio a cualquier persona por cualquier motivo en cualquier momento.
              </p>

              <h2 className="text-2xl font-bold mt-8">5. Ley Aplicable</h2>
              <p>
                Estos Términos de Servicio y su uso de la Plataforma se rigen e interpretan de acuerdo con las leyes de España, sin tener en cuenta sus disposiciones sobre conflicto de leyes.
              </p>
              
               <h2 className="text-2xl font-bold mt-8">6. Contacto</h2>
              <p>
                Para resolver una queja sobre la Plataforma o para recibir más información sobre el uso de la Plataforma, contáctenos en: <a href="mailto:soporte@ecoconnect.com" className="text-primary hover:underline">soporte@ecoconnect.com</a>.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
}
