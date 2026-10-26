import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Icon } from "@/components/icon";

export const metadata = {
  title: "Comprendre les études",
  description: "Glossaire pour lire les études sur les plantes médicinales et distinguer les usages rapportés des preuves scientifiques.",
};

const glossary = [
  { term: "Usage traditionnel", text: "Information issue d’une enquête, d’une source historique ou d’une revue décrivant une pratique rapportée. Cela documente un savoir ou une pratique; ce n’est pas une validation clinique." },
  { term: "In vitro", text: "Essai réalisé hors d’un organisme vivant, par exemple sur des cellules, des parasites ou des bactéries en culture. Un effet observé dans ce modèle ne prouve pas un effet chez une personne." },
  { term: "In vivo", text: "Essai réalisé chez un organisme vivant, souvent un animal dans les publications précliniques. Les résultats animaux ne se transposent pas directement à la santé humaine." },
  { term: "Ex vivo", text: "Test effectué hors de l’organisme sur un tissu ou un échantillon biologique prélevé. Il reste distinct d’un essai clinique." },
  { term: "Essai clinique", text: "Étude menée auprès de participants humains selon un protocole défini. Sa présence seule n’établit pas une efficacité: méthode, taille, comparateur et résultats doivent être examinés." },
  { term: "DOI", text: "Identifiant pérenne d’une publication. Un DOI permet de retrouver l’article via le résolveur doi.org." },
  { term: "PMID", text: "Identifiant d’une notice bibliographique dans PubMed, la base de la National Library of Medicine des États-Unis." },
  { term: "Limite méthodologique", text: "Élément qui restreint l’interprétation: modèle, taille, préparation, comparateur, biais, durée ou manque de données. Les limites doivent rester visibles à côté du résultat." },
];

export default function UnderstandPage() {
  return (
    <main>
      <section className="page-hero"><div className="wrap">
        <Breadcrumbs items={[{ label: "Comprendre" }]} />
        <div className="page-hero-inner">
          <div><p className="section-kicker">Vulgarisation · sans raccourci</p><h1>Lire les études avec recul.</h1><p className="lead">Quelques repères pour comprendre ce qu’une publication démontre — et ce qu’elle ne permet pas de conclure.</p></div>
          <aside className="page-hero-aside"><strong>Le point clé</strong>Un usage rapporté, un résultat de laboratoire et un bénéfice chez l’humain sont trois informations différentes.</aside>
        </div>
      </div></section>
      <section className="page-content"><div className="wrap">
        <div className="glossary-list">{glossary.map((item) => <article key={item.term} className="glossary-card"><h2>{item.term}</h2><p>{item.text}</p></article>)}</div>
        <div className="understand-callout"><Icon name="shield" size={22} /><div><strong>Documenter, jamais prescrire.</strong><p>Les fiches n’établissent aucun diagnostic et ne proposent aucune dose ou traitement. Une maladie ou un médicament doit être discuté avec un professionnel de santé.</p></div></div>
        <Link className="text-link" href="/preuves/methodologie">Voir comment les preuves sont classées <Icon name="arrow" size={15} /></Link>
      </div></section>
    </main>
  );
}
