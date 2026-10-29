import { BillingBlock } from './parts/BillingBlock'
import { Cta } from './parts/Cta'
import { Faq } from './parts/Faq'
import { Features } from './parts/Features'
import { Hero } from './parts/Hero'
import { HowItWorks } from './parts/HowItWorks'
import { LandingFooter } from './parts/LandingFooter'
import { LandingHeader } from './parts/LandingHeader'
import { Pricing } from './parts/Pricing'
import { Privacy } from './parts/Privacy'
import { Regions } from './parts/Regions'
import styles from './Landing.module.css'

/** Лендинг (Figma: секция `Landing`, фрейм 208:3395). Секции — в порядке по вертикали макета. Статичный. */
export function Landing() {
  return (
    <div className={styles.page}>
      <LandingHeader />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <BillingBlock />
        <Pricing />
        <Regions />
        <Privacy />
        <Faq />
        <Cta />
      </main>
      <LandingFooter />
    </div>
  )
}
