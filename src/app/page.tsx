import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { PlantCard } from "@/components/plant-card";
import { SearchForm } from "@/components/search-form";
import { StudyCard } from "@/components/study-card";
import { getHomeData } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { plants, studies, stats } = await getHomeData();
  const featuredPlants = plants.slice(0, 3);
  const latestStudies = studies.slice(0, 3);

  return (
    <main>
      <section className="home-hero">
        <div className="home-hero-inner wrap">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-mark" /> Pharmacopée végétale · base documentaire</p>
            <h1>Les plantes.<br /><em>Les preuves.</em><br />Le contexte.</h1>
            <p className="hero-intro">
              Explorer la pharmacopée végétale ouest-africaine à travers des usages rapportés,
              des études publiées et leurs limites — sans transformer l’information en prescription.
            </p>
            <div className="hero-actions">
              <Link className="button button-primary" href="/plantes">Explorer les plantes <Icon name="arrow" size={16} /></Link>
              <Link className="button button-ghost" href="/preuves/methodologie">Notre méthode</Link>
            </div>
          </div>
          <div className="hero-art">
            <span className="hero-art-note">Illustration éditoriale · non botanique</span>
            <div className="hero-art-image">
              <Image src="/images/hero-herbier.jpg" alt="Composition éditoriale de feuilles et de spécimens végétaux sur papier d’herbier" width={900} height={600} priority />
              <div className="hero-art-caption">
                <div><small>Une base de recherche ouverte</small><strong>De la tradition aux données publiées</strong></div>
                <span className="hero-art-number">01 / 05</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="hero-bottom" aria-label="Recherche rapide et contenu du corpus">
        <div className="hero-bottom-inner wrap">
          <div>
            <span className="hero-bottom-label">Commencer une exploration</span>
            <SearchForm placeholder="Ex. Nauclea, Plasmodium, limonoïde…" />
          </div>
          <div className="hero-stats" aria-label="Contenu actuel de la base">
            <div className="hero-stat"><strong>{stats.plants}</strong><span>Espèces</span></div>
            <div className="hero-stat"><strong>{stats.studies}</strong><span>Études sourcées</span></div>
            <div className="hero-stat"><strong>{stats.claims}</strong><span>Affirmations</span></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Le catalogue · {plants.length} espèces documentées</p>
              <h2>Un herbier relié aux sources.</h2>
            </div>
            <Link className="text-link" href="/plantes">Voir toutes les plantes <Icon name="arrow" size={16} /></Link>
          </div>
          {featuredPlants.length > 0 ? (
            <div className="plant-grid">
              {featuredPlants.map((plant, index) => <PlantCard key={plant.id} plant={plant} index={index} />)}
            </div>
          ) : (
            <div className="empty-note">Le catalogue se prépare. Les premières fiches sourcées apparaîtront ici.</div>
          )}
        </div>
      </section>

      <section className="section section-dark">
        <div className="wrap">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Le graphe de connaissance</p>
              <h2>Suivre une question,<br />pas une promesse.</h2>
            </div>
            <p>Chaque affirmation renvoie à une ou plusieurs études, à un niveau de preuve, puis à ses limites. Les résultats d’un extrait ne deviennent jamais une recommandation.</p>
          </div>
          <div className="pathway-grid">
            <div className="pathway-step"><span className="pathway-step-number">01</span><h3>Pathologie</h3><p>Un sujet étudié, présenté sans diagnostic ni conseil de soin.</p></div>
            <div className="pathway-step"><span className="pathway-step-number">02</span><h3>Mécanisme observé</h3><p>Le modèle expérimental décrit ce qui a été mesuré.</p></div>
            <div className="pathway-step"><span className="pathway-step-number">03</span><h3>Plante & composé</h3><p>Une espèce, une partie et une préparation explicitement référencées.</p></div>
            <div className="pathway-step"><span className="pathway-step-number">04</span><h3>Étude & limites</h3><p>Le DOI ou PMID, les résultats et ce qu’ils ne démontrent pas.</p></div>
          </div>
          <div style={{ marginTop: 23 }}><Link className="text-link" href="/pathologies/paludisme">Parcourir le dossier paludisme <Icon name="arrow" size={16} /></Link></div>
        </div>
      </section>

      <section className="section section-tinted">
        <div className="wrap">
          <div className="tradition-notice">
            <span className="tradition-notice-icon"><Icon name="book" size={20} /></span>
            <div>
              <strong>Deux registres, jamais confondus.</strong>
              <p>Les usages traditionnels sont documentés dans un bloc distinct; ils ne sont pas une preuve d’efficacité scientifique.</p>
            </div>
            <Link className="text-link" href="/comprendre">Comprendre la différence <Icon name="arrow" size={15} /></Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Bibliographie · DOI et PubMed</p>
              <h2>Des résultats à leur contexte.</h2>
            </div>
            <Link className="text-link" href="/publications">Toute la bibliographie <Icon name="arrow" size={16} /></Link>
          </div>
          {latestStudies.length > 0 ? latestStudies.map((study) => <StudyCard key={study.id} study={study} associatedPlants={study.plants} />) : <div className="empty-note">Aucune publication n’est encore enregistrée.</div>}
        </div>
      </section>

      <section className="section section-compact section-tinted">
        <div className="wrap">
          <div className="section-heading" style={{ marginBottom: 0 }}>
            <div>
              <p className="section-kicker">Transparence d’abord</p>
              <h2>La preuve s’attache à l’affirmation.</h2>
              <p>Une même espèce peut avoir plusieurs propriétés étudiées et plusieurs niveaux de preuve. Les classements de cette version de démonstration sont provisoires et attendent une validation experte indépendante.</p>
            </div>
            <Link className="button button-primary" href="/preuves/methodologie">Lire la méthodologie <Icon name="arrow" size={15} /></Link>
          </div>
        </div>
      </section>
    </main>
  );
}
