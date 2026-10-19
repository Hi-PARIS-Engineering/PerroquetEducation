/**
 * @file (platform)/databootcamp/courses/page.tsx
 * @description Page « Liste des cours » du pilier Hi! Databootcamp.
 *
 * La liste des cours du bootcamp n'est pas encore rattachée (placeholder).
 * En attendant, la page présente une **démo du module de code exécutable**
 * (`RunnableCodeBlock`, Python dans le navigateur via Pyodide) afin de montrer
 * l'interactivité façon Google Colab prévue pour les cours.
 */

import Link from "next/link";
import { RunnableCodeBlock } from "@/components/platform/RunnableCodeBlock";

/** Extrait de code de démonstration proposé dans l'éditeur. */
const DEMO_CODE = `# Éditez ce code puis cliquez sur « Exécuter »
# Tout tourne dans votre navigateur - aucun serveur.

def fibonacci(n):
    a, b = 0, 1
    suite = []
    for _ in range(n):
        suite.append(a)
        a, b = b, a + b
    return suite

print("Suite de Fibonacci :", fibonacci(10))
`;

/**
 * Placeholder de la liste des cours du Data Bootcamp + démo du module exécutable.
 */
export default function DataBootcampCoursesPage() {
  return (
    <div className="bg-white dark:bg-navy w-full">
      {/* Bannière de titre */}
      <div className="bg-primary/5 border-b border-primary/10 py-12 mb-8">
        <div className="max-w-4xl mx-auto px-6">
          <nav className="text-sm text-primary/60 dark:text-white/60 mb-3 flex items-center font-medium">
            <Link href="/databootcamp" className="hover:text-secondary transition-colors">
              Hi! Databootcamp
            </Link>{" "}
            <span className="mx-2">/</span> Liste des cours
          </nav>
          <h1 className="text-3xl font-extrabold text-primary dark:text-white">Liste des cours</h1>
          <p className="text-primary/70 dark:text-white/80 mt-2 font-medium">Les cours du Data Bootcamp seront bientôt disponibles ici.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-12">

      {/* État vide */}
      <div className="flex flex-col items-center justify-center py-16 text-center gap-4 bg-white dark:bg-navy border border-dashed border-gray-200 dark:border-white/10 rounded-2xl mb-14">
        <span className="text-5xl">📚</span>
        <div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">Aucun cours pour l'instant</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-1 max-w-sm mx-auto">
            Le contenu de cette page est en cours de préparation. Revenez prochainement.
          </p>
        </div>
        <Link
          href="/databootcamp"
          className="mt-2 text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
        >
          ← Retour à la présentation
        </Link>
      </div>

      {/* Démo du module de code exécutable */}
      <section>
        <div className="mb-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full mb-3">
            Aperçu · nouveauté
          </span>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Exécutez du Python dans votre navigateur</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-1">
            Les futurs cours pourront intégrer des blocs de code exécutables, façon Google Colab -
            sans installation. Essayez ci-dessous : modifiez le code et cliquez sur « Exécuter ».
          </p>
        </div>
        <RunnableCodeBlock code={DEMO_CODE} />
      </section>
      </div>
    </div>
  );
}
