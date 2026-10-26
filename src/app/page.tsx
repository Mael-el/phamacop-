import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { PlantCard } from "@/components/plant-card";
import { SearchForm } from "@/components/search-form";
import { StudyCard } from "@/components/study-card";
import { getHomeData } from "@/lib/catalog";
import { getDictionary } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [{ plants, studies, pathologies, stats }, { t }] = await Promise.all([getHomeData(), getDictionary()]);
  const featuredPlants = plants.slice(0, 3);
  const latestStudies = studies.slice(0, 3);
  const solutions = pathologies.filter((pathology) => pathology.claimCount > 0).slice(0, 3);

  return (
    <main>
      <section className="home-hero">
        <div className="home-hero-inner wrap">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-mark" /> {t.home.eyebrow}</p>
            <h1>{t.home.title1}<br /><em>{t.home.title2}</em><br />{t.home.title3}</h1>
            <p className="hero-intro">{t.home.intro}</p>
            <div className="hero-actions">
              <Link className="button button-primary" href="/plantes">{t.home.explorePlants} <Icon name="arrow" size={16} /></Link>
              <Link className="button button-ghost" href="/preuves/methodologie">{t.home.method}</Link>
            </div>
          </div>
          <div className="hero-art">
            <span className="hero-art-note">{t.home.artNote}</span>
            <div className="hero-art-image">
              <Image src="/images/hero-herbier.jpg" alt={t.home.artCaptionStrong} width={900} height={600} priority />
              <div className="hero-art-caption">
                <div><small>{t.home.artCaptionSmall}</small><strong>{t.home.artCaptionStrong}</strong></div>
                <span className="hero-art-number">01 / 05</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="hero-bottom" aria-label={t.home.corpusAria}>
        <div className="hero-bottom-inner wrap">
          <div>
            <span className="hero-bottom-label">{t.home.startExploration}</span>
            <SearchForm placeholder={t.home.searchPlaceholder} />
          </div>
          <div className="hero-stats" aria-label={t.home.corpusAria}>
            <div className="hero-stat"><strong>{stats.plants}</strong><span>{t.home.statSpecies}</span></div>
            <div className="hero-stat"><strong>{stats.studies}</strong><span>{t.home.statStudies}</span></div>
            <div className="hero-stat"><strong>{stats.claims}</strong><span>{t.home.statClaims}</span></div>
            <div className="hero-stat"><strong>{pathologies.length}</strong><span>{t.home.statSolutions}</span></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-heading">
            <div>
              <p className="section-kicker">{t.home.sectionPlants} · {plants.length}</p>
              <h2>{t.plants.title}</h2>
              <p>{t.home.sectionPlantsLead}</p>
            </div>
            <Link className="text-link" href="/plantes">{t.home.seeAll} <Icon name="arrow" size={16} /></Link>
          </div>
          {featuredPlants.length > 0 ? (
            <div className="plant-grid">
              {featuredPlants.map((plant, index) => <PlantCard key={plant.id} plant={plant} t={t} index={index} />)}
            </div>
          ) : (
            <div className="empty-note">{t.plants.empty}</div>
          )}
        </div>
      </section>

      <section className="section section-tinted">
        <div className="wrap">
          <div className="section-heading">
            <div>
              <p className="section-kicker">{t.solutions.kicker}</p>
              <h2>{t.solutions.title}</h2>
              <p>{t.home.sectionSolutionsLead}</p>
            </div>
            <Link className="text-link" href="/solutions">{t.home.seeAll} <Icon name="arrow" size={16} /></Link>
          </div>
          {solutions.length > 0 ? (
            <div className="record-grid">
              {solutions.map((solution) => (
                <Link href="/solutions" className="record-card" key={solution.id}>
                  <div className="record-card-top"><span className="record-tag">{t.solutions.kicker}</span><span>{solution.claimCount} {solution.claimCount === 1 ? t.pathologies.claimOne : t.pathologies.claimMany}</span></div>
                  <h2>{solution.name}</h2>
                  <p>{solution.summary}</p>
                  <span className="record-card-link">{t.solutions.testedPlants} <Icon name="arrow" size={15} /></span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-note">{t.solutions.empty}</div>
          )}
          <div className="method-callout" style={{ marginTop: 22 }}>
            <strong>{t.solutions.caution}</strong>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="tradition-notice">
            <span className="tradition-notice-icon"><Icon name="book" size={20} /></span>
            <div>
              <strong>{t.understand.asideTitle}</strong>
              <p>{t.understand.asideBody}</p>
            </div>
            <Link className="text-link" href="/comprendre">{t.footer.understand} <Icon name="arrow" size={15} /></Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-heading">
            <div>
              <p className="section-kicker">{t.publications.kicker}</p>
              <h2>{t.home.sectionStudies}</h2>
              <p>{t.home.sectionStudiesLead}</p>
            </div>
            <Link className="text-link" href="/publications">{t.home.seeAll} <Icon name="arrow" size={16} /></Link>
          </div>
          {latestStudies.length > 0
            ? latestStudies.map((study) => <StudyCard key={study.id} study={study} t={t} associatedPlants={study.plants} />)
            : <div className="empty-note">{t.publications.empty}</div>}
        </div>
      </section>

      <section className="section section-compact section-tinted">
        <div className="wrap">
          <div className="section-heading" style={{ marginBottom: 0 }}>
            <div>
              <p className="section-kicker">{t.footer.transparency}</p>
              <h2>{t.home.pledgeTitle}</h2>
              <p>{t.home.pledgeBody}</p>
            </div>
            <Link className="button button-primary" href="/preuves/methodologie">{t.nav.methode} <Icon name="arrow" size={15} /></Link>
          </div>
        </div>
      </section>
    </main>
  );
}
