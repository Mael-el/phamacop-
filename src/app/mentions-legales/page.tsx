import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { getDictionary } from "@/lib/i18n";

export const metadata = {
  title: "Mentions et précautions",
  description: "Avertissements, périmètre documentaire et précautions d’usage du site Herbier ouest-africain.",
};

export default async function LegalPage() {
  const { locale, t } = await getDictionary();
  return (
    <main>
      <section className="page-hero"><div className="wrap">
        <Breadcrumbs items={[{ label: "Mentions & précautions" }]} />
        <div className="page-hero-inner">
          <div><p className="section-kicker">Cadre d’utilisation · information générale</p><h1>Ce que ce site est.<br />Et ce qu’il n’est pas.</h1><p className="lead">L’Herbier ouest-africain est une base documentaire scientifique en construction, conçue pour relier des sources publiées à des informations botaniques et ethnobotaniques.</p></div>
          <aside className="page-hero-aside"><strong>À retenir</strong>Cette plateforme n’est pas un service de soin, une consultation, une pharmacie ou un outil de diagnostic.</aside>
        </div>
      </div></section>
      <section className="page-content"><div className="wrap legal-content">
        {locale === "fon" && (
          <div className="method-callout" style={{ marginBottom: 24 }}>
            <strong>{t.legal.fonSummaryTitle}</strong><br />{t.legal.fonSummaryBody}
          </div>
        )}
        <div className="legal-block"><h2>Pas un conseil médical</h2><p>Les contenus sont fournis à titre documentaire et pédagogique. Ils ne constituent ni un diagnostic, ni une prescription, ni une recommandation personnalisée de traitement, ni une promesse de prévention ou de guérison.</p><p>Ne commencez pas, ne modifiez pas et n’arrêtez pas un traitement sur la base de ce site. Pour un symptôme, une maladie, une grossesse, un enfant ou une question d’interaction médicamenteuse, adressez-vous à un professionnel de santé qualifié. En cas d’urgence, contactez les services d’urgence locaux.</p></div>
        <section className="legal-text-block"><h2>Portée des données</h2><p>Les usages traditionnels consignés décrivent des pratiques rapportées dans des sources citées. Ils ne prouvent pas l’efficacité ou l’innocuité d’une plante. Les résultats in vitro, ex vivo ou chez l’animal ne démontrent pas à eux seuls un effet chez l’humain.</p><p>Les noms, parties étudiées, régions et composés sont limités aux éléments trouvés dans les sources associées. Une absence d’information sur ce site ne signifie pas qu’aucun risque ou aucune étude n’existe.</p></section>
        <section className="legal-text-block"><h2>Fiabilité et révision</h2><p>Les publications originales et leurs identifiants sont proposés pour vérification. Les résumés en français sont des synthèses éditoriales et peuvent omettre des détails de l’article. Les premières classifications de preuve de cette version sont provisoires et attendent une revue experte indépendante.</p><p>Cette version est un prototype documentaire : les informations d’éditeur, de contact et les conditions de réutilisation doivent être complétées par le responsable du projet avant ouverture au public.</p></section>
        <section className="legal-text-block"><h2>Sources externes & recherche</h2><p>Les liens DOI et PubMed ouvrent des sites tiers. Lorsqu’une recherche contient au moins trois caractères, son texte est transmis à PubMed/NCBI afin de récupérer des notices bibliographiques pertinentes. Le texte brut de la requête n’est pas conservé dans la base; les notices trouvées sont enregistrées dans la file candidate avec leur PMID/DOI et leur statut « à valider ».</p><p>Les notices externes ne sont pas publiées automatiquement, ne reçoivent pas de niveau de preuve et ne sont pas transformées en conseil ou en affirmation scientifique. Leur disponibilité et leurs conditions d’accès relèvent des services concernés.</p><p><Link href="/preuves/methodologie">Consulter la méthodologie des niveaux de preuve</Link>, <Link href="/publications">parcourir les publications référencées</Link> ou <Link href="/veille">voir les notices candidates</Link>.</p></section>
      </div></section>
    </main>
  );
}
