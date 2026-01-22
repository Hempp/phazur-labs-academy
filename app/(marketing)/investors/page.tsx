import Link from 'next/link'
import {
  TrendingUp,
  Users,
  Globe,
  Target,
  DollarSign,
  BarChart3,
  ArrowRight,
  Building2,
  Rocket,
  Shield,
  Award,
  Mail
} from 'lucide-react'

const highlights = [
  {
    icon: Users,
    value: '1M+',
    label: 'Active Learners',
    growth: '+150% YoY'
  },
  {
    icon: Globe,
    value: '120+',
    label: 'Countries',
    growth: '+40 countries'
  },
  {
    icon: DollarSign,
    value: '$25M',
    label: 'ARR',
    growth: '+180% YoY'
  },
  {
    icon: Target,
    value: '95%',
    label: 'Net Retention',
    growth: 'Enterprise'
  }
]

const fundingRounds = [
  {
    round: 'Series B',
    amount: '$50M',
    date: 'January 2025',
    lead: 'Andreessen Horowitz',
    participants: ['Sequoia Capital', 'Index Ventures', 'Accel']
  },
  {
    round: 'Series A',
    amount: '$15M',
    date: 'March 2023',
    lead: 'Sequoia Capital',
    participants: ['Y Combinator', 'SV Angel']
  },
  {
    round: 'Seed',
    amount: '$3M',
    date: 'August 2022',
    lead: 'Y Combinator',
    participants: ['Angel Investors']
  }
]

const investors = [
  { name: 'Andreessen Horowitz', type: 'Lead Investor' },
  { name: 'Sequoia Capital', type: 'Lead Investor' },
  { name: 'Index Ventures', type: 'Investor' },
  { name: 'Accel', type: 'Investor' },
  { name: 'Y Combinator', type: 'Seed Investor' },
  { name: 'SV Angel', type: 'Investor' }
]

const marketOpportunity = [
  {
    title: 'Global EdTech Market',
    value: '$404B',
    by: 'by 2025',
    description: 'The global education technology market is experiencing unprecedented growth.'
  },
  {
    title: 'Corporate Training',
    value: '$380B',
    by: 'by 2027',
    description: 'Enterprise L&D spending continues to accelerate post-pandemic.'
  },
  {
    title: 'Tech Skills Gap',
    value: '85M',
    by: 'unfilled jobs by 2030',
    description: 'Global tech talent shortage creates massive demand for upskilling.'
  }
]

const competitiveAdvantages = [
  {
    icon: Rocket,
    title: 'AI-Powered Personalization',
    description: 'Proprietary algorithms that adapt content difficulty and pacing to individual learners.'
  },
  {
    icon: Building2,
    title: 'Enterprise-First Approach',
    description: 'Purpose-built for corporate training with SSO, analytics, and LMS integration.'
  },
  {
    icon: Shield,
    title: 'Premium Content Library',
    description: '500+ courses created by industry practitioners from top tech companies.'
  },
  {
    icon: Award,
    title: 'Industry Recognition',
    description: 'Certificates valued by employers, with direct hiring partnerships.'
  }
]

const leadership = [
  {
    name: 'Dr. Sarah Chen',
    role: 'CEO & Co-founder',
    background: 'Former VP Engineering at Coursera, Stanford CS PhD'
  },
  {
    name: 'Marcus Williams',
    role: 'CTO & Co-founder',
    background: 'Former Staff Engineer at Google, MIT graduate'
  },
  {
    name: 'Jennifer Walsh',
    role: 'CFO',
    background: 'Former CFO at Udacity, Goldman Sachs alumni'
  }
]

export default function InvestorsPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium mb-6">
            <TrendingUp className="h-4 w-4" />
            Growing 180% YoY
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Investor Relations
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Building the future of tech education. Backed by world-class investors.
          </p>
          <Link
            href="mailto:investors@phazurlabs.com"
            className="inline-flex items-center h-12 px-6 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90"
          >
            Contact Investor Relations
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {highlights.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <metric.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl font-bold mb-1">{metric.value}</div>
                <div className="text-muted-foreground text-sm mb-1">{metric.label}</div>
                <div className="text-xs text-green-600 dark:text-green-400 font-medium">{metric.growth}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Investors */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 text-center">Our Investors</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Backed by the world&apos;s leading venture capital firms.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-4xl mx-auto">
            {investors.map((investor, index) => (
              <div key={index} className="text-center p-4 border rounded-xl">
                <div className="font-semibold mb-1">{investor.name}</div>
                <div className="text-xs text-muted-foreground">{investor.type}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Funding History */}
      <section className="py-20 bg-surface-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Funding History</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {fundingRounds.map((round, index) => (
              <div key={index} className="bg-background border rounded-2xl p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">{round.date}</div>
                    <h3 className="text-2xl font-bold">{round.round}</h3>
                  </div>
                  <div className="text-3xl font-bold text-primary">{round.amount}</div>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Led by: </span>
                  <span className="font-medium">{round.lead}</span>
                </div>
                <div className="text-sm mt-1">
                  <span className="text-muted-foreground">Participants: </span>
                  <span>{round.participants.join(', ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Market Opportunity */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 text-center">Market Opportunity</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Positioned at the intersection of three massive, growing markets.
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {marketOpportunity.map((market, index) => (
              <div key={index} className="text-center p-8 border rounded-2xl">
                <div className="text-4xl font-bold text-primary mb-2">{market.value}</div>
                <div className="text-sm text-muted-foreground mb-4">{market.by}</div>
                <h3 className="font-semibold mb-2">{market.title}</h3>
                <p className="text-sm text-muted-foreground">{market.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Competitive Advantages */}
      <section className="py-20 bg-surface-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 text-center">Competitive Advantages</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            What sets Phazur Labs apart in a crowded market.
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {competitiveAdvantages.map((advantage, index) => (
              <div key={index} className="flex gap-4 p-6 bg-background border rounded-xl">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <advantage.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{advantage.title}</h3>
                  <p className="text-muted-foreground text-sm">{advantage.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Leadership Team</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {leadership.map((leader, index) => (
              <div key={index} className="text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-violet-500/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">
                    {leader.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="font-semibold text-lg">{leader.name}</h3>
                <div className="text-primary text-sm mb-2">{leader.role}</div>
                <p className="text-muted-foreground text-sm">{leader.background}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/leadership" className="text-primary font-medium hover:underline flex items-center justify-center gap-1">
              View Full Leadership Team <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <BarChart3 className="h-12 w-12 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Interested in Learning More?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Contact our investor relations team for detailed financial information and partnership opportunities.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="mailto:investors@phazurlabs.com"
              className="inline-flex items-center h-12 px-6 bg-white text-primary rounded-md font-medium hover:bg-gray-100"
            >
              <Mail className="mr-2 h-5 w-5" />
              investors@phazurlabs.com
            </Link>
            <Link
              href="/press"
              className="inline-flex items-center h-12 px-6 border border-white/30 text-white rounded-md font-medium hover:bg-white/10"
            >
              View Press Room
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
