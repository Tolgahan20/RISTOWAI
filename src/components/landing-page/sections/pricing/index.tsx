'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './pricing.module.css';
import { Activity, Briefcase, DollarSign, FileText, Globe, Layers, Shield, Users } from 'react-feather';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const roleSections = [
  {
    id: 'store-manager',
    title: 'Store Manager',
    description:
      'Il responsabile del punto vendita pianifica i turni, controlla il costo del lavoro e gestisce gli imprevisti operativi della settimana.',
    bullets: [
      { icon: Activity, text: 'Pianificazione turni settimanali' },
      { icon: DollarSign, text: 'Controllo costo del lavoro' },
      { icon: Users, text: 'Gestione assenze e sostituzioni' },
      { icon: Briefcase, text: 'Chiusura settimana operativa' },
    ],
    mockup: 'store' as const,
  },
  {
    id: 'area-manager',
    title: 'Area Manager',
    description:
      "L'area manager monitora più locali, individua criticità operative e coordina le azioni con i responsabili dei punti vendita.",
    bullets: [
      { icon: Activity, text: 'Confronto performance tra locali' },
      { icon: DollarSign, text: 'Identificazione criticità operative' },
      { icon: Layers, text: 'Coordinamento con store manager' },
      { icon: FileText, text: 'Preparazione discussion pack per area' },
    ],
    mockup: 'area' as const,
  },
  {
    id: 'headquarters',
    title: 'Headquarters',
    description:
      'La direzione monitora le performance della rete, controlla la compliance operativa e analizza i trend del costo del lavoro.',
    bullets: [
      { icon: Globe, text: 'Dashboard KPI di rete' },
      { icon: Activity, text: 'Analisi regionale' },
      { icon: Shield, text: 'Monitoraggio compliance' },
      { icon: FileText, text: 'Reporting operativo' },
    ],
    mockup: 'hq' as const,
  },
];

const storePresets = {
  low: {
    labour: '23.3%',
    labourTone: 'positive',
    budget: '58%',
    budgetFill: '58%',
    budgetTone: 'positive',
    hours: '280h',
    cost: '€6.720',
    suggestions: '2',
    alerts: [
      {
        title: 'Alert di copertura operativa',
        body: 'Barista mancante Dom 11:30-15:30 · Sala mancante Sab 18:00-23:00',
        tone: 'warning',
      },
      {
        title: 'Configurazione a costo minimo',
        body: 'Costo del lavoro nel target ma i livelli di servizio potrebbero risentirne nei picchi',
        tone: 'neutral',
      },
    ],
  },
  mid: {
    labour: '28.3%',
    labourTone: 'warm',
    budget: '72%',
    budgetFill: '72%',
    budgetTone: 'warm',
    hours: '340h',
    cost: '€8.160',
    suggestions: '3',
    alerts: [
      {
        title: 'Passa a LOW',
        body: 'Risparmio previsto: 60h x €24 = €1.440/settimana · Nessun rischio copertura nei giorni feriali',
        tone: 'positive',
      },
      {
        title: 'Alert',
        body: 'Barista mancante Dom 11:30-15:30 · Impatto stimato: 4 ore non coperte',
        tone: 'warning',
      },
      {
        title: 'Riduci 18h negli slot a bassa domanda',
        body: 'Mar/Mer mattina sotto soglia · Risparmio 18h x €24 = €432/settimana',
        tone: 'neutral',
      },
    ],
  },
  high: {
    labour: '34.2%',
    labourTone: 'danger',
    budget: '94%',
    budgetFill: '94%',
    budgetTone: 'danger',
    hours: '410h',
    cost: '€9.840',
    suggestions: '3',
    alerts: [
      {
        title: 'Sforamento budget previsto: +€8.600',
        body: 'Proiezione mensile: €42.600 vs €34.000 budget · Utilizzo al 125%',
        tone: 'warning',
      },
      {
        title: 'Passa a MID',
        body: 'Risparmio 70h x €24 = €1.680/settimana · Copertura weekend mantenuta',
        tone: 'positive',
      },
      {
        title: 'Riduci 70h negli slot a bassa domanda',
        body: 'Labour % da 34,2% verso target 30% — taglia i periodi a domanda bassa',
        tone: 'positive',
      },
    ],
  },
} as const;

