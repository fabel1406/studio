// src/app/privacy/page.tsx
import PublicLayout from "@/app/(public)/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  return (
    <PublicLayout>
      <div className="bg-background text-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <Card className="max-w-4xl mx-auto shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl sm:text-4xl font-extrabold text-center">Política de Privacidad</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground text-justify">
              <p className="text-sm text-center">Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

              <h2 className="text-2xl font-bold mt-8">1. Introducción</h2>
              <p>
                Bienvenido a EcoConnect. Nos comprometemos a proteger su privacidad. Esta Política de Privacidad explica cómo recopilamos, usamos, divulgamos y salvaguardamos su información cuando visita nuestra plataforma. Lea esta política de privacidad detenidamente. Si no está de acuerdo con los términos de esta política de privacidad, no acceda a la plataforma.
              </p>

              <h2 className="text-2xl font-bold mt-8">2. Recopilación de su información</h2>
              <p>
                Podemos recopilar información sobre usted de varias maneras. La información que podemos recopilar en la Plataforma incluye:
              </p>
              <ul>
                <li><strong>Datos Personales:</strong> Información de identificación personal, como su nombre, dirección de correo electrónico y número de teléfono, que nos proporciona voluntariamente cuando se registra en la Plataforma.</li>
                <li><strong>Datos de la Empresa:</strong> Información relacionada con su empresa, como el nombre de la empresa, el rol (Generador/Transformador), la descripción y la ubicación, que proporciona para utilizar los servicios de la Plataforma.</li>
                <li><strong>Datos Derivados:</strong> Información que nuestros servidores recopilan automáticamente cuando accede a la Plataforma, como su dirección IP, tipo de navegador, sistema operativo, tiempos de acceso y las páginas que ha visto directamente antes y después de acceder a la Plataforma.</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8">3. Uso de su información</h2>
              <p>
                Tener información precisa sobre usted nos permite brindarle una experiencia fluida, eficiente y personalizada. Específicamente, podemos usar la información recopilada sobre usted a través de la Plataforma para:
              </p>
              <ul>
                <li>Crear y gestionar su cuenta.</li>
                <li>Facilitar la comunicación y las negociaciones entre Generadores y Transformadores.</li>
                <li>Enviarle un correo electrónico sobre su cuenta o pedido.</li>
                <li>Mejorar la eficiencia y el funcionamiento de la Plataforma.</li>
                <li>Monitorear y analizar el uso y las tendencias para mejorar su experiencia.</li>
                <li>Notificarle sobre actualizaciones de la Plataforma.</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8">4. Seguridad de su información</h2>
              <p>
                Utilizamos medidas de seguridad administrativas, técnicas y físicas para ayudar a proteger su información personal. Si bien hemos tomado medidas razonables para proteger la información personal que nos proporciona, tenga en cuenta que, a pesar de nuestros esfuerzos, ninguna medida de seguridad es perfecta o impenetrable, y no se puede garantizar ningún método de transmisión de datos contra ninguna intercepción u otro tipo de uso indebido.
              </p>

              <h2 className="text-2xl font-bold mt-8">5. Contacto</h2>
              <p>
                Si tiene preguntas o comentarios sobre esta Política de Privacidad, contáctenos en: <a href="mailto:privacidad@ecoconnect.com" className="text-primary hover:underline">privacidad@ecoconnect.com</a>.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
}
