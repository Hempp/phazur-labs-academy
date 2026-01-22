import Link from 'next/link'
import {
  Newspaper,
  Download,
  Mail,
  ExternalLink,
  Calendar,
  Award,
  TrendingUp,
  Users,
  Image as ImageIcon
} from 'lucide-react'

const pressReleases = [
  {
    date: 'January 15, 2025',
    title: 'Phazur Labs Raises $50M Series B to Expand AI-Powered Learning Platform',
    excerpt: 'Funding led by Andreessen Horowitz will accelerate product development and global expansion.',
    link: '#'
  },
  {
    date: 'December 5, 2024',
    title: 'Phazur Labs Reaches 1 Million Active Learners Milestone',
    excerpt: 'Platform crosses major milestone with learners in 120+ countries.',
    link: '#'
  },
  {
    date: 'November 12, 2024',
    title: 'Phazur Labs Launches Enterprise Learning Suite',
    excerpt: 'New product line designed for corporate training and workforce development.',
    link: '#'
  },
  {
    date: 'October 3, 2024',
    title: 'Phazur Labs Partners with Google Cloud for Scalable Infrastructure',
    excerpt: 'Strategic partnership to deliver faster, more reliable learning experiences globally.',
    link: '#'
  },
  {
    date: 'September 18, 2024',
    title: 'Phazur Labs Named to Forbes Cloud 100 Rising Stars',
    excerpt: 'Recognition highlights company\'s rapid growth and innovative approach to edtech.',
    link: '#'
  }
]

const mediaFeatures = [
  {
    publication: 'TechCrunch',
    title: 'How Phazur Labs is Reimagining Tech Education',
    date: 'January 2025',
    link: '#',
    logo: 'TC'
  },
  {
    publication: 'Forbes',
    title: 'The Future of Corporate Training is Personalized',
    date: 'December 2024',
    link: '#',
    logo: 'F'
  },
  {
    publication: 'The Verge',
    title: 'AI Tutors: Promise and Pitfalls',
    date: 'November 2024',
    link: '#',
    logo: 'TV'
  },
  {
    publication: 'Wired',
    title: 'Inside the Platform Making Coding Accessible',
    date: 'October 2024',
    link: '#',
    logo: 'W'
  }
]

const awards = [
  {
    year: '2025',
    award: 'Best EdTech Platform',
    organization: 'EdTech Breakthrough Awards'
  },
  {
    year: '2024',
    award: 'Forbes Cloud 100 Rising Stars',
    organization: 'Forbes'
  },
  {
    year: '2024',
    award: 'Best Learning Experience',
    organization: 'Brandon Hall Group'
  },
  {
    year: '2024',
    award: 'Top 50 Startups to Watch',
    organization: 'CB Insights'
  },
  {
    year: '2023',
    award: 'Best Online Learning Platform',
    organization: 'Product Hunt Golden Kitty'
  }
]

const companyStats = [
  { value: '1M+', label: 'Active Learners' },
  { value: '120+', label: 'Countries' },
  { value: '$50M', label: 'Series B Funding' },
  { value: '200+', label: 'Team Members' }
]

const pressKitItems = [
  {
    title: 'Company Logos',
    description: 'Logo files in various formats (SVG, PNG, EPS)',
    icon: ImageIcon
  },
  {
    title: 'Brand Guidelines',
    description: 'Colors, typography, and usage guidelines',
    icon: Download
  },
  {
    title: 'Executive Bios',
    description: 'Biographies and headshots of leadership team',
    icon: Users
  },
  {
    title: 'Fact Sheet',
    description: 'Company overview, stats, and key facts',
    icon: Newspaper
  }
]

export default function PressPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-light text-primary text-sm font-medium mb-6">
            <Newspaper className="h-4 w-4" />
            Press & Media
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Press Room
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            The latest news, press releases, and media resources from Phazur Labs.
          </p>
          <Link
            href="mailto:press@phazurlabs.com"
            className="inline-flex items-center h-12 px-6 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90"
          >
            <Mail className="mr-2 h-5 w-5" />
            Contact Press Team
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {companyStats.map((stat, index) => (
              <div key={index}>
                <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-muted-foreground text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Press Releases */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Press Releases</h2>
            <Link href="#" className="text-primary font-medium hover:underline flex items-center gap-1">
              View All <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-6">
            {pressReleases.map((release, index) => (
              <Link
                key={index}
                href={release.link}
                className="block p-6 border rounded-xl hover:shadow-lg transition-all group"
              >
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4" />
                  {release.date}
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {release.title}
                </h3>
                <p className="text-muted-foreground">{release.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Media Features */}
      <section className="py-20 bg-surface-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Media Coverage</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {mediaFeatures.map((feature, index) => (
              <Link
                key={index}
                href={feature.link}
                className="bg-background border rounded-xl p-6 hover:shadow-lg transition-all group"
              >
                <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-bold text-xl mb-4">
                  {feature.logo}
                </div>
                <div className="text-sm text-muted-foreground mb-2">{feature.publication}</div>
                <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-2">
                  {feature.title}
                </h3>
                <div className="text-sm text-muted-foreground mt-2">{feature.date}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Awards */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <Award className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Awards & Recognition</h2>
            <p className="text-muted-foreground">
              Industry recognition for our commitment to excellence in education technology.
            </p>
          </div>
          <div className="max-w-2xl mx-auto space-y-4">
            {awards.map((award, index) => (
              <div key={index} className="flex items-center gap-4 p-4 border rounded-xl">
                <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-primary">{award.year}</span>
                </div>
                <div>
                  <h3 className="font-semibold">{award.award}</h3>
                  <p className="text-sm text-muted-foreground">{award.organization}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Press Kit */}
      <section className="py-20 bg-surface-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Press Kit</h2>
            <p className="text-muted-foreground">
              Download official brand assets and media resources.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {pressKitItems.map((item, index) => (
              <button
                key={index}
                className="bg-background border rounded-xl p-6 text-left hover:shadow-lg transition-all group"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </button>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="#"
              className="inline-flex items-center h-12 px-6 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90"
            >
              <Download className="mr-2 h-5 w-5" />
              Download Full Press Kit
            </Link>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <TrendingUp className="h-12 w-12 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Media Inquiries</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            For press inquiries, interview requests, or additional information, please contact our press team.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="mailto:press@phazurlabs.com"
              className="inline-flex items-center h-12 px-6 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90"
            >
              <Mail className="mr-2 h-5 w-5" />
              press@phazurlabs.com
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
