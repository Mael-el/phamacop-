import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { EvidenceBadge } from "@/components/evidence-badge";
import type { EvidenceLevel } from "@/db/schema";
import { getDictionary } from "@/lib/i18n";

export const metadata = {
  title: "Méthodologie des niveaux de preuve",
  description: "Comment sont classées les affirmations et comment lire leurs limites dans l’Herbier ouest-africain.",
};

const levels: Array<{ id: string; level: EvidenceLevel; title: string; text: string }> = [
  { id: "high", level: "HIGH", title: "Preuve élevée", text: "Catégorie réservée à une affirmation appuyée par des données humaines robustes, cohérentes et confirmées par des travaux indépendants. Elle n’est pas attribuée dans le corpus actuel." },
  { id: "moderate", level: "MODERATE", title: "Preuve modérée", text: "Catégorie réservée à des données humaines convergentes mais encore limitées, ou à des études présentant des réserves méthodologiques. Elle n’est pas attribuée dans le corpus actuel." },
  { id: "preclinical", level: "PRECLINICAL", title: "Préclinique", text: "Résultat issu d’une culture cellulaire ou parasitaire (in vitro), d’un tissu isolé (ex vivo) ou d’un modèle animal. Il génère une piste de recherche et ne démontre pas un bénéfice clinique." },
  { id: "ethnobotanical", level: "ETHNOBOTANICAL", title: "Donnée ethnobotanique", text: "Usage rapporté dans une enquête, une revue ou une publication. C’est un fait documentaire sur des pratiques; ce n’est ni une preuve d’efficacité, ni une recette, ni une recommandation." },
  { id: "insufficient", level: "INSUFFICIENT", title: "Données insuffisantes", text: "Les références disponibles dans ce corpus ne permettent pas de conclure sur l’affirmation. L’absence de données recensées n’équivaut pas à une preuve d’absence d’activité ou de risque." },
  { id: "risk-signal", level: "RISK_SIGNAL", title: "Signal de risque", text: "Information de prudence indépendante de l’activité revendiquée. Elle peut provenir d’une étude ou d’une synthèse; sa portée dépend du modèle, de l’extrait et de la qualité des données." },
];

export default async function MethodologyPage() {
  const { locale, t } = await getDictionary();
  return (
    <main>
      <section className="page-hero"><div className="wrap">
        <Breadcrumbs items={[{ label: "Preuves", href: "/preuves/methodologie" }, { label: "Méthodologie" }]} />
        <div className="page-hero-inner">
          <div><p className="section-kicker">Transparence scientifique · règles publiques</p><h1>Comment lire une preuve.</h1><p className="lead">Un badge résume le type de données qui soutient une affirmation précise. Il ne mesure pas la valeur d’une plante et ne remplace pas l’analyse de l’étude source.</p></div>
          <aside className="page-hero-aside"><strong>Pas de score automatique</strong>La catégorie est attachée à une affirmation, jamais à l’espèce. Aucune IA n’attribue les niveaux de preuve.</aside>
        </div>
      </div></section>
      <section className="page-content"><div className="wrap">
        {locale === "fon" && (
          <div className="method-callout" style={{ marginBottom: 24 }}>
            <strong>{t.method.fonSummaryTitle}</strong><br />{t.method.fonSummaryBody}
          </div>
        )}
        <div className="method-intro">
          <p>Chaque badge est cliquable et mène à cette page. Sur une fiche, la justification, les études liées et les limites de méthode apparaissent à côté de l’affirmation. Les références publiées possèdent un DOI ou un PMID. Les usages traditionnels sont rangés dans un bloc séparé et identifiés comme données ethnobotaniques.</p>
          <aside className="method-callout"><strong>État du corpus de démonstration.</strong><br />Les premières classifications sont des classements éditoriaux de travail basés sur le type d’étude recensé. Elles ne sont pas attribuées ni validées par un expert indépendant; chaque fiche porte donc la mention « à valider par un expert ».</aside>
        </div>

        <div className="evidence-grid">
          {levels.map((item) => (
            <article className="evidence-method-card" id={item.id} key={item.id}>
              <EvidenceBadge level={item.level} t={t} />
              <h2>{item.title}</h2>
              <p>{item.text}</p>
            </article>
          ))}
        </div>

        <div className="method-steps" aria-label="Étapes de documentation">
          <div className="method-step"><span>01</span><strong>Délimiter l’affirmation</strong><p>Une propriété, un modèle et une espèce; pas un score général sur la plante.</p></div>
          <div className="method-step"><span>02</span><strong>Relier la source</strong><p>DOI ou PMID, type d’étude, résultats et références consultables.</p></div>
          <div className="method-step"><span>03</span><strong>Afficher les limites</strong><p>Modèle, extrait, souches et transposabilité sont précisés lorsqu’ils sont documentés.</p></div>
          <div className="method-step"><span>04</span><strong>Revue humaine requise</strong><p>Un expert pharmacognoste ou pharmacien doit vérifier le contenu avant toute validation formelle.</p></div>
        </div>

        <section className="method-reference-block">
          <p className="section-kicker">Exemple de source de cadrage</p>
          <h2>Pourquoi distinguer les modèles ?</h2>
          <p>Une revue systématique des activités antiplasmodiales de plantes africaines distingue les études in vitro, in vivo et cliniques; elle souligne l’hétérogénéité des modèles et des méthodes, ainsi que les limites des données de toxicité.</p>
          <Link href="https://doi.org/10.1186/s12936-021-03866-0" target="_blank" rel="noreferrer">Tajbakhsh et al. · Malaria Journal (2021) · DOI 10.1186/s12936-021-03866-0 <span aria-hidden="true">↗</span></Link>
        </section>

        <div className="method-footnote"><strong>Révision.</strong> Le niveau devrait évoluer si de nouvelles études fiables apparaissent. Les changements doivent être documentés par un humain, avec date, motif et sources. L’historique expert n’est pas encore activé dans cette version initiale.</div>
      </div></section>
    </main>
  );
}