const StoreMockup = () => {
  const [preset, setPreset] = useState<keyof typeof storePresets>('mid');
  const data = storePresets[preset];

  return (
    <div className={styles.dashboardCard}>
      <div className={styles.dashboardTop}>
        <div className={styles.dashboardBrand}>Ristowai</div>
        <div className={styles.dashboardMeta}>
          <span>Settimana 10, 2025</span>
          <span className={styles.statusBadge}>Aperta</span>
        </div>
      </div>

      <div key={preset} className={styles.mockupStage}>
        <div className={styles.metricGrid}>
          <div className={styles.metricBox}>
            <span className={styles.metricLabel}>Labour %</span>
            <strong
              className={
                data.labourTone === 'danger'
                  ? styles.metricNumberDanger
                  : data.labourTone === 'positive'
                    ? styles.metricNumberPositive
                    : styles.metricNumberAccent
              }
            >
              {data.labour}
            </strong>
            <span className={styles.metricHint}>Target 30%</span>
          </div>
          <div className={styles.metricBox}>
            <span className={styles.metricLabel}>Budget mese</span>
            <strong className={styles.metricNumber}>{data.budget}</strong>
            <div className={styles.progressTrack}>
              <div
                className={`${styles.progressFill} ${
                  data.budgetTone === 'danger'
                    ? styles.progressFillDanger
                    : data.budgetTone === 'positive'
                      ? styles.progressFill
                      : styles.progressFillWarm
                }`}
                style={{ width: data.budgetFill }}
              />
            </div>
          </div>
          <div className={styles.metricBox}>
            <span className={styles.metricLabel}>Ore totali</span>
            <strong className={styles.metricNumber}>{data.hours}</strong>
            <span className={styles.metricHint}>Questa settimana</span>
          </div>
          <div className={styles.metricBox}>
            <span className={styles.metricLabel}>Costo settimanale</span>
            <strong className={styles.metricNumber}>{data.cost}</strong>
            <span className={styles.metricHint}>Proiezione</span>
          </div>
        </div>

        <div className={styles.inlineFilters}>
          <span className={styles.filterLabel}>Preset operativi</span>
          <div className={styles.filterPills}>
            {(['low', 'mid', 'high'] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setPreset(item)}
                className={`${styles.filterPill} ${preset === item ? styles.filterPillActive : ''}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.inlineFilters}>
          <span className={styles.filterLabel}>Suggerimenti AI</span>
          <span className={styles.counterBadge}>{data.suggestions}</span>
        </div>

        <div className={styles.alertStack}>
          {data.alerts.map((alert) => (
            <div
              key={alert.title}
              className={`${styles.alertCard} ${
                alert.tone === 'positive'
                  ? styles.alertPositive
                  : alert.tone === 'warning'
                    ? styles.alertWarning
                    : ''
              }`}
            >
              <span className={styles.alertTitle}>{alert.title}</span>
              <span className={styles.alertBody}>{alert.body}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const areaViews = {
  locations: (
    <>
      <div className={styles.metricGridCompact}>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>Labour % area</span>
          <strong className={styles.metricNumber}>30.1%</strong>
        </div>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>Locali</span>
          <strong className={styles.metricNumber}>4</strong>
        </div>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>Allerte</span>
          <strong className={styles.metricNumberDanger}>2</strong>
        </div>
      </div>

      <div className={styles.locationList}>
        {[
          ['Trattoria Milano Centro', '26.8%', 'positive'],
          ['Caffè Roma Termini', '31.2%', 'danger'],
          ['Pizzeria Napoli Vomero', '28.5%', 'positive'],
          ['Bistrot Firenze', '34.1%', 'danger'],
        ].map(([name, value, tone]) => (
          <div key={name} className={styles.locationRow}>
            <span className={styles.locationName}>{name}</span>
            <span className={tone === 'danger' ? styles.rowTagDanger : styles.rowTagPositive}>{value}</span>
          </div>
        ))}
      </div>
    </>
  ),
  discussion: (
    <div className={styles.discussionList}>
      {[
        ['Bistrot Firenze', '+5.8%', '+0.3%', '+3.2%', '+2.3%', 'Revisione pianificazione turni'],
        ['Bar Roma', '+3.2%', '+1.1%', '+1.5%', '+0.6%', 'Strategia staffing weekend'],
        ['Pizzeria Napoli Vomero', '+2.1%', '+0.9%', '+0.7%', '+0.5%', 'Ottimizzazione copertura feriale'],
        ['Trattoria Milano Centro', '-0.8%', '-0.3%', '-0.2%', '-0.3%', 'Best practice da condividere'],
      ].map(([name, variance, demand, planning, execution, topic]) => (
        <div key={name} className={styles.discussionCard}>
          <div className={styles.discussionHeader}>
            <span className={styles.locationName}>{name}</span>
            <span className={variance.startsWith('-') ? styles.rowTagPositive : styles.statusBadgeMuted}>
              Labour variance {variance}
            </span>
          </div>
          <div className={styles.discussionMetrics}>
            <div className={styles.discussionMetric}>
              <span className={styles.metricLabel}>Demand</span>
              <strong className={variance.startsWith('-') ? styles.metricMicroPositive : styles.metricMicroDanger}>{demand}</strong>
            </div>
            <div className={styles.discussionMetric}>
              <span className={styles.metricLabel}>Planning</span>
              <strong className={variance.startsWith('-') ? styles.metricMicroPositive : styles.metricMicroDanger}>{planning}</strong>
            </div>
            <div className={styles.discussionMetric}>
              <span className={styles.metricLabel}>Execution</span>
              <strong className={variance.startsWith('-') ? styles.metricMicroPositive : styles.metricMicroDanger}>{execution}</strong>
            </div>
          </div>
          <span className={styles.alertBody}>Topic: {topic}</span>
        </div>
      ))}
    </div>
  ),
  compare: (
    <div className={styles.compareTable}>
      <div className={styles.compareRowHeader}>
        {['Metrica', 'Trattoria', 'Caffè', 'Pizzeria', 'Bistrot', 'Target'].map((item) => (
          <span key={item} className={styles.compareHeaderCell}>{item}</span>
        ))}
      </div>
      {[
        ['Labour %', '26.8%', '31.2%', '28.5%', '34.1%', '30%'],
        ['Ore/Sett.', '320h', '450h', '280h', '210h', '300h'],
        ['Costo/Coperto', '4.2€', '5.8€', '4.5€', '6.1€', '5€'],
        ['Score Copertura', '98%', '87%', '95%', '78%', '90%'],
      ].map((row) => (
        <div key={row[0]} className={styles.compareRow}>
          {row.map((cell, index) => (
            <span
              key={`${row[0]}-${cell}`}
              className={`${styles.compareCell} ${
                index > 0 && index < row.length - 1
                  ? Number.parseFloat(cell) <= Number.parseFloat(row[row.length - 1])
                    ? styles.metricMicroPositive
                    : styles.metricMicroDanger
                  : ''
              }`}
            >
              {cell}
            </span>
          ))}
        </div>
      ))}
    </div>
  ),
} as const;

const AreaMockup = () => {
  const [view, setView] = useState<keyof typeof areaViews>('locations');

  return (
    <div className={styles.dashboardCard}>
      <div className={styles.dashboardTop}>
        <div className={styles.dashboardBrand}>Ristowai Area Manager</div>
        <div className={styles.dashboardMeta}>
          <span>Area Nord</span>
          <span className={styles.statusBadgeMuted}>2 alert</span>
        </div>
      </div>

      <div className={styles.segmentedTabs}>
        {[
          ['locations', 'Locali'],
          ['discussion', 'Discussion Pack'],
          ['compare', 'Confronto'],
        ].map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setView(key as keyof typeof areaViews)}
            className={`${styles.segmentTab} ${view === key ? styles.segmentTabActive : ''}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div key={view} className={styles.mockupStage}>
        {areaViews[view]}
      </div>
    </div>
  );
};

const hqViews = {
  network: (
    <>
      <div className={styles.metricGridCompact}>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>Locali</span>
          <strong className={styles.metricNumber}>42</strong>
          <span className={styles.metricHint}>Locali</span>
        </div>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>Dipendenti</span>
          <strong className={styles.metricNumber}>684</strong>
          <span className={styles.metricHint}>Dipendenti</span>
        </div>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>Costo settimanale</span>
          <strong className={styles.metricNumber}>€487.200</strong>
          <span className={styles.metricHint}>Costo settimanale</span>
        </div>
      </div>

      <div className={styles.dualPanel}>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>Labour % rete</span>
          <strong className={styles.metricNumber}>28.9%</strong>
          <span className={styles.metricHintPositive}>↘ 1.2% vs settimana scorsa</span>
        </div>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>Budget mese</span>
          <strong className={styles.metricNumber}>71%</strong>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} />
          </div>
        </div>
      </div>

      <div className={styles.regionPanel}>
        <span className={styles.metricLabel}>Panoramica regionale</span>
        {[
          ['Nord Italia', '14 locali', '27.4%', 'positive'],
          ['Centro Italia', '12 locali', '29.8%', 'positive'],
          ['Sud Italia', '10 locali', '30.5%', 'danger'],
          ['Isole', '6 locali', '27.1%', 'positive'],
        ].map(([region, stores, value, tone]) => (
          <div key={region} className={styles.regionRow}>
            <div className={styles.regionMeta}>
              <span className={styles.regionName}>{region}</span>
              <span className={styles.regionStores}>{stores}</span>
            </div>
            <span className={tone === 'danger' ? styles.rowTagDanger : styles.rowTagPositive}>{value}</span>
          </div>
        ))}
      </div>
    </>
  ),
  regions: (
    <div className={styles.regionCards}>
      {[
        ['Nord Italia', '14', '228', '27.4%', '↘ 0.8%', '€162.400', 'In linea'],
        ['Centro Italia', '12', '196', '29.8%', '↗ 0.3%', '€138.600', 'In linea'],
        ['Sud Italia', '10', '152', '30.5%', '↗ 1.1%', '€112.800', 'A rischio'],
        ['Isole', '6', '108', '27.1%', '↘ 1.9%', '€73.400', 'In linea'],
      ].map(([name, stores, staff, labour, trend, cost, badge]) => (
        <div key={name} className={styles.regionOverviewCard}>
          <div className={styles.discussionHeader}>
            <span className={styles.locationName}>{name}</span>
            <span className={badge === 'A rischio' ? styles.statusBadgeMuted : styles.rowTagPositive}>{badge}</span>
          </div>
          <div className={styles.regionOverviewMetrics}>
            <div>
              <span className={styles.metricLabel}>Locali</span>
              <strong className={styles.metricMicro}>{stores}</strong>
            </div>
            <div>
              <span className={styles.metricLabel}>Staff</span>
              <strong className={styles.metricMicro}>{staff}</strong>
            </div>
            <div>
              <span className={styles.metricLabel}>Labour %</span>
              <strong className={labour.startsWith('30') ? styles.metricMicroDanger : styles.metricMicroPositive}>{labour}</strong>
            </div>
            <div>
              <span className={styles.metricLabel}>Trend</span>
              <strong className={trend.includes('↘') ? styles.metricMicroPositive : styles.metricMicroDanger}>{trend}</strong>
            </div>
          </div>
          <span className={styles.alertBody}>Costo settimanale {cost}</span>
        </div>
      ))}
    </div>
  ),
  compliance: (
    <div className={styles.complianceStack}>
      <div className={styles.complianceCard}>
        <span className={styles.metricLabel}>Compliance complessiva</span>
        <strong className={styles.metricNumberPositive}>89.5%</strong>
      </div>
      {[
        ['Max 40h/settimana per dipendente', '92.9%', '39/42', '92.9%'],
        ['Riposo ≥11h tra i turni', '97.6%', '41/42', '97.6%'],
        ['Varianza budget ≤ ±5%', '81%', '34/42', '81%'],
        ['Score copertura ≥ 90%', '85.7%', '36/42', '85.7%'],
        ['Turni pubblicati ≥ 7 giorni prima', '90.5%', '38/42', '90.5%'],
      ].map(([label, value, count, fill]) => (
        <div key={label} className={styles.complianceCard}>
          <div className={styles.complianceHeader}>
            <span className={styles.locationName}>{label}</span>
            <span className={Number.parseFloat(value) >= 90 ? styles.rowTagPositive : styles.statusBadgeMuted}>{value}</span>
          </div>
          <div className={styles.progressTrack}>
            <div
              className={`${styles.progressFill} ${Number.parseFloat(value) < 90 ? styles.progressFillWarm : ''}`}
              style={{ width: fill }}
            />
          </div>
          <span className={styles.metricHint}>{count}</span>
        </div>
      ))}
    </div>
  ),
} as const;

const HeadquartersMockup = () => {
  const [view, setView] = useState<keyof typeof hqViews>('network');

  return (
    <div className={styles.dashboardCard}>
      <div className={styles.dashboardTop}>
        <div className={styles.dashboardBrand}>Ristowai Headquarters</div>
        <div className={styles.dashboardMeta}>
          <span>Settimana 10, 2025</span>
        </div>
      </div>

      <div className={styles.segmentedTabs}>
        {[
          ['network', 'Rete'],
          ['regions', 'Regioni'],
          ['compliance', 'Compliance'],
        ].map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setView(key as keyof typeof hqViews)}
            className={`${styles.segmentTab} ${view === key ? styles.segmentTabActive : ''}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div key={view} className={styles.mockupStage}>
        {hqViews[view]}
      </div>
    </div>
  );
};

const renderMockup = (type: (typeof roleSections)[number]['mockup']) => {
  if (type === 'store') return <StoreMockup />;
  if (type === 'area') return <AreaMockup />;
  return <HeadquartersMockup />;
};

export const Pricing = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const cards = cardsRef.current;

    if (!section || !title || cards.length === 0) return;

    const isMobile = window.innerWidth <= 1024;

    if (isMobile) {
      return;
    }

    gsap.set([title.children, ...cards], {
      opacity: 1,
      y: 0,
    });

    gsap.from(title.children, {
      y: 40,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: title,
        start: 'top 80%',
      },
    });

    cards.forEach((card, index) => {
      gsap.from(card, {
        y: 60,
        opacity: 0,
        duration: 0.8,
        delay: 0.15 * index,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section id="pricing" ref={sectionRef} className={styles.section} data-section="white">
      <div className={styles.container}>
        <div ref={titleRef} className={styles.titleContainer}>
          <p className={styles.eyebrow}>Governance operativa</p>
          <h2 className={styles.title}>Una vista diversa per ogni livello decisionale</h2>
          <p className={styles.subtitle}>
            Dal punto vendita agli headquarters, ogni ruolo lavora sullo stesso sistema con strumenti e visibilita adatti al proprio perimetro operativo.
          </p>
        </div>

        <div className={styles.stack}>
          {roleSections.map((role, index) => (
            <article
              key={role.title}
              id={role.id}
              ref={(el) => {
                if (el) {
                  cardsRef.current[index] = el as HTMLDivElement;
                }
              }}
              className={`${styles.showcase} ${index % 2 === 1 ? styles.showcaseReverse : ''}`}
            >
              <div className={styles.mockupColumn}>{renderMockup(role.mockup)}</div>

              <div className={styles.contentColumn}>
                <h3 className={styles.roleTitle}>{role.title}</h3>
                <p className={styles.roleDescription}>{role.description}</p>
                <ul className={styles.roleList}>
                  {role.bullets.map((item) => {
                    const Icon = item.icon;

                    return (
                      <li key={item.text} className={styles.roleItem}>
                        <span className={styles.roleIcon}>
                          <Icon size={18} />
                        </span>
                        <span>{item.text}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
