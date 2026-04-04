import {
  Banner,
  Button,
  Card,
  CardBody,
  Divider,
  Hero,
  Image,
  NewsletterSignup,
  StatCard,
  Testimonial,
  Timeline,
} from '@arcana-ui/core';
import { Link, useNavigate } from 'react-router-dom';
import { ProductGrid } from '../components/ProductGrid';
import { products } from '../data/products';
import './Home.css';

const FEATURED = products.slice(0, 4);

export function Home(): React.JSX.Element {
  const navigate = useNavigate();

  return (
    <main className="forma-home">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <Hero
        headline="Objects that endure."
        subheadline="Thoughtfully made for everyday life."
        primaryCTA={{ label: 'Shop Collection', onClick: () => navigate('/shop') }}
        secondaryCTA={{ label: 'Our Story', href: '#about' }}
        variant="fullscreen"
        height="large"
        overlay
        media={
          <Image
            src="https://placehold.co/1440x600/d4c5b0/6b5d4f?text=FORMA"
            alt="A curated arrangement of ceramic objects and textiles in warm, natural tones"
            aspectRatio="video"
          />
        }
      />

      {/* ── Selected Objects ─────────────────────────────────────────────── */}
      <section className="forma-section">
        <div className="forma-container">
          <div className="forma-section-header">
            <h2 className="forma-section-title">Selected Objects</h2>
            <Link to="/shop" className="forma-section-link">
              View all
            </Link>
          </div>
          <ProductGrid products={FEATURED} columns={4} />
        </div>
      </section>

      {/* ── Trust Banner ─────────────────────────────────────────────────── */}
      <section className="forma-container">
        <Banner variant="neutral">
          Complimentary shipping on orders over $200. Returns accepted within 60 days.
        </Banner>
      </section>

      {/* ── Trust Stats ───────────────────────────────────────────────────── */}
      <section className="forma-section">
        <div className="forma-container">
          <div className="forma-stats-grid">
            <StatCard
              value="10k+"
              label="Happy customers"
              icon={
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                </svg>
              }
            />
            <StatCard
              value="Carbon neutral"
              label="Shipping worldwide"
              icon={
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                </svg>
              }
            />
            <StatCard
              value="30 days"
              label="Free returns, no questions"
              icon={
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <polyline points="1 4 1 10 7 10" />
                  <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
                </svg>
              }
            />
            <StatCard
              value="Handmade"
              label="By independent makers"
              icon={
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              }
            />
          </div>
        </div>
      </section>

      <Divider spacing="lg" />

      {/* ── Testimonials ──────────────────────────────────────────────────── */}
      <section className="forma-section">
        <div className="forma-container">
          <h2 className="forma-section-title forma-section-title--center">
            What people are saying
          </h2>
          <div className="forma-testimonials">
            <Testimonial
              quote="The Alto Bowl is the only thing on our table that gets a compliment every dinner. It is that kind of object."
              author="Clara M."
              jobTitle="Interior Designer"
              company="Stockholm"
              rating={5}
              variant="card"
            />
            <Testimonial
              quote="I replaced everything on my desk with Forma pieces. The leather notebook cover alone changed how I feel about starting my day."
              author="James T."
              jobTitle="Writer"
              company="Brooklyn"
              rating={5}
              variant="card"
            />
            <Testimonial
              quote="Finally, a brand that trusts you to appreciate simplicity. No over-designed nonsense. Just things that work and look right."
              author="Aiko N."
              jobTitle="Architect"
              company="Tokyo"
              rating={5}
              variant="card"
            />
          </div>
        </div>
      </section>

      {/* ── About / Timeline ──────────────────────────────────────────────── */}
      <section className="forma-section" id="about">
        <div className="forma-container">
          <div className="forma-about-grid">
            <div className="forma-about-text">
              <h2 className="forma-section-title">Our Story</h2>
              <p className="forma-about-description">
                We started with a question: what if fewer, better things could replace the constant
                cycle of buying and discarding. Every Forma object is made by independent artisans
                using materials that age with grace.
              </p>
              <Button variant="outline" onClick={() => navigate('/shop')}>
                Explore the collection
              </Button>
            </div>
            <Card variant="outlined">
              <CardBody>
                <Timeline
                  variant="compact"
                  items={[
                    {
                      title: 'Founded in Portland',
                      description: 'Started with a single ceramic line and a belief in permanence.',
                      date: '2019',
                      status: 'complete',
                    },
                    {
                      title: 'First international makers',
                      description: 'Partnered with artisans in Japan, Italy, and New Zealand.',
                      date: '2021',
                      status: 'complete',
                    },
                    {
                      title: 'Carbon neutral shipping',
                      description: 'Every order offset. No exceptions, no asterisks.',
                      date: '2023',
                      status: 'complete',
                    },
                    {
                      title: 'Furniture collection',
                      description: 'Oak, walnut, and ash pieces designed in-house, made in Oregon.',
                      date: '2025',
                      status: 'active',
                    },
                  ]}
                />
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* ── Newsletter ────────────────────────────────────────────────────── */}
      <section className="forma-section forma-section--muted">
        <div className="forma-container">
          <NewsletterSignup
            title="Stay in the loop."
            description="New objects, rarely. No noise."
            placeholder="your@email.com"
            buttonText="Subscribe"
            variant="card"
            onSubmit={() => Promise.resolve()}
            successMessage="Welcome to Forma."
          />
        </div>
      </section>
    </main>
  );
}
