import "dotenv/config";
import { db, pool } from "@/db";
import {
  claimStudies,
  claims,
  compounds,
  mechanisms,
  pathologies,
  plantCompounds,
  plantSafety,
  plantStudies,
  plants,
  studies,
  traditionalUses,
  type EvidenceLevel,
  type StudyType,
} from "./schema";

const sourceUrl = (doi: string) => `https://doi.org/${doi}`;

async function seed() {
  const result = await db.transaction(async (tx) => {
    const studyRows = [
      {
        slug: "nauclea-latifolia-1998-in-vitro",
        title: "In vitro antiplasmodial activity of stem and root extracts of Nauclea latifolia S.M. (Rubiaceae)",
        authors: "Benoit-Vical F, Valentin A, Cournac V, et al.",
        journal: "Journal of Ethnopharmacology",
        year: 1998,
        studyType: "IN_VITRO" as StudyType,
        doi: "10.1016/s0378-8741(98)00036-1",
        pmid: "9705007",
        sourceUrl: sourceUrl("10.1016/s0378-8741(98)00036-1"),
        abstractSummary:
          "Des extraits aqueux de tiges et de racines, préparés en infusion ou décoction, ont été testés in vitro sur deux souches de Plasmodium falciparum. Les auteurs rapportent que N. latifolia est utilisée par des tradipraticiens en Côte d’Ivoire.",
        keyResults:
          "L’activité observée sur la souche FcB1 était principalement située vers la fin du cycle érythrocytaire (32e–48e heure). Le résultat décrit un essai de laboratoire, pas un traitement chez l’humain.",
        limitations:
          "Étude in vitro sur des extraits aqueux et des souches de laboratoire. Elle ne démontre ni efficacité clinique, ni innocuité, ni dose thérapeutique chez l’humain; la composition d’un extrait peut varier.",
      },
      {
        slug: "alstonia-boonei-2021-souris",
        title: "Evaluation of Antimalarial Potential of Extracts from Alstonia boonei and Carica papaya in Plasmodium berghei-Infected Mice",
        authors: "Atanu FO, Idih FM, Nwonuma CO, et al.",
        journal: "Evidence-Based Complementary and Alternative Medicine",
        year: 2021,
        studyType: "IN_VIVO" as StudyType,
        doi: "10.1155/2021/2599191",
        pmid: null,
        sourceUrl: sourceUrl("10.1155/2021/2599191"),
        abstractSummary:
          "Les auteurs ont évalué des extraits d’Alstonia boonei et de Carica papaya dans des modèles expérimentaux de souris infectées par Plasmodium berghei, avec des mesures de parasitémie et de paramètres biologiques.",
        keyResults:
          "Dans les groupes expérimentaux, les extraits ont réduit la parasitémie par rapport au groupe témoin infecté. Il s’agit d’un résultat observé chez la souris, dans les conditions de cette étude.",
        limitations:
          "Modèle murin et extraits expérimentaux; aucun essai clinique humain. Les doses expérimentales, le mode d’extraction et les résultats chez l’animal ne sont pas transposables à une préparation traditionnelle ou à une personne.",
      },
      {
        slug: "vernonia-amygdalina-2015-transmission",
        title: "Plasmodium transmission blocking activities of Vernonia amygdalina extracts and isolated compounds",
        authors: "Abay SM, Lucantoni L, Dahiya N, et al.",
        journal: "Malaria Journal",
        year: 2015,
        studyType: "MIXED_PRECLINICAL" as StudyType,
        doi: "10.1186/s12936-015-0812-2",
        pmid: "26208861",
        sourceUrl: sourceUrl("10.1186/s12936-015-0812-2"),
        abstractSummary:
          "L’étude a examiné des extraits de feuilles et des composés isolés sur plusieurs stades de Plasmodium, avec des essais in vitro, des modèles murins et des moustiques vecteurs; des fractions ont aussi été évaluées ex vivo sur des isolats de terrain de P. falciparum.",
        keyResults:
          "Le résumé rapporte des variations de densité de gamétocytes chez la souris, d’oocystes chez le moustique et du développement précoce du parasite en laboratoire. Vernodalol et vernolide ont été isolés dans le cadre du travail.",
        limitations:
          "Résultats de modèles expérimentaux (parasite, souris, moustique et essais ex vivo), non d’un essai thérapeutique chez des patients. Les résultats portent sur des extraits et molécules définis par les auteurs.",
      },
      {
        slug: "ocimum-gratissimum-2017-antimicrobien",
        title: "Proximate, Phytochemical, and In Vitro Antimicrobial Properties of Dried Leaves from Ocimum gratissimum",
        authors: "Talabi JY, Makanjuola SA",
        journal: "Preventive Nutrition and Food Science",
        year: 2017,
        studyType: "IN_VITRO" as StudyType,
        doi: "10.3746/pnf.2017.22.3.191",
        pmid: "29043216",
        sourceUrl: sourceUrl("10.3746/pnf.2017.22.3.191"),
        abstractSummary:
          "Des feuilles séchées d’Ocimum gratissimum et des extraits aqueux ou hydroéthanoliques ont été caractérisés puis testés au laboratoire contre plusieurs bactéries.",
        keyResults:
          "L’extrait aqueux-éthanolique a inhibé la croissance des organismes testés dans les conditions de l’essai; l’extrait aqueux a montré une activité notamment contre Pseudomonas aeruginosa. Les auteurs ont aussi mesuré la composition phytochimique de l’échantillon.",
        limitations:
          "Essais antimicrobiens in vitro sur des extraits et souches sélectionnés. Cela ne prouve pas qu’une feuille, tisane ou préparation soigne une infection chez une personne.",
      },
      {
        slug: "khaya-senegalensis-2023-limonoides",
        title: "Antiplasmodial and Antileishmanial Activities of a New Limonoid and Other Constituents from the Stem Bark of Khaya senegalensis",
        authors: "Amang à Ngnoung GA, Nganso Ditchou YO, Leutcha PB, et al.",
        journal: "Molecules",
        year: 2023,
        studyType: "IN_VITRO" as StudyType,
        doi: "10.3390/molecules28207227",
        pmid: "37894704",
        sourceUrl: sourceUrl("10.3390/molecules28207227"),
        abstractSummary:
          "Une extraction méthanolique d’écorce de tige de Khaya senegalensis et des composés isolés ont été évalués in vitro sur Plasmodium falciparum et Leishmania donovani.",
        keyResults:
          "Les auteurs rapportent une activité variable selon la souche et l’échantillon, notamment sur P. falciparum Dd2. Plusieurs limonoïdes ont été isolés et caractérisés; le papier présente ces résultats comme une piste de recherche.",
        limitations:
          "Essais in vitro et matériel végétal/extraits spécifiques. Les données ne démontrent ni bénéfice clinique ni sécurité d’emploi d’une préparation traditionnelle chez l’humain.",
      },
      {
        slug: "revue-plantes-africaines-paludisme-2021",
        title: "Antiplasmodial, antimalarial activities and toxicity of African medicinal plants: a systematic review of literature",
        authors: "Tajbakhsh E, Kwenti TE, Kheyri P, et al.",
        journal: "Malaria Journal",
        year: 2021,
        studyType: "REVIEW" as StudyType,
        doi: "10.1186/s12936-021-03866-0",
        pmid: null,
        sourceUrl: sourceUrl("10.1186/s12936-021-03866-0"),
        abstractSummary:
          "Revue systématique de 200 articles portant sur l’activité antiplasmodiale/antipaludique et la toxicité de plantes médicinales africaines; elle recense 722 essais indépendants et distingue notamment les études in vitro et in vivo.",
        keyResults:
          "La revue décrit une forte hétérogénéité des méthodes et souligne que la majorité des essais sont précliniques. Parmi les espèces évaluées pour la toxicité, Vernonia amygdalina fait partie de celles pour lesquelles des signaux sont fréquemment rapportés.",
        limitations:
          "Les études réunies diffèrent par les espèces, les extraits, les modèles et les protocoles. Un signal rapporté dans une revue n’est pas une conclusion toxicologique applicable à toute préparation ou à toute personne.",
      },
      {
        slug: "alstonia-boonei-revue-2012",
        title: "A Review of the Ethnobotany and Pharmacological Importance of Alstonia boonei De Wild (Apocynaceae)",
        authors: "Adotey JPK, Adukpo GE, Boahen YO, Armah FA",
        journal: "ISRN Pharmacology",
        year: 2012,
        studyType: "REVIEW" as StudyType,
        doi: "10.5402/2012/587160",
        pmid: null,
        sourceUrl: sourceUrl("10.5402/2012/587160"),
        abstractSummary:
          "Revue de la littérature ethnobotanique et pharmacologique consacrée à Alstonia boonei, arbre d’origine ouest-africaine, et aux pratiques documentées dans différentes communautés.",
        keyResults:
          "Les auteurs recensent notamment des usages traditionnels rapportés en Afrique de l’Ouest et décrivent des constituants chimiques étudiés dans la littérature.",
        limitations:
          "Revue narrative: les usages compilés ne sont pas une preuve d’efficacité clinique ni une recommandation. Les pratiques et les parties utilisées varient selon les sources et les communautés.",
      },
      {
        slug: "cryptolepis-sanguinolenta-2010-clinique",
        title: "Clinical efficacy of a tea-bag formulation of Cryptolepis sanguinolenta root in the treatment of acute uncomplicated falciparum malaria",
        authors: "Bugyei KA, Boye GL, Addy ME",
        journal: "Ghana Medical Journal",
        year: 2010,
        studyType: "CLINICAL" as StudyType,
        doi: "10.4314/gmj.v44i1.68849",
        pmid: "21326984",
        sourceUrl: sourceUrl("10.4314/gmj.v44i1.68849"),
        abstractSummary:
          "Essai prospectif descriptif ouvert mené dans trois cliniques au Ghana; 44 personnes présentant un paludisme non compliqué ont été incluses au départ et suivies jusqu’à 28 jours. L’étude évaluait une formulation en sachet de racines de Cryptolepis sanguinolenta.",
        keyResults:
          "Les auteurs rapportent une clairance de la parasitémie chez environ la moitié des participants à 72 heures et l’absence de parasites au jour 7 parmi les personnes évaluées. Le texte intégral rapporte deux recrudescences tardives, aux jours 21 et 28.",
        limitations:
          "Essai ouvert sans groupe témoin ni randomisation, petit effectif; 12 participants ont été perdus de vue avant le jour 7 et un autre a été retiré, selon le texte intégral. Deux recrudescences tardives sont rapportées. Ces données préliminaires ne permettent pas de conclure à une efficacité comparative ou à une sécurité générale.",
      },
      {
        slug: "morinda-alstonia-2020-souris",
        title: "Antiplasmodial activities of Morinda lucida (Benth) and Alstonia boonei (De wild) in mice infected with Plasmodium berghei",
        authors: "Afolabi OJ, Abejide AE",
        journal: "Bulletin of the National Research Centre",
        year: 2020,
        studyType: "IN_VIVO" as StudyType,
        doi: "10.1186/s42269-020-00342-8",
        pmid: null,
        sourceUrl: sourceUrl("10.1186/s42269-020-00342-8"),
        abstractSummary:
          "Des extraits de feuilles et d’écorces de Morinda lucida et Alstonia boonei ont été évalués chez des souris infectées par Plasmodium berghei NK65; les auteurs ont aussi testé une combinaison des deux extraits.",
        keyResults:
          "Dans ce modèle murin, la suppression de parasitémie rapportée était de 83 % pour M. lucida à 400 mg/kg et de 85 % pour A. boonei à 600 mg/kg; la combinaison atteignait 92 % à 800 mg/kg. La chloroquine, comparateur de l’étude, a éliminé les parasites dans ce modèle.",
        limitations:
          "Étude animale avec extraits et doses expérimentales, sans essai clinique chez l’humain. Les pourcentages décrivent les groupes de souris de cette étude et ne sont ni une posologie ni une promesse de résultat chez une personne.",
      },
      {
        slug: "plantes-herbales-ghana-2020-in-vitro",
        title: "The In Vitro Antiplasmodial Activities of Aqueous Extracts of Selected Ghanaian Herbal Plants",
        authors: "Cudjoe E, Donu D, Okonu RE, et al.",
        journal: "Journal of Parasitology Research",
        year: 2020,
        studyType: "IN_VITRO" as StudyType,
        doi: "10.1155/2020/5041919",
        pmid: "32518693",
        sourceUrl: sourceUrl("10.1155/2020/5041919"),
        abstractSummary:
          "Des extraits aqueux de feuilles d’Alchornea cordifolia, Polyalthia longifolia, Moringa oleifera et Mangifera indica ont été testés in vitro sur trois souches de Plasmodium falciparum; des cultures prolongées ont aussi servi à observer les stades asexués et gamétocytes.",
        keyResults:
          "A. cordifolia a montré une activité qualifiée de modérée par les auteurs (IC50 de 5,8; 17,4; et 15,8 µg/mL sur les trois souches). M. indica a montré une activité faible (IC50 de 65,4; 96,7; et 81,7 µg/mL); M. oleifera et P. longifolia étaient inactives dans les essais rapportés.",
        limitations:
          "Essais in vitro sur des extraits aqueux et un nombre limité de souches; les résultats concernent uniquement ces conditions expérimentales et ne démontrent aucun effet clinique.",
      },
      {
        slug: "plantes-ouest-afrique-2000-enquete-in-vitro",
        title: "Antiplasmodial activity of plant extracts used in West African traditional medicine",
        authors: "Valentin A, Benoit-Vical F, Pélissier Y, et al.",
        journal: "Journal of Ethnopharmacology",
        year: 2000,
        studyType: "MIXED_PRECLINICAL" as StudyType,
        doi: "10.1016/S0378-8741(00)00296-8",
        pmid: "11025150",
        sourceUrl: sourceUrl("10.1016/S0378-8741(00)00296-8"),
        abstractSummary:
          "Après une enquête ethnobotanique, cinq plantes originaires de Côte d’Ivoire, dont Alchornea cordifolia, ont été sélectionnées car des tradipraticiens les utilisaient pour le paludisme. Les extraits ont ensuite été testés in vitro sur trois souches de P. falciparum.",
        keyResults:
          "Les IC50 des extraits aqueux variaient de 2,34 à plus de 500 µg/mL selon la plante. A. cordifolia et Terminalia glaucescens figuraient parmi les plantes les plus actives; des extraits organiques supplémentaires ont aussi été évalués.",
        limitations:
          "L’enquête ethnobotanique et les essais in vitro répondent à des questions différentes. Les résultats de laboratoire ne valident pas une efficacité chez les patients; l’activité variait selon la plante, l’extrait et la souche.",
      },
      {
        slug: "benin-woody-species-2021-enquete",
        title: "Traditional medicinal knowledge of woody species across climatic zones in Benin (West Africa)",
        authors: "Ahoyo CC, Houehanou TD, Yaoitcha AS, et al.",
        journal: "Journal of Ethnopharmacology",
        year: 2021,
        studyType: "ETHNOBOTANICAL" as StudyType,
        doi: "10.1016/j.jep.2020.113417",
        pmid: "32980483",
        sourceUrl: sourceUrl("10.1016/j.jep.2020.113417"),
        abstractSummary:
          "Enquête ethnobotanique nationale au Bénin fondée sur des entretiens semi-structurés avec 590 professionnels de la médecine traditionnelle (guérisseurs et vendeurs). Les auteurs ont recensé 123 espèces ligneuses et comparé les citations selon les zones climatiques.",
        keyResults:
          "Mangifera indica et Alchornea cordifolia figurent parmi les cinq espèces les plus citées pour la gestion des problèmes de santé dans les zones étudiées, avec des fréquences de citation rapportées de 95 % et 83 % respectivement.",
        limitations:
          "Une fréquence de citation mesure la place d’une espèce dans les réponses de l’enquête; elle ne prouve ni efficacité ni sécurité. Les auteurs signalent un manque de consensus entre praticiens et l’absence fréquente de détails sur les organes utilisés.",
      },
      {
        slug: "guiera-senegalensis-2006-in-vitro",
        title: "Phytochemical and pharmacological study of roots and leaves of Guiera senegalensis J.F. Gmel (Combretaceae)",
        authors: "Fiot J, Sanon S, Azas N, et al.",
        journal: "Journal of Ethnopharmacology",
        year: 2006,
        studyType: "IN_VITRO" as StudyType,
        doi: "10.1016/j.jep.2005.12.030",
        pmid: "16443341",
        sourceUrl: sourceUrl("10.1016/j.jep.2005.12.030"),
        abstractSummary:
          "Les auteurs ont isolé et caractérisé des constituants des racines et feuilles de Guiera senegalensis, dont des alcaloïdes bêta-carboliques et la guieranone A, puis ont évalué leurs activités antiplasmodiales et leur cytotoxicité in vitro.",
        keyResults:
          "Les extraits d’alcaloïdes et des bêta-carbolines ont présenté une activité antiplasmodiale in vitro. La guieranone A a montré une forte activité mais aussi une cytotoxicité envers des monocytes humains dans les conditions de l’essai.",
        limitations:
          "Essais cellulaires et composés isolés; l’activité et la cytotoxicité observées ne permettent pas d’estimer le risque ou l’efficacité d’une préparation chez l’humain.",
      },
      {
        slug: "guiera-senegalensis-2018-souris",
        title: "In Vivo Antiplasmodial Activity of Two Sahelian Plant Extracts on Plasmodium berghei ANKA Infected NMRI Mice",
        authors: "Bonkian LN, Yerbanga RS, Koama B, et al.",
        journal: "Evidence-Based Complementary and Alternative Medicine",
        year: 2018,
        studyType: "IN_VIVO" as StudyType,
        doi: "10.1155/2018/6859632",
        pmid: "29977316",
        sourceUrl: sourceUrl("10.1155/2018/6859632"),
        abstractSummary:
          "Étude expérimentale menée au Burkina Faso évaluant des décoctions de feuilles de Guiera senegalensis et Bauhinia rufescens chez des souris infectées par Plasmodium berghei ANKA.",
        keyResults:
          "Pour G. senegalensis, les réductions de parasitémie rapportées étaient de 57,5 %, 35,9 % et 44,9 % aux doses testées de 100, 250 et 500 mg/kg respectivement; l’effet n’augmentait donc pas de façon monotone avec la dose.",
        limitations:
          "Modèle murin avec six souris par groupe et protocole suppressif de quatre jours. Les résultats sont spécifiques à ce modèle et ne constituent pas une donnée clinique ou une recommandation de dose.",
      },
      {
        slug: "picralima-nitida-1996-in-vitro",
        title: "Constituents of Picralima nitida display pronounced inhibitory activities against asexual erythrocytic forms of Plasmodium falciparum in vitro",
        authors: "François G, Aké Assi L, Holenz J, Bringmann G",
        journal: "Journal of Ethnopharmacology",
        year: 1996,
        studyType: "IN_VITRO" as StudyType,
        doi: "10.1016/S0378-8741(96)01456-0",
        pmid: "8953424",
        sourceUrl: sourceUrl("10.1016/S0378-8741(96)01456-0"),
        abstractSummary:
          "Des extraits aqueux et organiques de Picralima nitida, plante ouest-africaine, ont été testés in vitro contre des formes érythrocytaires asexuées de Plasmodium falciparum.",
        keyResults:
          "Les extraits de racine, d’écorce de tige et de péricarpe présentaient les activités les plus élevées dans l’essai; les extraits de feuilles et de graines étaient beaucoup moins actifs ou inactifs selon les échantillons.",
        limitations:
          "Essai in vitro uniquement. Les résultats varient fortement selon la partie végétale et l’extrait et ne permettent pas de conclure à une efficacité chez l’humain.",
      },
      {
        slug: "picralima-nitida-1992-in-vitro",
        title: "Evaluation of the in vitro antimalarial activity of Picralima nitida extracts",
        authors: "Iwu MM, Klayman DL",
        journal: "Journal of Ethnopharmacology",
        year: 1992,
        studyType: "IN_VITRO" as StudyType,
        doi: "10.1016/0378-8741(92)90012-G",
        pmid: "1608269",
        sourceUrl: sourceUrl("10.1016/0378-8741(92)90012-G"),
        abstractSummary:
          "Des extraits de graines, de péricarpe et d’écorce de tige de Picralima nitida ont été évalués in vitro contre des clones de Plasmodium falciparum sensibles ou résistants à la chloroquine.",
        keyResults:
          "L’extrait dichlorométhanique de péricarpe a montré les IC50 les plus faibles parmi les extraits bruts testés sur les clones W-2 et D-6; une fraction alcaloïdique d’écorce a aussi été évaluée.",
        limitations:
          "Résultats en culture parasitaire, sans essai clinique; ils ne démontrent ni efficacité thérapeutique ni sécurité d’une préparation traditionnelle.",
      },
      {
        slug: "picralima-nitida-revue-2014",
        title: "Medicinal uses, phytochemistry and pharmacology of Picralima nitida (Apocynaceae) in tropical diseases: a review",
        authors: "Erharuyi O, Falodun A, Langer P",
        journal: "Asian Pacific Journal of Tropical Medicine",
        year: 2014,
        studyType: "REVIEW" as StudyType,
        doi: "10.1016/S1995-7645(13)60182-0",
        pmid: "24418074",
        sourceUrl: sourceUrl("10.1016/S1995-7645(13)60182-0"),
        abstractSummary:
          "Revue consacrée aux usages médicinaux rapportés, à la phytochimie et aux études pharmacologiques de Picralima nitida, espèce ouest-africaine de la famille des Apocynaceae.",
        keyResults:
          "La revue compile différents usages ethnomédicinaux de parties de la plante et des études précliniques portant notamment sur des alcaloïdes et l’activité antiplasmodiale.",
        limitations:
          "Revue narrative hétérogène; les usages compilés ne prouvent pas une efficacité ou une sécurité clinique et ne doivent pas être interprétés comme une recommandation.",
      },
      {
        slug: "enantia-chlorantha-1991-souris",
        title: "The effects of extracts of Enantia chlorantha in malaria",
        authors: "Agbaje EO, Onabanjo AO",
        journal: "Annals of Tropical Medicine & Parasitology",
        year: 1991,
        studyType: "IN_VIVO" as StudyType,
        doi: "10.1080/00034983.1991.11812613",
        pmid: "1811435",
        sourceUrl: sourceUrl("10.1080/00034983.1991.11812613"),
        abstractSummary:
          "Étude expérimentale de l’extrait aqueux d’Enantia chlorantha dans un modèle murin d’infection par Plasmodium yoelii.",
        keyResults:
          "L’article rapporte une suppression de l’infection chez les souris lorsque l’extrait était fourni dans l’eau de boisson; les voies d’administration par gavage ou sous-cutanée ne reproduisaient pas l’effet rapporté.",
        limitations:
          "Résultat ancien et propre à un modèle animal et à une voie d’administration particulière; aucune efficacité humaine ne peut en être déduite.",
      },
      {
        slug: "enantia-chlorantha-2025-souris",
        title: "Aqueous extract of Enantia chlorantha Oliv. demonstrates antimalarial activity and improves redox imbalance and biochemical alterations in mice",
        authors: "Evbuomwan IO, Adeyemi OS, Oluba OM",
        journal: "BMC Complementary Medicine and Therapies",
        year: 2025,
        studyType: "IN_VIVO" as StudyType,
        doi: "10.1186/s12906-025-04745-w",
        pmid: null,
        sourceUrl: sourceUrl("10.1186/s12906-025-04745-w"),
        abstractSummary:
          "Étude d’un extrait aqueux d’écorce de tige d’Enantia chlorantha dans des modèles de souris infectées par Plasmodium berghei NK65, avec des mesures de parasitémie, de survie et de paramètres biologiques.",
        keyResults:
          "Les auteurs rapportent une inhibition de parasitémie dépendante du modèle, atteignant 80,4 % au test curatif, ainsi qu’une survie moyenne prolongée dans les conditions expérimentales.",
        limitations:
          "Étude chez la souris; le modèle, l’extrait et les doses ne permettent pas de conclure à une efficacité ou une sécurité clinique chez l’humain.",
      },
      {
        slug: "benin-diarrhees-2021-enquete",
        title: "An ethnobotanical survey of seventeen plants species used against diarrhoea and other diseases in southern Benin (West Africa)",
        authors: "Dougnon V, Agbodjento E, Hounsa E, Legba BB, Deguenon E, et al.",
        journal: "Journal of Biological Research — Bollettino della Società Italiana di Biologia Sperimentale",
        year: 2021,
        studyType: "ETHNOBOTANICAL" as StudyType,
        doi: "10.4081/jbr.2021.9486",
        pmid: null,
        sourceUrl: sourceUrl("10.4081/jbr.2021.9486"),
        abstractSummary:
          "Enquête ethnobotanique par entretiens semi-structurés auprès de 72 praticiens de la médecine traditionnelle (52 herboristes de marché, 20 guérisseurs) à Cotonou, Ouidah, Abomey-Calavi et Porto-Novo, au Bénin, sur 17 plantes utilisées contre les diarrhées et d’autres affections.",
        keyResults:
          "Les auteurs rapportent 39 maladies ou symptômes traités, répartis en 15 catégories; les catégories infectieuses, sanguines et digestives sont les plus citées (paludisme, fièvre, diarrhée). Ocimum gratissimum, Alchornea cordifolia et Vernonia amygdalina figurent parmi les plantes les plus indiquées pour les infections diarrhéiques.",
        limitations:
          "Enquête déclarative : elle documente des pratiques rapportées, pas une efficacité. Les organes, préparations et quantités varient selon les praticiens, et l’étude ne comporte ni essai clinique ni évaluation de toxicité.",
      },
      {
        slug: "picralima-sud-benin-2017-enquete",
        title: "Importance ethnobotanique et valeur d’usage de Picralima nitida (Stapf) au Sud-Bénin (Afrique de l’Ouest)",
        authors: "Akabassi GC, Padonou EA, Chadare FJ, Assogbadjo AE",
        journal: "International Journal of Biological and Chemical Sciences",
        year: 2017,
        studyType: "ETHNOBOTANICAL" as StudyType,
        doi: "10.4314/ijbcs.v11i5.4",
        pmid: null,
        sourceUrl: sourceUrl("10.4314/ijbcs.v11i5.4"),
        abstractSummary:
          "240 personnes issues des groupes socio-culturels Fon, Goun, Nago et Aïzo du Sud-Bénin ont été interrogées dans leur langue locale sur les connaissances et les usages de Picralima nitida.",
        keyResults:
          "Les enquêtés rapportent 21 traitements à partir de différentes parties de l’espèce; les graines sont l’organe le plus utilisé, devant les racines, les feuilles et l’écorce. Le groupe Goun présente la meilleure connaissance des usages.",
        limitations:
          "Données déclaratives et indices ethnobotaniques : l’étude ne mesure ni efficacité ni sécurité, et les auteurs signalent une mauvaise transmission intergénérationnelle des connaissances.",
      },
    ];

    const studyBySlug = new Map<string, number>();
    for (const study of studyRows) {
      const [saved] = await tx
        .insert(studies)
        .values(study)
        .onConflictDoUpdate({
          target: studies.slug,
          set: {
            title: study.title,
            authors: study.authors,
            journal: study.journal,
            year: study.year,
            studyType: study.studyType,
            doi: study.doi,
            pmid: study.pmid,
            sourceUrl: study.sourceUrl,
            abstractSummary: study.abstractSummary,
            keyResults: study.keyResults,
            limitations: study.limitations,
          },
        })
        .returning({ id: studies.id });
      studyBySlug.set(study.slug, saved.id);
    }

    const plantRows = [
      {
        slug: "nauclea-latifolia",
        scientificName: "Nauclea latifolia",
        botanicalAuthor: "Sm.",
        family: "Rubiaceae",
        commonNames: [
          { language: "en", name: "Pincushion tree", region: "Nom courant anglophone cité dans la littérature botanique" },
          { language: "fon", name: "nimon", region: "Bénin · nom fon relevé dans les listes de noms de plantes en fon (variante : ko)" },
        ],
        synonyms: [],
        summary:
          "Arbuste ou petit arbre de la famille des Rubiaceae. Des extraits aqueux de tiges et de racines ont été étudiés in vitro sur Plasmodium falciparum; l’article rapporte également un usage traditionnel en Côte d’Ivoire.",
        sourceRegions: ["Côte d’Ivoire (usage cité dans l’article)"],
        partsUsed: ["Tiges", "Racines"],
      },
      {
        slug: "alstonia-boonei",
        scientificName: "Alstonia boonei",
        botanicalAuthor: "De Wild.",
        family: "Apocynaceae",
        commonNames: [{ language: "tw", name: "Onyame dua", region: "Ghana; nom rapporté par la revue Adotey et al. (2012)" }],
        synonyms: [],
        summary:
          "Arbre d’origine ouest-africaine de la famille des Apocynaceae. Une étude expérimentale a évalué des extraits dans un modèle murin de paludisme; une revue distincte documente des usages rapportés dans plusieurs communautés.",
        sourceRegions: ["Nigeria (étude sur modèle murin)", "Afrique de l’Ouest (revue ethnobotanique)"],
        partsUsed: ["Feuilles (étude expérimentale)", "Autres parties citées dans les revues; non détaillées ici"],
      },
      {
        slug: "vernonia-amygdalina",
        scientificName: "Vernonia amygdalina",
        botanicalAuthor: "Delile",
        family: "Asteraceae",
        commonNames: [
          { language: "en", name: "Bitter leaf", region: "Nom anglais courant repris dans la littérature" },
          { language: "fon", name: "amanvivè", region: "Bénin · nom fon (fiche technique Vernonia, INRAB/Bénin ; variante : aloman)" },
        ],
        synonyms: ["Gymnanthemum amygdalinum (Delile) Sch.Bip. ex Walp."],
        summary:
          "Espèce de la famille des Asteraceae. Des extraits de feuilles et des molécules isolées ont été étudiés sur plusieurs stades de Plasmodium dans des modèles de laboratoire, murins et vectoriels; les résultats ne constituent pas une preuve clinique.",
        sourceRegions: ["Afrique subsaharienne (contexte des publications citées)", "Bénin (enquête ethnobotanique, Sud-Bénin)"],
        partsUsed: ["Feuilles"],
      },
      {
        slug: "ocimum-gratissimum",
        scientificName: "Ocimum gratissimum",
        botanicalAuthor: "L.",
        family: "Lamiaceae",
        commonNames: [
          { language: "en", name: "African basil", region: "Nom anglais courant repris dans la littérature" },
          { language: "fon", name: "tchiayo", region: "Bénin · nom fongbè attesté (variantes : tchayo, yandodou)" },
        ],
        synonyms: [],
        summary:
          "Espèce de la famille des Lamiaceae. Un article a caractérisé des feuilles séchées et testé des extraits aqueux ou hydroéthanoliques contre plusieurs bactéries en laboratoire.",
        sourceRegions: ["Nigeria (contexte de l’étude)", "Bénin (enquête ethnobotanique, Sud-Bénin)"],
        partsUsed: ["Feuilles séchées"],
      },
      {
        slug: "khaya-senegalensis",
        scientificName: "Khaya senegalensis",
        botanicalAuthor: "(Desr.) A.Juss.",
        family: "Meliaceae",
        commonNames: [{ language: "fon", name: "kpaya", region: "Bénin · nom fon cité par une source secondaire béninoise, à confirmer par un locuteur natif" }],
        synonyms: [],
        summary:
          "Arbre de la famille des Meliaceae. Une étude a caractérisé un extrait méthanolique d’écorce de tige et des limonoïdes, puis les a évalués in vitro contre des parasites; l’activité dépend du modèle et de la souche testée.",
        sourceRegions: ["Cameroun (contexte de l’étude)"],
        partsUsed: ["Écorce de tige (étude de 2023)"],
      },
      {
        slug: "cryptolepis-sanguinolenta",
        scientificName: "Cryptolepis sanguinolenta",
        botanicalAuthor: "(Lindl.) Schltr.",
        family: "Apocynaceae",
        commonNames: [],
        synonyms: [],
        summary:
          "Espèce ouest-africaine de la famille des Apocynaceae. Une étude clinique ouverte et non comparative au Ghana a évalué une formulation expérimentale de racines; ses limites et les recrudescences rapportées restent visibles dans la fiche.",
        sourceRegions: ["Ghana (essai clinique ouvert)"],
        partsUsed: ["Racines (formulation de l’étude clinique)"],
      },
      {
        slug: "morinda-lucida",
        scientificName: "Morinda lucida",
        botanicalAuthor: "Benth.",
        family: "Rubiaceae",
        commonNames: [{ language: "fon", name: "hwenssi", region: "Bénin (Mono) · nom fon relevé dans la base Prelude/Ethnopharmacologia (variante : hwensso)" }],
        synonyms: [],
        summary:
          "Arbuste de la famille des Rubiaceae. Des extraits de feuilles et d’écorces ont été étudiés chez la souris dans un modèle expérimental de Plasmodium berghei; ces résultats ne sont pas des données de traitement humain.",
        sourceRegions: ["Nigeria (collecte d’étude rapportée dans l’article)"],
        partsUsed: ["Feuilles", "Écorce"],
      },
      {
        slug: "alchornea-cordifolia",
        scientificName: "Alchornea cordifolia",
        botanicalAuthor: "(Schumach. & Thonn.) Müll.Arg.",
        family: "Euphorbiaceae",
        commonNames: [{ language: "fon", name: "kamala", region: "Bénin · nom fon et goun relevé dans la base Prelude/Ethnopharmacologia (variante : avovlo en gèn)" }],
        synonyms: [],
        summary:
          "Espèce ligneuse documentée dans des enquêtes ethnobotaniques en Côte d’Ivoire et au Bénin. Des extraits aqueux de feuilles ont aussi été testés in vitro contre plusieurs souches de Plasmodium falciparum, avec des résultats variables selon la souche.",
        sourceRegions: ["Côte d’Ivoire (enquête ethnobotanique)", "Bénin (enquête nationale, Sud-Bénin)", "Ghana (essai in vitro)"],
        partsUsed: ["Feuilles", "Tiges feuillées (parties mentionnées dans la littérature)"],
      },
      {
        slug: "guiera-senegalensis",
        scientificName: "Guiera senegalensis",
        botanicalAuthor: "J.F.Gmel.",
        family: "Combretaceae",
        commonNames: [],
        synonyms: [],
        summary:
          "Arbuste sahélien de la famille des Combretaceae. Ses feuilles et racines ont été étudiées in vitro; une décoction de feuilles a également été évaluée chez des souris. Une molécule isolée a montré de la cytotoxicité dans un essai cellulaire.",
        sourceRegions: ["Burkina Faso (étude animale)", "Sahel ouest-africain (publications citées)"],
        partsUsed: ["Feuilles", "Racines"],
      },
      {
        slug: "picralima-nitida",
        scientificName: "Picralima nitida",
        botanicalAuthor: "Stapf",
        family: "Apocynaceae",
        commonNames: [],
        synonyms: [],
        summary:
          "Arbre d’Afrique de l’Ouest de la famille des Apocynaceae. Des extraits de différentes parties ont été évalués in vitro contre Plasmodium falciparum; les résultats varient fortement selon l’organe et le solvant utilisé.",
        sourceRegions: ["Afrique de l’Ouest (espèce décrite dans les publications)", "Bénin (enquête ethnobotanique, Sud-Bénin)"],
        partsUsed: ["Racines", "Écorce de tige", "Péricarpe", "Feuilles et graines (résultats variables)"],
      },
      {
        slug: "enantia-chlorantha",
        scientificName: "Enantia chlorantha",
        botanicalAuthor: "Oliv.",
        family: "Annonaceae",
        commonNames: [],
        synonyms: [],
        summary:
          "Espèce de la famille des Annonaceae étudiée dans des modèles murins de Plasmodium. Les publications portent notamment sur des extraits aqueux d’écorce; elles ne constituent pas une validation clinique.",
        sourceRegions: ["Nigeria (études animales)"],
        partsUsed: ["Écorce de tige"],
      },
      {
        slug: "mangifera-indica",
        scientificName: "Mangifera indica",
        botanicalAuthor: "L.",
        family: "Anacardiaceae",
        commonNames: [
          { language: "fr", name: "Manguier", region: "Nom français courant" },
          { language: "en", name: "Mango", region: "Nom anglais courant" },
          { language: "fon", name: "manga", region: "Bénin · nom fon et goun relevé dans la base Prelude/Ethnopharmacologia (variantes : mangania, amangagoto)" },
        ],
        synonyms: [],
        summary:
          "Arbre fruitier cultivé, étudié ici à travers des enquêtes ethnobotaniques au Bénin et un essai in vitro au Ghana. L’extrait aqueux de feuilles a montré une activité faible dans les souches testées; ce résultat ne préjuge pas d’autres usages ou préparations.",
        sourceRegions: ["Bénin (enquête ethnobotanique)", "Ghana (essai in vitro)"],
        partsUsed: ["Feuilles (essai in vitro)"],
      },
      {
        slug: "moringa-oleifera",
        scientificName: "Moringa oleifera",
        botanicalAuthor: "Lam.",
        family: "Moringaceae",
        commonNames: [
          { language: "fr", name: "Moringa", region: "Nom courant" },
          { language: "fon", name: "kpatinman", region: "Bénin · nom fon et goun attesté (variante : yovokpatinman)" },
        ],
        synonyms: [],
        summary:
          "Espèce cultivée, incluse dans une étude ghanéenne d’extraits aqueux de plantes utilisées localement. L’extrait de feuilles n’a pas montré d’activité antiplasmodiale dans les souches et les conditions de cet essai in vitro.",
        sourceRegions: ["Ghana (étude in vitro)"],
        partsUsed: ["Feuilles"],
      },
    ];


    /**
     * Photos documentaires (recherchées sur le web, jamais générées).
     * Chaque entrée porte la provenance d’origine ; la licence doit être vérifiée
     * avant toute réutilisation hors du site.
     */
    const plantImages: Record<
      string,
      { imageUrl: string; imageCredit: string; imageSourceUrl: string; imageNote: string }
    > = {
      "nauclea-latifolia": {
        imageUrl: "/images/plantes/nauclea-latifolia.jpg",
        imageCredit: "Wikimedia Commons — Nauclea latifolia (feuilles et fruit)",
        imageSourceUrl: "https://commons.wikimedia.org/wiki/Category:Nauclea_latifolia",
        imageNote: "Photo d’illustration botanique; licence à vérifier sur la page source avant réutilisation.",
      },
      "alstonia-boonei": {
        imageUrl: "/images/plantes/alstonia-boonei.jpg",
        imageCredit: "African Plants Database (herbier) — Alstonia boonei",
        imageSourceUrl: "https://african-plants.org/portal/taxa/index.php?taxauthid=1&taxon=360&clid=3",
        imageNote: "Planche d’herbier numérisée, pas une photographie de terrain.",
      },
      "vernonia-amygdalina": {
        imageUrl: "/images/plantes/vernonia-amygdalina.jpg",
        imageCredit: "Wikimedia Commons — Vernonia amygdalina",
        imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Vernonia_amygdalina_06.jpg",
        imageNote: "Photo d’illustration botanique; licence à vérifier sur la page source avant réutilisation.",
      },
      "ocimum-gratissimum": {
        imageUrl: "/images/plantes/ocimum-gratissimum.jpg",
        imageCredit: "Wikimedia Commons (Starr) — Ocimum gratissimum, fleurs et feuilles",
        imageSourceUrl: "https://commons.wikimedia.org/wiki/Category:Ocimum_gratissimum",
        imageNote: "Photo d’illustration botanique; licence à vérifier sur la page source avant réutilisation.",
      },
      "khaya-senegalensis": {
        imageUrl: "/images/plantes/khaya-senegalensis.jpg",
        imageCredit: "Wikimedia Commons — Khaya senegalensis (fruits et feuilles)",
        imageSourceUrl: "https://commons.wikimedia.org/wiki/Category:Khaya_senegalensis",
        imageNote: "Photo d’illustration botanique; licence à vérifier sur la page source avant réutilisation.",
      },
      "cryptolepis-sanguinolenta": {
        imageUrl: "/images/plantes/cryptolepis-sanguinolenta.jpg",
        imageCredit: "Botanical Institute — Cryptolepis sanguinolenta (feuillage et fleurs)",
        imageSourceUrl: "https://botanicalinstitute.org/cryptolepis/",
        imageNote: "Photo issue d’un article de vulgarisation; identification à confirmer par un botaniste.",
      },
      "morinda-lucida": {
        imageUrl: "/images/plantes/morinda-lucida.jpg",
        imageCredit: "Congotrees / Royal Botanic Garden Edinburgh — Morinda lucida (boutons floraux)",
        imageSourceUrl: "https://congotrees.rbge.org.uk/species/details/morinda-lucida",
        imageNote: "Photo d’illustration botanique; licence à vérifier sur la page source avant réutilisation.",
      },
      "alchornea-cordifolia": {
        imageUrl: "/images/plantes/alchornea-cordifolia.jpg",
        imageCredit: "DR Congo Flora — Alchornea cordifolia (feuilles et inflorescences)",
        imageSourceUrl: "https://drcongoflora.com/speciesdata/species.php?species_id=241370",
        imageNote: "Photo d’illustration botanique; licence à vérifier sur la page source avant réutilisation.",
      },
      "guiera-senegalensis": {
        imageUrl: "/images/plantes/guiera-senegalensis.jpg",
        imageCredit: "Wikimedia Commons — Guiera senegalensis",
        imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Guiera_senegalensis_MS_1357.JPG",
        imageNote: "Photo d’illustration botanique; licence à vérifier sur la page source avant réutilisation.",
      },
      "picralima-nitida": {
        imageUrl: "/images/plantes/picralima-nitida.jpg",
        imageCredit: "Wikimedia Commons — Picralima nitida (jeunes feuilles)",
        imageSourceUrl: "https://species.wikimedia.org/wiki/Picralima_nitida",
        imageNote: "Photo d’illustration botanique; licence à vérifier sur la page source avant réutilisation.",
      },
      "enantia-chlorantha": {
        imageUrl: "/images/plantes/enantia-chlorantha.jpg",
        imageCredit: "Herbal Zoo Services — Enantia chlorantha (écorce, bois jaune)",
        imageSourceUrl: "https://herbalzooservices.com/product/enantia-chlorantha/",
        imageNote: "Photo commerciale d’illustration; identification à confirmer par un botaniste.",
      },
      "mangifera-indica": {
        imageUrl: "/images/plantes/mangifera-indica.jpg",
        imageCredit: "Tropical The Ferns — Mangifera indica (feuilles et fruits)",
        imageSourceUrl: "https://tropical.theferns.info/viewtropical.php?id=Mangifera+indica",
        imageNote: "Photo d’illustration botanique; licence à vérifier sur la page source avant réutilisation.",
      },
      "moringa-oleifera": {
        imageUrl: "/images/plantes/moringa-oleifera.jpg",
        imageCredit: "Wikimedia Commons (Starr) — Moringa oleifera, feuilles",
        imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Starr-150325-0582-Moringa_oleifera-leaves-Community_Garden_Sand_Island-Midway_Atoll_(24635445594).jpg",
        imageNote: "Photo d’illustration botanique; licence à vérifier sur la page source avant réutilisation.",
      },
    };

    const plantBySlug = new Map<string, number>();
    for (const plant of plantRows) {
      const [saved] = await tx
        .insert(plants)
        .values({ ...plant, ...(plantImages[plant.slug] ?? {}) })
        .onConflictDoUpdate({
          target: plants.slug,
          set: {
            scientificName: plant.scientificName,
            botanicalAuthor: plant.botanicalAuthor,
            family: plant.family,
            commonNames: plant.commonNames,
            synonyms: plant.synonyms,
            summary: plant.summary,
            sourceRegions: plant.sourceRegions,
            partsUsed: plant.partsUsed,
            ...(plantImages[plant.slug] ?? {}),
            updatedAt: new Date(),
          },
        })
        .returning({ id: plants.id });
      plantBySlug.set(plant.slug, saved.id);
    }

    const [malaria] = await tx
      .insert(pathologies)
      .values({
        slug: "paludisme",
        name: "Paludisme (malaria)",
        summary:
          "Les publications reliées à cette page étudient des extraits végétaux face à différentes espèces ou formes de Plasmodium, en culture, chez l’animal ou dans des modèles de transmission.",
        scopeNote:
          "Ces travaux expérimentaux ne permettent pas de diagnostiquer le paludisme ni de recommander une plante. Les signes de maladie doivent être évalués par un professionnel de santé; un traitement prescrit ne doit pas être remplacé.",
      })
      .onConflictDoUpdate({
        target: pathologies.slug,
        set: {
          name: "Paludisme (malaria)",
          summary:
            "Les publications reliées à cette page étudient des extraits végétaux face à différentes espèces ou formes de Plasmodium, en culture, chez l’animal ou dans des modèles de transmission.",
          scopeNote:
            "Ces travaux expérimentaux ne permettent pas de diagnostiquer le paludisme ni de recommander une plante. Les signes de maladie doivent être évalués par un professionnel de santé; un traitement prescrit ne doit pas être remplacé.",
        },
      })
      .returning({ id: pathologies.id });

    const diarrhoeaSummary =
      "Les sources reliées à cette page sont des enquêtes ethnobotaniques menées au Bénin : elles recensent les plantes que des praticiens citent pour les diarrhées et les infections digestives. Aucun essai clinique n’est associé à ce dossier pour le moment.";
    const diarrhoeaScope =
      "Une diarrhée peut être grave, en particulier chez le nourrisson, l’enfant et la personne âgée. La réhydratation et un avis médical sont prioritaires; aucune plante de cette page ne constitue une recommandation de traitement.";

    const [diarrhoea] = await tx
      .insert(pathologies)
      .values({
        slug: "diarrhees-infectieuses",
        name: "Diarrhées infectieuses",
        summary: diarrhoeaSummary,
        scopeNote: diarrhoeaScope,
      })
      .onConflictDoUpdate({
        target: pathologies.slug,
        set: { name: "Diarrhées infectieuses", summary: diarrhoeaSummary, scopeNote: diarrhoeaScope },
      })
      .returning({ id: pathologies.id });

    const mechanismRows = [
      {
        slug: "croissance-plasmodium",
        name: "Croissance de Plasmodium en modèles expérimentaux",
        description:
          "Essais qui mesurent l’effet d’un extrait ou d’une molécule sur des parasites Plasmodium en culture ou chez l’animal. Le résultat dépend du modèle, de la souche et de la préparation testée.",
        readingText:
          "Une activité mesurée dans une boîte de laboratoire ou chez une souris ne prouve pas qu’une plante soigne une personne. Elle sert à poser une question de recherche, qui doit être confirmée par des étapes précliniques et cliniques appropriées.",
      },
      {
        slug: "transmission-plasmodium",
        name: "Stades de développement et transmission du parasite",
        description:
          "Certains travaux mesurent des stades du parasite dans l’hôte, en laboratoire ou chez le moustique vecteur. Ce sont des résultats de modèles expérimentaux distincts d’un bénéfice clinique.",
        readingText:
          "Le bloc « transmission » décrit un protocole expérimental qui suit le parasite et le vecteur. Il ne constitue ni une stratégie de prévention personnelle ni un conseil de traitement.",
      },
      {
        slug: "inhibition-bacterienne-in-vitro",
        name: "Croissance bactérienne en laboratoire",
        description:
          "Mesure de l’inhibition de bactéries sélectionnées par des extraits, dans des tests in vitro tels que la diffusion sur gélose.",
        readingText:
          "Un halo d’inhibition observé sur une boîte de culture ne prouve pas l’efficacité contre une infection chez un patient. Les concentrations, la formulation et les conditions d’essai ne représentent pas un usage médical.",
      },
    ];

    const mechanismBySlug = new Map<string, number>();
    for (const mechanism of mechanismRows) {
      const [saved] = await tx
        .insert(mechanisms)
        .values(mechanism)
        .onConflictDoUpdate({ target: mechanisms.slug, set: mechanism })
        .returning({ id: mechanisms.id });
      mechanismBySlug.set(mechanism.slug, saved.id);
    }

    const claimRows: Array<{
      slug: string;
      plantSlug: string;
      mechanismSlug: string | null;
      pathologyId: number | null;
      claimText: string;
      evidenceLevel: EvidenceLevel;
      rationale: string;
      limitations: string;
      studySlug: string;
      additionalStudySlugs?: string[];
    }> = [
      {
        slug: "nauclea-extrait-contre-plasmodium-in-vitro",
        plantSlug: "nauclea-latifolia",
        mechanismSlug: "croissance-plasmodium",
        pathologyId: malaria.id,
        claimText:
          "Des extraits aqueux de tiges et de racines ont inhibé P. falciparum dans un essai in vitro; l’article situe l’effet surtout en fin du cycle érythrocytaire.",
        evidenceLevel: "PRECLINICAL",
        rationale:
          "Le résultat repose sur une étude de laboratoire menée sur des extraits aqueux et deux souches de P. falciparum.",
        limitations:
          "Aucun essai clinique humain dans cette publication; les extraits testés ne sont pas équivalents à une préparation ou à une dose d’usage.",
        studySlug: "nauclea-latifolia-1998-in-vitro",
      },
      {
        slug: "alstonia-modele-murin-plasmodium",
        plantSlug: "alstonia-boonei",
        mechanismSlug: "croissance-plasmodium",
        pathologyId: malaria.id,
        claimText:
          "Une étude chez des souris infectées par P. berghei a observé une baisse de parasitémie dans les groupes recevant des extraits d’A. boonei, comparés au témoin infecté.",
        evidenceLevel: "PRECLINICAL",
        rationale:
          "Le niveau est limité à un modèle animal expérimental décrit dans l’article de 2021.",
        limitations:
          "Résultat chez la souris; il ne démontre pas une efficacité, une posologie ou une sécurité chez l’humain.",
        studySlug: "alstonia-boonei-2021-souris",
      },
      {
        slug: "vernonia-stades-transmission-plasmodium",
        plantSlug: "vernonia-amygdalina",
        mechanismSlug: "transmission-plasmodium",
        pathologyId: malaria.id,
        claimText:
          "Des extraits de feuilles et des fractions ont affecté plusieurs stades de Plasmodium dans des essais de laboratoire, des modèles murins et des moustiques vecteurs.",
        evidenceLevel: "PRECLINICAL",
        rationale:
          "Étude multi-modèles; le résultat publié porte sur des mesures expérimentales de parasites et de transmission, pas sur des patients traités.",
        limitations:
          "Les modèles et les extraits sont spécifiques à l’étude; pas de conclusion d’efficacité clinique ou de prévention chez l’humain.",
        studySlug: "vernonia-amygdalina-2015-transmission",
      },
      {
        slug: "ocimum-activite-antimicrobienne-in-vitro",
        plantSlug: "ocimum-gratissimum",
        mechanismSlug: "inhibition-bacterienne-in-vitro",
        pathologyId: null,
        claimText:
          "Des extraits de feuilles séchées ont inhibé certaines bactéries dans les conditions d’un essai antimicrobien in vitro.",
        evidenceLevel: "PRECLINICAL",
        rationale:
          "Le papier rapporte des tests de laboratoire sur des extraits aqueux et hydroéthanoliques contre plusieurs bactéries sélectionnées.",
        limitations:
          "Aucun résultat clinique; une inhibition sur gélose ne signifie pas qu’une infection peut être soignée par la plante.",
        studySlug: "ocimum-gratissimum-2017-antimicrobien",
      },
      {
        slug: "khaya-activite-antiplasmodiale-in-vitro",
        plantSlug: "khaya-senegalensis",
        mechanismSlug: "croissance-plasmodium",
        pathologyId: malaria.id,
        claimText:
          "Un extrait méthanolique d’écorce et des limonoïdes isolés ont été évalués in vitro sur différentes souches de P. falciparum.",
        evidenceLevel: "PRECLINICAL",
        rationale:
          "Le niveau est préclinique: le travail mesure l’activité en culture et décrit des molécules isolées.",
        limitations:
          "Pas de donnée d’efficacité clinique dans cette étude; résultats sensibles au modèle, à la souche et au matériel extrait.",
        studySlug: "khaya-senegalensis-2023-limonoides",
      },
      {
        slug: "vernonia-signal-toxicologie-corpus",
        plantSlug: "vernonia-amygdalina",
        mechanismSlug: null,
        pathologyId: null,
        claimText:
          "Dans une revue systématique des plantes africaines étudiées contre le paludisme, V. amygdalina figure parmi les espèces pour lesquelles des signaux de toxicité sont rapportés fréquemment.",
        evidenceLevel: "RISK_SIGNAL",
        rationale:
          "Signal de prudence indépendant de l’activité expérimentale: il est issu d’une synthèse de la littérature, pas d’un profil de risque propre à chaque préparation.",
        limitations:
          "La revue rassemble des essais hétérogènes; ce signal ne définit ni la probabilité ni la gravité d’un effet pour chaque produit ou chaque personne.",
        studySlug: "revue-plantes-africaines-paludisme-2021",
      },
      {
        slug: "cryptolepis-etude-clinique-preliminaire",
        plantSlug: "cryptolepis-sanguinolenta",
        mechanismSlug: null,
        pathologyId: malaria.id,
        claimText:
          "Un essai ouvert et non comparatif au Ghana a étudié une formulation de racines chez 44 personnes au départ; les auteurs rapportent une clairance parasitaire chez les personnes suivies, avec deux recrudescences tardives.",
        evidenceLevel: "INSUFFICIENT",
        rationale:
          "Il existe une observation clinique, mais un seul petit essai descriptif, sans groupe témoin, avec des pertes de suivi et des recrudescences ne suffit pas à établir une efficacité comparative.",
        limitations:
          "Ne constitue pas une recommandation de traitement. Les résultats ne peuvent pas être généralisés à d’autres préparations, populations ou contextes; une validation clinique indépendante serait nécessaire.",
        studySlug: "cryptolepis-sanguinolenta-2010-clinique",
      },
      {
        slug: "morinda-lucida-modele-murin",
        plantSlug: "morinda-lucida",
        mechanismSlug: "croissance-plasmodium",
        pathologyId: malaria.id,
        claimText:
          "Dans un modèle de souris infectées par P. berghei, les auteurs rapportent une réduction de parasitémie après administration d’extraits de M. lucida; le résultat dépend de l’extrait et de la dose testés.",
        evidenceLevel: "PRECLINICAL",
        rationale:
          "Résultat observé chez l’animal, avec une comparaison à un groupe témoin et un médicament de référence dans l’étude.",
        limitations:
          "Modèle murin et extraits expérimentaux; aucun effet clinique ni schéma d’utilisation chez l’humain ne peut en être déduit.",
        studySlug: "morinda-alstonia-2020-souris",
      },
      {
        slug: "alchornea-cordifolia-in-vitro",
        plantSlug: "alchornea-cordifolia",
        mechanismSlug: "croissance-plasmodium",
        pathologyId: malaria.id,
        claimText:
          "Un extrait aqueux de feuilles d’A. cordifolia a inhibé in vitro la croissance de trois souches de P. falciparum; les valeurs d’IC50 différaient selon la souche.",
        evidenceLevel: "PRECLINICAL",
        rationale:
          "L’affirmation s’appuie sur un essai de culture parasitaire publié en 2020; l’activité a été qualifiée de modérée par les auteurs dans leur protocole.",
        limitations:
          "Essai in vitro sur extrait aqueux; cela ne démontre pas d’effet chez une personne et ne permet pas d’extrapoler à d’autres préparations.",
        studySlug: "plantes-herbales-ghana-2020-in-vitro",
      },
      {
        slug: "guiera-alcaloides-in-vitro",
        plantSlug: "guiera-senegalensis",
        mechanismSlug: "croissance-plasmodium",
        pathologyId: malaria.id,
        claimText:
          "Des extraits d’alcaloïdes et des bêta-carbolines de G. senegalensis ont été évalués contre Plasmodium in vitro; la guieranone A a aussi montré une cytotoxicité envers des monocytes dans le même travail.",
        evidenceLevel: "PRECLINICAL",
        rationale:
          "Le résultat est issu d’essais cellulaires sur extraits et molécules isolées; le profil d’activité et de cytotoxicité est propre aux tests de cette publication.",
        limitations:
          "Les essais in vitro ne prédisent pas directement l’effet ou le risque d’une préparation chez l’humain. Le signal de cytotoxicité est aussi présenté séparément dans la fiche.",
        studySlug: "guiera-senegalensis-2006-in-vitro",
      },
      {
        slug: "guiera-decoction-souris",
        plantSlug: "guiera-senegalensis",
        mechanismSlug: "croissance-plasmodium",
        pathologyId: malaria.id,
        claimText:
          "Une décoction de feuilles de G. senegalensis a réduit la parasitémie dans un modèle murin de P. berghei; la réduction rapportée était la plus élevée à la dose expérimentale la plus basse testée.",
        evidenceLevel: "PRECLINICAL",
        rationale:
          "Étude expérimentale chez la souris au Burkina Faso, avec des groupes témoins et des doses définies par le protocole.",
        limitations:
          "Petit modèle animal et suivi de quatre jours; la réponse n’augmentait pas de façon monotone avec la dose et ne démontre pas d’efficacité humaine.",
        studySlug: "guiera-senegalensis-2018-souris",
      },
      {
        slug: "guiera-signal-cytotoxicite-guieranone",
        plantSlug: "guiera-senegalensis",
        mechanismSlug: null,
        pathologyId: null,
        claimText:
          "La guieranone A isolée de G. senegalensis a présenté une cytotoxicité envers des monocytes humains dans un essai de laboratoire.",
        evidenceLevel: "RISK_SIGNAL",
        rationale:
          "Signal de prudence issu d’un test de cytotoxicité publié, indépendant de l’activité antiplasmodiale mesurée.",
        limitations:
          "Résultat in vitro portant sur une molécule isolée; il ne permet pas de conclure sur le risque clinique d’une plante entière ou d’une préparation différente.",
        studySlug: "guiera-senegalensis-2006-in-vitro",
      },
      {
        slug: "picralima-nitida-extraits-in-vitro",
        plantSlug: "picralima-nitida",
        mechanismSlug: "croissance-plasmodium",
        pathologyId: malaria.id,
        claimText:
          "Des extraits de P. nitida ont inhibé des formes érythrocytaires de P. falciparum in vitro; les résultats les plus élevés concernaient certaines parties comme les racines, l’écorce ou le péricarpe, tandis que les feuilles et graines étaient généralement moins actives.",
        evidenceLevel: "PRECLINICAL",
        rationale:
          "Deux publications évaluent des extraits ou fractions contre des souches parasitaires en culture; leurs résultats distinguent les parties et solvants.",
        limitations:
          "Résultats in vitro, dépendants de l’organe et de l’extraction. Ils ne démontrent ni efficacité clinique ni sécurité d’une utilisation traditionnelle.",
        studySlug: "picralima-nitida-1996-in-vitro",
        additionalStudySlugs: ["picralima-nitida-1992-in-vitro"],
      },
      {
        slug: "enantia-chlorantha-modeles-murins",
        plantSlug: "enantia-chlorantha",
        mechanismSlug: "croissance-plasmodium",
        pathologyId: malaria.id,
        claimText:
          "Des extraits d’écorce d’E. chlorantha ont été testés dans des modèles murins de Plasmodium; deux publications rapportent une suppression parasitaire dans leurs protocoles expérimentaux.",
        evidenceLevel: "PRECLINICAL",
        rationale:
          "L’affirmation est soutenue par des études animales publiées à plusieurs décennies d’intervalle; aucune ne constitue un essai clinique humain.",
        limitations:
          "Les modèles, extraits et voies d’administration diffèrent; l’étude de 1991 rapporte un résultat dépendant de la voie d’administration. Aucune conclusion thérapeutique humaine n’est possible.",
        studySlug: "enantia-chlorantha-2025-souris",
        additionalStudySlugs: ["enantia-chlorantha-1991-souris"],
      },
      {
        slug: "mangifera-indica-activite-faible-in-vitro",
        plantSlug: "mangifera-indica",
        mechanismSlug: "croissance-plasmodium",
        pathologyId: malaria.id,
        claimText:
          "Dans l’essai ghanéen cité, l’extrait aqueux de feuilles de M. indica a montré une activité antiplasmodiale faible contre les souches testées, comparativement aux autres extraits étudiés.",
        evidenceLevel: "PRECLINICAL",
        rationale:
          "Résultat directement issu d’un essai in vitro de 72 heures; il documente aussi une activité faible ou absente plutôt que de sélectionner seulement les résultats positifs.",
        limitations:
          "Une activité faible dans ces conditions ne conclut ni sur d’autres préparations ni sur un usage médical; aucun résultat clinique n’est établi par cette étude.",
        studySlug: "plantes-herbales-ghana-2020-in-vitro",
      },
      {
        slug: "vernonia-diarrhees-benin-enquete",
        plantSlug: "vernonia-amygdalina",
        mechanismSlug: null,
        pathologyId: diarrhoea.id,
        claimText:
          "Dans une enquête menée auprès de 72 praticiens du Sud-Bénin, Vernonia amygdalina fait partie des plantes les plus indiquées pour les infections diarrhéiques.",
        evidenceLevel: "ETHNOBOTANICAL",
        rationale:
          "L’affirmation reprend une fréquence de citation recueillie par entretiens : elle documente une pratique rapportée, pas un effet mesuré.",
        limitations:
          "Enquête déclarative sans évaluation clinique; les organes et préparations varient d’un praticien à l’autre et ne sont pas standardisés.",
        studySlug: "benin-diarrhees-2021-enquete",
      },
      {
        slug: "ocimum-diarrhees-benin-enquete",
        plantSlug: "ocimum-gratissimum",
        mechanismSlug: null,
        pathologyId: diarrhoea.id,
        claimText:
          "Ocimum gratissimum est la plante la plus fréquemment citée pour les infections diarrhéiques dans une enquête conduite dans quatre villes du Sud-Bénin.",
        evidenceLevel: "ETHNOBOTANICAL",
        rationale:
          "Le résultat provient des entretiens (52 herboristes, 20 guérisseurs) analysés par les auteurs avec des indices de valeur d’usage et de consensus.",
        limitations:
          "Une fréquence de citation mesure la notoriété d’un usage; elle ne démontre ni efficacité ni innocuité et ne renseigne pas sur les quantités employées.",
        studySlug: "benin-diarrhees-2021-enquete",
      },
      {
        slug: "alchornea-diarrhees-benin-enquete",
        plantSlug: "alchornea-cordifolia",
        mechanismSlug: null,
        pathologyId: diarrhoea.id,
        claimText:
          "Alchornea cordifolia est citée par les praticiens interrogés au Sud-Bénin parmi les plantes utilisées contre les diarrhées et les infections digestives.",
        evidenceLevel: "ETHNOBOTANICAL",
        rationale:
          "Il s’agit d’un usage rapporté lors d’entretiens semi-structurés, sans mesure d’activité dans cette publication.",
        limitations:
          "Aucun test biologique ni essai clinique dans cette enquête; l’usage déclaré ne permet pas de conclure à un bénéfice.",
        studySlug: "benin-diarrhees-2021-enquete",
      },
      {
        slug: "picralima-usages-sud-benin",
        plantSlug: "picralima-nitida",
        mechanismSlug: null,
        pathologyId: null,
        claimText:
          "Au Sud-Bénin, des personnes des groupes Fon, Goun, Nago et Aïzo rapportent 21 usages thérapeutiques différents de Picralima nitida, à partir des graines, racines, feuilles et écorces.",
        evidenceLevel: "ETHNOBOTANICAL",
        rationale:
          "Enquête ethnobotanique auprès de 240 personnes, avec calcul d’indices de valeur d’usage et comparaison entre groupes socio-culturels.",
        limitations:
          "Inventaire d’usages déclarés : aucune mesure d’efficacité ou de sécurité; plusieurs usages reposent sur des connaissances peu transmises selon les auteurs.",
        studySlug: "picralima-sud-benin-2017-enquete",
      },
      {
        slug: "moringa-oleifera-inactif-dans-essai",
        plantSlug: "moringa-oleifera",
        mechanismSlug: "croissance-plasmodium",
        pathologyId: malaria.id,
        claimText:
          "L’extrait aqueux de feuilles de M. oleifera n’a pas montré d’activité antiplasmodiale dans les souches et les conditions de l’essai ghanéen cité.",
        evidenceLevel: "PRECLINICAL",
        rationale:
          "Il s’agit d’un résultat négatif précis d’un essai in vitro, conservé pour éviter de ne présenter que des résultats positifs.",
        limitations:
          "Ce résultat limité à un extrait et un protocole ne prouve pas l’absence générale d’activité ou de risque, et ne renseigne pas sur une efficacité clinique.",
        studySlug: "plantes-herbales-ghana-2020-in-vitro",
      },
    ];

    const claimBySlug = new Map<string, number>();
    for (const claim of claimRows) {
      const plantId = plantBySlug.get(claim.plantSlug);
      const mechanismId = claim.mechanismSlug ? mechanismBySlug.get(claim.mechanismSlug) ?? null : null;
      if (!plantId) throw new Error(`Missing plant for claim ${claim.slug}`);
      const [saved] = await tx
        .insert(claims)
        .values({
          slug: claim.slug,
          plantId,
          mechanismId,
          pathologyId: claim.pathologyId,
          claimText: claim.claimText,
          evidenceLevel: claim.evidenceLevel,
          rationale: claim.rationale,
          limitations: claim.limitations,
          reviewerStatus: "Classement éditorial initial · à valider par un expert",
          expertReviewer: null,
          reviewedAt: null,
        })
        .onConflictDoUpdate({
          target: claims.slug,
          set: {
            plantId,
            mechanismId,
            pathologyId: claim.pathologyId,
            claimText: claim.claimText,
            evidenceLevel: claim.evidenceLevel,
            rationale: claim.rationale,
            limitations: claim.limitations,
            reviewerStatus: "Classement éditorial initial · à valider par un expert",
            expertReviewer: null,
            reviewedAt: null,
            updatedAt: new Date(),
          },
        })
        .returning({ id: claims.id });
      claimBySlug.set(claim.slug, saved.id);

      const linkedStudySlugs = [claim.studySlug, ...(claim.additionalStudySlugs ?? [])];
      for (const studySlug of linkedStudySlugs) {
        const studyId = studyBySlug.get(studySlug);
        if (!studyId) throw new Error(`Missing study ${studySlug} for claim ${claim.slug}`);
        await tx
          .insert(claimStudies)
          .values({ claimId: saved.id, studyId })
          .onConflictDoNothing();
      }
    }

    const useRows = [
      {
        slug: "nauclea-usage-cote-ivoire",
        plantSlug: "nauclea-latifolia",
        description:
          "Les auteurs rapportent que l’espèce est utilisée par des tradipraticiens en Côte d’Ivoire dans le contexte du paludisme. Cette observation documente une pratique citée dans l’article; elle ne prouve pas une efficacité médicale.",
        region: "Côte d’Ivoire (rapporté dans la publication)",
        community: null,
        partReported: "Tiges et racines mentionnées dans l’étude",
        preparationReported:
          "Infusion et décoction décrites comme formes traditionnelles dans l’article — information documentaire, pas une instruction de préparation.",
        studySlug: "nauclea-latifolia-1998-in-vitro",
        sourceContext: "Contexte ethnobotanique rapporté par les auteurs de l’étude de 1998.",
      },
      {
        slug: "alstonia-usages-revue-ouest-afrique",
        plantSlug: "alstonia-boonei",
        description:
          "Une revue décrit des usages médicinaux rapportés pour A. boonei dans plusieurs régions d’Afrique de l’Ouest. Les pratiques présentées varient selon les sources et ne constituent pas une validation clinique.",
        region: "Afrique de l’Ouest (synthèse de littérature)",
        community: null,
        partReported: "Les parties diffèrent selon les études; voir les références originales.",
        preparationReported: null,
        studySlug: "alstonia-boonei-revue-2012",
        sourceContext: "Revue ethnobotanique, sans prescription ni validation d’une recette.",
      },
      {
        slug: "vernonia-usage-litterature",
        plantSlug: "vernonia-amygdalina",
        description:
          "L’article présente les feuilles de l’espèce dans le contexte de la médecine traditionnelle et étudie ensuite des extraits en modèles expérimentaux. Aucune enquête communautaire locale n’est résumée dans cette fiche.",
        region: "Contexte général de la littérature citée; région précise non détaillée ici",
        community: null,
        partReported: "Feuilles",
        preparationReported: null,
        studySlug: "vernonia-amygdalina-2015-transmission",
        sourceContext: "Le contexte d’usage est séparé des résultats expérimentaux et n’en constitue pas une preuve.",
      },
      {
        slug: "ocimum-usage-litterature",
        plantSlug: "ocimum-gratissimum",
        description:
          "Les auteurs décrivent l’espèce comme utilisée dans l’alimentation et la médecine en zone tropicale. L’étude citée porte sur des feuilles séchées et des tests de laboratoire, et non sur une efficacité clinique.",
        region: "Zone tropicale; étude menée au Nigeria",
        community: null,
        partReported: "Feuilles séchées",
        preparationReported: null,
        studySlug: "ocimum-gratissimum-2017-antimicrobien",
        sourceContext: "Énoncé de contexte des auteurs; aucune indication médicale n’est formulée ici.",
      },
      {
        slug: "khaya-usage-litterature",
        plantSlug: "khaya-senegalensis",
        description:
          "La publication décrit K. senegalensis comme une plante médicinale camerounaise. Les informations de cette fiche portent surtout sur une étude phytochimique et expérimentale; aucun usage communautaire précis n’est attribué.",
        region: "Cameroun (contexte de la publication)",
        community: null,
        partReported: "Écorce de tige dans l’étude de 2023",
        preparationReported: null,
        studySlug: "khaya-senegalensis-2023-limonoides",
        sourceContext: "Mention de contexte dans l’article; ce n’est pas une recommandation d’usage.",
      },
      {
        slug: "cryptolepis-usages-ghana",
        plantSlug: "cryptolepis-sanguinolenta",
        description:
          "L’article clinique situe les racines de l’espèce dans la médecine traditionnelle ghanéenne liée au paludisme, puis évalue une formulation expérimentale. Ce contexte d’usage ne valide pas la sécurité ou l’efficacité d’autres préparations.",
        region: "Ghana (contexte rapporté par l’étude)",
        community: null,
        partReported: "Racines",
        preparationReported: "Une formulation en sachet est décrite dans l’essai; cette description bibliographique n’est pas une instruction d’usage.",
        studySlug: "cryptolepis-sanguinolenta-2010-clinique",
        sourceContext: "Contexte ethnomédicinal rapporté par l’article clinique ouvert de 2010.",
      },
      {
        slug: "morinda-usage-litterature",
        plantSlug: "morinda-lucida",
        description:
          "La publication décrit M. lucida comme l’une des plantes utilisées dans le contexte du paludisme, avant d’évaluer des extraits chez des souris. L’usage rapporté et le résultat animal restent des informations distinctes.",
        region: "Nigeria (contexte de l’étude)",
        community: null,
        partReported: "Feuilles et écorce étudiées",
        preparationReported: null,
        studySlug: "morinda-alstonia-2020-souris",
        sourceContext: "Mention de contexte dans l’étude expérimentale; aucune recommandation n’est formulée.",
      },
      {
        slug: "alchornea-usage-cote-ivoire",
        plantSlug: "alchornea-cordifolia",
        description:
          "Après une enquête ethnobotanique en Côte d’Ivoire, les auteurs indiquent que des tradipraticiens utilisaient A. cordifolia parmi les plantes étudiées dans le contexte du paludisme. Ils ont ensuite testé des extraits en laboratoire.",
        region: "Côte d’Ivoire (enquête rapportée dans la publication)",
        community: "Tradipraticiens cités par les auteurs; communauté non précisée dans cette notice",
        partReported: null,
        preparationReported: "Décoction aqueuse mentionnée par l’article comme méthode d’extraction/usage rapportée; information descriptive, pas une recette.",
        studySlug: "plantes-ouest-afrique-2000-enquete-in-vitro",
        sourceContext: "Enquête ethnobotanique suivie d’essais in vitro; l’une ne prouve pas l’efficacité de l’autre.",
      },
      {
        slug: "alchornea-usage-benin-enquete",
        plantSlug: "alchornea-cordifolia",
        description:
          "A. cordifolia figure parmi les espèces ligneuses les plus citées par les professionnels interrogés dans une enquête ethnobotanique couvrant le Bénin. La notice de synthèse ne rattache pas cette fréquence à une indication unique.",
        region: "Bénin (enquête nationale)",
        community: "590 professionnels de la médecine traditionnelle interrogés dans l’étude",
        partReported: "Les organes ne sont pas détaillés pour cette espèce dans le résumé de l’étude.",
        preparationReported: null,
        studySlug: "benin-woody-species-2021-enquete",
        sourceContext: "Fréquence de citation dans une enquête; ce n’est pas une mesure d’efficacité ou de sécurité.",
      },
      {
        slug: "guiera-usage-sahel",
        plantSlug: "guiera-senegalensis",
        description:
          "Une publication sur les constituants de G. senegalensis décrit des associations végétales traditionnellement rapportées pour le paludisme. Ce contexte ethnobotanique ne justifie pas les associations comme traitement.",
        region: "Sahel ouest-africain (contexte des sources citées)",
        community: null,
        partReported: "Feuilles et racines étudiées dans la publication",
        preparationReported: null,
        studySlug: "guiera-senegalensis-2006-in-vitro",
        sourceContext: "Contexte de littérature rapporté par les auteurs; aucune posologie ou préparation n’est proposée.",
      },
      {
        slug: "picralima-usage-revue",
        plantSlug: "picralima-nitida",
        description:
          "Une revue de littérature décrit différents usages ethnomédicinaux de parties de P. nitida en Afrique de l’Ouest, dont des usages rapportés pour des symptômes fébriles. Une revue ne constitue pas une enquête communautaire ni une validation clinique.",
        region: "Afrique de l’Ouest (littérature compilée)",
        community: null,
        partReported: "Différentes parties sont rapportées dans les références citées par la revue.",
        preparationReported: null,
        studySlug: "picralima-nitida-revue-2014",
        sourceContext: "Revue narrative; les pratiques varient selon les sources et ne sont pas une recommandation.",
      },
      {
        slug: "enantia-usage-nigeria",
        plantSlug: "enantia-chlorantha",
        description:
          "La littérature citée présente E. chlorantha dans le contexte de pratiques traditionnelles contre le paludisme au Nigeria; les publications associées décrivent des modèles animaux, pas un essai de traitement chez des patients.",
        region: "Nigeria (contexte de littérature et d’étude)",
        community: null,
        partReported: "Écorce de tige dans les études associées",
        preparationReported: null,
        studySlug: "enantia-chlorantha-2025-souris",
        sourceContext: "Information de contexte ethnobotanique; elle ne prouve pas d’efficacité clinique.",
      },
      {
        slug: "mangifera-usage-benin-enquete",
        plantSlug: "mangifera-indica",
        description:
          "M. indica figure parmi les espèces ligneuses les plus citées dans l’enquête béninoise. Cette fréquence documente les réponses des personnes interrogées, sans identifier à elle seule un usage médical ou une efficacité.",
        region: "Bénin (enquête nationale)",
        community: "590 professionnels de la médecine traditionnelle interrogés dans l’étude",
        partReported: "Non précisée pour cette espèce dans le résumé de l’étude.",
        preparationReported: null,
        studySlug: "benin-woody-species-2021-enquete",
        sourceContext: "Donnée de fréquence de citation; ne constitue pas une preuve clinique.",
      },
      {
        slug: "alchornea-usage-diarrhees-benin",
        plantSlug: "alchornea-cordifolia",
        description:
          "Dans une enquête menée auprès de 72 praticiens du Sud-Bénin, A. cordifolia est citée parmi les plantes utilisées contre les diarrhées et les infections digestives. Les auteurs recensent 39 symptômes ou maladies traités par les 17 plantes étudiées.",
        region: "Bénin (Cotonou, Ouidah, Abomey-Calavi, Porto-Novo)",
        community: "52 herboristes de marché et 20 guérisseurs interrogés",
        partReported: "Feuilles (organe majoritairement cité pour cette espèce dans l’enquête)",
        preparationReported:
          "Préparations variables selon les praticiens (décoctions et macérations citées) — information documentaire, pas une instruction de préparation.",
        studySlug: "benin-diarrhees-2021-enquete",
        sourceContext: "Usage rapporté par entretiens semi-structurés; aucune mesure d’efficacité.",
      },
      {
        slug: "picralima-usage-sud-benin",
        plantSlug: "picralima-nitida",
        description:
          "Au Sud-Bénin, 240 personnes des groupes Fon, Goun, Nago et Aïzo décrivent 21 traitements à base de P. nitida; les graines sont l’organe le plus utilisé, devant les racines, les feuilles et l’écorce.",
        region: "Bénin (Sud-Bénin, quatre groupes socio-culturels)",
        community: "Fon, Goun, Nago et Aïzo",
        partReported: "Graines (organe le plus cité), racines, feuilles, écorce",
        preparationReported: null,
        studySlug: "picralima-sud-benin-2017-enquete",
        sourceContext: "Inventaire d’usages déclarés; l’étude ne mesure ni efficacité ni sécurité.",
      },
    ];

    for (const use of useRows) {
      const plantId = plantBySlug.get(use.plantSlug);
      const sourceStudyId = studyBySlug.get(use.studySlug);
      if (!plantId || !sourceStudyId) throw new Error(`Missing relation for use ${use.slug}`);
      await tx
        .insert(traditionalUses)
        .values({
          slug: use.slug,
          plantId,
          description: use.description,
          region: use.region,
          community: use.community,
          partReported: use.partReported,
          preparationReported: use.preparationReported,
          sourceStudyId,
          sourceContext: use.sourceContext,
        })
        .onConflictDoUpdate({
          target: traditionalUses.slug,
          set: {
            description: use.description,
            region: use.region,
            community: use.community,
            partReported: use.partReported,
            preparationReported: use.preparationReported,
            sourceStudyId,
            sourceContext: use.sourceContext,
          },
        });
    }

    const compoundRows = [
      {
        slug: "vernodalol",
        name: "Vernodalol",
        chemicalFamily: "Lactone sesquiterpénique · élémanolide",
        description:
          "Molécule isolée et caractérisée dans l’étude sur V. amygdalina; elle a été évaluée dans un essai expérimental de développement précoce de Plasmodium.",
        plantSlug: "vernonia-amygdalina",
        studySlug: "vernonia-amygdalina-2015-transmission",
      },
      {
        slug: "vernolide",
        name: "Vernolide",
        chemicalFamily: "Lactone sesquiterpénique · germacranolide",
        description:
          "Molécule isolée à partir de V. amygdalina dans l’étude citée; l’activité rapportée dépend d’un essai de laboratoire spécifique.",
        plantSlug: "vernonia-amygdalina",
        studySlug: "vernonia-amygdalina-2015-transmission",
      },
      {
        slug: "21beta-hydroxybourjotinolone-a",
        name: "21β-hydroxybourjotinolone A",
        chemicalFamily: "Limonoïde",
        description:
          "Limonoïde caractérisé à partir de l’écorce de Khaya senegalensis dans l’étude de 2023; sa description chimique ne constitue pas une preuve d’usage clinique.",
        plantSlug: "khaya-senegalensis",
        studySlug: "khaya-senegalensis-2023-limonoides",
      },
      {
        slug: "21alpha-melianodiol",
        name: "21α-melianodiol",
        chemicalFamily: "Limonoïde",
        description:
          "Limonoïde rapporté comme constituant isolé de Khaya senegalensis dans l’étude phytochimique citée.",
        plantSlug: "khaya-senegalensis",
        studySlug: "khaya-senegalensis-2023-limonoides",
      },
      {
        slug: "21beta-melianodiol",
        name: "21β-melianodiol",
        chemicalFamily: "Limonoïde",
        description:
          "Limonoïde rapporté comme constituant isolé de Khaya senegalensis dans l’étude phytochimique citée.",
        plantSlug: "khaya-senegalensis",
        studySlug: "khaya-senegalensis-2023-limonoides",
      },
      {
        slug: "harman-guiera",
        name: "Harman",
        chemicalFamily: "Alcaloïde bêta-carbolique",
        description:
          "Alcaloïde isolé dans l’étude phytochimique sur les racines et feuilles de G. senegalensis, puis évalué dans des essais cellulaires antiplasmodiaux.",
        plantSlug: "guiera-senegalensis",
        studySlug: "guiera-senegalensis-2006-in-vitro",
      },
      {
        slug: "tetrahydroharman-guiera",
        name: "Tétrahydroharman (éléagnine)",
        chemicalFamily: "Alcaloïde bêta-carbolique",
        description:
          "Alcaloïde bêta-carbolique identifié dans les racines et feuilles de G. senegalensis et caractérisé dans la publication citée.",
        plantSlug: "guiera-senegalensis",
        studySlug: "guiera-senegalensis-2006-in-vitro",
      },
      {
        slug: "harmalan-guiera",
        name: "Harmalan (dihydroharman)",
        chemicalFamily: "Alcaloïde bêta-carbolique",
        description:
          "Alcaloïde isolé des racines de G. senegalensis dans l’étude de 2006 et évalué dans le contexte de ses essais phytochimiques et biologiques.",
        plantSlug: "guiera-senegalensis",
        studySlug: "guiera-senegalensis-2006-in-vitro",
      },
      {
        slug: "guieranone-a",
        name: "Guieranone A",
        chemicalFamily: "Naphtyl-buténone",
        description:
          "Constituant isolé des racines et feuilles de G. senegalensis. L’article rapporte une activité antiplasmodiale in vitro ainsi qu’une cytotoxicité envers des monocytes dans les conditions testées.",
        plantSlug: "guiera-senegalensis",
        studySlug: "guiera-senegalensis-2006-in-vitro",
      },
    ];

    const compoundBySlug = new Map<string, number>();
    for (const compound of compoundRows) {
      const [saved] = await tx
        .insert(compounds)
        .values({
          slug: compound.slug,
          name: compound.name,
          chemicalFamily: compound.chemicalFamily,
          description: compound.description,
        })
        .onConflictDoUpdate({
          target: compounds.slug,
          set: {
            name: compound.name,
            chemicalFamily: compound.chemicalFamily,
            description: compound.description,
          },
        })
        .returning({ id: compounds.id });
      compoundBySlug.set(compound.slug, saved.id);
      const plantId = plantBySlug.get(compound.plantSlug);
      const studyId = studyBySlug.get(compound.studySlug);
      if (!plantId || !studyId) throw new Error(`Missing relation for compound ${compound.slug}`);
      await tx
        .insert(plantCompounds)
        .values({ plantId, compoundId: saved.id, studyId })
        .onConflictDoNothing();
    }

    const plantStudySlugs: Record<string, string[]> = {
      "nauclea-latifolia": ["nauclea-latifolia-1998-in-vitro", "revue-plantes-africaines-paludisme-2021"],
      "alstonia-boonei": ["alstonia-boonei-2021-souris", "alstonia-boonei-revue-2012", "morinda-alstonia-2020-souris", "revue-plantes-africaines-paludisme-2021"],
      "vernonia-amygdalina": ["vernonia-amygdalina-2015-transmission", "revue-plantes-africaines-paludisme-2021", "benin-diarrhees-2021-enquete"],
      "ocimum-gratissimum": ["ocimum-gratissimum-2017-antimicrobien", "benin-diarrhees-2021-enquete"],
      "khaya-senegalensis": ["khaya-senegalensis-2023-limonoides", "revue-plantes-africaines-paludisme-2021"],
      "cryptolepis-sanguinolenta": ["cryptolepis-sanguinolenta-2010-clinique"],
      "morinda-lucida": ["morinda-alstonia-2020-souris"],
      "alchornea-cordifolia": ["plantes-herbales-ghana-2020-in-vitro", "plantes-ouest-afrique-2000-enquete-in-vitro", "benin-woody-species-2021-enquete", "benin-diarrhees-2021-enquete"],
      "guiera-senegalensis": ["guiera-senegalensis-2006-in-vitro", "guiera-senegalensis-2018-souris"],
      "picralima-nitida": ["picralima-nitida-1996-in-vitro", "picralima-nitida-1992-in-vitro", "picralima-nitida-revue-2014", "picralima-sud-benin-2017-enquete"],
      "enantia-chlorantha": ["enantia-chlorantha-1991-souris", "enantia-chlorantha-2025-souris"],
      "mangifera-indica": ["plantes-herbales-ghana-2020-in-vitro", "benin-woody-species-2021-enquete"],
      "moringa-oleifera": ["plantes-herbales-ghana-2020-in-vitro"],
    };

    for (const [plantSlug, studySlugs] of Object.entries(plantStudySlugs)) {
      const plantId = plantBySlug.get(plantSlug);
      if (!plantId) throw new Error(`Missing plant ${plantSlug}`);
      for (const studySlug of studySlugs) {
        const studyId = studyBySlug.get(studySlug);
        if (!studyId) throw new Error(`Missing study ${studySlug}`);
        await tx.insert(plantStudies).values({ plantId, studyId }).onConflictDoNothing();
      }
    }

    const safetyByPlant: Record<
      string,
      { summary: string; riskSignal: boolean; riskRationale: string | null; sourceStudySlug: string | null }
    > = {
      "vernonia-amygdalina": {
        summary:
          "Un signal de prudence bibliographique est recensé : une revue systématique rapporte des signaux de toxicité fréquemment pour cette espèce dans les études antiplasmodiales. Cela ne décrit pas le risque de chaque préparation.",
        riskSignal: true,
        riskRationale:
          "Signal indépendant du niveau d’activité; à interpréter selon la revue et ses limites, sans extrapolation à toutes les formes d’usage.",
        sourceStudySlug: "revue-plantes-africaines-paludisme-2021",
      },
      "guiera-senegalensis": {
        summary:
          "Un signal de prudence indépendant est rapporté : la guieranone A isolée de l’espèce a montré une cytotoxicité envers des monocytes dans un essai in vitro. Cela ne décrit pas le risque de toutes les parties ou préparations.",
        riskSignal: true,
        riskRationale:
          "Observation sur une molécule isolée et un modèle cellulaire; portée limitée, mais pertinente à afficher séparément du signal antiplasmodial.",
        sourceStudySlug: "guiera-senegalensis-2006-in-vitro",
      },
      "cryptolepis-sanguinolenta": {
        summary:
          "L’essai clinique ouvert rapporte des mesures biologiques et ne signale pas de toxicité évidente dans son petit échantillon. Le protocole, l’effectif, les pertes de suivi et le suivi limité ne permettent pas de conclure à une sécurité générale.",
        riskSignal: false,
        riskRationale: null,
        sourceStudySlug: "cryptolepis-sanguinolenta-2010-clinique",
      },
      "enantia-chlorantha": {
        summary:
          "Une étude décrit un test aigu chez la souris; ce type de résultat ne permet pas d’établir l’innocuité chez l’humain, les effets à long terme ou les interactions médicamenteuses.",
        riskSignal: false,
        riskRationale: null,
        sourceStudySlug: "enantia-chlorantha-2025-souris",
      },
    };

    for (const plant of plantRows) {
      const plantId = plantBySlug.get(plant.slug);
      if (!plantId) continue;
      const safety = safetyByPlant[plant.slug] ?? {
        summary:
          "Les références sélectionnées ne permettent pas d’établir la sécurité d’une préparation destinée à l’humain. Les résultats expérimentaux ne renseignent pas, à eux seuls, les interactions ni les effets à long terme.",
        riskSignal: false,
        riskRationale: null,
        sourceStudySlug: null,
      };
      const safetyValues = {
        plantId,
        summary: safety.summary,
        riskSignal: safety.riskSignal,
        riskRationale: safety.riskRationale,
        precautions:
          "Cette base n’indique aucune dose ni préparation à utiliser. Grossesse, allaitement, enfants, maladies et interactions médicamenteuses : données spécifiques non renseignées ici. Ne pas remplacer un traitement ou l’avis d’un professionnel de santé.",
        sourceStudyId: safety.sourceStudySlug ? studyBySlug.get(safety.sourceStudySlug) ?? null : null,
      };
      await tx
        .insert(plantSafety)
        .values(safetyValues)
        .onConflictDoUpdate({
          target: plantSafety.plantId,
          set: {
            summary: safetyValues.summary,
            riskSignal: safetyValues.riskSignal,
            riskRationale: safetyValues.riskRationale,
            precautions: safetyValues.precautions,
            sourceStudyId: safetyValues.sourceStudyId,
            updatedAt: new Date(),
          },
        });
    }

    return {
      plants: plantBySlug.size,
      studies: studyBySlug.size,
      claims: claimBySlug.size,
      compounds: compoundBySlug.size,
      traditionalUses: useRows.length,
    };
  });

  console.log("Seed terminé :", result);
}

seed()
  .catch((error: unknown) => {
    console.error("Échec du seed scientifique :", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
